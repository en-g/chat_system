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
  id: number
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
