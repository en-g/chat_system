<template>
  <div class="personal-avatar-container">
    <el-avatar class="personal-avatar" :size="45" :src="personalInfo.avatarUrl" @mouseenter="listenShowPersonalInfo" />
    <div
      v-if="isShow || isEdit"
      class="personal-avatar-info"
      @mouseenter="listenReenterPersonalInfo"
      @mouseleave="listenHidePersonalInfo"
    >
      <div class="personal-avatar-info-top">
        <div class="info-avatar">
          <el-upload :show-file-list="false" :auto-upload="false" :on-change="listenAvatarChange">
            <el-avatar class="avatar" :size="60" :src="personalInfo.avatarUrl" />
          </el-upload>
        </div>
        <div class="info-nickname">{{ personalInfo.nickname }}</div>
        <div class="info-signature">
          <span v-if="!isEdit">{{ personalInfo.signature }}</span>
          <el-input
            v-else
            v-model="personalInfo.signature"
            maxlength="50"
            :rows="4"
            placeholder="请输入个性签名"
            type="textarea"
          />
        </div>
        <div class="pyq-life">
          <svg class="icon" aria-hidden="true" @click="listenNavigateToPyq">
            <use xlink:href="#icon-show-pyq"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="listenNavigateToLife">
            <use xlink:href="#icon-show-life"></use>
          </svg>
        </div>
        <div class="edit-save">
          <div v-show="!isEdit" class="item" @click="listenEditPersonalInfo">编辑</div>
          <div v-show="isEdit" class="item" @click="listenCancleEditPersonalInfo">取消</div>
          <div v-show="isEdit" class="item" @click="listenSavePersonalInfo">保存</div>
        </div>
      </div>
      <div class="personal-avatar-info-bottom">
        <div class="info">
          <div class="info-item">
            <div class="title">ID</div>
            <div class="content">{{ personalInfo.id }}</div>
          </div>
          <div class="info-item">
            <div class="title">账号</div>
            <div class="content">{{ personalInfo.username }}</div>
          </div>
          <div class="info-item">
            <div class="title">昵称</div>
            <div class="content">
              <span v-if="!isEdit">{{ personalInfo.nickname }}</span>
              <el-input
                v-else
                v-model="personalInfo.nickname"
                size="small"
                maxlength="10"
                placeholder="请输入昵称"
                type="text"
              />
            </div>
          </div>
          <div class="info-item">
            <div class="title">性别</div>
            <div class="content">
              <span v-if="!isEdit">{{ personalInfo.sex }}</span>
              <el-select v-else v-model="personalInfo.sex" size="small" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </div>
          </div>
          <div class="info-item">
            <div class="title">生日</div>
            <div class="content">
              <span v-if="!isEdit">{{ personalInfo.birthday }}</span>
              <el-date-picker
                v-else
                v-model="personalInfo.birthday"
                size="small"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择出生日期"
              />
            </div>
          </div>
          <div class="info-item">
            <div class="title">邮箱</div>
            <div class="content">
              <span v-if="!isEdit">{{ personalInfo.email }}</span>
              <el-input v-else v-model="personalInfo.email" size="small" placeholder="请输入邮箱" type="text" />
            </div>
          </div>
        </div>
        <div class="sign-out">
          <el-button class="button" @click="listenClickSignOut">退出登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getPersonalInfo, updatePersonalInfo } from '@/api/user'
  import useStore from '@/store/index'
  import { PersonalInfoType, UpdatePersonalInfoType } from '@/types/user'
  import { ElMessage } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import { localStorage, sessionStorage } from '@/utils/storage'
  import type { UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { formateTime } from '@/utils/utils'

  const router = useRouter()
  const store = useStore()
  const storage = localStorage(`${store.user_id}`)
  const sStorage = sessionStorage(`${store.user_id}`)

  const isShow = ref<boolean>(false) // 标记是否显示个人信息
  const isEdit = ref<boolean>(false) // 标记是否点击编辑个人信息

  // 获取个人信息
  const getPersonalInfoData = async () => {
    const info = sStorage.get('personalInfo')
    if (info) {
      return info
    }
    const { data } = await getPersonalInfo({
      userId: store.user_id,
    })
    console.log(data)
    data.birthday = formateTime(data.birthday, 1)
    sStorage.set('personalInfo', data)
    return data
  }
  const data = await getPersonalInfoData()
  const personalInfo = ref<PersonalInfoType>(data)

  // 点击编辑个人信息
  const listenEditPersonalInfo = () => {
    isEdit.value = true
  }

  // 取消编辑个人信息
  const listenCancleEditPersonalInfo = () => {
    isEdit.value = false
  }

  // 点击保存个人信息
  const listenSavePersonalInfo = async () => {
    const info: UpdatePersonalInfoType = {
      userId: personalInfo.value.id,
      nickname: personalInfo.value.nickname,
      avatarUrl: personalInfo.value.avatarUrl,
      sex: personalInfo.value.sex,
      birthday: personalInfo.value.birthday,
      signature: personalInfo.value.signature,
      email: personalInfo.value.email,
    }
    const { data } = await updatePersonalInfo(info)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_PERSONAL_INFO_SUCCESS)
      sStorage.set('personalInfo', personalInfo.value)
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_PERSONAL_INFO_FAIL)
    }
    isEdit.value = false
  }

  // 显示个人信息
  const listenShowPersonalInfo = () => {
    isShow.value = true
    isEdit.value = false
  }

  // 重新进入个人信息
  const listenReenterPersonalInfo = () => {
    isShow.value = true
  }

  // 隐藏个人信息
  const listenHidePersonalInfo = () => {
    isShow.value = false
  }

  // 跳转到个人朋友圈
  const listenNavigateToPyq = () => {
    router.push({
      name: 'pyq',
      query: {
        id: store.user_id,
      },
    })
  }

  // 跳转到个人生活圈
  const listenNavigateToLife = () => {
    router.push({
      name: 'life',
      query: {
        id: store.user_id,
      },
    })
  }

  // 退出登录
  const listenClickSignOut = () => {
    storage.remove('token')
    router.replace('/login')
  }

  // 上传头像
  const listenAvatarChange = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'ready') {
      const res: any = await fileUpload.singleFileUpload('avatar', uploadFile.raw)
      switch (res.status) {
        case 0:
          ElMessage.error(TIP_TYPE.UPLOAD_AVATAR_FAIL)
          break
        case 1:
          ElMessage.success(TIP_TYPE.UPLOAD_AVATAR_SUCCESS)
          personalInfo.value.avatarUrl = res.fileInfo.url
          await listenSavePersonalInfo()
          break
        case 2:
          ElMessage.error(TIP_TYPE.IMAGE_MIMETYPE_ERROR)
      }
    }
  }
