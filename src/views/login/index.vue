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
    <div v-if="isUpdate" class="login-update-password">
      <div class="login-update-password-content">
        <UpdatePassword @cancle="listenCancleUpdate" @confirm="listenConfirmUpdate" />
      </div>
    </div>
    <div v-if="isRegister" class="login-register">
      <div class="login-register-content">
        <Register @cancle="listenCancleRegister" @skip="listenSkipWriteInfo" @write="listenChooseWriteInfo" />
      </div>
    </div>
    <div v-if="isWrite" class="login-write-info">
      <div class="login-write-info-content">
        <WriteInfo :id="registerId" @cancle="listenCancleWriteInfo" @confirm="listenConfirmWriteInfo" />
      </div>
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
  import { randomUserRegisterInfo, searchUser, userLogin } from '@/api/login'
  import { ElMessage } from 'element-plus'
  import { TIP_TYPE } from '@/config/index'
  import { localStorage } from '@/utils/storage'
  import useStore from '@/store/index'
  import UpdatePassword from '@/components/updatePassword/index.vue'
  import Register from './children/register/index.vue'
  import WriteInfo from './children/writeInfo/index.vue'

  const router = useRouter()
  const store = useStore()

  // 登录必填信息
  const loginInfo = reactive<UserLoginType>({
    username: '',
    password: '',
  })
  // 登录信息验证
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
  const isRemember = ref<boolean>(false) // 标记是否记住密码
  const isUpdate = ref<boolean>(false) // 标记是否点击修改密码
  const isRegister = ref<boolean>(false) // 标记是否点击注册
  const isWrite = ref<boolean>(false) // 标记注册后是否填写个人信息
  const registerId = ref<number>(-1) // 用户注册之后得到的用户 ID

  // 初始化登录信息，若记住密码会自动获取
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

  // 用户登录
  const listenUserLogin = async () => {
    if (loginInfo.username && loginInfo.password) {
      // 查询用户是否存在
      const res = await searchUser(loginInfo)
      if (!res.data) {
        ElMessage.error(TIP_TYPE.LOGIN_INFO_ERROR)
      } else {
        const { data } = await userLogin(loginInfo)
        ElMessage.success(TIP_TYPE.LOGIN_SUCCESS)
        // 用户 ID 缓存
        store.user_id = data.id
        let storage = localStorage()
        storage.set('userId', data.id)
        // 若记住密码，缓存到本地（后续再进行密码加密）
        if (isRemember.value) {
          storage.set('username', loginInfo.username)
          storage.set('password', loginInfo.password)
        } else {
          storage.remove('username')
          storage.remove('password')
        }
        storage = localStorage(data.id)
        // 缓存 token
        storage.set('token', data.access_token)
        // websocket.init()
        router.push({ name: 'contacts' })
      }
    } else {
      ElMessage.error(TIP_TYPE.LOGIN_INFO_ERROR)
    }
  }

  // 修改密码
  const listenUpdatePassword = () => {
    isUpdate.value = true
  }

  // 取消修改密码
  const listenCancleUpdate = () => {
    isUpdate.value = false
  }

  // 确定修改密码
  const listenConfirmUpdate = () => {
    isUpdate.value = false
    loginInfo.password = ''
  }

  // 注册
  const listenUserRegister = () => {
    isRegister.value = true
  }

  // 取消注册
  const listenCancleRegister = () => {
    isRegister.value = false
  }

  // 注册后跳过填写个人信息，后端自动生成
  const listenSkipWriteInfo = async (id: number) => {
    registerId.value = id
    const { data } = await randomUserRegisterInfo({
      userId: id,
    })
    if (data) {
      ElMessage.success(TIP_TYPE.RANDOM_SELF_INFO_SUCCESS)
    } else {
      ElMessage.error(TIP_TYPE.RANDOM_SELF_INFO_FAIL)
    }
    isRegister.value = false
  }

  // 选择手动填写个人信息
  const listenChooseWriteInfo = (id: number) => {
    registerId.value = id
    isWrite.value = true
    isRegister.value = false
  }

  // 取消手动填写个人信息，后端自动生成
  const listenCancleWriteInfo = async () => {
    const { data } = await randomUserRegisterInfo({
      userId: registerId.value,
    })
    if (data) {
      ElMessage.success(TIP_TYPE.RANDOM_SELF_INFO_SUCCESS)
    } else {
      ElMessage.error(TIP_TYPE.RANDOM_SELF_INFO_FAIL)
    }
    isWrite.value = false
  }

  // 确定个人信息
  const listenConfirmWriteInfo = () => {
    isWrite.value = false
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
        padding: 20px;
        box-sizing: border-box;
        .title {
          font-size: var(--title-font-size);
          font-weight: var(--title-font-weight);
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
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
    .login-update-password,
    .login-register,
    .login-write-info {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      // background-color: rgba(0, 0, 0, 0.3);
      z-index: 200;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      &-content {
        width: 370px;
        position: fixed;
        right: 10%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
