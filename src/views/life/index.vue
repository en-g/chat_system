<template>
  <div class="life-container">
    <div class="life-personal-center">
      <PersonalCenter
        :personal-center-info="personalCenterInfo"
        @regard="listenRegard"
        @release="listenRelease"
        @detail="showLifeTidingDetail"
      />
    </div>
    <div class="life-hot-search">
      <HotSearch :hot-tidings-list="hotTidingsList" @detail="showLifeTidingDetail" />
    </div>
    <div v-show="!showDetailVisible" class="life-content">
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
    <div v-show="showDetailVisible" class="life-detail">
      <div class="close">
        <svg class="icon" aria-hidden="true" @click="listenCloseLifeTidingDetail">
          <use xlink:href="#icon-detail-close"></use>
        </svg>
      </div>
      <el-card class="life-detail-card">
        <el-scrollbar class="detail-scrollbar">
          <div class="detail-wrapper">
            <div class="title">{{ lifeTidingDetailInfo?.title }}</div>
            <div class="info">
              <div class="avatar">
                <el-avatar :size="40" :src="lifeTidingDetailInfo?.avatarUrl" />
              </div>
              <div class="name">{{ lifeTidingDetailInfo?.name }}</div>
              <div class="data">
                <div class="item">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-detail-thumb"></use>
                  </svg>
                  <span>{{ lifeTidingDetailInfo?.thumbsUpCount }}</span>
                </div>
                <div class="item">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-detail-comment"></use>
                  </svg>
                  <span>{{ lifeTidingDetailInfo?.thumbsUpCount }}</span>
                </div>
                <div class="item">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-collection"></use>
                  </svg>
                  <span>{{ lifeTidingDetailInfo?.commentsCount }}</span>
                </div>
                <div class="item">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-detail-see"></use>
                  </svg>
                  <span>{{ lifeTidingDetailInfo?.readings }}</span>
                </div>
                <div class="item">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-detail-time"></use>
                  </svg>
                  <span>{{ lifeTidingDetailInfo?.createTime.replace('T', ' ').split('.')[0] }}</span>
                </div>
              </div>
            </div>
            <div class="content">{{ lifeTidingDetailInfo?.content }}</div>
            <div class="picture">
              <div v-for="item in lifeTidingDetailInfo?.pictures" :key="item.id" class="item">
                <el-image class="image" :src="item.url" fit="contain" />
                <!-- <img class="image" :src="item.url" alt="image" /> -->
              </div>
            </div>
            <div class="comment">
              <div class="label">评论</div>
              <div class="input">
                <el-input
                  v-model="comment"
                  class="comment-input"
                  :autosize="{ minRows: 2 }"
                  maxlength="200"
                  type="textarea"
                  placeholder="发表评论"
                />
                <div class="send">
                  <Emoji @emoji="listenInputEmoji">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-emoji"></use>
                    </svg>
                  </Emoji>
                  <el-button
                    class="button"
                    size="small"
                    type="primary"
                    @click="
                      listenSendComment(lifeTidingDetailInfo?.id as number, lifeTidingDetailInfo?.userId as number)
                    "
                    >发送</el-button
                  >
                </div>
              </div>
              <div v-if="lifeTidingDetailInfo?.commentsList?.length">
                <CommentList
                  :comment-list="lifeTidingDetailInfo?.commentsList"
                  :life-tiding-id="lifeTidingDetailInfo.id"
                />
              </div>
            </div>
          </div>
        </el-scrollbar>
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
            <Emoji @emoji="listenSendTidingsInputEmoji">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-emoji"></use>
              </svg>
            </Emoji>
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
  </div>
</template>

