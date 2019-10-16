export class UserFormModel {
  username: string;
  password: string;
  name: string;
  email: string;
  roles: Array<string>;
  enabled: boolean;
  force_change_pwd: boolean;
}
