import { Injectable } from '@angular/core';

import { CdPwdExpiryData } from '../models/cd-pwd-expiry-data';
import { Permissions } from '../models/permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  constructor() {}

  set(
    username: string,
    token: string,
    permissions: object = {},
    sso = false,
    pwdExpiryData: object = {}
  ) {
    localStorage.setItem('dashboard_username', username);
    localStorage.setItem('access_token', token);
    localStorage.setItem('dashboard_permissions', JSON.stringify(new Permissions(permissions)));
    localStorage.setItem(
      'user_pwd_expiry_data',
      JSON.stringify(new CdPwdExpiryData(pwdExpiryData))
    );
    localStorage.setItem('sso', String(sso));
  }

  remove() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('dashboard_username');
  }

  getToken(): string {
    return localStorage.getItem('access_token');
  }

  isLoggedIn() {
    return localStorage.getItem('dashboard_username') !== null;
  }

  getUsername() {
    return localStorage.getItem('dashboard_username');
  }

  getPermissions(): Permissions {
    return JSON.parse(
      localStorage.getItem('dashboard_permissions') || JSON.stringify(new Permissions({}))
    );
  }

  getPwdExpiryData(): CdPwdExpiryData {
    return JSON.parse(
      localStorage.getItem('user_pwd_expiry_data') || JSON.stringify(new CdPwdExpiryData({}))
    );
  }

  isSSO() {
    return localStorage.getItem('sso') === 'true';
  }
}
