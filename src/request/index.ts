import axios from 'axios'
import { BASE_URL, ERROR_TYPE, TIME_OUT } from '@/config/index'
import { ElMessage } from 'element-plus'
import useStore from '@/store/index'
import { localStorage } from '@/utils/storage'
import { useRouter } from 'vue-router'

const request = (config: any) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
  })

  instance.interceptors.request.use(
    (config: any) => {
      const store = useStore()
      const storage = localStorage(`${store.user_id}`)
      const token = storage.get('token')
      token && (config.headers.Authorization = `Bearer ${token}`)
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use((res: any) => {
    const { status, data } = res
    if (status === 200) {
      return Promise.resolve(data)
    } else if (status === 401) {
      ElMessage.error(ERROR_TYPE.TOKEN_INVALID)
      const router = useRouter()
      router.push('/login')
    } else {
      ElMessage.error(ERROR_TYPE.NETWORK_ERROR)
    }
    return Promise.resolve(data.data)
  })
  return instance(config)
}

const get = (config: any) => request(Object.assign(config, { method: 'GET' }))
const post = (config: any) => request(Object.assign(config, { method: 'POST' }))
const del = (config: any) => request(Object.assign(config, { method: 'DELETE' }))
const put = (config: any) => request(Object.assign(config, { method: 'PUT' }))

export { get, post, del, put }
