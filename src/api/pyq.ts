import { get, post, del } from '@/request/index'
import {
  ContactPyqTidingsListInfoType,
  DeletePyqTidingsIdType,
  GetPyqMessagesListIdType,
  PyqTidingsInfoType,
  PyqTidingsListInfoType,
  SendPyqTidingsCommentInfoType,
  ThumbsUpPyqTidingsIdsType,
} from '@/types/pyq'

// 获取朋友圈动态列表
const getPyqTidingsList = (info: PyqTidingsListInfoType) => {
  return Promise.resolve(
    get({
      url: `pyq/list/${info.userId}`,
      params: {
        pageNum: info.pageNum,
        pageSize: info.pageSize,
      },
    })
  )
}

// 获取联系人的朋友圈动态列表
const getContactPyqTidingsList = (info: ContactPyqTidingsListInfoType) => {
  return Promise.resolve(
    get({
      url: 'pyq/list',
      params: info,
    })
  )
}

// 发布动态
const releasePyqTiding = (info: PyqTidingsInfoType) => {
  return Promise.resolve(
    post({
      url: 'pyq',
      data: info,
    })
  )
}

// 点赞动态
const thumbsUpPyqTiding = (ids: ThumbsUpPyqTidingsIdsType) => {
  return Promise.resolve(
    post({
      url: 'pyq/thumbs',
      data: ids,
    })
  )
}

// 点赞动态
const cancleThumbsUpPyqTiding = (ids: ThumbsUpPyqTidingsIdsType) => {
  return Promise.resolve(
    del({
      url: 'pyq/thumbs',
      data: ids,
    })
  )
}

// 发送评论
const sendPyqTidingComment = (info: SendPyqTidingsCommentInfoType) => {
  return Promise.resolve(
    post({
      url: 'pyq/comment',
      data: info,
    })
  )
}

// 删除动态
const deletePyqTiding = (id: DeletePyqTidingsIdType) => {
  return Promise.resolve(
    del({
      url: 'pyq',
      data: id,
    })
  )
}

// 获取消息列表
const getPyqMessagesList = (id: GetPyqMessagesListIdType) => {
  return Promise.resolve(get({ url: `pyq/messages/list/${id.userId}` }))
}

// 获取消息数
const getPyqMessagesCount = (id: GetPyqMessagesListIdType) => {
  return Promise.resolve(get({ url: `pyq/messages/count/${id.userId}` }))
}

export {
  getPyqTidingsList,
  getContactPyqTidingsList,
  releasePyqTiding,
  thumbsUpPyqTiding,
  cancleThumbsUpPyqTiding,
  sendPyqTidingComment,
  deletePyqTiding,
  getPyqMessagesList,
  getPyqMessagesCount,
}
