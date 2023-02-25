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
