export interface PyqTidingsType {
  id: number
  userId: number
  nickname: string
  avatarUrl: string
  content: string
  createTime: string
  pictures: Array<PyqTidingsPictureType>
  thumbs: Array<PyqTidingsThumbsType>
  comments: Array<PyqTidingsCommentsType>
}

export interface PyqTidingsPictureType {
  id: number
  url: string
}

export interface PyqTidingsThumbsType {
  userId: number
  nickname: string
}

export interface PyqTidingsCommentsType {
  id: number
  userId: number
  toId: number
  fromName: string
  toName: string
  content: string
}

export interface PyqTidingsListIdType {
  userId: number
}

export interface ContactPyqTidingsListIdType {
  userId: number
  contactId: number
}

export interface PyqTidingsInfoType {
  userId: number
  content: string
  pictureIds: Array<number>
}
