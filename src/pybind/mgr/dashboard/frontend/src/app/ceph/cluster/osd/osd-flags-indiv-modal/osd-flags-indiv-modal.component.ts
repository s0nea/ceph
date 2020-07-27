import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OsdService } from '../../../../shared/api/osd.service';
import { NotificationType } from '../../../../shared/enum/notification-type.enum';
import { Flag } from '../../../../shared/models/flag';
import { Permissions } from '../../../../shared/models/permissions';
import { AuthStorageService } from '../../../../shared/services/auth-storage.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'cd-osd-flags-indiv-modal',
  templateUrl: './osd-flags-indiv-modal.component.html',
  styleUrls: ['./osd-flags-indiv-modal.component.scss']
})
export class OsdFlagsIndivModalComponent implements OnInit {
  permissions: Permissions;
  selected: object[];
  osdFlagsForm = new FormGroup({});
  flags: Flag[] = [
    {
      code: 'noup',
      name: $localize`No Up`,
      description: $localize`OSDs are not allowed to start`,
      value: false,
      disabled: false,
      indeterminate: false
    },
    {
      code: 'nodown',
      name: $localize`No Down`,
      description: $localize`OSD failure reports are being ignored, such that the monitors will not mark OSDs down`,
      value: false,
      disabled: false,
      indeterminate: false
    },
    {
      code: 'noin',
      name: $localize`No In`,
      description: $localize`OSDs that were previously marked out will not be marked back in when they start`,
      value: false,
      disabled: false,
      indeterminate: false
    },
    {
      code: 'noout',
      name: $localize`No Out`,
      description: $localize`OSDs will not automatically be marked out after the configured interval`,
      value: false,
      disabled: false,
      indeterminate: false
    }
  ];
  disabledTooltip: string = $localize`The flag can't be (un)set for single OSD because it has been enabled for the entire cluster`;

  constructor(
    public activeModal: NgbActiveModal,
    private authStorageService: AuthStorageService,
    private osdService: OsdService,
    private notificationService: NotificationService
  ) {
    this.permissions = this.authStorageService.getPermissions();
  }

  ngOnInit() {
    const osdCount = this.selected.length;
    this.osdService.getFlags().subscribe((clusterWideFlags: string[]) => {
      const activatedIndivFlags = this.getActivatedIndivFlags();
      this.flags.forEach((flag) => {
        const flagCount = activatedIndivFlags[flag.code];
        if (clusterWideFlags.includes(flag.code)) {
          flag.value = true;
          flag.disabled = true;
        } else if (flagCount === osdCount) {
          flag.value = true;
        } else if (flagCount > 0) {
          flag.indeterminate = true;
        }
      });
    });
  }

  getActivatedIndivFlags(): { [flag: string]: number } {
    const flagsCount = {};
    this.flags.forEach((flag) => {
      flagsCount[flag.code] = 0;
    });

    [].concat(...this.selected.map((osd) => osd['state'])).map((activatedFlag) => {
      if (Object.keys(flagsCount).includes(activatedFlag)) {
        flagsCount[activatedFlag] = flagsCount[activatedFlag] + 1;
      }
    });
    return flagsCount;
  }

  changeValue(flag: Flag) {
    flag.value = !flag.value;
    flag.indeterminate = false;
  }

  submitAction() {
    const activeFlags = {};
    this.flags.forEach((flag) => {
      if (flag.disabled || flag.indeterminate) {
        activeFlags[flag.code] = null;
      } else {
        activeFlags[flag.code] = flag.value;
      }
    });
    const selectedIds = this.selected.map((selection) => selection['osd']);
    this.osdService.updateFlags(activeFlags, selectedIds).subscribe(
      () => {
        this.notificationService.show(
          NotificationType.success,
          $localize`Updated individual OSD Flags`
        );
        this.activeModal.close();
      },
      () => {
        this.activeModal.close();
      }
    );
  }
}
