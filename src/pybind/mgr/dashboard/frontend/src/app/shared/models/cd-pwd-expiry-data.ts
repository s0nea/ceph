export class CdPwdExpiryData {
  pwdExpiryDate: number;
  pwdExpiryWarning1: number;
  pwdExpiryWarning2: number;
  pwdDefaultExpirySpan: number;

  constructor(pwdExpiryData: any) {
    this.pwdExpiryDate = pwdExpiryData.pwd_expiry_date || 0;
    // Warning level (yellow)
    this.pwdExpiryWarning1 = pwdExpiryData.user_pwd_expiry_warning_1 || 0;
    // Danger level (red)
    this.pwdExpiryWarning2 = pwdExpiryData.user_pwd_expiry_warning_2 || 0;
    this.pwdDefaultExpirySpan = pwdExpiryData.user_pwd_default_expiry_span || 0;
  }
}
