<template>
  <div class="message-list-container">
    <div v-if="props.messageList.length > 0" class="message-list-wrap">
      <div
        v-for="item in props.messageList"
        :key="item.id"
        class="message-list-item"
        @click="listenChatToContact(item.type, item.type === 'friend' ? item.contactId : item.groupId)"
      >
        <MessageListItem :message-list-item="item" :chat-id="props.chatId" :chat-type="props.chatType" />
      </div>
    </div>
    <div v-else class="message-list-null">暂无聊天记录</div>
  </div>
</template>

<script setup lang="ts">
  import MessageListItem from './messageListItem.vue'
  import { MessageListItemInfoType } from '@/types/message'

  const props = defineProps<{
    messageList: MessageListItemInfoType[]
    chatId: number
    chatType: string
  }>()
  const emit = defineEmits(['chat'])

  // 监听点好好友聊天
  const listenChatToContact = (type: string, id?: number) => {
    emit('chat', type, id)
  }
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
    .message-list-null {
      display: flex;
      justify-content: center;
      padding: 30px 0;
      box-sizing: border-box;
      font-size: var(--title-font-size);
      color: var(--desc-color);
      font-family: '楷体';
    }
  }
</style>
