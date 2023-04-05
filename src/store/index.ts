import { getUnHandleNotices } from '@/api/contacts'
import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => {
    return {
      clickContactsType: '',
      user_id: -1,
      contactUnHandleNoticeIds: [-1], // 未处理的联系人通知
      groupUnHandleNoticeIds: [-1], // 未处理的群聊通知
      isUpdateContactList: false, // 标记是否更新联系人列表
      isUpdateGroupList: false, // 标记是否更新群聊列表
    }
  },
  getters: {},
  actions: {
    // 初始化未处理的好友通知
    async initContactNoticeIds() {
      const { data } = await getUnHandleNotices({
        userId: this.user_id,
        type: 'contact',
      })
      const ids = data?.ids || []
      this.contactUnHandleNoticeIds.splice(0, this.contactUnHandleNoticeIds.length, ...ids)
    },
    // 初始化未处理的群聊通知
    async initGrouptNoticeIds() {
      const { data } = await getUnHandleNotices({
        userId: this.user_id,
        type: 'group',
      })
      const ids = data?.ids || []
      this.groupUnHandleNoticeIds.splice(0, this.groupUnHandleNoticeIds.length, ...ids)
    },
  },
})

export default useStore
