export interface ContactOrGroupResultType {
  id: number
  userId?: number
  groupId?: number
  name: string
  signature?: string
  avatarUrl: string
  isGroup: number
  isAdd: number
}

export interface SearchContactOrGroupType {
  keyword: string
  userId: number
}
