<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-title">用户注册</div>
      <div class="register-main">
        <el-form
          class="register-main-form"
          :model="register"
          :rules="verificationRules"
          label-position="left"
          label-width="70px"
          status-icon
        >
          <el-form-item class="register-main-form-item" label="邮箱" prop="email">
            <el-input v-model="register.email" size="normal" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item class="register-main-form-item" label="用户名" prop="username">
            <el-input v-model="register.username" size="normal" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item class="register-main-form-item" label="密码" prop="password">
            <el-input v-model="register.password" size="normal" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item class="register-main-form-item" label="验证码" prop="verificationCode">
            <div class="verification-code">
              <el-input v-model="register.verificationCode" size="normal" placeholder="请输入验证码" />
              <div class="count-down" :class="{ send: isSend }" @click="listenSendVerificationCode">
                {{ isSend ? `${countDown}s` : '发送验证码' }}
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="register-main-button">
          <el-button class="register-main-button-item" size="normal" @click="listenCancleRegister">取消</el-button>
          <el-button class="register-main-button-item" type="primary" size="normal" @click="listenConfirmRegister"
            >确定</el-button
          >
        </div>
      </div>
      <el-dialog v-model="dialogVisible" class="register-dialog" :show-close="false">
        <span>是否填写个人信息？</span>
        <template #footer>
          <div class="register-dialog-button">
            <el-button class="register-dialog-button-item" @click="dialogVisible = false">否</el-button>
            <el-button class="register-dialog-button-item" type="primary" @click="dialogVisible = false">
              是
            </el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { AccountRegisterInfo } from '@/types/login'
  import type { FormRules } from 'element-plus'

  const emit = defineEmits(['cancle', 'confirm'])

  const register = reactive<AccountRegisterInfo>({
    email: '',
    username: '',
    password: '',
    verificationCode: '',
  })
  const countDown = ref<number>(60)
  const isSend = ref<boolean>(false)
  const dialogVisible = ref<boolean>(false)

  const validateEmail = (rule: any, value: any, callback: any) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱'))
    }
  }

  const verificationRules = reactive<FormRules>({
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { validator: validateEmail, trigger: 'blur' },
    ],
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'change' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'blur' },
    ],
    verificationCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  })

  const listenSendVerificationCode = () => {
    if (!isSend.value) {
      isSend.value = true
      const interval = setInterval(() => {
        countDown.value -= 1
        if (countDown.value === -1) {
          isSend.value = false
          clearInterval(interval)
        }
      }, 1000)
      // 发送验证码
    }
  }

  const listenCancleRegister = () => {
    emit('cancle')
  }

  const listenConfirmRegister = () => {
    dialogVisible.value = true
    // emit('confirm')
  }
</script>

<style scoped lang="less">
  .register-container {
    width: 100%;
    .register-card {
      width: 100%;
      min-height: 387px;
      padding: 20px;
      box-sizing: border-box;
      .register-title {
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
        padding-bottom: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 20px;
      }
      .register-main {
        &-form {
          &-item {
            display: flex;
            align-items: center;
            &:last-child {
              margin-bottom: 25px;
            }
            .verification-code {
              display: flex;
              align-items: center;
              .count-down {
                width: 70%;
                height: 32px;
                padding: 10px;
                box-sizing: border-box;
                border: 1px solid var(--border-color);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
                cursor: pointer;
                background-color: rgb(236, 236, 236);
                position: relative;
                color: var(--desc-color);
                &.send {
                  cursor: default;
                }
              }
            }
          }
        }
        &-button {
          display: flex;
          justify-content: flex-end;
          &-item {
            margin-left: 5% !important;
          }
        }
      }
      .register-dialog {
        &-button {
          display: flex;
          justify-content: flex-end;
          &-item {
            margin-left: 20px !important;
          }
        }
      }
    }
  }
  :deep(.el-dialog header) {
    display: none !important;
  }
  :deep(.el-dialog .el-dialog__body) {
    padding: 20px !important;
  }
</style>