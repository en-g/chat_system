import { del, get, post, put } from '@/request/index'
import {
  AddFriendGroupsType,
  AgreeAddContactInfoType,
  AgreeAddGroupIdType,
  DeleteFriendGroupsIdsType,
  GetContactsInfoType,
  GetContactsListType,
  GetFriendGroupListType,
  GetGroupInfoType,
  GetNoticeListInfoType,
  ReadNoticeIdType,
  RefseAddContactInfoType,
  RefseAddGroupIdType,
  UnHandleNoticesInfoType,
  UpdateContactsRemarksType,
  UpdateGroupsRemarksType,
} from '@/types/contacts'
import { SearchContactOrGroupType } from '@/types/navbar'

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

// 获取分组列表
const getFriendGroupList = (id: GetFriendGroupListType) => {
  return Promise.resolve(get({ url: `friendGroups/list/${id.userId}` }))
}

// 添加分组
const addFriendGroup = (info: AddFriendGroupsType) => {
  return Promise.resolve(
    post({
      url: 'friendGroups/add',
      data: info,
    })
  )
}

// 删除分组
const deleteFriendGroup = (ids: DeleteFriendGroupsIdsType) => {
  return Promise.resolve(
    del({
      url: 'friendGroups/delete',
      data: ids,
    })
  )
}

// 搜索联系人或群聊
const searchContactsOrGroups = (info: SearchContactOrGroupType) => {
  return Promise.resolve(
    get({
      url: 'friends/groups/search',
      params: info,
    })
  )
}

// 获取好友通知列表
const getContactNoticeList = (info: GetNoticeListInfoType) => {
  return Promise.resolve(
    get({
      url: 'notice/contact',
      params: info,
    })
  )
}

// 获取群聊通知列表
const getGroupNoticeList = (info: GetNoticeListInfoType) => {
  return Promise.resolve(
    get({
      url: 'notice/group',
      params: info,
    })
  )
}

// 同意添加联系人
const agreeAddContact = (info: AgreeAddContactInfoType) => {
  return Promise.resolve(
    post({
      url: 'friends/agree',
      data: info,
    })
  )
}

// 拒绝添加联系人
const refuseAddContact = (id: RefseAddContactInfoType) => {
  return Promise.resolve(
    put({
      url: 'friends/refuse',
      data: id,
    })
  )
}

// 获取未处理通知
const getUnHandleNotices = (info: UnHandleNoticesInfoType) => {
  return Promise.resolve(
    get({
      url: 'notice/unHandle',
      params: info,
    })
  )
}

// 同意进群
const agreeAddGroup = (id: AgreeAddGroupIdType) => {
  return Promise.resolve(
    post({
      url: 'groups/agree',
      data: id,
    })
  )
}

// 拒绝进群
const refuseAddGrop = (id: RefseAddGroupIdType) => {
  return Promise.resolve(
    put({
      url: 'groups/refuse',
      data: id,
    })
  )
}

// 通知已阅读
const readNotice = (id: ReadNoticeIdType) => {
  return Promise.resolve(
    put({
      url: 'notice/read',
      data: id,
    })
  )
}

export {
  getContactsList,
  getGroupsList,
  getFriendInfo,
  getGroupInfo,
  updateContactsRemarks,
  updateGroupsRemarks,
  getFriendGroupList,
  addFriendGroup,
  deleteFriendGroup,
  searchContactsOrGroups,
  getContactNoticeList,
  getGroupNoticeList,
  agreeAddContact,
  refuseAddContact,
  getUnHandleNotices,
  agreeAddGroup,
  refuseAddGrop,
  readNotice,
}
