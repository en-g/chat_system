import { get, put } from '@/request/index'
import { updatePassCodeType, updatePassType } from '../types/pass'

// 修改密码
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

// 获取修改密码的验证码
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
