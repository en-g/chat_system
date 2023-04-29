export interface MessageListItemInfoType {
  id: number
  contactId?: number
  groupId?: number
  type: string
  name: string
  remarks?: string
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

export interface ChatMessageInfoType {
  contactId?: number
  groupId?: number
  chatName: string
  type: string
  chatMessageList: Array<ChatMessageItemType>
}

export interface ChatMessageItemType {
  id: number
  fromId: number
  toId?: number
  groupId?: number
  type: number
  message?: string
  url?: string
  createTime: string
}

export interface ChatMessageNoticeType {
  id: number
  fromId: number
  toId?: number
  groupId?: number
  type: number
  message?: string
  url?: string
  createTime: string
  isContact: boolean
}

export interface DeleteChatMessageListItemType {
  id: number
  type: string
}

export interface OfflineChatMessagesInfoType {
  contact?: Array<ChatMessageItemType>
  group?: Array<ChatMessageItemType>
}
