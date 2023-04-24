import { getUnHandleNotices } from '@/api/contacts'
import { getLifeMessageCount } from '@/api/life'
import { getPyqMessagesCount } from '@/api/pyq'
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
      lifeMessagesCount: 0, // 生活圈消息数
      pyqMessagesCount: 0, // 朋友圈消息数
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
    // 初始化生活圈消息数
    async initLifeMessageCount() {
      const { data } = await getLifeMessageCount({
        userId: this.user_id,
      })
      if (data) {
        this.lifeMessagesCount = data.messageCount
      }
    },
    // 初始化朋友圈消息数
    async initpyqMessageCount() {
      const { data } = await getPyqMessagesCount({
        userId: this.user_id,
      })
      if (data) {
        this.pyqMessagesCount = data.messageCount
      }
    },
  },
})

export default useStore
