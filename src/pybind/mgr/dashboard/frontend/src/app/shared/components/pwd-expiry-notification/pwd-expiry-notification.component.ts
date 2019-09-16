import { Component, OnInit } from '@angular/core';

import { CdPwdExpiryData } from '../../models/cd-pwd-expiry-data';
import { AuthStorageService } from '../../services/auth-storage.service';

@Component({
  selector: 'cd-pwd-expiry-notification',
  templateUrl: './pwd-expiry-notification.component.html',
  styleUrls: ['./pwd-expiry-notification.component.scss']
})
export class PwdExpiryNotificationComponent implements OnInit {
  alertType: string;
  expiryDays: number;
  pwdExpiryData: CdPwdExpiryData;

  constructor(private authStorageService: AuthStorageService) {}

  ngOnInit() {
    this.pwdExpiryData = this.authStorageService.getPwdExpiryData();
    this.expiryDays = this.getExpiryDays(this.pwdExpiryData.pwdExpiryDate);
    if (this.expiryDays <= this.pwdExpiryData.pwdExpiryWarning2) {
      this.alertType = 'danger';
    } else {
      this.alertType = 'warning';
    }
  }

  private getExpiryDays(pwdExpiryDate: number): number {
    if (pwdExpiryDate) {
      const current = new Date();
      const expiry = new Date(pwdExpiryDate * 1000);
      return Math.floor((expiry.valueOf() - current.valueOf()) / (1000 * 3600 * 24));
    }
  }
}
