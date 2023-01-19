<template>
  <div class="update-password-container">
    <el-card class="update-password-card">
      <div class="update-password-title">修改密码</div>
      <div class="update-password-main">
        <el-form
          class="update-password-main-form"
          :model="passInfo"
          :rules="verificationRules"
          label-position="left"
          label-width="70px"
          status-icon
        >
          <el-form-item class="update-password-main-form-item" label="邮箱" prop="email">
            <el-input v-model="passInfo.email" size="default" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="用户名" prop="username">
            <el-input v-model="passInfo.username" size="default" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="新密码" prop="newPass">
            <el-input v-model="passInfo.newPass" size="default" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="确认密码" prop="confirmPass">
            <el-input v-model="passInfo.confirmPass" size="default" placeholder="请确认新密码" />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="验证码" prop="verificationCode">
            <div class="verification-code">
              <el-input v-model="passInfo.verificationCode" size="default" placeholder="请输入验证码" />
              <div class="count-down" :class="{ send: isSend }" @click="listenSendVerificationCode">
                {{ isSend ? `${countDown}s` : '发送验证码' }}
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="update-password-main-button">
          <el-button class="update-password-main-button-item" size="default" @click="listenCancleUpdate"
            >取消</el-button
          >
          <el-button class="update-password-main-button-item" type="primary" size="default" @click="listenConfirmUpdate"
            >确定</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { PassInfoType, updatePassType } from '@/types/pass'
  import { ElMessage, FormRules } from 'element-plus'
  import { updatePassword } from '@/api/pass'
  import { TIP_TYPE } from '@/config/index'

  const emit = defineEmits(['cancle', 'confirm'])

  const passInfo = reactive<PassInfoType>({
    email: '',
    username: '',
    newPass: '',
    confirmPass: '',
    verificationCode: '',
  })
  const countDown = ref<number>(60)
  const isSend = ref<boolean>(false)

  const validateEmail = (rule: any, value: any, callback: any) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱'))
    }
  }

  const validatePassword = (rule: any, value: any, callback: any) => {
    if (value !== passInfo.newPass) {
      callback(new Error('确认密码必须与新密码相同'))
    } else {
      callback()
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
    newPass: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'change' },
      { min: 6, max: 20, message: '长度必须为6~20', trigger: 'blur' },
    ],
    confirmPass: [
      { required: true, message: '确认密码必须与新密码相同', trigger: 'blur' },
      { validator: validatePassword, trigger: 'blur' },
      { validator: validatePassword, trigger: 'change' },
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

  const listenCancleUpdate = () => {
    emit('cancle')
  }

  const listenConfirmUpdate = async () => {
    const info: updatePassType = {
      email: passInfo.email,
      username: passInfo.username,
      newPass: passInfo.newPass,
      verificationCode: passInfo.verificationCode,
    }
    if (info.email && info.username && info.newPass && info.verificationCode) {
      const { data } = await updatePassword(info)
      if (data) {
        ElMessage.success(TIP_TYPE.UPDATE_PASS_SUCCESS)
        emit('confirm')
      } else {
        ElMessage.error(TIP_TYPE.UPDATE_PASS_FAIL)
      }
    } else {
      ElMessage.error(TIP_TYPE.PASS_INFO_ERROR)
    }
  }
</script>

<style scoped lang="less">
  .update-password-container {
    width: 100%;
    .update-password-card {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      .update-password-title {
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
        padding-bottom: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 20px;
      }
      .update-password-main {
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
    }
  }
</style>
