export interface CreateGroupInfoType {
  leaderId: number
  name: string
  avatarUrl: string
  members: Array<number>
}

export interface DefaultGrouoAvatarListType {
  id: number
  url: string
}

export interface ContactListType {
  userId: number
  nickname: string
  avatarUrl: string
}

export interface GetAllContactType {
  userId: number
}

export interface ExitGroupType {
  userId: number
  groupId: number
}

export interface DismissGroupType {
  leaderId: number
  groupId: number
}
