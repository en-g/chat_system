<template>
  <div class="message-list-item-container">
    <el-badge :value="props.messageListItem.unRead" :max="99">
      <div class="message-list-item-wrap">
        <div class="message-list-item-avatar">
          <el-avatar :size="50" :src="props.messageListItem.avatarUrl" />
        </div>
        <div class="message-list-item-content">
          <div class="message-list-item-nicknme">
            {{ props.messageListItem.remarks || props.messageListItem.nickname }}
          </div>
          <div class="message-list-item-last-message">{{ props.messageListItem.lastMessage }}</div>
        </div>
      </div>
    </el-badge>
  </div>
</template>

<script setup lang="ts">
  import { MessageListItemInfoType } from '@/types/message'

  const props = defineProps<{
    messageListItem: MessageListItemInfoType
  }>()
</script>

<style scoped lang="less">
  .message-list-item-container {
    width: 100%;
    padding: 12px 10px;
    box-sizing: border-box;
    &:hover {
      cursor: pointer;
      background-color: var(--mouse-hover-active);
    }
    .message-list-item-wrap {
      width: 100%;
      display: flex;
      .message-list-item-avatar {
        margin-right: 10px;
      }
      .message-list-item-content {
        flex: 1;
        .message-list-item-nicknme {
          height: 25px;
          line-height: 25px;
          font-size: 16px;
          font-weight: var(--title-font-weight);
        }
        .message-list-item-last-message {
          height: 25px;
          line-height: 25px;
          color: var(--desc-color);
          font-size: var(--small-desc-size);
        }
      }
    }
  }
  :deep(.el-badge) {
    display: block;
  }
  :deep(.el-badge__content.is-fixed) {
    top: -7px;
    right: 0;
    transform: translateX(-1%);
  }
</style>
