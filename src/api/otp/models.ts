export interface otpParameters{
  email: string;
}

export interface CheckOtp{
  email:string;
  otp:string;
  newPassword:string;
}

export interface CheckResult{
  status:number,
  message:string;
}