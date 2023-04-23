<template>
  <div class="tidings-list-item-container">
    <div class="tidings-list-item-wrap">
      <div class="tidings-list-item-avatar">
        <el-avatar
          class="avatar"
          :size="50"
          shape="square"
          :src="props.tidingsInfo.avatarUrl"
          @click="listenNavigateToContactPyq"
        />
      </div>
      <div class="tidings-list-item-main">
        <div class="tidings-list-item-nickname">{{ props.tidingsInfo.nickname }}</div>
        <div class="tidings-list-item-content">{{ props.tidingsInfo.content }}</div>
        <div
          v-if="!!props.tidingsInfo.pictures.length"
          class="tidings-list-item-pictures"
          :class="props.tidingsInfo.pictures.length > 3 ? 'tworow' : 'onerow'"
        >
          <div v-for="item in props.tidingsInfo.pictures" :key="item.id" class="tidings-list-item-pictures-item">
            <el-image class="image" :src="item.url" :preview-src-list="previewList" fit="cover">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </div>
        </div>
        <div class="tidings-list-item-time-thumbs">
          <div class="release-time">
            <div class="time">{{ props.tidingsInfo.createTime.replace('T', ' ').split('.')[0] }}</div>
            <div v-show="parseInt(route.query.id as string) === store.user_id" class="delete">
              <el-link type="danger" @click="listenDeletePyqTiding">删除</el-link>
            </div>
          </div>
          <div class="thumbs-comments">
            <svg class="icon" aria-hidden="true" @click="listenThumbsUpTiding">
              <use
                :xlink:href="props.tidingsInfo.isThumbsUp === 1 ? '#icon-thumbs-active' : '#icon-detail-thumb'"
              ></use>
            </svg>
            <svg class="icon" aria-hidden="true" @click="listenClickComment">
              <use xlink:href="#icon-detail-comment"></use>
            </svg>
          </div>
        </div>
        <div v-show="thumbsUpinfo || isShowComment || isComment" class="tidings-list-item-comments">
          <div v-show="thumbsUpinfo" class="thumbs" :class="{ margin: isShowComment || isComment }">
            <span class="list">{{ thumbsUpinfo }}</span>
            <span
              >&ensp;{{
                props.tidingsInfo.thumbs.length > 5 ? `等${props.tidingsInfo.thumbs.length}人` : ''
              }}点赞了该动态</span
            >
          </div>
          <div v-show="isShowComment" class="comments" :class="{ margin: isComment }">
            <div v-for="item in props.tidingsInfo.comments" :key="item.id" class="comments-item">
              <span v-if="item.toId">
                <span class="name" @click="listenReplyContacts(item.userId, item.fromName)">{{ item.fromName }}</span>
                回复
                <span class="name" @click="listenReplyContacts(item.toId as number, item.toName as string)">
                  {{ item.toName }}
                </span>
                <span class="quotes"> :&ensp;</span>
                {{ item.content }}
              </span>
              <span v-else>
                <span class="name" @click="listenReplyContacts(item.userId, item.fromName)">{{ item.fromName }}</span>
                <span class="quotes"> :&ensp;</span>
                {{ item.content }}
              </span>
            </div>
          </div>
          <div v-show="isComment" class="input">
            <div v-show="toName" class="to">
              <div class="name">@{{ toName }}</div>
              <div class="delete" @click="listenCancleReplyUser">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-to-delete"></use>
                </svg>
              </div>
            </div>
            <el-input
              v-model="comment"
              class="comment"
              :autosize="{ minRows: 2 }"
              type="textarea"
              placeholder="发表评论"
            />
            <div class="send">
              <Emoji @emoji="listenInputEmoji">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-emoji"></use>
                </svg>
              </Emoji>
              <el-button type="primary" @click="listenSendComment">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { PyqTidingsThumbsType, PyqTidingsType, SendPyqTidingsCommentInfoType } from '@/types/pyq'
  import useStore from '@/store/index'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import Emoji from '@/components/emoji/index.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const props = defineProps<{
    tidingsInfo: PyqTidingsType
  }>()
  const thumbsUpTiding: ((id: number) => void) | undefined = inject('thumbsUpTiding')
  const sendTidingComment: ((info: SendPyqTidingsCommentInfoType, toName?: string) => void) | undefined =
    inject('sendTidingComment')
  const deleteTiding: ((id: number) => void) | undefined = inject('deleteTiding')

  const comment = ref<string>('') // 评论
  const toId = ref<number>(-1) // 被回复方 ID
  const toName = ref<string>('') // 被回复方昵称
  const previewList = reactive<string[]>([]) // 图片预览列表
  const isComment = ref<boolean>(false) // 标记是否评论
  const isShowComment = computed(() => !!props.tidingsInfo.comments.length) // 标记是否显示评论

  // 初始化图片预览列表
  const initPreviewList = () => {
    props.tidingsInfo.pictures.forEach((item) => {
      previewList.push(item.url)
    })
  }
  initPreviewList()

  // 点赞信息
  const thumbsUpinfo = computed(() => {
    const thumbsUpList: string[] = []
    props.tidingsInfo.thumbs.forEach((item: PyqTidingsThumbsType) => {
      thumbsUpList.push(item.nickname)
    })
    return thumbsUpList.slice(0, 5).join(' , ') + (props.tidingsInfo.thumbs.length > 5 ? ' ...' : '')
  })

  // 点赞动态
  const listenThumbsUpTiding = () => {
    if (thumbsUpTiding) {
      thumbsUpTiding(props.tidingsInfo.id)
    }
  }

  // 输入emoji
  const listenInputEmoji = (emoji: string) => {
    comment.value += emoji
  }

  // 回复好友
  const listenReplyContacts = (id: number, name: string) => {
    if (id !== store.user_id) {
      toId.value = id
      toName.value = name
      isComment.value = true
    }
  }

  // 取消回复
  const listenCancleReplyUser = () => {
    toId.value = -1
    toName.value = ''
  }

  // 打开/关闭评论输入框
  const listenClickComment = () => {
    isComment.value = !isComment.value
    listenCancleReplyUser()
  }

  // 发送评论
  const listenSendComment = () => {
    if (!comment.value.trim()) {
      ElMessage.error(TIP_TYPE.COMMENT_IS_NOT_NULL)
      return
    }
    if (sendTidingComment) {
      if (toId.value !== -1) {
        const info: SendPyqTidingsCommentInfoType = {
          pyqTidingId: props.tidingsInfo.id,
          userId: store.user_id,
          toId: toId.value,
          content: comment.value,
        }
        sendTidingComment(info, toName.value)
      } else {
        const info: SendPyqTidingsCommentInfoType = {
          pyqTidingId: props.tidingsInfo.id,
          userId: store.user_id,
          content: comment.value,
        }
        sendTidingComment(info)
      }
    }
    comment.value = ''
    listenCancleReplyUser()
  }

  // 删除动态
  const listenDeletePyqTiding = () => {
    ElMessageBox.confirm('确定要删除该动态吗？', '删除动态', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      if (deleteTiding) {
        deleteTiding(props.tidingsInfo.id)
      }
    })
  }

  // 跳转到联系人的朋友圈
  const listenNavigateToContactPyq = () => {
    router.push({
      name: 'pyq',
      query: { id: props.tidingsInfo.userId },
    })
  }
