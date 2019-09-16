import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModule } from 'ngx-bootstrap/alert';

import { configureTestBed } from '../../../../testing/unit-test-helper';
import { CdPwdExpiryData } from '../../models/cd-pwd-expiry-data';
import { AuthStorageService } from '../../services/auth-storage.service';
import { PwdExpiryNotificationComponent } from './pwd-expiry-notification.component';

describe('PwdExpiryNotificationComponent', () => {
  let component: PwdExpiryNotificationComponent;
  let fixture: ComponentFixture<PwdExpiryNotificationComponent>;
  let authStorageService: AuthStorageService;

  configureTestBed({
    declarations: [PwdExpiryNotificationComponent],
    imports: [AlertModule.forRoot(), HttpClientTestingModule],
    providers: [AuthStorageService]
  });

  describe('password expiry date has been set', () => {
    beforeEach(() => {
      authStorageService = TestBed.get(AuthStorageService);
      spyOn(authStorageService, 'getPwdExpiryData').and.returnValue(
        new CdPwdExpiryData({
          pwd_expiry_date: 1645488000,
          user_pwd_expiry_warning_1: 10,
          user_pwd_expiry_warning_2: 5,
          pwd_default_expiry_span: 90
        })
      );
      fixture = TestBed.createComponent(PwdExpiryNotificationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      component.ngOnInit();
      expect(component).toBeTruthy();
    });

    it('should set warning levels', () => {
      component.ngOnInit();
      expect(component.pwdExpiryData.pwdExpiryWarning1).toBe(10);
      expect(component.pwdExpiryData.pwdExpiryWarning2).toBe(5);
    });

    it('should calculate password expiry in days', () => {
      const dateValue = Date;
      spyOn(global, 'Date').and.callFake((date) => {
        if (date) {
          return new dateValue(date);
        } else {
          return new Date('2022-02-18T00:00:00.000Z');
        }
      });
      component.ngOnInit();
      expect(component['expiryDays']).toBe(4);
    });

    it('should set alert type warning correctly', () => {
      const dateValue = Date;
      spyOn(global, 'Date').and.callFake((date) => {
        if (date) {
          return new dateValue(date);
        } else {
          return new Date('2022-02-14T00:00:00.000Z');
        }
      });
      component.ngOnInit();
      expect(component['alertType']).toBe('warning');
    });

    it('should set alert type danger correctly', () => {
      const dateValue = Date;
      spyOn(global, 'Date').and.callFake((date) => {
        if (date) {
          return new dateValue(date);
        } else {
          return new Date('2022-02-18T00:00:00.000Z');
        }
      });
      component.ngOnInit();
      expect(component['alertType']).toBe('danger');
    });
  });

  describe('password expiry date has not been set', () => {
    beforeEach(() => {
      authStorageService = TestBed.get(AuthStorageService);
      spyOn(authStorageService, 'getPwdExpiryData').and.returnValue(
        new CdPwdExpiryData({
          pwd_expiry_date: null,
          user_pwd_expiry_warning_1: 10,
          user_pwd_expiry_warning_2: 5,
          pwd_default_expiry_span: 90
        })
      );
      fixture = TestBed.createComponent(PwdExpiryNotificationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should calculate no expiryDays', () => {
      component.ngOnInit();
      expect(component['expiryDays']).toBeUndefined();
    });
  });
});
