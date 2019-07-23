import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

import { NotificationType } from '../enum/notification-type.enum';
import { CdNotification, CdNotificationConfig } from '../models/cd-notification';
import { CdDatePipe } from '../pipes/cd-date.pipe';

@Injectable({
  providedIn: 'root'
})
export class PermanentNotificationService {

  private configs: CdNotificationConfig[] = [];

  constructor(public toastr: ToastrService, private cdDatePipe: CdDatePipe) { }

  private getNotificationConfig(
    arg: NotificationType | CdNotificationConfig | (() => CdNotificationConfig),
    title?: string,
    message?: string,
    options?: any | IndividualConfig,
    application?: string): CdNotificationConfig {
    let config: CdNotificationConfig;
    if (_.isFunction(arg)) {
      config = arg() as CdNotificationConfig;
    } else if (_.isObject(arg)) {
      config = arg as CdNotificationConfig;
    } else {
      config = new CdNotificationConfig(
          arg as NotificationType,
          title,
          message,
          options,
          application
      );
    }
    return config;
  }

  show(
    type: NotificationType,
    title: string,
    message?: string,
    options?: any | IndividualConfig,
    application?: string
  );
  show(config: CdNotificationConfig | (() => CdNotificationConfig));
  show(
    arg: NotificationType | CdNotificationConfig | (() => CdNotificationConfig),
    title?: string,
    message?: string,
    options?: any | IndividualConfig,
    application?: string) {
    const notificationConfig = this.getNotificationConfig(arg, title, message, options, application);
    const existingToast = _.find(this.toastr.toasts, (t) => {
      if (t.toastRef.componentInstance.title === notificationConfig.title) {
        return t;
      }
    }) as ActiveToast<any>;
    if (existingToast) {
      const existingMessage = existingToast.message.includes(notificationConfig.message);
      if (existingMessage) {
        return;
      }
      let messageUpdate = '';
      if (existingToast.message.includes('</ul>')) {
        messageUpdate = _.replace(existingToast.message, '</ul>', '');
        messageUpdate = messageUpdate + '<li>' + notificationConfig.message + '</li></ul>';
      } else {
        messageUpdate = '<ul><li>' + existingToast.message + '</li><li>' + notificationConfig.message + '</li></ul>';
      }
      this.toastr.remove(existingToast.toastId);
      notificationConfig.message = messageUpdate;
    }

    // make sure that the permanent notification config parameter are set
    notificationConfig.options = !notificationConfig.options ? CdNotificationConfig.permNotificationConfig  : _.merge(
          notificationConfig.options, CdNotificationConfig.permNotificationConfig);
    const notification = new CdNotification(notificationConfig);
    return this.toastr[['error', 'info', 'success'][notification.type]](
      notification.message,
      notification.title,
      notification.options
    );
  }
}
