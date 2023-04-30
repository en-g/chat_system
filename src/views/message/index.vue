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
          :chat-id="chatId"
          :chat-type="chatType"
          @send="listenSendChatMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, provide } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    ChatMessageItemType,
    ChatMessageNoticeType,
    DeleteChatMessageListItemType,
    MessageListItemInfoType,
    OfflineChatMessagesInfoType,
  } from '@/types/message'
  import MessageList from './children/messageList/index.vue'
  import ChatBox from './children/chatBox/index.vue'
  import useStore from '@/store'
  import { localStorage, sessionStorage } from '@/utils/storage'
  import websocket from '@/websocket'
  import {
    actualDeleteChatMessageListItem,
    actualUpdateChatMessageList,
    updateChatMessageList,
  } from '@/websocket/chatMessage'
  import { getFriendInfo, getGroupInfo } from '@/api/contacts'
  import idb from '@/utils/indexedDB'
  import { formateTime } from '@/utils/utils'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const lStorage = localStorage(`${store.user_id}`)
  const storage = sessionStorage(`${store.user_id}`)

  const chatId = ref<number>(-1) // 聊天对象 ID
  const chatName = ref<string>('') // 聊天对象名称
  const chatType = ref<string>('') // 聊天对象类型
  const isSend = ref<boolean>(false) // 标记是否为发送消息
  const messageList = reactive<MessageListItemInfoType[]>([]) // 左侧聊天列表
  const chatMessageList = reactive<ChatMessageItemType[]>([]) // 聊天记录列表

  // 获取聊天列表
  const getMessageList = () => {
    const list = lStorage.get('chatMessageList') || []
    messageList.splice(0, messageList.length, ...list)
  }
  getMessageList()

  // 获取好友聊天记录
  const getContactChatMessageList = async (id: number) => {
    const fromChatList =
      <Array<any>>await idb.getDataByIndex('friendChatMessages', 'chatIds', [store.user_id, id]) || []
    const toChatList = <Array<any>>await idb.getDataByIndex('friendChatMessages', 'chatIds', [id, store.user_id]) || []
    fromChatList.push(...toChatList)
    fromChatList.sort((m1: any, m2: any) => m1.id - m2.id)
    chatMessageList.splice(0, chatMessageList.length, ...fromChatList)
  }

  // 获取群聊聊天记录
  const getGroupChatMessageList = async (id: number) => {
    const chatList = <Array<any>>await idb.getDataByIndex('groupChatMessages', 'groupId', id) || []
    chatList.sort((m1: any, m2: any) => m1.id - m2.id)
    chatMessageList.splice(0, chatMessageList.length, ...chatList)
  }

  // 获取聊天记录列表数据
  const getChatMessageInfo = async (id: number, type: string) => {
    chatId.value = id
    chatType.value = type
    const chatObj = messageList.find(
      (item: MessageListItemInfoType) => item.contactId === id || item.groupId === id
    ) as MessageListItemInfoType
    chatName.value = type === 'friend' ? chatObj?.remarks || chatObj?.name : chatObj?.name

    // 获取聊天记录
    if (type === 'friend') {
      await getContactChatMessageList(id)
    } else {
      await getGroupChatMessageList(id)
    }
  }

  // 初始化聊天信息
  const initChatInfo = () => {
    const { type, id } = route.query
    if (type && id) {
      getChatMessageInfo(parseInt(id as string), type as string)
    }
  }
  initChatInfo()

  // 更新聊天记录
  const updateAllChatMessageList = (info: ChatMessageNoticeType) => {
    if (info.isContact) {
      chatMessageList.push({
        id: info.id,
        fromId: info.fromId,
        toId: info.toId,
        type: info.type,
        message: info.message,
        url: info.url,
        createTime: formateTime(info.createTime) as string,
      })
    } else {
      chatMessageList.push({
        id: info.id,
        fromId: info.fromId,
        groupId: info.groupId,
        type: info.type,
        message: info.message,
        url: info.url,
        createTime: formateTime(info.createTime) as string,
      })
    }
  }
  provide('updateAllChatMessageList', updateAllChatMessageList)

  // 监听点击聊天
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
        data.birthday = formateTime(data.birthday, 1)
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
        data.createTime = formateTime(data.createTime, 1)
        groupsInfo.push(data)
        storage.set('groupsInfo', groupsInfo)
      }
    }
    // 未读消息数置0
    const messageItem = messageList.find(
      (item) => (type === 'friend' && item?.contactId === id) || (type === 'group' && item?.groupId === id)
    )
    if (messageItem) {
      messageItem.unRead = 0
      lStorage.set('chatMessageList', messageList)
    }
    // 获取聊天记录列表
    await getChatMessageInfo(id, type)
    router.push({
      name: 'message',
      query: {
        type,
        id,
      },
    })
  }

  // 发送消息
  const listenSendChatMessage = async (type: number, message: string, url: string) => {
    isSend.value = true
    if (chatType.value === 'friend') {
      const chatMessage = {
        fromId: store.user_id,
        toId: chatId.value,
        type,
        message,
        url,
      }
      // 发送到 websocket 服务器
      websocket.send('chat', { ...chatMessage, isContact: true })
    } else {
      const chatMessage = {
        fromId: store.user_id,
        groupId: chatId.value,
        type,
        message,
        url,
      }
      // 发送到 websocket 服务器
      websocket.send('chat', { ...chatMessage, isContact: false })
    }
  }

  onMounted(() => {
    // 更新页面聊天数据，只有处于当前组件中时，才采用实时页面数据更新
    websocket.listen('chat', async (info: ChatMessageNoticeType) => {
      // 更新聊天列表
      if (
        info.fromId === chatId.value &&
        info.toId === store.user_id &&
        chatType.value === 'friend' &&
        info.isContact
      ) {
        console.log('接收到好友消息')
        // 接收到好友消息
        await actualUpdateChatMessageList(messageList, info, false, true)
        // 更新本地缓存中的聊天列表
        await updateChatMessageList(info, false, true)
        console.log('对方发送，好友消息，更新左侧聊天列表', info)
      } else if (
        info.fromId === store.user_id &&
        info.toId === chatId.value &&
        chatType.value === 'friend' &&
        info.isContact
      ) {
        console.log('接收到自己发送的消息')
        // 接收到自己发送的消息
        await actualUpdateChatMessageList(messageList, info, true, true)
        // 更新本地缓存中的聊天列表
        await updateChatMessageList(info, true, true)
        console.log('自己发送，好友消息，更新左侧聊天列表', info)
      } else if (
        info.fromId !== store.user_id &&
        info.groupId === chatId.value &&
        chatType.value === 'group' &&
        !info.isContact
      ) {
        console.log('接收到群友发送的消息')
        // 接收到群友发送的消息
        await actualUpdateChatMessageList(messageList, info, false, true)
        // 更新本地缓存中的聊天列表
        await updateChatMessageList(info, false, true)
        console.log('群友发送，群聊消息，更新左侧聊天列表', info)
      } else if (
        info.fromId === store.user_id &&
        info.groupId === chatId.value &&
        chatType.value === 'group' &&
        !info.isContact
      ) {
        console.log('接收到自己发送的消息2')
        // 接收到自己发送的消息
        await actualUpdateChatMessageList(messageList, info, true, true)
        // 更新本地缓存中的聊天列表
        await updateChatMessageList(info, true, true)
        console.log('自己发送，群聊消息，更新左侧聊天列表', info)
      } else {
        await actualUpdateChatMessageList(messageList, info)
        console.log('不在聊天界面，只更新左侧聊天列表', info)
      }
    })
    // 删除聊天列表项
    websocket.listen('deleteChatMessageItem', (info: DeleteChatMessageListItemType) => {
      if (chatId.value === info.id && chatType.value === info.type) {
        chatId.value = -1
        chatType.value = ''
        router.push({ name: 'message' })
      }
      actualDeleteChatMessageListItem(messageList, info)
    })
    // 接收离线消息，更新左侧聊天列表
    websocket.listen('offlineChatMessages', async (offlineChatMessages: OfflineChatMessagesInfoType) => {
      console.log('接收离线消息，实时更新左侧聊天列表', offlineChatMessages)
      if (offlineChatMessages.contact) {
        for (const message of offlineChatMessages.contact) {
          // 更新左侧聊天列表
          await actualUpdateChatMessageList(
            messageList,
            Object.assign(message, { isContact: true }),
            message.fromId === store.user_id
          )
        }
      }
      if (offlineChatMessages.group) {
        for (const message of offlineChatMessages.group) {
          // 更新左侧聊天列表
          await actualUpdateChatMessageList(
            messageList,
            Object.assign(message, { isContact: false }),
            message.fromId === store.user_id
          )
        }
      }
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
