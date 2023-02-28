<template>
  <div class="chat-box-container">
    <div class="chat-box-title">
      <div class="chat-box-object">{{ props.chatName }}</div>
      <div class="chat-box-setting">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chat-setting"></use>
        </svg>
      </div>
    </div>
    <div class="chat-box-main">
      <el-scrollbar class="chat-box-scrollbar">
        <ChatMessageList :type="props.type" :friend-chat-message-list="props.friendChatMessageList" />
      </el-scrollbar>
    </div>
    <div class="chat-box-input"></div>
  </div>
</template>

<script setup lang="ts">
  import ChatMessageList from './chatMessageList.vue'
  import { FriendChatMessageInfoType } from '@/types/message'

  const props = defineProps<{
    type: string
    chatName: string
    friendChatMessageList: FriendChatMessageInfoType[]
  }>()
</script>

<style scoped lang="less">
  .chat-box-container {
    width: 100%;
    height: 100%;
    .chat-box-title {
      width: 100%;
      height: 8%;
      padding: 10px 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      .chat-box-object {
        flex: 1;
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
      }
      .chat-box-setting {
        flex: 1;
        text-align: right;
      }
    }
    .chat-box-main {
      width: 100%;
      height: 67%;
      box-sizing: border-box;
      .chat-box-scrollbar {
        width: 100%;
        height: 100%;
      }
    }
    .chat-box-input {
      width: 100%;
      height: 25%;
      box-sizing: border-box;
      border-top: 1px solid var(--border-color);
    }
  }
</style>
