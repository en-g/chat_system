<template>
  <div class="chat-message-list-container">
    <div v-for="item in props.friendChatMessageList" :key="item.id" class="chat-message-list-item">
      <ChatMessageListItem :type="props.type" :message-list-item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChatMessageListItem from './chatMessageListItem.vue'
  import { FriendChatMessageInfoType } from '@/types/message'

  const props = defineProps<{
    type: string
    friendChatMessageList: FriendChatMessageInfoType[]
  }>()
</script>

<style scoped lang="less">
  .chat-message-list-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
