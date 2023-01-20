export interface UserLoginType {
  username: string
  password: string
}

export interface AccountRegisterInfoType {
  email: string
  username: string
  password: string
  verificationCode: string
}

export interface RegisterInfoType {
  email: string
  username: string
  password: string
  verificationCode?: string
}
