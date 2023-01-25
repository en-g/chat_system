<template>
  <div class="write-info-container">
    <el-card class="write-info-card">
      <div class="write-info-title">填写个人信息</div>
      <div class="write-info-main">
        <el-form class="write-info-main-form" :label-position="'top'" :model="selfInfo">
          <el-form-item class="write-info-main-form-item" label="选择头像">
            <div class="upload-avatar">
              <el-upload class="upload" :show-file-list="false" :auto-upload="false" :on-change="listenAvatarChange">
                <img v-if="selfInfo.avatarUrl" :src="selfInfo.avatarUrl" class="avatar" />
                <el-icon v-else class="icon"><Plus /></el-icon>
              </el-upload>
            </div>
            <div class="default-avatar">
              <div
                v-for="item in defaultAvatarList"
                :key="item.id"
                class="item"
                @click="listenChooseAvatar(item.id, item.url)"
              >
                <el-avatar shape="square" :size="50" fit="fill" :src="item.url" />
                <div v-show="chooseId === item.id" class="choose"></div>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="write-info-main-form-item" label="选择昵称">
            <el-input v-model="selfInfo.nickname" maxlength="10" size="default" placeholder="请输入昵称" type="text" />
          </el-form-item>
          <el-form-item class="write-info-main-form-item" label="选择性别">
            <el-select v-model="selfInfo.sex" placeholder="请选择性别" size="default">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item class="write-info-main-form-item" label="选择出生日期">
            <el-date-picker v-model="selfInfo.birthday" type="date" placeholder="请选择出生日期" size="default" />
          </el-form-item>
        </el-form>
        <div class="write-info-main-button">
          <el-button class="write-info-main-button-item" size="default" @click="listenCancleWriteInfo">取消</el-button>
          <el-button class="write-info-main-button-item" type="primary" size="default" @click="listenConfirmWriteInfo"
            >确定</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { AccountSelfInfoType } from '@/types/login'
  import { getDefaultAvatarList, writeUserRegisterInfo } from '@/api/login'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'

  const emit = defineEmits(['cancle', 'confirm'])
  const props = defineProps<{
    id: number
  }>()

  const selfInfo = reactive<AccountSelfInfoType>({
    userId: props.id,
    avatarUrl: '',
    nickname: '',
    sex: '',
    birthday: new Date(),
  })
  const chooseId = ref<number>(-1)

  const getUserRegisterDefaultAvatarList = async () => {
    const { data } = await getDefaultAvatarList()
    return data
  }
  const defaultAvatarList = await getUserRegisterDefaultAvatarList()

  const listenChooseAvatar = (id: number, avatarUrl: string) => {
    chooseId.value = id
    selfInfo.avatarUrl = avatarUrl
  }

  const listenAvatarChange = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'ready') {
      const res: any = await fileUpload.singleFileUpload('avatar', uploadFile.raw)
      switch (res.status) {
        case 0:
          ElMessage.error(TIP_TYPE.UPLOAD_AVATAR_FAIL)
          break
        case 1:
          ElMessage.success(TIP_TYPE.UPLOAD_AVATAR_SUCCESS)
          selfInfo.avatarUrl = res.fileInfo.url
          chooseId.value = -1
          break
        case 2:
          ElMessage.error(TIP_TYPE.IMAGE_MIMETYPE_ERROR)
      }
    }
  }

  const listenCancleWriteInfo = () => {
    emit('cancle')
  }

  const listenConfirmWriteInfo = async () => {
    if (selfInfo.avatarUrl && selfInfo.birthday && selfInfo.nickname && selfInfo.sex) {
      const { data } = await writeUserRegisterInfo(selfInfo)
      if (data) {
        ElMessage.success(TIP_TYPE.WRITE_SELF_INFO_SUCCESS)
        emit('confirm')
      } else {
        ElMessage.error(TIP_TYPE.WRITE_SELF_INFO_FAIL)
      }
    } else {
      ElMessage.error(TIP_TYPE.WRITE_SELF_INFO_ERROR)
    }
  }
</script>

<style scoped lang="less">
  .write-info-container {
    width: 100%;
    .write-info-card {
      width: 100%;
      min-height: 387px;
      padding: 20px;
      box-sizing: border-box;
      .write-info-title {
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
        padding-bottom: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 20px;
      }
      .write-info-main {
        &-form {
          &-item {
            .upload-avatar {
              width: 107px;
              height: 107px;
              margin-right: 10px;
              .upload {
                width: 100%;
                height: 100%;
                border: 1px dashed var(--el-border-color);
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: var(--el-transition-duration-fast);
                display: flex;
                justify-content: center;
                align-items: center;
                .avatar {
                  width: 100%;
                  height: 100%;
                }
                .icon {
                  width: 100%;
                  height: 100%;
                  font-size: 28px;
                  color: #8c939d;
                }
                &:hover {
                  border-color: var(--el-color-primary);
                }
              }
            }
            .default-avatar {
              width: 171px;
              height: 107px;
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              align-content: space-between;
              .item {
                cursor: pointer;
                position: relative;
                .choose {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 50px;
                  height: 50px;
                  border: 3px solid var(--avatar-active-border-color);
                  box-sizing: border-box;
                }
              }
            }
            &:last-child {
              margin-bottom: 25px;
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
