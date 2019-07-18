import { Component, OnInit } from '@angular/core';

import { UserFormModel } from '../../../core/auth/user-form/user-form.model';
import { UserService } from '../../api/user.service';
import { AuthStorageService } from '../../services/auth-storage.service';

// TODO: Enhance warning time span to be configurable

@Component({
  selector: 'cd-pwd-expiry-panel',
  templateUrl: './pwd-expiry-panel.component.html',
  styleUrls: ['./pwd-expiry-panel.component.scss']
})
export class PwdExpiryPanelComponent implements OnInit {
  days = 0;

  constructor(private authStorageService: AuthStorageService, private userService: UserService) {}

  ngOnInit() {
    this.userService.get(this.authStorageService.getUsername()).subscribe((user: UserFormModel) => {
      this.getExpiryDays(user);
    });
  }

  getExpiryDays(user: UserFormModel) {
    if (user.pwdexpirydate) {
      const current = new Date();
      const expiry = new Date(user.pwdexpirydate);
      this.days = Math.floor((expiry.valueOf() - current.valueOf()) / (1000 * 3600 * 24));
    }
  }
}
