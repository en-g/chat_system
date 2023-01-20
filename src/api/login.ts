import { get, post } from '@/request/index'
import { RegisterInfoType, UserLoginType } from '@/types/login'

const userLogin = (info: UserLoginType) => {
  return Promise.resolve(
    post({
      url: 'login',
      data: {
        ...info,
      },
    })
  )
}

const searchUser = (info: UserLoginType) => {
  return Promise.resolve(
    get({
      url: 'login/search',
      params: {
        ...info,
      },
    })
  )
}

const userRegister = (info: RegisterInfoType) => {
  return Promise.resolve(
    post({
      url: 'login/register',
      data: {
        ...info,
      },
    })
  )
}

export { userLogin, searchUser, userRegister }
