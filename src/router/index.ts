import { createRouter, createWebHistory } from 'vue-router'
import routes from './config'
import useStore from '@/store/index'
import { localStorage } from '@/utils/storage'
import { ElMessage } from 'element-plus'
import { ERROR_TYPE } from '@/config/index'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  const store = useStore()
  const storage = localStorage()
  const user_id = storage.get('userId')
  if (!user_id) {
    ElMessage.error(ERROR_TYPE.TOKEN_INVALID)
    next('/login')
    return
  } else if (store.user_id === -1) {
    store.user_id = user_id
  }
  next()
})

export default router
