import useStore from '@/store'

// 添加联系人通知
const onAddContactNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.contactUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.contactUnHandleNoticeIds.push(notice.id)
  }
}

// 更新联系人列表
const onUpdatecontactList = () => {
  const store = useStore()
  store.isUpdateContactList = true
}

export { onAddContactNotice, onUpdatecontactList }
