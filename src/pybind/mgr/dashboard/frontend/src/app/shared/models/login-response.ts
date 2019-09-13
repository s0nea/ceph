export class LoginResponse {
  username: string;
  token: string;
  permissions: object;
  pwdExpiryData: object;
  sso: boolean;
}
