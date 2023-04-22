import { get, post, del } from '@/request/index'
import {
  CollectionListIdType,
  GetNewTidingsListInfoType,
  GetUserCenterInfoIdsType,
  GetUserTidingsListInfoType,
  LifeTidingsInfoType,
  MessageListIdType,
  RegardListIdType,
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

export {
  getNewLifeTidingsList,
  getHotLifeTidingsList,
  getUserCenterInfo,
  releaseLifeTiding,
  getUserTidingsList,
  getRegardsList,
  getMessagesList,
  getCollectionsList,
}
