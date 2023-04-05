<template>
  <div class="index-container">
    <div class="index-message-list">
      <MessageList
        :message-list="props.messageList"
        :chat-id="props.chatId"
        :chat-type="props.chatType"
        @chat="listenChatToContact"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MessageListItemInfoType } from '@/types/message'
  import MessageList from './messageList.vue'

  const props = defineProps<{
    messageList: MessageListItemInfoType[]
    chatId: number
    chatType: string
  }>()
  const emit = defineEmits(['chat'])

  // 监听点好好友聊天
  const listenChatToContact = (id: number, type: string) => {
    emit('chat', id, type)
  }
</script>

<style scoped lang="less">
  .index-container {
    width: 100%;
    .index-message-list {
      width: 100%;
    }
  }
</style>
