import useStore from '@/store'
import { sessionStorage } from '@/utils/storage'

// 添加联系人通知
const onAddContactNotice = (notice: any) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const contactNotices: Array<any> = storage.get('contactNotices') || []
  contactNotices.unshift(notice)
  storage.set('contactNotices', contactNotices)
}

// 添加群聊通知
const onAddGroupNotice = (notice: any) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const groupNotices: Array<any> = storage.get('groupNotices') || []
  groupNotices.unshift(notice)
  storage.set('groupNotices', groupNotices)
}

export { onAddContactNotice, onAddGroupNotice }
