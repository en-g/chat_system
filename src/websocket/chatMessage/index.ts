import useStore from '@/store'
import { localStorage, sessionStorage } from '@/utils/storage'
import { ChatMessageNoticeType, DeleteChatMessageListItemType, MessageListItemInfoType } from '@/types/message'
import { getFriendInfo, getGroupInfo } from '@/api/contacts'
import idb from '@/utils/indexedDB'

// 更新本地缓存
const onChat = async (info: ChatMessageNoticeType) => {
  await updateChatMessageList(info)

  // Todo 保存该消息
  if (info.isContact) {
    await idb.addData('friendChatMessages', {
      fromId: info.fromId,
      toId: info.toId,
      type: info.type,
      message: info.message,
      url: info.url,
      createTime: new Date().toLocaleString(),
    })
  } else {
    await idb.addData('groupChatMessages', {
      fromId: info.fromId,
      groupId: info.groupId,
      type: info.type,
      message: info.message,
      url: info.url,
      createTime: new Date().toLocaleString(),
    })
  }
}

// 删除聊天列表项
const onDeleteChatMessageItem = (info: DeleteChatMessageListItemType) => {
  deleteChatMessageListItem(info)
}

// 更新本地缓存的聊天列表
const updateChatMessageList = async (info: ChatMessageNoticeType, isCur = false, isZero = false) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const lStorage = localStorage(`${store.user_id}`)
  const chatMessageList: MessageListItemInfoType[] = lStorage.get('chatMessageList') || []
  if (info.isContact) {
    const fromId = (isCur ? info.toId : info.fromId) as number
    const index = chatMessageList.findIndex(
      (item: MessageListItemInfoType) => item.contactId === fromId && item.type === 'friend'
    )
    if (index === -1) {
      const contactsInfo = storage.get('contactsInfo') || []
      let contactInfo = contactsInfo.find((item: any) => item.id === fromId)
      if (!contactInfo) {
        // 获取对方的信息
        const { data } = await getFriendInfo({
          userId: store.user_id,
          friendId: fromId,
        })
        data.birthday = data.birthday.split('T')[0]
        contactInfo = data
        contactsInfo.push(data)
        storage.set('contactsInfo', contactsInfo)
      }
      const chatMessage: MessageListItemInfoType = {
        id: chatMessageList.length + 1,
        contactId: fromId,
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
      chatMessageList[index].unRead = isZero ? 0 : chatMessageList[index].unRead + 1
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
      chatMessageList[index].unRead = isZero ? 0 : chatMessageList[index].unRead + 1
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    }
    lStorage.set('chatMessageList', chatMessageList)
  }
}

// 直接更新页面的聊天列表
const actualUpdateChatMessageList = async (
  chatMessageList: MessageListItemInfoType[],
  info: ChatMessageNoticeType,
  isCur = false,
  isZero = false
) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  if (info.isContact) {
    const fromId = (isCur ? info.toId : info.fromId) as number
    const index = chatMessageList.findIndex(
      (item: MessageListItemInfoType) => item.contactId === fromId && item.type === 'friend'
    )
    console.log(fromId, index)
    if (index === -1) {
      let contactsInfo = (storage.get('contactsInfo') || []).find((item: any) => item.id === fromId)
      if (!contactsInfo) {
        // 获取对方的信息
        const { data } = await getFriendInfo({
          userId: store.user_id,
          friendId: fromId,
        })
        contactsInfo = data
      }
      const chatMessage: MessageListItemInfoType = {
        id: chatMessageList.length + 1,
        contactId: fromId,
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
      chatMessageList[index].unRead = isZero ? 0 : chatMessageList[index].unRead + 1
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
      chatMessageList[index].unRead = isZero ? 0 : chatMessageList[index].unRead + 1
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    }
  }
}

// 删除聊天列表项
const deleteChatMessageListItem = (info: DeleteChatMessageListItemType) => {
  const store = useStore()
  const lStorage = localStorage(`${store.user_id}`)
  const chatMessageList = lStorage.get('chatMessageList') || []
  if (info.type === 'friend') {
    const index = chatMessageList.findIndex(
      (chatMessage: MessageListItemInfoType) => chatMessage.contactId === info.id && chatMessage.type === info.type
    )
    if (index !== -1) {
      chatMessageList.splice(index, 1)
      lStorage.set('chatMessageList', chatMessageList)
    }
  } else {
    const index = chatMessageList.findIndex(
      (chatMessage: MessageListItemInfoType) => chatMessage.groupId === info.id && chatMessage.type === info.type
    )
    if (index !== -1) {
      chatMessageList.splice(index, 1)
      lStorage.set('chatMessageList', chatMessageList)
    }
  }
}

// 实时删除页面的聊天列表项
const actualDeleteChatMessageListItem = (
  chatMessageList: MessageListItemInfoType[],
  info: DeleteChatMessageListItemType
) => {
  if (info.type === 'friend') {
    const index = chatMessageList.findIndex(
      (chatMessage: MessageListItemInfoType) => chatMessage.contactId === info.id && chatMessage.type === info.type
    )
    if (index !== -1) {
      chatMessageList.splice(index, 1)
    }
  } else {
    const index = chatMessageList.findIndex(
      (chatMessage: MessageListItemInfoType) => chatMessage.groupId === info.id && chatMessage.type === info.type
    )
    if (index !== -1) {
      chatMessageList.splice(index, 1)
    }
  }
}

export {
  onChat,
  updateChatMessageList,
  actualUpdateChatMessageList,
  deleteChatMessageListItem,
  actualDeleteChatMessageListItem,
  onDeleteChatMessageItem,
}
