import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin as observableForkJoin } from 'rxjs';

import { OsdService } from '../../../../shared/api/osd.service';
import { NotificationType } from '../../../../shared/enum/notification-type.enum';
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
  selected: number;
  osdFlagsForm = new FormGroup({});
  flags = [
    {
      code: 'noup',
      name: $localize`No Up`,
      value: false,
      description: $localize`OSDs are not allowed to start`,
      disabled: false
    },
    {
      code: 'nodown',
      name: $localize`No Down`,
      value: false,
      description: $localize`OSD failure reports are being ignored, such that the monitors will not mark OSDs down`,
      disabled: false
    },
    {
      code: 'noin',
      name: $localize`No In`,
      value: false,
      description: $localize`OSDs that were previously marked out will not be marked back in when they start`,
      disabled: false
    },
    {
      code: 'noout',
      name: $localize`No Out`,
      value: false,
      description: $localize`OSDs will not automatically be marked out after the configured interval`,
      disabled: false
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
    const observables = [this.osdService.getDetails(this.selected), this.osdService.getFlags()];
    observableForkJoin(observables).subscribe((resp: object) => {
      const osdState = resp[0]['osd_map']['state'];
      const clusterWideFlags = resp[1];
      this.flags.forEach((flag) => {
        if (clusterWideFlags.includes(flag.code)) {
          flag.value = true;
          flag.disabled = true;
        } else if (osdState.includes(flag.code)) {
          flag.value = true;
        }
      });
    });
  }

  submitAction() {
    const activeFlags = this.flags
      .filter((flag) => flag.value && !flag.disabled)
      .map((flag) => flag.code);
    this.osdService.updateIndividualFlags(this.selected, activeFlags).subscribe(
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
