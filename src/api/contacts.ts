import { get, put } from '@/request/index'
import {
  GetContactsInfoType,
  GetContactsListType,
  GetGroupInfoType,
  UpdateContactsRemarksType,
  UpdateGroupsRemarksType,
} from '@/types/contacts'

// 获取联系人列表
const getContactsList = (id: GetContactsListType) => {
  return Promise.resolve(get({ url: `friends/list/${id.userId}` }))
}

// 获取群聊列表
const getGroupsList = (id: GetContactsListType) => {
  return Promise.resolve(get({ url: `groups/list/${id.userId}` }))
}

// 获取联系人信息
const getFriendInfo = (ids: GetContactsInfoType) => {
  return Promise.resolve(
    get({
      url: 'friends/info',
      params: ids,
    })
  )
}

// 获取群聊信息
const getGroupInfo = (ids: GetGroupInfoType) => {
  return Promise.resolve(
    get({
      url: 'groups/info',
      params: ids,
    })
  )
}

// 修改联系人备注
const updateContactsRemarks = (info: UpdateContactsRemarksType) => {
  return Promise.resolve(
    put({
      url: 'friends/remarks',
      data: info,
    })
  )
}

// 修改用户群昵称
const updateGroupsRemarks = (info: UpdateGroupsRemarksType) => {
  return Promise.resolve(
    put({
      url: 'groups/remarks',
      data: info,
    })
  )
}

export { getContactsList, getGroupsList, getFriendInfo, getGroupInfo, updateContactsRemarks, updateGroupsRemarks }
