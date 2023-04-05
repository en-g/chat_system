import useStore from '@/store'
import { localStorage, sessionStorage } from '@/utils/storage'
import { ChatMessageNoticeType, MessageListItemInfoType } from '@/types/message'
import { getFriendInfo, getGroupInfo } from '@/api/contacts'

// 更新本地缓存
const onChat = async (info: ChatMessageNoticeType) => {
  await updateChatMessageList(info)

  // Todo 保存该消息
}

// 更新本地缓存的聊天列表
const updateChatMessageList = async (info: ChatMessageNoticeType) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const lStorage = localStorage(`${store.user_id}`)
  const chatMessageList: MessageListItemInfoType[] = lStorage.get('chatMessageList') || []
  if (info.isContact) {
    const index = chatMessageList.findIndex(
      (item: MessageListItemInfoType) => item.contactId === info.fromId && item.type === 'friend'
    )
    if (index === -1) {
      const contactsInfo = storage.get('contactsInfo') || []
      let contactInfo = contactsInfo.find((item: any) => item.id === info.fromId)
      if (!contactInfo) {
        // 获取对方的信息
        const { data } = await getFriendInfo({
          userId: store.user_id,
          friendId: info.fromId,
        })
        data.createTime = data.createTime.split('T')[0]
        contactInfo = data
        contactsInfo.push(data)
        storage.set('contactsInfo', contactsInfo)
      }
      const chatMessage: MessageListItemInfoType = {
        id: chatMessageList.length + 1,
        contactId: info.fromId,
        type: 'friend',
        name: contactInfo.nickname,
        remarks: contactInfo.remarks,
        avatarUrl: contactInfo.avatarUrl,
        lastMessage: (info.type === 1 ? info.message : '[图片]') as string,
        unRead: 1,
      }
      chatMessageList.unshift(chatMessage)
    } else {
      chatMessageList[index].lastMessage = (info.type === 1 ? info.message : '[图片]') as string
      chatMessageList[index].unRead++
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    }
    lStorage.set('chatMessageList', chatMessageList)
  } else {
    const index = chatMessageList.findIndex(
      (item: MessageListItemInfoType) => item.groupId === info.groupId && item.type === 'group'
    )
    if (index === -1) {
      const groupsInfo = storage.get('groupsInfo') || []
      let groupInfo = groupsInfo.find((item: any) => item.id === info.groupId)
      if (!groupInfo) {
        // 获取群聊的信息
        const { data } = await getGroupInfo({
          userId: store.user_id,
          groupId: info.groupId as number,
        })
        data.createTime = data.createTime.split('T')[0]
        groupInfo = data
        groupsInfo.push(data)
        storage.set('groupsInfo', groupsInfo)
      }
      const chatMessage: MessageListItemInfoType = {
        id: chatMessageList.length + 1,
        groupId: info.groupId,
        type: 'group',
        name: groupInfo.name,
        remarks: groupInfo.remarks,
        avatarUrl: groupInfo.avatarUrl,
        lastMessage: (info.type === 1 ? info.message : '[图片]') as string,
        unRead: 1,
      }
      chatMessageList.unshift(chatMessage)
    } else {
      chatMessageList[index].lastMessage = (info.type === 1 ? info.message : '[图片]') as string
      chatMessageList[index].unRead++
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    }
    lStorage.set('chatMessageList', chatMessageList)
  }
}

// 直接更新页面的聊天列表
const actualUpdateChatMessageList = async (chatMessageList: MessageListItemInfoType[], info: ChatMessageNoticeType) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  if (info.isContact) {
    const index = chatMessageList.findIndex(
      (item: MessageListItemInfoType) => item.contactId === info.fromId && item.type === 'friend'
    )
    if (index === -1) {
      let contactsInfo = (storage.get('contactsInfo') || []).find((item: any) => item.id === info.fromId)
      if (!contactsInfo) {
        // 获取对方的信息
        const { data } = await getFriendInfo({
          userId: store.user_id,
          friendId: info.fromId,
        })
        contactsInfo = data
      }
      const chatMessage: MessageListItemInfoType = {
        id: chatMessageList.length + 1,
        contactId: info.fromId,
        type: 'friend',
        name: contactsInfo.nickname,
        remarks: contactsInfo.remarks,
        avatarUrl: contactsInfo.avatarUrl,
        lastMessage: (info.type === 1 ? info.message : '[图片]') as string,
        unRead: 1,
      }
      chatMessageList.unshift(chatMessage)
    } else {
      chatMessageList[index].lastMessage = (info.type === 1 ? info.message : '[图片]') as string
      chatMessageList[index].unRead++
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    }
  } else {
    const index = chatMessageList.findIndex(
      (item: MessageListItemInfoType) => item.groupId === info.groupId && item.type === 'group'
    )
    if (index === -1) {
      let groupsInfo = (storage.get('groupsInfo') || []).find((item: any) => item.id === info.groupId)
      if (!groupsInfo) {
        // 获取群聊的信息
        const { data } = await getGroupInfo({
          userId: store.user_id,
          groupId: info.groupId as number,
        })
        groupsInfo = data
      }
      const chatMessage: MessageListItemInfoType = {
        id: chatMessageList.length + 1,
        groupId: info.groupId,
        type: 'group',
        name: groupsInfo.name,
        remarks: groupsInfo.remarks,
        avatarUrl: groupsInfo.avatarUrl,
        lastMessage: (info.type === 1 ? info.message : '[图片]') as string,
        unRead: 1,
      }
      chatMessageList.unshift(chatMessage)
    } else {
      chatMessageList[index].lastMessage = (info.type === 1 ? info.message : '[图片]') as string
      chatMessageList[index].unRead++
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    }
  }
}

export { onChat, actualUpdateChatMessageList }
