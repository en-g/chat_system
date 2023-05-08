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
          label-width="80px"
          status-icon
        >
          <el-form-item class="update-password-main-form-item" label="邮箱" prop="email">
            <el-input v-model="passInfo.email" size="default" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="用户名" prop="username">
            <el-input v-model="passInfo.username" size="default" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="新密码" prop="newPass">
            <el-input
              v-model="passInfo.newPass"
              type="password"
              show-password
              size="default"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item class="update-password-main-form-item" label="确认密码" prop="confirmPass">
            <el-input
              v-model="passInfo.confirmPass"
              type="password"
              show-password
              size="default"
              placeholder="请确认新密码"
            />
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
  import { PassInfoType, updatePassCodeType, updatePassType } from '@/types/pass'
  import { ElMessage, FormRules } from 'element-plus'
  import { getUpdatePasswordCode, updatePassword } from '@/api/pass'
  import { TIP_TYPE } from '@/config/index'

  const emit = defineEmits(['cancle', 'confirm'])

  // 修改密码必填信息
  const passInfo = reactive<PassInfoType>({
    email: '',
    username: '',
    newPass: '',
    confirmPass: '',
    verificationCode: '',
  })
  const countDown = ref<number>(60) // 验证码倒计时
  const isSend = ref<boolean>(false) // 标记是否点击发送验证码

  // 邮箱验证规则
  const validateEmail = (rule: any, value: any, callback: any) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱'))
    }
  }

  // 密码验证规则
  const validatePassword = (rule: any, value: any, callback: any) => {
    if (value !== passInfo.newPass) {
      callback(new Error('确认密码必须与新密码相同'))
    } else {
      callback()
    }
  }

  // 表单验证规则
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

  // 发送修改密码验证码
  const listenSendVerificationCode = async () => {
    // 邮箱不能为空
    if (!passInfo.email) {
      ElMessage.error(TIP_TYPE.EMAIL_NOT_NULL)
      return
    }
    if (!isSend.value) {
      isSend.value = true
      const interval = setInterval(() => {
        countDown.value -= 1
        if (countDown.value === -1) {
          isSend.value = false
          countDown.value = 60
          clearInterval(interval)
        }
      }, 1000)
      // 发送验证码
      const info: updatePassCodeType = {
        email: passInfo.email,
        username: passInfo.username,
      }
      const { data } = await getUpdatePasswordCode(info)
      switch (data.status) {
        case 0:
          ElMessage.error(TIP_TYPE.VERIFICATION_CODE_FAIL)
          break
        case 1:
          ElMessage.success(TIP_TYPE.VERIFICATION_CODE_SUCCESS)
          break
        case 2:
          ElMessage.error(TIP_TYPE.VERIFICATION_CODE_EMAIL_ERROR)
          break
      }
    }
  }

  // 取消修改密码
  const listenCancleUpdate = () => {
    emit('cancle')
  }

  // 确定修改密码
  const listenConfirmUpdate = async () => {
    const info: updatePassType = {
      email: passInfo.email,
      username: passInfo.username,
      newPass: passInfo.newPass,
      verificationCode: passInfo.verificationCode,
    }
    // 信息完整
    if (info.email && info.username && info.newPass && info.verificationCode) {
      const { data } = await updatePassword(info)
      console.log(data)
      switch (data.status) {
        case 0:
          ElMessage.error(TIP_TYPE.UPDATE_PASS_FAIL)
          break
        case 1:
          ElMessage.success(TIP_TYPE.UPDATE_PASS_SUCCESS)
          emit('confirm')
          break
        case 2:
          ElMessage.error(TIP_TYPE.VERIFICATION_CODE_ERROR)
          break
        case 3:
          ElMessage.error(TIP_TYPE.VERIFICATION_CODE_EXPIRED)
          break
      }
    } else {
      // 信息不完整
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
                font-size: var(--small-desc-size);
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
