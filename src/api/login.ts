import { post } from '@/request/index'
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

export { userLogin }
