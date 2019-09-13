export class UserFormModel {
  username: string;
  password: string;
  pwdExpiryDate: number;
  name: string;
  email: string;
  roles: Array<string>;
  enabled: boolean;
}
