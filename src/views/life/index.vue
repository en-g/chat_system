<template>
  <div class="life-container">
    <div class="life-personal-center">
      <PersonalCenter :personal-center-info="personalCenterInfo" @regard="listenRegard" @release="listenRelease" />
    </div>
    <div class="life-hot-search">
      <HotSearch :hot-tidings-list="hotTidingsList" />
    </div>
    <div class="life-content">
      <el-card class="life-navbar-card">
        <div class="life-navbar">
          <div class="navbar-item" :class="{ active: isNew && id === -1 }" @click="listenShowNewTidings">最新</div>
          <div class="navbar-item" :class="{ active: !isNew && id === -1 }" @click="listenShowHotTidings">热门</div>
          <div v-show="id !== -1" class="navbar-item" :class="{ active: id !== -1 }">
            {{ `${personalCenterInfo.name}的动态` }}
          </div>
        </div>
      </el-card>
      <el-card class="life-main-card">
        <div class="life-main">
          <el-scrollbar v-if="!!tidingsList.length" ref="scrollbarRef" class="life-tidings-list-scroll">
            <div class="life-tidings-list">
              <Tidings :tidings-list="tidingsList" />
            </div>
            <div class="life-tidings-pagination">
              <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[2, 5, 10]"
                :small="true"
                :background="true"
                layout="sizes, prev, pager, next"
                :total="total"
                @size-change="listenPaginationChange"
                @current-change="listenPaginationChange"
              />
            </div>
          </el-scrollbar>
          <div v-else class="tidings-null">
            <span v-if="id === -1">生活圈还没有动态，快来发布动态吧</span>
            <span v-else>TA还没有发布过动态</span>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="isRelease" title="发布动态" width="50%" top="5vh">
      <div class="life-release-title-wrapper">
        <div class="label">标题</div>
        <div class="life-release-title">
          <el-input
            v-model="tidingInfo.title"
            maxlength="100"
            :autosize="{ minRows: 2, maxRows: 3 }"
            placeholder="标题"
            type="textarea"
          />
        </div>
      </div>
      <div class="life-release-main">
        <div class="label">内容</div>
        <div class="life-release-input">
          <el-input
            v-model="tidingInfo.content"
            maxlength="1000"
            :autosize="{ minRows: 8, maxRows: 8 }"
            placeholder="分享生活乐趣......"
            type="textarea"
          />
          <div class="life-release-emoji">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-emoji"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="life-release-pictures-wrapper">
        <div class="life-release-pictures">
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
    <el-dialog id="detail" v-model="showDetailVisible" width="798px" :modal="false" :show-close="false" top="60px">
      动态详情
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, computed, watch, ref, provide } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Tidings from './children/tidings/index.vue'
  import useStore from '@/store'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'
  import { sessionStorage } from '@/utils/storage'
  import { HotTidingsListItemType, LifeTidingsInfoType, LifeTidingsType, PersonalCenterInfoType } from '@/types/life'
  import PersonalCenter from './children/personalCenter/index.vue'
  import HotSearch from './children/hotSearch/index.vue'
  import {
    getHotLifeTidingsList,
    getNewLifeTidingsList,
    getUserCenterInfo,
    getUserTidingsList,
    releaseLifeTiding,
  } from '@/api/life'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const isRelease = ref<boolean>(false) // 标记是否显示发布动态
  const isNew = ref<boolean>(true) // 标记是否为最新动态
  const showDetailVisible = ref<boolean>(true) // 查看动态详情
  // 获取要查看的用户的 ID
  const id = computed(() => {
    if (route.query.id) {
      return parseInt(route.query.id as string)
    }
    return -1
  })
  // 待发布的动态信息
  const tidingInfo = reactive<LifeTidingsInfoType>({
    userId: store.user_id,
    title: '',
    content: '',
    pictureIds: [],
  })
  const prePictureList = reactive<Array<{ uid: number; id: number }>>([]) // 动态可预览图片列表
  const previewUrl = ref<string>('') // 当前预览的图片 URL
  const isPreview = ref<boolean>(false) // 标记是否显示图片预览
  const pageNum = ref<number>(1) // 当前页数
  const pageSize = ref<number>(10) // 当前每页条数
  const total = ref<number>(0) // 朋友圈动态总条数
  const tidingsList = reactive<LifeTidingsType[]>([])
  // 个人中心信息
  const personalCenterInfo = reactive<PersonalCenterInfoType>({
    userId: -1,
    name: '',
    avatarUrl: '',
    fans: 0,
    likes: 0,
    comments: 0,
    isRegard: 0,
    isAdd: 0,
  })
  // 热门动态列表
  const hotTidingsList = reactive<HotTidingsListItemType[]>([
    { id: 1, title: '成都大运会倒计时100天', read: 12345 },
    { id: 2, title: '成都大运会倒计时100天', read: 12345 },
    { id: 3, title: '成都大运会倒计时100天', read: 12345 },
    { id: 4, title: '成都大运会倒计时100天', read: 12345 },
    { id: 5, title: '成都大运会倒计时100天', read: 12345 },
    { id: 6, title: '成都大运会倒计时100天', read: 12345 },
    { id: 7, title: '成都大运会倒计时100天', read: 12345 },
    { id: 8, title: '成都大运会倒计时100天', read: 12345 },
    { id: 9, title: '成都大运会倒计时100天', read: 12345 },
    { id: 10, title: '成都大运会倒计时100天', read: 12345 },
  ])

  // 获取生活圈动态列表
  const getLifeTidingsListData = async () => {
    let info = null
    if (isNew.value) {
      // 获取最新
      const { data } = await getNewLifeTidingsList({
        userId: store.user_id,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      })
      info = data
    } else {
      // 获取热门
      const { data } = await getHotLifeTidingsList({
        userId: store.user_id,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      })
      info = data
    }
    total.value = info.total
    tidingsList.splice(0, tidingsList.length, ...info.list)
  }
  await getLifeTidingsListData()

  // 获取个人中心信息
  const getUserCenterInfoData = async () => {
    const { data } = await getUserCenterInfo({
      userId: id.value === -1 ? store.user_id : id.value,
      selfId: store.user_id,
    })
    Object.assign(personalCenterInfo, data)
  }
  await getUserCenterInfoData()

  // 获取个人动态列表
  const getUserTidingsListData = async () => {
    const { data } = await getUserTidingsList({
      userId: id.value,
      selfId: store.user_id,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    })
    total.value = data.total
    tidingsList.splice(0, tidingsList.length, ...data.list)
  }

  // 收藏动态
  const collectTiding = (id: number) => {
    const tiding = tidingsList.find((item) => item.id === id)
    if (tiding) {
      if (tiding.isCollect === 0) {
        tiding.isCollect = 1
      } else {
        tiding.isCollect = 0
      }
    }
    // 发送请求并提示
  }
  provide('collectTiding', collectTiding)

  // 点击关注
  const listenRegard = (isRegard: boolean) => {
    personalCenterInfo.isRegard = isRegard ? 0 : 1
  }

  // 发布动态
  const listenRelease = () => {
    tidingInfo.title = ''
    tidingInfo.content = ''
    tidingInfo.pictureIds.splice(0, tidingInfo.pictureIds.length)
    isPreview.value = false
    previewUrl.value = ''
    prePictureList.splice(0, prePictureList.length)
    isRelease.value = true
  }

  // 获取最新动态
  const listenShowNewTidings = async () => {
    isNew.value = true
    await getLifeTidingsListData()
    router.push({ name: 'life' })
  }

  // 获取热门动态
  const listenShowHotTidings = async () => {
    isNew.value = false
    await getLifeTidingsListData()
    router.push({ name: 'life' })
  }

  // 跳转到生活圈界面
  const listenNavigateTolife = () => {
    router.push({ name: 'life' })
  }

  // 跳转到我的生活圈界面
  const listenNavigateToMylife = () => {
    router.push({ name: 'life', query: { id: store.user_id } })
  }

  // 上传动态图片
  const listenPicturesChange = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'ready') {
      const res: any = await fileUpload.singleFileUpload('life', uploadFile.raw)
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
  }

  // 确定发布动态
  const listenConfirmReleaseTiding = async () => {
    if (!tidingInfo.title) {
      ElMessage.error(TIP_TYPE.TIDING_TITLE_IS_NOT_NULL)
      return
    }
    if (!tidingInfo.content) {
      ElMessage.error(TIP_TYPE.TIDING_CONTENT_IS_NOT_NULL)
      return
    }
    prePictureList.forEach((item) => {
      tidingInfo.pictureIds.push(item.id)
    })
    const { data } = await releaseLifeTiding(tidingInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.RELEASE_TIDING_SUCCESS)
      // 跳转到最新动态
      isNew.value = true
      await getLifeTidingsListData()
      router.push({ name: 'life' })
      isRelease.value = false
    } else {
      ElMessage.error(TIP_TYPE.RELEASE_TIDING_FAIL)
    }
  }

  // 监听用户id变化，更新数据
  watch(
    id,
    async () => {
      if (id.value !== -1) {
        // 获取个人动态列表
        await getUserTidingsListData()
      }
      // 更新个人中心信息
      await getUserCenterInfoData()
    },
    { immediate: true }
  )

  // 更新数据
  const listenPaginationChange = async () => {
    await getLifeTidingsListData()
  }
