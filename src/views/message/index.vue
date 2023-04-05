<template>
  <div class="message-container">
    <div class="message-list">
      <el-scrollbar class="messgae-list-scrollbar">
        <MessageList :message-list="messageList" :chat-id="chatId" :chat-type="chatType" @chat="listenChatToContact" />
      </el-scrollbar>
    </div>
    <div class="message-main">
      <div v-if="chatId !== -1" class="message-main-chat-box">
        <ChatBox
          :chat-message-list="chatMessageList"
          :chat-name="chatName"
          :is-send="isSend"
          @send="listenSendChatMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { ChatMessageItemType, ChatMessageNoticeType, MessageListItemInfoType } from '@/types/message'
  import MessageList from './children/messageList/index.vue'
  import ChatBox from './children/chatBox/index.vue'
  import useStore from '@/store'
  import { localStorage, sessionStorage } from '@/utils/storage'
  import websocket from '@/websocket'
  import { actualUpdateChatMessageList } from '@/websocket/chatMessage'
  import { getFriendInfo, getGroupInfo } from '@/api/contacts'

  const route = useRoute()
  const store = useStore()
  const lStorage = localStorage(`${store.user_id}`)
  const storage = sessionStorage(`${store.user_id}`)

  const chatId = ref<number>(-1) // 聊天对象 ID
  const chatName = ref<string>('') // 聊天对象名称
  const chatType = ref<string>('') // 聊天对象类型
  const isSend = ref<boolean>(false) // 标记是否为发送消息
  const messageList = reactive<MessageListItemInfoType[]>([])
  const chatMessageList = reactive<ChatMessageItemType[]>([])

  // 获取聊天列表
  const getMessageList = () => {
    const list = lStorage.get('chatMessageList') || []
    messageList.splice(0, messageList.length, ...list)
  }
  getMessageList()

  // 获取聊天记录列表数据
  const getChatMessageInfo = (id: number, type: string) => {
    chatId.value = id
    chatType.value = type
    const chatObj = messageList.find(
      (item: MessageListItemInfoType) => item.contactId === id || item.groupId === id
    ) as MessageListItemInfoType
    chatName.value = type === 'friend' ? chatObj?.remarks || chatObj?.name : chatObj?.name

    // Todo 获取聊天记录
  }

  // 初始化聊天信息
  const initChatInfo = () => {
    const { type, id } = route.query
    if (type && id) {
      getChatMessageInfo(parseInt(id as string), type as string)
    }
  }
  initChatInfo()

  // 监听点击好友聊天
  const listenChatToContact = async (type: string, id: number) => {
    isSend.value = false
    if (type === 'friend') {
      const contactsInfo = storage.get('contactsInfo') || []
      const contactInfo = contactsInfo.find((item: any) => item.id === id)
      if (!contactInfo) {
        // 获取对方的信息
        const { data } = await getFriendInfo({
          userId: store.user_id,
          friendId: id,
        })
        data.createTime = data.createTime.split('T')[0]
        contactsInfo.push(data)
        storage.set('contactsInfo', contactsInfo)
      }
    } else {
      const groupsInfo = storage.get('groupsInfo') || []
      const groupInfo = groupsInfo.find((item: any) => item.id === id)
      if (!groupInfo) {
        // 获取群聊的信息
        const { data } = await getGroupInfo({
          userId: store.user_id,
          groupId: id,
        })
        data.createTime = data.createTime.split('T')[0]
        groupsInfo.push(data)
        storage.set('groupsInfo', groupsInfo)
      }
    }
    getChatMessageInfo(id, type)
  }

  // 发送消息
  const listenSendChatMessage = (chatMessage: string) => {
    isSend.value = true
    if (chatType.value === 'friend') {
      chatMessageList.push({
        id: chatMessageList.length + 1,
        fromId: store.user_id,
        toId: chatId.value,
        type: 1,
        message: chatMessage,
        url: '',
        createTime: new Date().toISOString(),
      })
      websocket.send('chat', {
        fromId: store.user_id,
        toId: chatId.value,
        type: 1,
        message: chatMessage,
        url: '',
        isContact: true,
      })
    } else {
      chatMessageList.push({
        id: chatMessageList.length + 1,
        fromId: store.user_id,
        groupId: chatId.value,
        type: 1,
        message: chatMessage,
        url: '',
        createTime: new Date().toISOString(),
      })
      websocket.send('chat', {
        fromId: store.user_id,
        groupId: chatId.value,
        type: 1,
        message: chatMessage,
        url: '',
        isContact: false,
      })
    }
  }

  onMounted(() => {
    // 更新页面聊天数据，只有处于当前组件中时，才采用实时页面数据更新
    websocket.listen('chat', async (info: ChatMessageNoticeType) => {
      // 更新聊天列表
      await actualUpdateChatMessageList(messageList, info)
    })
  })
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
      .message-main-chat-box {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
