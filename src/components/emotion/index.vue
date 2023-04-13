<template>
  <el-popover placement="top-start" :width="302" trigger="click">
    <el-scrollbar height="302px">
      <div class="emotion-list">
        <div class="add-emotion">
          <el-upload class="upload" :show-file-list="false" :auto-upload="false" :on-change="listenAvatarChange">
            <el-icon class="icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <div v-for="item in emotionList" :key="item.id" class="emotion-list-item" @click="listenSendEmotion(item.id)">
          <img class="emotion" :src="item.url" alt="emotion" />
        </div>
      </div>
    </el-scrollbar>
    <template #reference>
      <slot></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
  import { getEmotionList, uploadEmotion } from '@/api/emotion'
  import { EmotionListType } from '@/types/emotion'
  import { reactive } from 'vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const emit = defineEmits(['emotion'])

  const emotionList = reactive<EmotionListType[]>([]) // 表情包列表

  // 获取表情包列表
  const getEmotionListData = async () => {
    let emotions = storage.get('emotionList')
    if (!emotions) {
      const { data } = await getEmotionList({
        userId: store.user_id,
      })
      emotions = data
      storage.set('emotionList', emotions)
    }
    emotionList.splice(0, emotionList.length, ...emotions)
  }
  await getEmotionListData()

  // 上传表情包
  const listenAvatarChange = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'ready') {
      const res: any = await fileUpload.singleFileUpload('emotion', uploadFile.raw)
      if (res.status == 0) {
        ElMessage.error(TIP_TYPE.UPLOAD_EMOTION_FAIL)
      } else if (res.status == 1) {
        const { data } = await uploadEmotion({
          userId: store.user_id,
          fileId: res.fileInfo.id,
        })
        if (data) {
          ElMessage.success(TIP_TYPE.UPLOAD_EMOTION_SCCESS)
          emotionList.push({
            id: res.fileInfo.id,
            url: res.fileInfo.url,
          })
          storage.set('emotionList', emotionList)
        } else {
          ElMessage.error(TIP_TYPE.UPLOAD_EMOTION_FAIL)
        }
      } else if (res.status == 2) {
        ElMessage.error(TIP_TYPE.IMAGE_MIMETYPE_ERROR)
      }
    }
  }

  // 发送表情包
  const listenSendEmotion = (id: number) => {
    const url = emotionList.find((item) => item.id === id)?.url
    emit('emotion', url)
  }
</script>

<style scoped lang="less">
  .emotion-list {
    display: flex;
    flex-wrap: wrap;
    .add-emotion {
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      margin-right: 9px;
      margin-bottom: 9px;
      box-sizing: border-box;
      cursor: pointer;
      .icon {
        font-size: 30px;
        color: #8c939d;
      }
    }
    .emotion-list-item {
      width: 60px;
      height: 60px;
      margin-right: 9px;
      margin-bottom: 9px;
      box-sizing: border-box;
      cursor: pointer;
      .emotion {
        width: 60px;
        height: 60px;
      }
    }
  }
</style>
