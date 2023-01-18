import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'reset-css'
import './style/base.css'
import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)
app.use(router).use(createPinia()).use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#app')
