<template>
  <div class="comment-list-item-container">
    <div class="comment-detail">
      <div class="avatar">
        <el-avatar :size="40" :src="props.comment?.avatarUrl" />
      </div>
      <div class="main">
        <div class="name">{{ props.comment?.name }}</div>
        <div class="fa-content">{{ props.comment?.content }}</div>
        <div class="op">
          <div class="time">{{ props.comment?.createTime }}</div>
          <div class="thumb">
            <svg class="icon" aria-hidden="true" @click="listenThumbsComment">
              <use :xlink:href="props.comment.isThumbsUp ? '#icon-thumbs-active' : '#icon-detail-thumb'"></use>
            </svg>
            <span>{{ props.comment?.thumbsUpCount }}</span>
          </div>
          <div class="reply">
            <el-link type="info" @click="listenReply(props.comment?.userId as number, props.comment?.name as string)"
              >回复</el-link
            >
          </div>
        </div>
        <div class="children">
          <div v-for="item in props.comment?.children" :key="item.id" class="item">
            <div class="content">
              <div class="desc">
                <div class="from-avatar">
                  <el-avatar :size="20" :src="item.fromAvatarUrl" />
                </div>
                <div class="info">
                  <div class="left">
                    <div class="from-name">{{ item.fromName }}</div>
                    <div v-if="item.toId !== props.comment?.userId" class="reply">回复</div>
                    <div v-if="item.toId !== props.comment?.userId" class="to-name">{{ item.toName }}</div>
                    <div>：</div>
                  </div>
                  <span class="message">
                    {{ item.content }}
                  </span>
                </div>
              </div>
            </div>
            <div class="op">
              <div class="time">{{ item.createTime }}</div>
              <div class="reply">
                <el-link type="info" @click="listenReply(item.fromId, item.fromName)">回复</el-link>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isReply" class="input">
          <div class="object">
            <div class="obname">@{{ replyName }}</div>
            <div class="close">
              <svg class="icon" aria-hidden="true" @click="listenCloseReply">
                <use xlink:href="#icon-to-delete"></use>
              </svg>
            </div>
          </div>
          <el-input
            v-model="comment"
            class="comment-input"
            :autosize="{ minRows: 2 }"
            maxlength="200"
            type="textarea"
            placeholder="请输入内容"
          />
          <div class="send">
            <Emoji @emoji="listenInputEmoji">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-emoji"></use>
              </svg>
            </Emoji>
            <el-button class="button" size="small" type="primary" @click="listenSendComment">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue'
  import { LifeTidingDetailCommentType } from '@/types/life'
  import useStore from '@/store'

  const store = useStore()
  const props = defineProps<{
    comment: LifeTidingDetailCommentType
    lifeTidingId: number
  }>()
  const replyComment: any = inject('replyComment')
  const thumbsUpComments: any = inject('thumbsUpComments')
  const cancelThumbsUpComments: any = inject('cancelThumbsUpComments')

  const comment = ref<string>('') // 评论
  const isReply = ref<boolean>(false) // 是否回复
  const replyName = ref<string>('') // 被回复方名称
  const replyId = ref<number>(-1) // 被回复方id

  // 输入emoji
  const listenInputEmoji = (emoji: string) => {
    comment.value += emoji
  }

  // 显示回复输入框
  const listenReply = (id: number, name: string) => {
    if (id !== store.user_id) {
      replyId.value = id
      replyName.value = name
      isReply.value = true
    }
  }

  // 关闭回复框
  const listenCloseReply = () => {
    replyId.value = -1
    replyName.value = ''
    comment.value = ''
    isReply.value = false
  }

  // 回复
  const listenSendComment = async () => {
    if (replyComment) {
      await replyComment({
        lifeTidingId: props.lifeTidingId,
        lifeCommentId: props.comment?.id as number,
        fromId: store.user_id,
        toId: replyId.value,
        content: comment.value,
      })
      listenCloseReply()
    }
  }

  // 点赞评论
  const listenThumbsComment = async () => {
    console.log(props.comment)
    if (props.comment.isThumbsUp === 0) {
      await thumbsUpComments(
        {
          lifeTidingId: props.lifeTidingId,
          lifeCommentId: props.comment.id,
          userId: store.user_id,
        },
        false
      )
    } else {
      await cancelThumbsUpComments(
        {
          lifeTidingId: props.lifeTidingId,
          lifeCommentId: props.comment.id,
          userId: store.user_id,
        },
        false
      )
    }
  }
</script>

<style scoped lang="less">
  .comment-list-item-container {
    .comment-detail {
      display: flex;
      .avatar {
        margin-right: 10px;
      }
      .main {
        flex: 1;
        .name {
          font-weight: bold;
          height: 30px;
          line-height: 30px;
          margin-bottom: 5px;
        }
        .fa-content {
          font-size: 15px;
          line-height: 25px;
          word-wrap: break-word;
          word-break: break-all;
          margin-bottom: 5px;
        }
        .op {
          display: flex;
          align-items: center;
          color: var(--desc-color);
          margin-bottom: 20px;
          .time {
            margin-right: 30px;
          }
          .thumb {
            margin-right: 30px;
            display: flex;
            align-items: center;
            .icon {
              margin-right: 5px;
            }
          }
          .reply {
          }
        }
        .children {
          .item {
            .content {
              line-height: 20px;
              margin-bottom: 5px;
              .desc {
                display: flex;
                .from-avatar {
                  padding-top: 3px;
                  box-sizing: border-box;
                  margin-right: 10px;
                }
                .info {
                  .left {
                    display: inline-flex;
                    align-items: center;
                    .from-name {
                      font-weight: bold;
                    }
                    .reply {
                      // font-size: 15px;
                      padding: 0 10px;
                      box-sizing: border-box;
                    }
                    .to-name {
                      font-weight: bold;
                    }
                  }
                  .message {
                    font-size: 15px;
                    line-height: 25px;
                    word-wrap: break-word;
                    word-break: break-all;
                  }
                }
              }
            }
            .op {
              display: flex;
              align-items: center;
              font-size: var(--small-desc-size);
              color: var(--desc-color);
              margin-bottom: 20px;
              .time {
                margin-right: 30px;
              }
              .reply {
                display: flex;
                align-items: center;
              }
            }
          }
        }
        .input {
          border: 1px solid var(--border-color);
          padding: 5px 0 10px;
          box-sizing: border-box;
          margin-bottom: 20px;
          .object {
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .obname {
            }
            .close {
              .icon {
                font-size: 12px;
              }
            }
          }
          .comment-input {
          }
          .send {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            box-sizing: border-box;
            .icon {
            }
            .button {
            }
          }
        }
      }
    }
  }
</style>
