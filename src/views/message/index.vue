<template>
  <div class="message-container">
    <div class="message-list">
      <el-scrollbar class="messgae-list-scrollbar">
        <MessageList :message-list="messageList" @chat="listenChatToContact" />
      </el-scrollbar>
    </div>
    <div class="message-main">
      <div v-if="!!chatMessageList.length" class="message-main-chat-box">
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
  import { ref, reactive } from 'vue'
  import { ChatMessageItemType, MessageListItemInfoType } from '@/types/message'
  import MessageList from './children/messageList/index.vue'
  import ChatBox from './children/chatBox/index.vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const chatId = ref<number>(-1) // 聊天对象 ID
  const chatName = ref<string>('') // 聊天对象名称
  const chatType = ref<string>('') // 聊天对象类型
  const isSend = ref<boolean>(false) // 标记是否为发送消息

  const messageList: MessageListItemInfoType[] = [
    {
      id: 1,
      contactId: 1,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 1,
    },
    {
      id: 2,
      contactId: 2,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '王尼玛',
      lastMessage: '大湾区二群翁',
      unRead: 100,
    },
    {
      id: 3,
      contactId: 3,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 4,
      contactId: 4,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 5,
      contactId: 5,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 6,
      contactId: 6,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 7,
      contactId: 7,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 8,
      contactId: 8,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
    {
      id: 9,
      contactId: 9,
      type: 'contact',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      name: '老王',
      remarks: '',
      lastMessage: '大湾区二群翁',
      unRead: 10,
    },
  ]
  const chatMessageList = reactive<ChatMessageItemType[]>([])

  // 获取聊天记录列表数据
  const getChatMessageInfo = (id: number, type: string) => {
    chatId.value = id
    chatType.value = type
    const chatObj = messageList.find(
      (item: MessageListItemInfoType) => item.contactId === id || item.groupId === id
    ) as MessageListItemInfoType
    chatName.value = chatObj?.remarks || chatObj.name
    const myInfo = storage.get('personalInfo')
    chatMessageList.splice(
      0,
      chatMessageList.length,
      ...[
        {
          id: 1,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message:
            '青春，是人生中最美的那一部分，是世界上任何一种语言中最动人的词汇之一。青年，是国家的未来和民族的希望，是社会上最富有朝气、最富有创造性、最富有生命力的群体。在革命、建设、改革各个历史时期，中国共产党始终高度重视青年、关怀青年、信任青年，对青年一代寄予殷切期望、提出严格要求。新中国成立以来，毛泽东、邓小平、江泽民、胡锦涛等历届党和国家领导人都曾饱含深情地留下激励亿万青年的名言。党的十八大以来，以习近平同志为核心的党中央站在党和国家事业发展薪火相传、后继有人的战略高度，关心青年的成长进步，为新时代党的青年工作指明前进方向。作为全党拥护、人民爱戴、当之无愧的党的核心、军队统帅、人民领袖，新时代中国特色社会主义国家掌舵者、人民领路人，习近平总书记多次出席青年活动，与青年谈心，给青年回信，为青年鼓劲……在广大青年心目中，总书记就是人生道路上学习的榜样、人生的导师。',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 2,
          fromId: 2,
          toId: 1,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 2,
          message: '',
          url: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
          createTime: new Date().toISOString(),
        },
        {
          id: 3,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 2,
          message: '',
          url: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
          createTime: new Date().toISOString(),
        },
        {
          id: 4,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 5,
          fromId: 2,
          toId: 1,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 6,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 7,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 8,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 9,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 10,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 11,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 12,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 13,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 14,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 15,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 16,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 17,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 19,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 20,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 21,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 22,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
        {
          id: 23,
          fromId: 1,
          toId: 2,
          fromName: myInfo.nickname,
          fromAvatarUrl: myInfo.avatarUrl,
          type: 1,
          message: '1111',
          url: '',
          createTime: new Date().toISOString(),
        },
      ]
    )
  }

  // 监听点击好友聊天
  const listenChatToContact = (type: string, id: number) => {
    isSend.value = false
    getChatMessageInfo(id, type)
  }

  // 发送消息
  const listenSendChatMessage = (chatMessage: string) => {
    isSend.value = true
    const myInfo = storage.get('personalInfo')
    if (chatType.value === 'contact') {
      chatMessageList.push({
        id: chatMessageList[chatMessageList.length - 1].id + 1,
        fromId: store.user_id,
        toId: chatId.value,
        fromName: myInfo.nickname,
        fromAvatarUrl: myInfo.avatarUrl,
        type: 1,
        message: chatMessage,
        url: '',
        createTime: new Date().toISOString(),
      })
    } else {
      console.log('group')
    }
  }
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
