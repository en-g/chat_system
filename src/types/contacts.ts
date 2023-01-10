export interface ContactsListType {
  id: number
  friendGroup: string
  list: ContactsListItemType[]
}

export interface ContactsListItemType {
  id: number
  avatarUrl: string
  name: string
  signature?: string
}
