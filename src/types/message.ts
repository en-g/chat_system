export interface MessageListItemInfoType {
  id: number
  userId: number
  nickname: string
  remarks: string | null | undefined
  avatarUrl: string
  lastMessage: string
  unRead: number
}

export interface FriendChatMessageInfoType {
  id: number
  fromId: number
  toId: number
  fromName: string
  fromAvatarUrl: string
  type: number
  message: string
  url: string
  createTime: string
}
