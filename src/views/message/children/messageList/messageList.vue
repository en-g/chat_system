<template>
  <div class="message-list-container">
    <div class="message-list-wrap">
      <div v-for="item in props.messageList" :key="item.id" class="message-list-item">
        <MessageListItem :message-list-item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MessageListItem from './messageListItem.vue'
  import { MessageListItemInfoType } from '@/types/message'

  const props = defineProps<{
    messageList: MessageListItemInfoType[]
  }>()
</script>

<style scoped lang="less">
  .message-list-container {
    width: 100%;
    .message-list-wrap {
      width: 100%;
      .message-list-item {
        width: 100%;
      }
    }
  }
</style>
