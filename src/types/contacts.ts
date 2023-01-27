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
