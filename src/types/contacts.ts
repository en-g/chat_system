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
