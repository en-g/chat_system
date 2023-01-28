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

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 跳转到登录界面，直接跳转
  if (to.path === '/login') {
    next()
    return
  }
  /**
   * 本地保存用户 ID
   * 每次路由跳转都确保 store.user_id 有值（包括刷新页面）
   * 本地保存的 ID 不存在时，跳转到登录界面
   */
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
