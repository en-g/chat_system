export interface LifeTidingsType {
  id: number
  userId: number
  nickname: string
  avatarUrl: string
  title: string
  content: string
  createTime: string
  isThumbsUp: number
  thumbsUpCount: number
  commentsCount: number
  pictures: Array<LifeTidingsPictureType>
  hotReview: LifeTidingsHotReviewType
}

export interface LifeTidingsPictureType {
  id: number
  url: string
}

export interface LifeTidingsHotReviewType {
  id: number
  content: string
  isThumbsUp: number
  thumbsUpCount: number
}

export interface LifeTidingsDetailType {
  id: number
}

export interface PersonalCenterInfoType {
  userId: number
  name: string
  avatarUrl: string
  messages: Array<any>
  regards: Array<any>
  fans: number
  like: number
  comment: number
  isRegard: number
}

export interface HotTidingsListItemType {
  id: number
  title: string
  read: number
}
