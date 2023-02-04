<template>
  <div class="pyq-container">
    <div class="pyq-ascription">
      <div class="pyq-current" @click="listenNavigateToPyq">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="id === store.user_id ? '#icon-current-view' : '#icon-current-view-active'"></use>
        </svg>
        <span :class="{ active: id !== store.user_id }">朋友圈</span>
      </div>
      <div class="pyq-mine" @click="listenNavigateToMyPyq">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="id === store.user_id ? '#icon-mine-active' : '#icon-mine'"></use>
        </svg>
        <span :class="{ active: id === store.user_id }">我的朋友圈</span>
      </div>
    </div>
    <div class="pyq-main">
      <Tidings :tidings-list="tidingsList" />
    </div>
    <div class="pyq-release">
      <svg class="icon" aria-hidden="true" @click="listenReleaseTidings">
        <use xlink:href="#icon-release"></use>
      </svg>
    </div>
    <el-dialog v-model="isRelease" title="发布动态" width="40%">
      <div class="pyq-release-main">
        <div class="pyq-release-input">
          <el-input
            v-model="tidingInfo.content"
            maxlength="200"
            :autosize="{ minRows: 3 }"
            placeholder="这一刻的想法......"
            show-word-limit
            type="textarea"
          />
        </div>
        <div class="pyq-release-emoji">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-emoji"></use>
          </svg>
        </div>
        <div class="pyq-release-pictures">
          <el-upload
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            :on-change="listenPicturesChange"
            :on-remove="listenPicturesRemove"
            :on-preview="listenPicturesPreview"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="isPreview">
            <img w-full :src="previewUrl" alt="Preview Image" />
          </el-dialog>
        </div>
      </div>
      <template #footer>
        <span class="button">
          <el-button class="item" @click="listenCancleReleaseTiding"> 取消 </el-button>
          <el-button class="item" type="primary" @click="listenConfirmReleaseTiding"> 发布 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, computed, watch, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Tidings from './children/tidings/index.vue'
  import { PyqTidingsInfoType, PyqTidingsType } from '@/types/pyq'
  import useStore from '@/store'
  import { getContactPyqTidingsList, getPyqTidingsList, releasePyqTiding } from '@/api/pyq'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()

  const isRelease = ref<boolean>(false)
  const tidingInfo = reactive<PyqTidingsInfoType>({
    userId: store.user_id,
    content: '',
    pictureIds: [],
  })
  const prePictureList = reactive<Array<{ uid: number; id: number }>>([])
  const previewUrl = ref('')
  const isPreview = ref(false)

  // 获取要查看的联系人的 ID
  const id = computed(() => {
    if (route.query.id) {
      return parseInt(route.query.id as string)
    }
    return -1
  })

  // 获取朋友圈动态列表
  const getPyqTidingsListData = async () => {
    const { data } = await getPyqTidingsList({
      userId: store.user_id,
    })
    return data
  }

  // 获取联系人的动态列表
  const getContactPyqTidingsListData = async () => {
    const { data } = await getContactPyqTidingsList({
      userId: store.user_id,
      contactId: id.value,
    })
    return data
  }

  // 获取动态列表
  const getTidingsList = async () => {
    if (id.value !== -1) {
      const data = await getContactPyqTidingsListData()
      return data
    } else {
      const data = await getPyqTidingsListData()
      return data
    }
  }
  const data = await getTidingsList()
  const tidingsList = ref<PyqTidingsType[]>(data) // 朋友圈动态列表

  // 更新朋友圈动态列表数据
  watch(id, async () => {
    const data = await getTidingsList()
    tidingsList.value = data
  })

  // 跳转到朋友圈界面
  const listenNavigateToPyq = () => {
    router.push({
      name: 'pyq',
    })
  }

  // 跳转到联系人朋友圈界面
  const listenNavigateToMyPyq = () => {
    router.push({
      name: 'pyq',
      query: { id: store.user_id },
    })
  }

  // 发布动态
  const listenReleaseTidings = () => {
    isRelease.value = true
  }

  // 上传动态图片
  const listenPicturesChange = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'ready') {
      const res: any = await fileUpload.singleFileUpload('pyq', uploadFile.raw)
      switch (res.status) {
        case 0:
          ElMessage.error(TIP_TYPE.UPLOAD_IMAGE_FAIL)
          break
        case 1:
          ElMessage.success(TIP_TYPE.UPLOAD_IMAGE_SUCCESS)
          prePictureList.push({
            uid: uploadFile.uid,
            id: res.fileInfo.id,
          })
          break
        case 2:
          ElMessage.error(TIP_TYPE.IMAGE_MIMETYPE_ERROR)
      }
    }
  }

  // 移除动态图片
  const listenPicturesRemove: UploadProps['onRemove'] = (uploadFile) => {
    const index = prePictureList.findIndex((item) => item.uid === uploadFile.uid)
    if (index !== -1) {
      prePictureList.splice(index, 1)
    }
  }

  // 动态图片预览
  const listenPicturesPreview = (uploadFile: UploadFile) => {
    previewUrl.value = uploadFile.url!
    isPreview.value = true
  }

  // 取消发布动态
  const listenCancleReleaseTiding = () => {
    isRelease.value = false
    tidingInfo.content = ''
    tidingInfo.pictureIds = []
    prePictureList.splice(0, prePictureList.length)
  }

  // 确定发布动态
  const listenConfirmReleaseTiding = async () => {
    if (!tidingInfo.content) {
      ElMessage.error(TIP_TYPE.TIDING_CONTENT_IS_NOT_NULL)
      return
    }
    prePictureList.forEach((item) => {
      tidingInfo.pictureIds.push(item.id)
    })
    const { data } = await releasePyqTiding(tidingInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.RELEASE_TIDING_SUCCESS)
      const data = await getTidingsList()
      tidingsList.value = data
      isRelease.value = false
      tidingInfo.content = ''
      tidingInfo.pictureIds = []
      prePictureList.splice(0, prePictureList.length)
    } else {
      ElMessage.error(TIP_TYPE.RELEASE_TIDING_FAIL)
    }
  }
</script>

<style scoped lang="less">
  .pyq-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .pyq-ascription {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .pyq-current,
      .pyq-mine {
        width: fit-content;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
        margin-right: 10px;
        font-weight: bold;
        color: #515151;
        cursor: pointer;
        .active {
          color: var(--nav-active-color);
        }
      }
    }
    .pyq-main {
      // width: 50%;
      width: 768px;
      height: calc(100vh - 60px);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
    }
    .pyq-release {
      flex: 1;
      .icon {
        margin-left: 10px;
        margin-top: 10px;
      }
    }
    .pyq-release-main {
      padding: 10px 0;
      box-sizing: border-box;
      border: 1px solid var(--border-color);
      .pyq-release-input {
      }
      .pyq-release-emoji {
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
      }
      .pyq-release-pictures {
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
    .button {
      .item:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
  :deep(.el-textarea__inner, .el-textarea:focus, .el-textarea:active) {
    resize: none;
    box-shadow: none;
  }
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    border: none;
  }
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
</style>
