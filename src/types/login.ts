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

export interface RegisterCodeInfoType {
  email: string
  username: string
}

export interface AccountSelfInfoType {
  userId: number
  nickname: string
  avatarUrl: string
  sex: string
  birthday: Date
}

export interface AccountRandomSelfInfoType {
  userId: number
}

export interface AccountSelfIdType {
  id: number
}
