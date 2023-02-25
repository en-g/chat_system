<template>
  <div class="index-container">
    <div class="index-message-list">
      <MessageList :message-list="props.messageList" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MessageListItemInfoType } from '@/types/message'
  import MessageList from './messageList.vue'

  const props = defineProps<{
    messageList: MessageListItemInfoType[]
  }>()
</script>

<style scoped lang="less">
  .index-container {
    width: 100%;
    .index-message-list {
      width: 100%;
    }
  }
</style>
