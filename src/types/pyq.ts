export interface PyqTidingsType {
  id: number
  userId: number
  nickname: string
  avatarUrl: string
  content: string
  createTime: string
  isThumbsUp: number
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
  toId: number | null
  fromName: string
  toName: string | null
  content: string
}

export interface PyqTidingsListInfoType {
  userId: number
  pageNum: number
  pageSize: number
}

export interface ContactPyqTidingsListInfoType {
  userId: number
  contactId: number
  pageNum: number
  pageSize: number
}

export interface PyqTidingsInfoType {
  userId: number
  content: string
  pictureIds: Array<number>
}

export interface ThumbsUpPyqTidingsIdsType {
  userId: number
  pyqTidingId: number
}

export interface SendPyqTidingsCommentInfoType {
  pyqTidingId: number
  userId: number
  toId?: number
  content: string
}

export interface DeletePyqTidingsIdType {
  pyqTidingId: number
}
