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

export interface UpdategroupsRemarksType {
  userId: number
  groupId: number
  remarks: string
}

export interface UpdateGroupNameInfoType {
  userId: number
  groupId: number
  name: string
}

export interface UpdateGroupNoticeInfoType {
  userId: number
  groupId: number
  notice: string
}
