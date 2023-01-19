import { put } from '@/request/index'
import { updatePassType } from '../types/pass'

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

export { updatePassword }
