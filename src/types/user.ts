export interface PersonalInfoIdType {
  userId: number
}

export interface PersonalInfoType {
  id: number
  username: string
  nickname: string
  avatarUrl: string
  sex: string
  signature: string
  birthday: string
  email: string
}

export interface UpdatePersonalInfoType {
  userId: number
  nickname: string
  avatarUrl: string
  sex: string
  birthday: string
  signature: string
  email: string
}