</script>

<style scoped lang="less">
  .personal-avatar-container {
    .personal-avatar {
      cursor: pointer;
    }
    .personal-avatar-info {
      width: 300px;
      position: fixed;
      top: 60px;
      right: 20px;
      z-index: 3000;
      border-radius: 4px;
      box-shadow: var(--el-box-shadow-light);
      background-color: #fff;
      .personal-avatar-info-top {
        text-align: center;
        background-color: var(--friend-info-background-color);
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        .info-avatar {
          margin-top: -50px;
          margin-bottom: 20px;
        }
        .info-nickname {
          margin-bottom: 10px;
          font-size: var(--title-font-size);
        }
        .info-signature {
          width: 200px;
          margin: 0 auto;
          margin-bottom: 10px;
          color: var(--desc-color);
          font-size: var(--small-desc-size);
          line-height: 15px;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pyq-life {
          .icon {
            margin: 0 5px;
          }
        }
        .edit-save {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          .item {
            cursor: pointer;
            margin-left: 10px;
          }
        }
      }
      .personal-avatar-info-bottom {
        padding: 20px;
        box-sizing: border-box;
        .info {
          margin-bottom: 20px;
          .info-item {
            height: 20px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .title {
              width: 40px;
              color: var(--desc-color);
            }
            .content {
              el-select {
                width: fit-content;
              }
            }
          }
        }
        .sign-out {
          .button {
            width: 100%;
          }
        }
      }
    }
  }
</style>
