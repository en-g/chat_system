export interface MessageListItemInfoType {
  id: number
  userId: number
  nickname: string
  remarks: string | null | undefined
  avatarUrl: string
  lastMessage: string
  unRead: number
}
