import { Injectable } from '@angular/core';

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
    forceChangePwd = false
  ) {
    localStorage.setItem('dashboard_username', username);
    localStorage.setItem('access_token', token);
    localStorage.setItem('dashboard_permissions', JSON.stringify(new Permissions(permissions)));
    localStorage.setItem('sso', String(sso));
    localStorage.setItem('force_change_pwd', String(forceChangePwd));
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

  getForceChangePwd() {
    return localStorage.getItem('force_change_pwd') === 'true';
  }

  getPermissions(): Permissions {
    return JSON.parse(
      localStorage.getItem('dashboard_permissions') || JSON.stringify(new Permissions({}))
    );
  }

  isSSO() {
    return localStorage.getItem('sso') === 'true';
  }
}
