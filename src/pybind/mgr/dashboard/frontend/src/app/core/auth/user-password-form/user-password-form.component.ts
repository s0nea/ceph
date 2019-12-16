import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';

import { UserService } from '../../../shared/api/user.service';
import { ActionLabelsI18n } from '../../../shared/constants/app.constants';
import { Icons } from '../../../shared/enum/icons.enum';
import { NotificationType } from '../../../shared/enum/notification-type.enum';
import { CdFormBuilder } from '../../../shared/forms/cd-form-builder';
import { CdFormGroup } from '../../../shared/forms/cd-form-group';
import { CdValidators } from '../../../shared/forms/cd-validators';
import { AuthStorageService } from '../../../shared/services/auth-storage.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { PasswordPolicyService } from '../../../shared/services/password-policy.service';

@Component({
  selector: 'cd-user-password-form',
  templateUrl: './user-password-form.component.html',
  styleUrls: ['./user-password-form.component.scss']
})
export class UserPasswordFormComponent {
  userForm: CdFormGroup;
  action: string;
  resource: string;
  passwordPolicyHelpText: string;
  passwordStrengthLevelClass: string;
  passwordValuation: string;
  icons = Icons;

  constructor(
    private i18n: I18n,
    public actionLabels: ActionLabelsI18n,
    private notificationService: NotificationService,
    private userService: UserService,
    private authStorageService: AuthStorageService,
    private formBuilder: CdFormBuilder,
    private router: Router,
    private passwordPolicyService: PasswordPolicyService
  ) {
    this.action = this.actionLabels.CHANGE;
    this.resource = this.i18n('password');
    this.createForm();
  }

  createForm() {
    this.passwordPolicyHelpText = this.passwordPolicyService.getHelpText();
    this.userForm = this.formBuilder.group(
      {
        oldpassword: [
          null,
          [
            Validators.required,
            CdValidators.custom('notmatch', () => {
              return (
                this.userForm &&
                this.userForm.getValue('newpassword') === this.userForm.getValue('oldpassword')
              );
            })
          ]
        ],
        newpassword: [
          null,
          [
            Validators.required,
            CdValidators.custom('notmatch', () => {
              return (
                this.userForm &&
                this.userForm.getValue('oldpassword') === this.userForm.getValue('newpassword')
              );
            })
          ],
          [
            CdValidators.passwordPolicy(
              this.userService,
              () => this.authStorageService.getUsername(),
              (_valid: boolean, credits: number, valuation: string) => {
                this.passwordStrengthLevelClass = this.passwordPolicyService.mapCreditsToCssClass(
                  credits
                );
                this.passwordValuation = _.defaultTo(valuation, '');
              }
            )
          ]
        ],
        confirmnewpassword: [null, [Validators.required]]
      },
      {
        validators: [CdValidators.match('newpassword', 'confirmnewpassword')]
      }
    );
  }

  onSubmit() {
    if (this.userForm.pristine) {
      return;
    }
    const username = this.authStorageService.getUsername();
    const oldPassword = this.userForm.getValue('oldpassword');
    const newPassword = this.userForm.getValue('newpassword');
    this.userService.changePassword(username, oldPassword, newPassword).subscribe(
      () => {
        this.notificationService.show(
          NotificationType.success,
          this.i18n('Updated user password"')
        );
        // Theoretically it is not necessary to navigate to '/logout' because
        // the auth token gets invalid after changing the password in the
        // backend, thus the user would be automatically logged out after the
        // next periodically API request is executed.
        this.router.navigate(['/logout']);
      },
      () => {
        this.userForm.setErrors({ cdSubmitButton: true });
      }
    );
  }
}
