import { del, get, post } from '@/request'
import { CreateGroupInfoType, DismissGroupType, ExitGroupType, GetAllContactType } from '@/types/groups'

// 获取群聊默认头像
const getGroupDefaultAvatrList = () => {
  return Promise.resolve(get({ url: 'groups/defaultAvatar/list/' }))
}

// 获取所有联系人
const getAllContact = (id: GetAllContactType) => {
  return Promise.resolve(get({ url: `friends/all/${id.userId}` }))
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

export { getGroupDefaultAvatrList, getAllContact, createGroup, exitGroup, dismissGroup }
