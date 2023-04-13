export interface ContactsListType {
  id: number
  name: string
  total: number
  members: ContactsListItemType[] | []
}

export interface ContactsListItemType {
  id: number
  name: string
  remarks?: string
  avatarUrl: string
  signature?: string
  status?: number
}

export interface GetContactsListType {
  userId: number
}

export interface GetContactsInfoType {
  userId: number
  friendId: number
}

export interface GetGroupInfoType {
  userId: number
  groupId: number
}

export interface UpdateContactsRemarksType {
  userId: number
  friendId: number
  remarks: string
}

export interface UpdateGroupsRemarksType {
  userId: number
  groupId: number
  remarks: string
}

export interface GetFriendGroupListType {
  userId: number
}

export interface FriendGroupsListType {
  id: number
  name: string
  total: number
}

export interface AddFriendGroupsType {
  userId: number
  name: string
}

export interface DeleteFriendGroupsIdsType {
  userId: number
  friendGroupId: number
  newId: number
}

export interface NoticeListItemType {
  id: number
  fromId: number
  toId: number
  groupId?: number
  groupName?: string
  fromName: string
  fromAvatarUrl: string
  fromSignature: string
  type: string
  message: string
  status: number
  createTime: string
}

export interface GetNoticeListInfoType {
  userId: number
  pageNum: number
  pageSize: number
}

export interface AgreeAddContactInfoType {
  noticeId: number
  friendGroupId: number
  remarks: string
}

export interface RefseAddContactInfoType {
  noticeId: number
}

export interface UnHandleNoticesInfoType {
  userId: number
  type: string
}

export interface AgreeAddGroupIdType {
  noticeId: number
}

export interface RefseAddGroupIdType {
  noticeId: number
}

export interface ReadNoticeIdType {
  noticeId: number
}

export interface UpdateContactFriendGroupType {
  userId: number
  friendId: number
  friendGroupId: number
}

export interface DeleteContactType {
  userId: number
  friendId: number
}

export interface ContactListAboutGroupIdsType {
  userId: number
  groupId: number
}

export interface ContactListAboutGroupType {
  userId: number
  name: string
  avatarUrl: string
  isMember: number
}
