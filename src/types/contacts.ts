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
