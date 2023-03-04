<template>
  <div class="message-list-container">
    <div class="message-list-wrap">
      <div
        v-for="item in props.messageList"
        :key="item.id"
        class="message-list-item"
        @click="listenChatToContact(item.type, item.type === 'contact' ? item.contactId : item.groupId)"
      >
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
  }
</style>
