import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { of as observableOf } from 'rxjs';

import { configureTestBed } from '../../../../../testing/unit-test-helper';
import { OsdService } from '../../../../shared/api/osd.service';
import { NotificationType } from '../../../../shared/enum/notification-type.enum';
import { NotificationService } from '../../../../shared/services/notification.service';
import { SharedModule } from '../../../../shared/shared.module';
import { OsdFlagsIndivModalComponent } from './osd-flags-indiv-modal.component';

describe('OsdFlagsIndivModalComponent', () => {
  let component: OsdFlagsIndivModalComponent;
  let fixture: ComponentFixture<OsdFlagsIndivModalComponent>;
  let httpTesting: HttpTestingController;
  let osdService: OsdService;

  configureTestBed({
    imports: [HttpClientTestingModule, ReactiveFormsModule, SharedModule, ToastrModule.forRoot()],
    declarations: [OsdFlagsIndivModalComponent],
    providers: [NgbActiveModal]
  });

  beforeEach(() => {
    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OsdFlagsIndivModalComponent);
    component = fixture.componentInstance;
    component.selected = 0;

    osdService = TestBed.inject(OsdService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form correctly if no individual and global flags are set', () => {
      spyOn(osdService, 'getDetails').and.callFake(() => observableOf({ osd_map: { state: [] } }));
      spyOn(osdService, 'getFlags').and.callFake(() => observableOf([]));
      fixture.detectChanges();
      checkFlags(component.flags);
    });

    it('should initialize form correctly if individual but no global flags are set', () => {
      spyOn(osdService, 'getDetails').and.callFake(() =>
        observableOf({ osd_map: { state: ['noout'] } })
      );
      spyOn(osdService, 'getFlags').and.callFake(() => observableOf([]));
      fixture.detectChanges();
      const expected = {
        noout: { value: true, disabled: false }
      };
      checkFlags(component.flags, expected);
    });

    it('should initialize form correctly if multiple individual but no global flags are set', () => {
      spyOn(osdService, 'getDetails').and.callFake(() =>
        observableOf({ osd_map: { state: ['noout', 'noin'] } })
      );
      spyOn(osdService, 'getFlags').and.callFake(() => observableOf([]));
      fixture.detectChanges();
      const expected = {
        noout: { value: true, disabled: false },
        noin: { value: true, disabled: false }
      };
      checkFlags(component.flags, expected);
    });

    it('should ignore unknown individual flags', () => {
      spyOn(osdService, 'getDetails').and.callFake(() =>
        observableOf({ osd_map: { state: ['foo', 'noout'] } })
      );
      spyOn(osdService, 'getFlags').and.callFake(() => observableOf([]));
      fixture.detectChanges();
      const expected = {
        noout: { value: true, disabled: false }
      };
      checkFlags(component.flags, expected);
    });

    it('should initialize form correctly if no individual but global flags are set', () => {
      spyOn(osdService, 'getDetails').and.callFake(() => observableOf({ osd_map: { state: [] } }));
      spyOn(osdService, 'getFlags').and.callFake(() => observableOf(['noout']));
      fixture.detectChanges();
      const expected = {
        noout: { value: true, disabled: true }
      };
      checkFlags(component.flags, expected);
    });
  });

  describe('submitAction', () => {
    let notificationType: NotificationType;
    let notificationService: NotificationService;
    let bsModalRef: NgbActiveModal;

    beforeEach(() => {
      notificationService = TestBed.inject(NotificationService);
      spyOn(notificationService, 'show').and.callFake((type) => {
        notificationType = type;
      });

      bsModalRef = TestBed.inject(NgbActiveModal);
      spyOn(bsModalRef, 'close').and.callThrough();
    });

    it('should submit an activated flag', () => {
      const code = [component.flags[0].code];
      component.flags[0].value = true;
      component.submitAction();
      const req = httpTesting.expectOne('api/osd/' + component.selected + '/flags');
      req.flush(code);
      expect(req.request.body).toEqual({ flags: code });
      expect(notificationType).toBe(NotificationType.success);
      expect(component.activeModal.close).toHaveBeenCalledTimes(1);
    });

    it('should submit multiple flags', () => {
      const codes = [component.flags[0].code, component.flags[1].code];
      component.flags[0].value = true;
      component.flags[1].value = true;
      component.submitAction();
      const req = httpTesting.expectOne('api/osd/' + component.selected + '/flags');
      req.flush(codes);
      expect(req.request.body).toEqual({ flags: codes });
      expect(notificationType).toBe(NotificationType.success);
      expect(component.activeModal.close).toHaveBeenCalledTimes(1);
    });

    it('should hide modal if request fails', () => {
      component.flags = [];
      component.submitAction();
      const req = httpTesting.expectOne('api/osd/' + component.selected + '/flags');
      req.flush([], { status: 500, statusText: 'failure' });
      expect(notificationService.show).toHaveBeenCalledTimes(0);
      expect(component.activeModal.close).toHaveBeenCalledTimes(1);
    });
  });
});

function checkFlags(flags: object[], expected: object = {}) {
  flags.forEach((flag) => {
    let value = false;
    let disabled = false;
    if (Object.keys(expected).includes(flag['code'])) {
      value = expected[flag['code']]['value'];
      disabled = expected[flag['code']]['disabled'];
    }
    expect(flag['value']).toBe(value);
    expect(flag['disabled']).toBe(disabled);
  });
}
