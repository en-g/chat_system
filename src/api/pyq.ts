import { get, post } from '@/request/index'
import { ContactPyqTidingsListInfoType, PyqTidingsInfoType, PyqTidingsListInfoType } from '@/types/pyq'

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

export { getPyqTidingsList, getContactPyqTidingsList, releasePyqTiding }
