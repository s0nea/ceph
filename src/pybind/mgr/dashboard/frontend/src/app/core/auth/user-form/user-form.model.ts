export class UserFormModel {
  username: string;
  password: string;
  pwdexpirydate: Date;
  name: string;
  email: string;
  roles: Array<string>;
  enabled: boolean;
}
