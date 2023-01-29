import { get, put } from '@/request/index'
import { PersonalInfoIdType, UpdatePersonalInfoType } from '@/types/user'

// 获取个人信息
const getPersonalInfo = (id: PersonalInfoIdType) => {
  return Promise.resolve(get({ url: `users/personal/info/${id.userId}` }))
}

// 修改个人信息
const updatePersonalInfo = (info: UpdatePersonalInfoType) => {
  return Promise.resolve(
    put({
      url: 'users/personal/info',
      data: info,
    })
  )
}

export { getPersonalInfo, updatePersonalInfo }
