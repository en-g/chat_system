import { get, post } from '@/request/index'
import { ContactPyqTidingsListIdType, PyqTidingsInfoType, PyqTidingsListIdType } from '@/types/pyq'

// 获取朋友圈动态列表
const getPyqTidingsList = (id: PyqTidingsListIdType) => {
  return Promise.resolve(get({ url: `pyq/list/${id.userId}` }))
}

// 获取联系人的朋友圈动态列表
const getContactPyqTidingsList = (ids: ContactPyqTidingsListIdType) => {
  return Promise.resolve(
    get({
      url: 'pyq/list',
      params: ids,
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

export { getPyqTidingsList, getContactPyqTidingsList, releasePyqTiding }
