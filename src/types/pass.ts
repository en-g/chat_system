export interface PassInfoType {
  username: string
  email: string
  newPass: string
  confirmPass: string
  verificationCode: string
}

export interface updatePassType {
  username: string
  email: string
  newPass: string
  verificationCode: string
}

export interface updatePassCodeType {
  username: string
  email: string
}
