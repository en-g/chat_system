export interface ContactOrGroupResultType {
  id: number
  userId?: number
  groupId?: number
  leaderId?: number
  name: string
  signature?: string
  avatarUrl: string
  number?: string
  username?: string
  isGroup: number
  isAdd: number
}

export interface SearchContactOrGroupType {
  keyword: string
  userId: number
}

export interface AddContactApplicationInfoType {
  fromId: number
  toId: number
  type: string
  message?: string
  friendGroupId: number
  remarks?: string
}

export interface AddGroupApplicationInfoType {
  fromId: number
  toId: number
  groupId: number
  type: string
  message?: string
}
