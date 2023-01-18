<template>
  <div class="login-container">
    <div class="login-swiper">
      <swiper
        class="login-swiper-wrap"
        :loop="true"
        :effect="'fade'"
        :modules="[EffectFade, Autoplay]"
        :autoplay="{
          delay: 8000,
          disableOnInteraction: false,
        }"
      >
        <swiper-slide class="login-swiper-item">
          <img src="../../assets/images/bg0.jpg" />
        </swiper-slide>
        <swiper-slide class="login-swiper-item">
          <img src="../../assets/images/bg1.jpg" />
        </swiper-slide>
        <swiper-slide class="login-swiper-item">
          <img src="../../assets/images/bg2.jpg" />
        </swiper-slide>
        <swiper-slide class="login-swiper-item">
          <img src="../../assets/images/bg3.jpg" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="login-cover"></div>
    <div class="login-main">
      <el-card class="login-card">
        <div class="title">用户登录</div>
        <el-form :model="loginInfo" :rules="verificationRules" status-icon>
          <el-form-item class="username" prop="username">
            <el-input v-model="loginInfo.username" size="large" placeholder="请输入用户名/邮箱" />
          </el-form-item>
          <el-form-item class="password" prop="password">
            <el-input
              v-model="loginInfo.password"
              type="password"
              size="large"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
        </el-form>
        <div class="remember-forget">
          <div class="remember">
            <el-checkbox v-model="isRemember" label="记住密码" />
          </div>
          <div class="forget">
            <el-link type="primary" @click="listenUpdatePassword">忘记密码</el-link>
          </div>
        </div>
        <div class="button">
          <el-button class="item" type="primary" size="default" @click="listenUserLogin">登录</el-button>
          <el-button class="item" type="primary" size="default" @click="listenUserRegister">注册</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { EffectFade, Autoplay } from 'swiper'
  import 'swiper/css'
  import 'swiper/css/effect-fade'
  import { UserLoginType } from '@/types/login'
  import type { FormRules } from 'element-plus'
  import { searchUser, userLogin } from '@/api/login'
  import { ElMessage } from 'element-plus'
  import { TIP_TYPE } from '@/config/index'
  import { localStorage } from '@/utils/storage'
  import useStore from '@/store/index'

  const router = useRouter()
  const store = useStore()

  const loginInfo = reactive<UserLoginType>({
    username: '',
    password: '',
  })
  const verificationRules = reactive<FormRules>({
    username: [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'change' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'blur' },
    ],
  })
  const isRemember = ref<boolean>(false)

  const initLoginInfo = () => {
    const storage = localStorage()
    const username = storage.get('username')
    const password = storage.get('password')
    if (username && password) {
      loginInfo.username = username
      loginInfo.password = password
      isRemember.value = true
    }
  }
  initLoginInfo()

  const listenUserLogin = async () => {
    if (loginInfo.username && loginInfo.password) {
      const res = await searchUser(loginInfo)
      if (!res.data) {
        ElMessage.error(TIP_TYPE.LOGIN_INFO_ERROR)
      } else {
        const { data } = await userLogin(loginInfo)
        ElMessage.success(TIP_TYPE.LOGIN_SUCCESS)
        store.user_id = data.id
        let storage = localStorage()
        storage.set('userId', data.id)
        if (isRemember.value) {
          storage.set('username', loginInfo.username)
          storage.set('password', loginInfo.password)
        } else {
          storage.remove('username')
          storage.remove('password')
        }
        storage = localStorage(data.id)
        storage.set('token', data.access_token)
        router.push({ name: 'contacts' })
      }
    } else {
      ElMessage.error(TIP_TYPE.LOGIN_INFO_ERROR)
    }
  }

  const listenUpdatePassword = () => {
    router.push({ name: 'pass' })
  }

  const listenUserRegister = () => {
    router.push({ name: 'register' })
  }
</script>

<style scoped lang="less">
  .login-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    .login-swiper {
      width: 100%;
      height: 100%;
      &-wrap {
        width: 100%;
        height: 100%;
        .login-swiper-item {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .login-cover {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background-color: rgba(255, 255, 255, 0.2);
    }
    .login-main {
      width: 370px;
      position: fixed;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 100;
      .login-card {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        .title {
          font-size: var(--title-font-size);
          font-weight: var(--title-font-weight);
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding: 15px 0;
          box-sizing: border-box;
        }
        .username {
          margin-bottom: 20px;
        }
        .password {
          margin-bottom: 15px;
        }
        .remember-forget {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          .remember {
          }
          .forget {
          }
        }
        .button {
          width: 100%;
          .item {
            width: 100%;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
</style>
