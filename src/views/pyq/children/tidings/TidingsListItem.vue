<template>
  <div ref="tidingsItemRef" class="tidings-list-item-container">
    <div class="tidings-list-item-wrap">
      <div class="tidings-list-item-avatar">
        <el-avatar :size="50" shape="square" :src="props.tidingsInfo.avatarUrl" />
      </div>
      <div class="tidings-list-item-main">
        <div class="tidings-list-item-nickname">{{ props.tidingsInfo.nickname }}</div>
        <div class="tidings-list-item-content">{{ props.tidingsInfo.content }}</div>
        <div class="tidings-list-item-pictures" :class="props.tidingsInfo.pictures.length > 3 ? 'tworow' : 'onerow'">
          <div v-for="item in props.tidingsInfo.pictures" :key="item.id" class="tidings-list-item-pictures-item">
            <el-image class="image" :src="item.url" :preview-src-list="previewList" fit="cover">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </div>
        </div>
        <div class="tidings-list-item-time-thumbs">
          <div class="time">{{ props.tidingsInfo.createTime.replace('T', ' ').split('.')[0] }}</div>
          <div class="thumbs-comments">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-thumbs"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-comments"></use>
            </svg>
          </div>
        </div>
        <div class="tidings-list-item-comments">
          <div v-show="thumbsUpinfo" class="thumbs">
            <span class="list">{{ thumbsUpinfo }}</span
            >&ensp;点赞了该动态
          </div>
          <div class="comments">
            <div v-for="item in props.tidingsInfo.comments" :key="item.id" class="comments-item">
              <span v-if="item.toId">
                <span class="name" @click="listenReplyContacts(item.userId, item.fromName)">{{ item.fromName }}</span>
                回复
                <span class="name" @click="listenReplyContacts(item.toId, item.toName)">{{ item.toName }}</span>
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
          <div class="input">
            <div v-show="toName" class="to">
              <div class="name">{{ toName }}</div>
              <div class="delete" @click="listenCancleReplyUser">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-to-delete"></use>
                </svg>
              </div>
            </div>
            <el-input v-model="comment" class="comment" autosize type="textarea" placeholder="发表评论" />
            <div class="send">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-emoji"></use>
              </svg>
              <el-button type="primary">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { PyqTidingsThumbsType, PyqTidingsType } from '@/types/pyq'
  import useStore from '@/store/index'

  const store = useStore()
  const props = defineProps<{
    tidingsInfo: PyqTidingsType
  }>()

  const comment = ref<string>('') // 评论
  const toName = ref<string>('') // 被回复方昵称
  const tidingsItemRef = ref<HTMLElement | null>(null)
  const previewList = reactive<string[]>([]) // 图片预览列表

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
    return thumbsUpList.join(' , ')
  })

  // 回复好友
  const listenReplyContacts = (id: number, name: string) => {
    if (id !== store.user_id) {
      toName.value = `@${name}`
    }
  }

  // 取消回复
  const listenCancleReplyUser = () => {
    toName.value = ''
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
          margin-bottom: 10px;
        }
        .tidings-list-item-pictures {
          // display: grid;
          // grid-template-columns: 1fr 1fr 1fr;
          // grid-gap: 5px 5px;
          display: flex;
          // justify-content: space-evenly;
          .tidings-list-item-pictures-item {
            // width: 100%;
            // height: 100;
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
          .time {
            color: var(--desc-color);
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
            margin-bottom: 10px;
            .list {
              color: var(--pyq-comments-user-color);
            }
          }
          .comments {
            margin-bottom: 10px;
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
          }
          .input {
            background-color: #fff;
            padding: 5px;
            box-sizing: border-box;
            .to {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .comment {
              outline: none !important;
            }
            .send {
              display: flex;
              justify-content: space-between;
              align-items: center;
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
