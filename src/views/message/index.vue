<template>
  <div class="message-container">
    <div class="message-list">
      <el-scrollbar class="messgae-list-scrollbar">
        <MessageList :message-list="messageList" />
      </el-scrollbar>
    </div>
    <div class="message-main"></div>
  </div>
</template>

<script setup lang="ts">
  import { MessageListItemInfoType } from '@/types/message'
  import MessageList from './children/messageList/index.vue'

  const messageList: MessageListItemInfoType[] = [
    {
      id: 1,
      userId: 1,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 1,
    },
    {
      id: 2,
      userId: 2,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '王尼玛',
      lastMessage: '大湾区二群翁',
      unRead: 100,
    },
    {
      id: 3,
      userId: 3,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 4,
      userId: 4,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 5,
      userId: 5,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 6,
      userId: 6,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 7,
      userId: 7,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 8,
      userId: 8,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 9,
      userId: 9,
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      nickname: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
  ]
</script>

<style scoped lang="less">
  .message-container {
    width: 100%;
    height: 100%;
    display: flex;
    .message-list {
      flex: 1;
      height: 100%;
      border-right: 1px solid var(--border-color);
      .messgae-list-scrollbar {
        height: 100%;
      }
    }
    .message-main {
      flex: 5;
      height: 100%;
    }
  }
</style>
