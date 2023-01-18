import { get, post } from '@/request/index'
import { UserLoginType } from '@/types/login'

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

export { userLogin, searchUser }
