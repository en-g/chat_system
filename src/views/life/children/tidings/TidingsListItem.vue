<template>
  <div class="tidings-list-item-container">
    <div class="tidings-list-item-wrap">
      <div class="tidings-list-item-avatar">
        <el-avatar
          class="avatar"
          :size="50"
          shape="square"
          :src="props.tidingsInfo.avatarUrl"
          @click="listenNavigateToContactLife"
        />
      </div>
      <div class="tidings-list-item-main">
        <div class="tidings-list-item-nickname">{{ props.tidingsInfo.nickname }}</div>
        <div class="tidings-list-item-title">{{ props.tidingsInfo.title }}</div>
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
        <div class="tidings-list-item-time">
          <div class="release-time">
            <div class="time">{{ props.tidingsInfo.createTime.replace('T', ' ').split('.')[0] }}</div>
          </div>
          <div class="thumbs">
            <div class="comments">
              <svg class="icon" aria-hidden="true" @click="navigateToLifeDetail">
                <use xlink:href="#icon-comments"></use>
              </svg>
              <span>{{ props.tidingsInfo.commentsCount }}</span>
            </div>
            <div class="thumbs">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="props.tidingsInfo.isThumbsUp === 1 ? '#icon-thumbs-active' : '#icon-thumbs'"></use>
              </svg>
              <span>{{ props.tidingsInfo.thumbsUpCount }}</span>
            </div>
          </div>
        </div>
        <div class="tidings-list-item-hot-review">
          <div class="hot-thumbs-count">
            <div class="hot">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-hot"></use>
              </svg>
              <span class="title">热评</span>
            </div>
            <div class="thumbs-count">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-thumbs"></use>
              </svg>
              <span class="count">{{ props.tidingsInfo.commentsCount }}</span>
            </div>
          </div>
          <div class="content">{{ props.tidingsInfo.hotReview.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { LifeTidingsType } from '@/types/life'
  import useStore from '@/store/index'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const props = defineProps<{
    tidingsInfo: LifeTidingsType
  }>()

  const previewList = reactive<string[]>([]) // 图片预览列表

  // 初始化图片预览列表
  const initPreviewList = () => {
    props.tidingsInfo.pictures.forEach((item) => {
      previewList.push(item.url)
    })
  }
  initPreviewList()

  // 跳转到用户的生活圈
  const listenNavigateToContactLife = () => {
    router.push({ name: 'life', query: { id: props.tidingsInfo.userId } })
  }

  // 跳转到生活圈动态的详情界面
  const navigateToLifeDetail = () => {
    router.push({ path: `/lifeDetail/${props.tidingsInfo.id}` })
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
          height: 50px;
          display: flex;
          align-items: center;
          font-size: var(--pyq-name-font-size);
          color: var(--pyq-name-color);
          font-weight: bold;
        }
        .tidings-list-item-title {
          line-height: 25px;
          font-size: var(--pyq-name-font-size);
          color: var(--life-name-color);
          font-weight: bold;
        }
        .tidings-list-item-content {
          line-height: 25px;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
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
        .tidings-list-item-time {
          display: flex;
          align-items: center;
          padding: 10px 0;
          box-sizing: border-box;
          justify-content: space-between;
          .release-time {
            display: flex;
            align-items: center;
            .time {
              color: var(--desc-color);
            }
          }
          .thumbs {
            display: flex;
            align-items: center;
            .thumbs,
            .comments {
              display: flex;
              align-items: center;
              margin-left: 30px;
              .icon {
                margin-right: 5px;
              }
            }
          }
        }
        .tidings-list-item-hot-review {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          background-color: var(--pyq-comments-background-color);
          .hot-thumbs-count {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .hot {
              flex: 1;
              display: flex;
              align-items: center;
              .icon {
              }
              .title {
                color: #ea3a1a;
              }
            }
            .thumbs-count {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .icon {
              }
              .count {
              }
            }
          }

          .content {
            padding: 10px 5px;
            box-sizing: border-box;
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