<script setup lang="ts">
  import { reactive, computed, watch, ref, provide } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Tidings from './children/tidings/index.vue'
  import CommentList from './children/commentList/index.vue'
  import Emoji from '@/components/emoji/index.vue'
  import useStore from '@/store'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'
  import {
    HotTidingsListItemType,
    LifeTidingDetailInfoType,
    LifeTidingsInfoType,
    LifeTidingsType,
    PersonalCenterInfoType,
    ReplyLifeTidingsInfoType,
    ThumbsUpCommentIdsType,
  } from '@/types/life'
  import PersonalCenter from './children/personalCenter/index.vue'
  import HotSearch from './children/hotSearch/index.vue'
  import {
    cancelCollectLifeTidings,
    cancelRegardUser,
    cancelThumbsUpComment,
    cancelThumbsUpLifeTidings,
    collectLifeTidings,
    commentLifeTiding,
    deleteLifeTidings,
    getBaseHotTidingList,
    getHotLifeTidingsList,
    getLifeTidingDetail,
    getNewLifeTidingsList,
    getUserCenterInfo,
    getUserTidingsList,
    regardUser,
    releaseLifeTiding,
    replyLifeTiding,
    thumbsUpComment,
    thumbsUpLifeTidings,
  } from '@/api/life'
  import websocket from '@/websocket'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()

  const isRelease = ref<boolean>(false) // 标记是否显示发布动态
  const isNew = ref<boolean>(true) // 标记是否为最新动态
  const showDetailVisible = ref<boolean>(false) // 查看动态详情
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
  const hotTidingsList = reactive<HotTidingsListItemType[]>([])
  // 动态详情
  const lifeTidingDetailInfo = ref<LifeTidingDetailInfoType>({
    id: -1,
    userId: -1,
    name: '',
    avatarUrl: '',
    title: '',
    content: '',
    createTime: '',
    isThumbsUp: -1,
    isCollect: -1,
    thumbsUpCount: -1,
    commentsCount: -1,
    collectionsCount: -1,
    readings: -1,
    pictures: [],
    commentsList: [],
  })
  const comment = ref<string>('') // 评论

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

  // 获取基本热门动态列表
  const getBaseHotTidingListData = async () => {
    const { data } = await getBaseHotTidingList()
    hotTidingsList.splice(0, hotTidingsList.length, ...data)
  }
  await getBaseHotTidingListData()

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

  // 点赞动态
  const thumbsUpTiding = async (lifeTidingId: number, userId: number) => {
    const tiding = tidingsList.find((item) => item.id === lifeTidingId)
    if (tiding) {
      if (tiding.isThumbsUp === 0) {
        const { data } = await thumbsUpLifeTidings({
          lifeTidingId,
          userId,
        })
        if (data) {
          tiding.isThumbsUp = 1
          tiding.thumbsUpCount += 1
        }
      } else {
        const { data } = await cancelThumbsUpLifeTidings({
          lifeTidingId,
          userId,
        })
        if (data) {
          tiding.isThumbsUp = 0
          tiding.thumbsUpCount -= 1
        }
      }
    }
  }
  provide('thumbsUpTiding', thumbsUpTiding)

  // 收藏动态
  const collectTiding = async (lifeTidingId: number, userId: number) => {
    const tiding = tidingsList.find((item) => item.id === lifeTidingId)
    if (tiding) {
      if (tiding.isCollect === 0) {
        const { data } = await collectLifeTidings({
          lifeTidingId,
          userId,
        })
        if (data) {
          ElMessage.success(TIP_TYPE.COLLECT_LIFE_TIDING_SUCCESS)
          tiding.isCollect = 1
          tiding.collectionsCount += 1
        } else {
          ElMessage.error(TIP_TYPE.COLLECT_LIFE_TIDING_FAIL)
        }
      } else {
        const { data } = await cancelCollectLifeTidings({
          lifeTidingId,
          userId,
        })
        if (data) {
          ElMessage.success(TIP_TYPE.CANCEL_COLLECT_LIFE_TIDING_SUCCESS)
          tiding.isCollect = 0
          tiding.collectionsCount -= 1
        }
      }
    }
  }
  provide('collectTiding', collectTiding)

  // 点击关注
  const listenRegard = async (isRegard: boolean) => {
    if (isRegard) {
      const { data } = await cancelRegardUser({
        userId: store.user_id,
        regardId: personalCenterInfo.userId,
      })
      if (data) {
        personalCenterInfo.fans -= 1
      }
    } else {
      const { data } = await regardUser({
        userId: store.user_id,
        regardId: personalCenterInfo.userId,
      })
      if (data) {
        // 通知对方更新生活圈消息数
        websocket.send('updateLifeMessageCount', { userId: personalCenterInfo.userId })
        personalCenterInfo.fans += 1
      }
    }
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

  // 删除动态
  const deleteLifeTiding = async (id: number) => {
    const { data } = await deleteLifeTidings({
      lifeTidingId: id,
    })
    if (data) {
      ElMessage.success(TIP_TYPE.DELETE_LIFE_TIDING_SUCCESS)
      await getUserTidingsListData()
      await getBaseHotTidingListData()
    }
  }
  provide('deleteLifeTiding', deleteLifeTiding)

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

  // 查看动态详情
  const showLifeTidingDetail = async (id: number) => {
    if (showDetailVisible.value && lifeTidingDetailInfo.value.id === id) return
    const { data } = await getLifeTidingDetail({
      userId: store.user_id,
      lifeTidingId: id,
    })
    lifeTidingDetailInfo.value = data
    showDetailVisible.value = true
    const tiding = tidingsList.find((item) => item.id === id)
    if (tiding) {
      tiding.readings += 1
    }
    const hotTiding = hotTidingsList.find((item) => item.id === id)
    if (hotTiding) {
      hotTiding.readings += 1
    }
  }
  provide('showLifeTidingDetail', showLifeTidingDetail)

  // 关闭动态详情
  const listenCloseLifeTidingDetail = () => {
    showDetailVisible.value = false
  }

  // 发送评论
  const listenSendComment = async (lifeTidingId: number, toId: number) => {
    if (!comment.value) {
      ElMessage.error(TIP_TYPE.COMMENT_IS_NOT_NULL)
    }
    const { data } = await commentLifeTiding({
      lifeTidingId,
      fromId: store.user_id,
      toId,
      content: comment.value,
    })
    if (data.status) {
      if (data.comment) {
        lifeTidingDetailInfo.value.commentsCount += 1
        lifeTidingDetailInfo.value?.commentsList.unshift(data.comment)
        const tiding = tidingsList.find((item) => item.id === lifeTidingId)
        if (tiding) {
          tiding.commentsCount += 1
        }
      }
      // 通知对方更新生活圈消息数
      websocket.send('updateLifeMessageCount', { userId: toId })
      comment.value = ''
    } else {
      ElMessage.error(TIP_TYPE.COMMENT_FAIL)
    }
  }

  // 回复评论
  const replyComment = async (info: ReplyLifeTidingsInfoType) => {
    if (!info.content) {
      ElMessage.error(TIP_TYPE.REPLY_IS_NOT_NLL)
    }
    const { data } = await replyLifeTiding(info)
    if (data.status) {
      if (data.comment) {
        lifeTidingDetailInfo.value.commentsCount += 1
        const comment = lifeTidingDetailInfo.value?.commentsList.find((item) => item.id === info.lifeCommentId)
        comment && comment?.children.push(data.comment)
        const tiding = tidingsList.find((item) => item.id === info.lifeTidingId)
        tiding && (tiding.commentsCount += 1)
      }
      // 通知对方更新生活圈消息数
      websocket.send('updateLifeMessageCount', { userId: info.toId })
    } else {
      ElMessage.error(TIP_TYPE.REPLY_FAIL)
    }
  }
  provide('replyComment', replyComment)

  // 点赞评论
  const thumbsUpComments = async (ids: ThumbsUpCommentIdsType, isHot: boolean) => {
    const { data } = await thumbsUpComment(ids)
    if (data) {
      if (isHot) {
        const tiding = tidingsList.find((item) => item.id === ids.lifeTidingId)
        if (tiding) {
          tiding.hotReview.isThumbsUp = 1
          tiding.hotReview.thumbsUpCount += 1
        }
      } else {
        const comment = lifeTidingDetailInfo.value.commentsList.find((item) => item.id === ids.lifeCommentId)
        if (comment) {
          comment.isThumbsUp = 1
          comment.thumbsUpCount += 1
        }
      }
    }
  }
  provide('thumbsUpComments', thumbsUpComments)

  // 取消点赞评论
  const cancelThumbsUpComments = async (ids: ThumbsUpCommentIdsType, isHot: boolean) => {
    const { data } = await cancelThumbsUpComment(ids)
    if (data) {
      if (isHot) {
        const tiding = tidingsList.find((item) => item.id === ids.lifeTidingId)
        if (tiding) {
          tiding.hotReview.isThumbsUp = 0
          tiding.hotReview.thumbsUpCount -= 1
        }
      } else {
        const comment = lifeTidingDetailInfo.value.commentsList.find((item) => item.id === ids.lifeCommentId)
        if (comment) {
          comment.isThumbsUp = 0
          comment.thumbsUpCount -= 1
        }
      }
    }
  }
  provide('cancelThumbsUpComments', cancelThumbsUpComments)

  // 输入emoji
  const listenInputEmoji = (emoji: string) => {
    comment.value += emoji
  }

  // 发布动态输入emoji
  const listenSendTidingsInputEmoji = (emoji: string) => {
    tidingInfo.content += emoji
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
      showDetailVisible.value = false
      isNew.value = true
      await getLifeTidingsListData()
      isRelease.value = false
      router.push({ name: 'life' })
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
        showDetailVisible.value = false
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
    .life-detail {
      width: 798px;
      height: calc(100vh - 62px);
      position: relative;
      .close {
        position: absolute;
        top: 5px;
        right: 5px;
        .icon {
          font-size: 16px;
        }
      }
      .life-detail-card {
        width: 100%;
        height: calc(100vh - 62px);
        .detail-scrollbar {
          height: calc(100vh - 102px);
          .detail-wrapper {
            padding: 10px;
            box-sizing: border-box;
            .title {
              font-size: 25px;
              line-height: 35px;
              margin-bottom: 20px;
            }
            .info {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              .avatar {
                margin-right: 10px;
              }
              .name {
                font-size: var(--middle-font-size);
              }
              .data {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .item {
                  display: flex;
                  align-items: center;
                  margin-left: 20px;
                  font-size: var(--small-desc-size);
                  color: var(--desc-color);
                  .icon {
                    color: var(--desc-color);
                    margin-right: 5px;
                  }
                }
              }
            }
            .content {
              font-size: var(--middle-font-size);
              line-height: 24px;
              margin-bottom: 20px;
              white-space: pre-line;
              text-indent: 4;
            }
            .picture {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              grid-template-rows: 1fr;
              column-gap: 10px;
              margin-bottom: 20px;
              .item {
                width: 100%;
                height: 100%;
                .image {
                  width: 100%;
                  height: 240px;
                }
              }
            }
            .comment {
              .label {
                font-size: var(--title-font-size);
                font-weight: bold;
                border-top: 1px solid var(--border-color);
                padding: 20px 0;
                box-sizing: border-box;
              }
              .input {
                padding: 5px 0 10px;
                box-sizing: border-box;
                border: 1px solid var(--border-color);
                margin-bottom: 20px;
                .comment-input {
                }
                .send {
                  display: flex;
                  justify-content: space-between;
                  .icon {
                    margin-left: 10px;
                  }
                  .button {
                    margin-right: 10px;
                  }
                }
              }
            }
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
