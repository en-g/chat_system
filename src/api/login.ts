import { get, post } from '@/request/index'
import {
  RegisterInfoType,
  UserLoginType,
  RegisterCodeInfoType,
  AccountRandomSelfInfoType,
  AccountSelfInfoUploadType,
} from '@/types/login'

// 用户登录
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

// 查询用户是否存在
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

const getUserRegisterCode = (info: RegisterCodeInfoType) => {
  return Promise.resolve(
    get({
      url: 'email/register',
      params: {
        ...info,
      },
    })
  )
}

const getDefaultAvatarList = () => {
  return Promise.resolve(get({ url: 'login/register/avatar/list' }))
}

const writeUserRegisterInfo = (info: AccountSelfInfoUploadType) => {
  return Promise.resolve(
    post({
      url: 'login/register/info',
      data: {
        ...info,
      },
    })
  )
}

const randomUserRegisterInfo = (id: AccountRandomSelfInfoType) => {
  return Promise.resolve(
    post({
      url: 'login/register/random/info',
      data: {
        ...id,
      },
    })
  )
}

export {
  userLogin,
  searchUser,
  userRegister,
  getUserRegisterCode,
  getDefaultAvatarList,
  writeUserRegisterInfo,
  randomUserRegisterInfo,
}