</script>

<style scoped lang="less">
  .life-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--theme-backgrond-color);
    .life-personal-center {
      width: 250px;
      position: fixed;
      top: 60px;
      left: 100px;
    }
    .life-hot-search {
      width: 300px;
      position: fixed;
      top: 60px;
      right: 50px;
    }
    .life-content {
      width: 798px;
      height: calc(100vh - 60px);
      .life-navbar-card {
        width: 100%;
        margin-bottom: 10px;
        .life-navbar {
          display: flex;
          align-items: center;
          .navbar-item {
            margin-right: 30px;
            font-size: var(--middle-font-size);
            cursor: pointer;
            &.active {
              color: var(--nav-active-color);
            }
          }
        }
      }
      .life-main-card {
        .life-main {
          // width: 50%;
          width: 100%;
          height: calc(100vh - 170px);
          // border-left: 1px solid var(--border-color);
          // border-right: 1px solid var(--border-color);
          .life-tidings-list-scroll {
            width: 100%;
            height: 100%;
            .life-tidings-list {
              width: 100%;
            }
            .life-tidings-pagination {
              width: 100%;
              padding: 40px 30px;
              box-sizing: border-box;
              display: flex;
              justify-content: flex-end;
            }
          }
          .tidings-null {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            padding: 30px 0;
            box-sizing: border-box;
            font-size: var(--title-font-size);
            color: var(--desc-color);
            font-family: '楷体';
          }
        }
      }
    }
    .life-release-title-wrapper {
      margin-bottom: 20px;
      .label {
        margin-bottom: 10px;
        font-size: var(--middle-font-size);
      }
      .life-release-title {
        padding: 5px 0;
        box-sizing: border-box;
        border: 1px solid var(--border-color);
      }
    }
    .life-release-main {
      margin-bottom: 20px;
      .label {
        margin-bottom: 10px;
        font-size: var(--middle-font-size);
      }
      .life-release-input {
        padding: 5px 0;
        box-sizing: border-box;
        border: 1px solid var(--border-color);
        .life-release-emoji {
          padding: 0 10px;
          box-sizing: border-box;
          margin-bottom: 10px;
        }
      }
    }
    .life-release-pictures-wrapper {
      .label {
        padding: 0 10px;
        box-sizing: border-box;
      }
      .life-release-pictures {
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
  :deep(#detail .el-dialog__header) {
    display: none;
  }
  :deep(#detail.el-dialog) {
    border-radius: 4px !important;
  }
</style>
