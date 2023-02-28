<template>
  <div class="message-container">
    <div class="message-list">
      <el-scrollbar class="messgae-list-scrollbar">
        <MessageList :message-list="messageList" @chat="listenChatToContact" />
      </el-scrollbar>
    </div>
    <div class="message-main">
      <div v-if="chatMessageList.length" class="message-main-chat-box">
        <ChatBox :type="chatType" :friend-chat-message-list="chatMessageList" :chat-name="chatName" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { FriendChatMessageInfoType, MessageListItemInfoType } from '@/types/message'
  import MessageList from './children/messageList/index.vue'
  import ChatBox from './children/chatBox/index.vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const chatId = ref<number>(-1) // 聊天对象 ID
  const chatName = ref<string>('') // 聊天对象名字
  const chatType = ref<string>('') // 聊天对象类型

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

  // 获取联系人聊天列表
  const getChatMessageList = () => {
    const myInfo = storage.get('personalInfo')
    const chatMessageList: FriendChatMessageInfoType[] = [
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
    ]
    return chatMessageList
  }
  const chatMessageList = reactive<FriendChatMessageInfoType[]>([])

  // 切换聊天对象，更新聊天列表数据
  watch(chatId, () => {
    const data = getChatMessageList()
    chatMessageList.splice(0, chatMessageList.length, ...data)
    console.log(chatMessageList)
  })

  // 监听点击好友聊天
  const listenChatToContact = (id: number, type: string) => {
    chatId.value = id
    const chatObj = messageList.find((item) => item.userId === id)
    if (chatObj) {
      chatName.value = chatObj?.remarks || chatObj.nickname
    }
    chatType.value = type
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
