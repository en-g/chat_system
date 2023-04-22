export interface LifeTidingsType {
  id: number
  userId: number
  name: string
  avatarUrl: string
  title: string
  content: string
  createTime: string
  isThumbsUp: number
  isCollect: number
  thumbsUpCount: number
  commentsCount: number
  collectionsCount: number
  readings: number
  pictures: Array<LifeTidingsPictureType>
  hotReview?: LifeTidingsHotReviewType
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
  fans: number
  likes: number
  comments: number
  isRegard: number
  isAdd: number
}

export interface PersonalCenterInfoMessagesType {
  id: number
  lifeTidingId: number
  title: string
  fromId: number
  fromName: string
  fromAvatarUrl: string
  content: number
  type: number
  createTime: string
}

export interface PersonalCenterInfoRegardsType {
  id: number
  userId: number
  name: string
  signature: string
  avatarUrl: string
}

export interface PersonalCenterInfoCollectionsType {
  id: number
  lifeTidingsId: number
  userId: number
  name: string
  avatarUrl: string
  title: string
}

export interface HotTidingsListItemType {
  id: number
  title: string
  read: number
}

export interface GetNewTidingsListInfoType {
  userId: number
  pageNum: number
  pageSize: number
}

export interface GetUserTidingsListInfoType {
  userId: number
  selfId: number
  pageNum: number
  pageSize: number
}

export interface GetUserCenterInfoIdsType {
  userId: number
  selfId: number
}

export interface LifeTidingsInfoType {
  userId: number
  title: string
  content: string
  pictureIds: Array<number>
}

export interface RegardListIdType {
  userId: number
}

export interface MessageListIdType {
  userId: number
}

export interface CollectionListIdType {
  userId: number
}
