import useStore from '@/store'

// 添加群聊通知
const onAddGroupNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.groupUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.groupUnHandleNoticeIds.push(notice.id)
  }
}

// 被邀请加入群聊通知

// 退出群聊通知

// 解散群聊通知

// 更新群聊列表
const onUpdateGroupList = async () => {
  const store = useStore()
  store.isUpdateGroupList = true
}

export { onAddGroupNotice, onUpdateGroupList }