</script>

<style scoped lang="less">
  .tidings-list-item-container {
    width: 100%;
    .tidings-list-item-wrap {
      width: 100%;
      display: flex;
      padding: 30px;
      box-sizing: border-box;
      font-weight: normal;
      .tidings-list-item-avatar {
        margin-right: 10px;
        .avatar {
          cursor: pointer;
        }
      }
      .tidings-list-item-main {
        flex: 1;
        .tidings-list-item-nickname {
          height: 25px;
          line-height: 25px;
          font-size: var(--pyq-name-font-size);
          color: var(--pyq-name-color);
          font-weight: bold;
        }
        .tidings-list-item-content {
          line-height: 25px;
        }
        .tidings-list-item-pictures {
          display: flex;
          margin-top: 10px;
          .tidings-list-item-pictures-item {
            width: 212px;
            height: 212px;
            &:nth-child(1),
            &:nth-child(2) {
              margin-right: 6px;
            }
            .image {
              width: 100%;
              height: 100%;
              .image-slot {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background: var(--el-fill-color-light);
                color: var(--el-text-color-secondary);
                font-size: 14px;
                .dot {
                  animation: dot 2s infinite steps(3, start);
                  overflow: hidden;
                }
              }
            }
          }
          &.onerow {
            grid-template-rows: 1fr;
          }
          &.tworow {
            grid-template-rows: 1fr 1fr;
          }
        }
        .tidings-list-item-time-thumbs {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          box-sizing: border-box;
          .release-time {
            display: flex;
            align-items: center;
            .time {
              color: var(--desc-color);
            }
            .delete {
              margin-left: 20px;
            }
          }
          .thumbs-comments {
            .icon {
              margin-left: 10px;
            }
          }
        }
        .tidings-list-item-comments {
          padding: 10px;
          box-sizing: border-box;
          background-color: var(--pyq-comments-background-color);
          .thumbs {
            .list {
              color: var(--pyq-comments-user-color);
            }
            &.margin {
              margin-bottom: 10px;
            }
          }
          .comments {
            .comments-item {
              padding: 5px 0;
              box-sizing: border-box;
              .name {
                color: var(--pyq-comments-user-color);
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
              .quotes {
                color: var(--pyq-comments-user-color);
              }
            }
            &.margin {
              margin-bottom: 10px;
            }
          }
          .input {
            background-color: #fff;
            padding: 5px;
            box-sizing: border-box;
            .comment {
              outline: none !important;
            }
            .to,
            .send {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 10px;
              box-sizing: border-box;
            }
          }
        }
      }
    }
  }
  :deep(.el-textarea__inner, .el-textarea:focus, .el-textarea:active) {
    resize: none;
    box-shadow: none;
  }
</style>
