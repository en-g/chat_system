import { get, put } from '@/request/index'
import { updatePassCodeType, updatePassType } from '../types/pass'

const updatePassword = (info: updatePassType) => {
  return Promise.resolve(
    put({
      url: 'login/update',
      data: {
        ...info,
      },
    })
  )
}

const getUpdatePasswordCode = (info: updatePassCodeType) => {
  return Promise.resolve(
    get({
      url: 'email/update',
      params: {
        ...info,
      },
    })
  )
}

export { updatePassword, getUpdatePasswordCode }
