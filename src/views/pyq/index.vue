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
      <div class="pyq-messages">
        <el-badge :value="store.pyqMessagesCount" :hidden="store.pyqMessagesCount === 0" :max="99" class="item">
          <div class="message-icon">
            <el-popover placement="right-start" :width="250" trigger="click">
              <el-scrollbar class="message-popover-scrollbar">
                <div v-if="messagesList.length > 0" class="message-list">
                  <div v-for="item in messagesList" :key="item.id" class="message-item">
                    <div class="time">{{ item.createTime.replace('T', ' ').split('.')[0] }}</div>
                    <div class="title">
                      <div class="other">【</div>
                      <div class="main">{{ item.title }}</div>
                      <div class="other">】</div>
                    </div>
                    <div class="tip">
                      <div class="avatar">
                        <el-avatar :size="30" :src="item.fromAvatarUrl" />
                      </div>
                      <div class="name">{{ item.fromName }}</div>
                      <div v-if="item.type === 1" class="item">评论了你：</div>
                      <div v-else-if="item.type === 2" class="item">回复了你：</div>
                      <div v-else-if="item.type === 3" class="item">点赞了你</div>
                    </div>
                    <div v-if="item.content" class="content">{{ item.content }}</div>
                  </div>
                </div>
                <div v-else class="message-null">暂无消息</div>
              </el-scrollbar>
              <template #reference>
                <svg class="icon" aria-hidden="true" @click="getPyqMessagesListData">
                  <use xlink:href="#icon-tip-message"></use>
                </svg>
              </template>
            </el-popover>
          </div>
        </el-badge>
      </div>
    </div>
    <div class="pyq-main">
      <el-scrollbar v-if="!!tidingsList.length" class="pyq-tidings-list-scroll">
        <div class="pyq-tidings-list">
          <Tidings :tidings-list="tidingsList" />
        </div>
        <div class="pyq-tidings-pagination">
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
      <div v-else class="tidings-null">朋友圈还没有动态，快来发布动态吧</div>
    </div>
    <div class="pyq-release">
      <svg v-show="id === store.user_id || id === -1" class="icon" aria-hidden="true" @click="listenReleaseTidings">
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
          <Emoji @emoji="listenInputEmoji">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-emoji"></use>
            </svg>
          </Emoji>
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
  import { reactive, computed, watch, ref, provide, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Tidings from './children/tidings/index.vue'
  import {
    PyqTidingsInfoType,
    PyqTidingsThumbsType,
    PyqTidingsType,
    SendPyqTidingsCommentInfoType,
    PyqMessagesListInfoType,
  } from '@/types/pyq'
  import useStore from '@/store'
  import {
    getContactPyqTidingsList,
    getPyqTidingsList,
    releasePyqTiding,
    cancleThumbsUpPyqTiding,
    thumbsUpPyqTiding,
    sendPyqTidingComment,
    deletePyqTiding,
    getPyqMessagesList,
  } from '@/api/pyq'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'
  import { sessionStorage } from '@/utils/storage'
  import websocket from '@/websocket'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const isRelease = ref<boolean>(false) // 标记是否显示发布动态
  // 待发布的动态信息
  const tidingInfo = reactive<PyqTidingsInfoType>({
    userId: store.user_id,
    content: '',
    pictureIds: [],
  })
  const prePictureList = reactive<Array<{ uid: number; id: number }>>([]) // 动态可预览图片列表
  const previewUrl = ref('') // 当前预览的图片 URL
  const isPreview = ref(false) // 标记是否显示图片预览
  const pageNum = ref<number>(1) // 当前页数
  const pageSize = ref<number>(10) // 当前每页条数
  const total = ref<number>(0) // 朋友圈动态总条数
  const messagesList = reactive<PyqMessagesListInfoType[]>([])

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
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    })
    total.value = data.total
    return data.list
  }

  // 获取联系人的动态列表
  const getContactPyqTidingsListData = async () => {
    const { data } = await getContactPyqTidingsList({
      userId: store.user_id,
      contactId: id.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    })
    total.value = data.total
    return data.list
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

  // pageNum、pageSize 变化，重新请求列表数据
  const listenPaginationChange = async () => {
    const data = await getTidingsList()
    tidingsList.value = data
    console.log(total.value)
  }

  // 获取消息数
  const getPyqMessagesCountData = async () => {
    await store.initpyqMessageCount()
  }
  await getPyqMessagesCountData()

  // 获取消息列表
  const getPyqMessagesListData = async () => {
    const { data } = await getPyqMessagesList({
      userId: store.user_id,
    })
    messagesList.splice(0, messagesList.length, ...data)
    store.pyqMessagesCount = 0
  }

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

  // 输入emoji
  const listenInputEmoji = (emoji: string) => {
    tidingInfo.content += emoji
  }

  // 发布动态
  const listenReleaseTidings = () => {
    tidingInfo.content = ''
    tidingInfo.pictureIds.splice(0, tidingInfo.pictureIds.length)
    prePictureList.splice(0, prePictureList.length)
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

  // 点赞/取消点赞动态
  const thumbsUpTiding = async (id: number) => {
    const tiding = tidingsList.value.find((item: PyqTidingsType) => item.id === id)
    const nickname = storage.get('personalInfo').nickname
    if (tiding) {
      if (tiding.isThumbsUp === 1) {
        tiding.isThumbsUp = 0
        const index = tiding.thumbs.findIndex((item: PyqTidingsThumbsType) => item.userId === store.user_id)
        tiding.thumbs.splice(index, 1)
        await cancleThumbsUpPyqTiding({
          userId: store.user_id,
          pyqTidingId: id,
        })
      } else {
        tiding.isThumbsUp = 1
        tiding.thumbs.unshift({ userId: store.user_id, nickname })
        await thumbsUpPyqTiding({
          userId: store.user_id,
          pyqTidingId: id,
        })
        if (tiding.userId !== store.user_id) {
          // 通知对方更新朋友圈消息数
          websocket.send('updatePyqMessageCount', { userId: tiding.userId })
        }
      }
    }
  }
  provide('thumbsUpTiding', thumbsUpTiding)

  // 发送评论
  const sendTidingComment = async (info: SendPyqTidingsCommentInfoType, toName?: string) => {
    const { data } = await sendPyqTidingComment(info)
    if (data.status) {
      const tiding = tidingsList.value.find((item: PyqTidingsType) => item.id === info.pyqTidingId)
      const nickname = storage.get('personalInfo').nickname
      if (info.toId) {
        tiding?.comments.push({
          id: data.id,
          userId: store.user_id,
          toId: info.toId,
          fromName: nickname,
          toName: toName as string,
          content: info.content,
        })
        // 通知对方更新朋友圈消息数
        websocket.send('updatePyqMessageCount', { userId: info.toId })
      } else {
        tiding?.comments.push({
          id: data.id,
          userId: store.user_id,
          toId: null,
          fromName: nickname,
          toName: null,
          content: info.content,
        })
        if (tiding?.userId !== store.user_id) {
          // 通知对方更新朋友圈消息数
          websocket.send('updatePyqMessageCount', { userId: tiding?.userId })
        }
      }
    } else {
      ElMessage.error(TIP_TYPE.SEND_TIDING_COMMENT_FAIL)
    }
  }
  provide('sendTidingComment', sendTidingComment)

  // 删除动态
  const deleteTiding = async (id: number) => {
    const { data } = await deletePyqTiding({
      pyqTidingId: id,
    })
    if (data) {
      ElMessage.success(TIP_TYPE.DELETE_PYQ_TIDING_SUCCESS)
      const index = tidingsList.value.findIndex((item: PyqTidingsType) => item.id === id)
      tidingsList.value.splice(index, 1)
    } else {
      ElMessage.error(TIP_TYPE.DELETE_PYQ_TIDING_FAIL)
    }
  }
  provide('deleteTiding', deleteTiding)

  onMounted(() => {
    websocket.listen('updatePyqMessageCount', () => {
      store.pyqMessagesCount += 1
    })
  })
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
        color: var(--theme-color);
        cursor: pointer;
        .active {
          color: var(--nav-active-color);
        }
      }
      .pyq-messages {
        margin-top: 20px;
        margin-right: 30px;
        .message-icon {
          border-radius: 50%;
          padding: 8px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            cursor: pointer;
            background-color: var(--mouse-hover-active);
          }
          .icon {
          }
        }
      }
    }
    .pyq-main {
      // width: 50%;
      width: 768px;
      height: calc(100vh - 60px);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      .pyq-tidings-list-scroll {
        width: 100%;
        height: 100%;
        .pyq-tidings-list {
          width: 100%;
        }
        .pyq-tidings-pagination {
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
        margin-top: 10%;
        font-size: var(--pyq-null-font-size);
        color: var(--desc-color);
        font-family: '楷体';
      }
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
  .message-popover-scrollbar {
    height: 400px;
    .message-list {
      .message-item {
        margin-bottom: 10px;
        .time {
          display: flex;
          justify-content: center;
          font-size: var(--small-desc-size);
          color: var(--desc-color);
          margin-bottom: 5px;
        }
        .title {
          display: flex;
          margin-bottom: 5px;
          .main {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .orther {
            width: fit-content;
          }
        }
        .tip {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          padding: 0 5px;
          box-sizing: border-box;
          .avatar {
            width: 30px;
          }
          .name {
            margin: 0 10px;
            font-size: var(--middle-font-size);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .item {
            width: 75px;
            color: var(--notice-source-color);
          }
        }
        .content {
          color: #eb7340;
          padding: 0 5px;
          box-sizing: border-box;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
    .message-null {
      font-size: var(--middle-font-size);
      color: var(--desc-color);
      display: flex;
      justify-content: center;
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
