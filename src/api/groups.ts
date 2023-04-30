import { del, get, post, put } from '@/request'
import {
  CreateGroupInfoType,
  DismissGroupType,
  ExitGroupType,
  GetAllContactType,
  UpdateGroupNameInfoType,
  UpdateGroupNoticeInfoType,
} from '@/types/groups'

// 获取群聊默认头像
const getGroupDefaultAvatrList = () => {
  return Promise.resolve(get({ url: 'groups/defaultAvatar/list/' }))
}

// 获取所有联系人
const getAllContact = (id: GetAllContactType) => {
  return Promise.resolve(get({ url: `friends/all/${id.userId}` }))
}

// 修改群聊名称
const updateGroupName = (info: UpdateGroupNameInfoType) => {
  return Promise.resolve(
    put({
      url: 'groups/name',
      data: info,
    })
  )
}

// 修改群聊公告
const updateGroupNotice = (info: UpdateGroupNoticeInfoType) => {
  return Promise.resolve(
    put({
      url: 'groups/notice',
      data: info,
    })
  )
}

// 创建群聊
const createGroup = (info: CreateGroupInfoType) => {
  return Promise.resolve(
    post({
      url: 'groups/create',
      data: info,
    })
  )
}

// 退出群聊
const exitGroup = (ids: ExitGroupType) => {
  return Promise.resolve(
    del({
      url: 'groups/exit',
      data: ids,
    })
  )
}

// 解散群聊
const dismissGroup = (ids: DismissGroupType) => {
  return Promise.resolve(
    del({
      url: 'groups/dismiss',
      data: ids,
    })
  )
}

export {
  getGroupDefaultAvatrList,
  getAllContact,
  createGroup,
  exitGroup,
  dismissGroup,
  updateGroupName,
  updateGroupNotice,
}
