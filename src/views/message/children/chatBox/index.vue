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
      <ChatMessageList :chat-message-list="props.chatMessageList" :is-send="props.isSend" />
    </div>
    <div class="chat-box-input">
      <div class="chat-box-input-function">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-emoji"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-image"></use>
        </svg>
      </div>
      <div class="chat-box-input-content">
        <el-input v-model="chatMessage" class="input" type="textarea" placeholder="请输入内容" />
        <el-tooltip
          v-model:visible="isContentEmpty"
          effect="light"
          content="输入的内容不能为空"
          placement="bottom-start"
        >
          <div v-show="isContentEmpty" class="blank-box"></div>
        </el-tooltip>
      </div>
      <div class="chat-box-input-send">
        <el-button type="primary" @click="listenSendChatMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ChatMessageList from './chatMessageList.vue'
  import { ChatMessageItemType } from '@/types/message'

  const props = defineProps<{
    chatName: string
    chatMessageList: ChatMessageItemType[]
    isSend: boolean
  }>()
  const emit = defineEmits(['send'])

  const chatMessage = ref<string>('')
  const isContentEmpty = ref<boolean>(false)

  // 监听发送消息
  const listenSendChatMessage = () => {
    if (!chatMessage.value) {
      isContentEmpty.value = true
      let timer: any = setTimeout(() => {
        isContentEmpty.value = false
        clearTimeout(timer)
        timer = null
      }, 1500)
      return
    }
    emit('send', chatMessage.value)
    chatMessage.value = ''
  }
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
    }
    .chat-box-input {
      width: 100%;
      height: 25%;
      padding: 10px 0;
      box-sizing: border-box;
      .chat-box-input-function {
        height: 15%;
        padding: 0 20px;
        box-sizing: border-box;
        .icon {
          margin-right: 20px;
        }
      }
      .chat-box-input-content {
        height: 70%;
        box-sizing: border-box;
        padding: 5px 10px 10px 10px;
        box-sizing: border-box;
        position: relative;
        .input {
          width: 100%;
          height: 100%;
        }
        .blank-box {
          position: absolute;
          top: 20px;
          left: 20px;
        }
      }
      .chat-box-input-send {
        height: 15%;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  :deep(.el-textarea__inner) {
    height: 100%;
    padding: 0 11px;
    font-size: 13px;
  }
  :deep(.el-textarea__inner, .el-textarea:focus, .el-textarea:active) {
    resize: none;
    box-shadow: none;
  }
</style>
