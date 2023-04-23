import { get, post, del } from '@/request/index'
import {
  CollectLifeTidingsIdsType,
  CollectionListIdType,
  CommentLifeTidingsInfoType,
  DeleteLifeTidingsIdType,
  GetNewTidingsListInfoType,
  GetUserCenterInfoIdsType,
  GetUserTidingsListInfoType,
  LifeTidingDetailIdsType,
  LifeTidingsInfoType,
  MessageListIdType,
  RegardListIdType,
  ReplyLifeTidingsInfoType,
  ThumbsUpCommentIdsType,
  ThumbsUpLifeTidingsIdsType,
} from '@/types/life'

// 获取最新动态列表
const getNewLifeTidingsList = (info: GetNewTidingsListInfoType) => {
  return Promise.resolve(
    get({
      url: 'life/list/new',
      params: info,
    })
  )
}

// 获取热门动态列表
const getHotLifeTidingsList = (info: GetNewTidingsListInfoType) => {
  return Promise.resolve(
    get({
      url: 'life/list/hot',
      params: info,
    })
  )
}

// 获取个人动态列表
const getUserTidingsList = (info: GetUserTidingsListInfoType) => {
  return Promise.resolve(
    get({
      url: `life/list/${info.userId}`,
      params: {
        selfId: info.selfId,
        pageNum: info.pageNum,
        pageSize: info.pageSize,
      },
    })
  )
}

// 获取用户个人中心信息
const getUserCenterInfo = (ids: GetUserCenterInfoIdsType) => {
  return Promise.resolve(
    get({
      url: 'life/center/info',
      params: ids,
    })
  )
}

// 获取关注列表
const getRegardsList = (id: RegardListIdType) => {
  return Promise.resolve(get({ url: `life/regard/list/${id.userId}` }))
}

// 获取消息列表
const getMessagesList = (id: MessageListIdType) => {
  return Promise.resolve(get({ url: `life/message/list/${id.userId}` }))
}

// 获取收藏列表
const getCollectionsList = (id: CollectionListIdType) => {
  return Promise.resolve(get({ url: `life/collection/list/${id.userId}` }))
}

// 发布动态
const releaseLifeTiding = (info: LifeTidingsInfoType) => {
  return Promise.resolve(
    post({
      url: 'life',
      data: info,
    })
  )
}

// 点赞动态
const thumbsUpLifeTidings = (ids: ThumbsUpLifeTidingsIdsType) => {
  return Promise.resolve(
    post({
      url: 'life/thumbs',
      data: ids,
    })
  )
}

// 取消点赞动态
const cancelThumbsUpLifeTidings = (ids: ThumbsUpLifeTidingsIdsType) => {
  return Promise.resolve(
    del({
      url: 'life/thumbs',
      data: ids,
    })
  )
}

// 收藏动态
const collectLifeTidings = (ids: CollectLifeTidingsIdsType) => {
  return Promise.resolve(
    post({
      url: 'life/collect',
      data: ids,
    })
  )
}

// 取消收藏动态
const cancelCollectLifeTidings = (ids: CollectLifeTidingsIdsType) => {
  return Promise.resolve(
    del({
      url: 'life/collect',
      data: ids,
    })
  )
}

// 删除动态
const deleteLifeTidings = (id: DeleteLifeTidingsIdType) => {
  return Promise.resolve(
    del({
      url: 'life',
      data: id,
    })
  )
}

// 获取动态详情
const getLifeTidingDetail = (ids: LifeTidingDetailIdsType) => {
  return Promise.resolve(
    get({
      url: 'life/detail',
      params: ids,
    })
  )
}

// 评论
const commentLifeTiding = (info: CommentLifeTidingsInfoType) => {
  return Promise.resolve(
    post({
      url: 'life/comment',
      data: info,
    })
  )
}

// 回复
const replyLifeTiding = (info: ReplyLifeTidingsInfoType) => {
  return Promise.resolve(
    post({
      url: 'life/reply',
      data: info,
    })
  )
}

// 点赞评论
const thumbsUpComment = (ids: ThumbsUpCommentIdsType) => {
  return Promise.resolve(
    post({
      url: 'life/comment/thumbs',
      data: ids,
    })
  )
}

// 取消点赞评论
const cancelThumbsUpComment = (ids: ThumbsUpCommentIdsType) => {
  return Promise.resolve(
    del({
      url: 'life/comment/thumbs',
      data: ids,
    })
  )
}

// 获取基本热门动态列表
const getBaseHotTidingList = () => {
  return Promise.resolve(get({ url: 'life/list/hot/base' }))
}

export {
  getNewLifeTidingsList,
  getHotLifeTidingsList,
  getUserCenterInfo,
  releaseLifeTiding,
  getUserTidingsList,
  getRegardsList,
  getMessagesList,
  getCollectionsList,
  thumbsUpLifeTidings,
  collectLifeTidings,
  cancelThumbsUpLifeTidings,
  cancelCollectLifeTidings,
  deleteLifeTidings,
  getLifeTidingDetail,
  commentLifeTiding,
  replyLifeTiding,
  thumbsUpComment,
  cancelThumbsUpComment,
  getBaseHotTidingList,
}
