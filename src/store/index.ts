import { getContactsList, getGroupsList, getUnHandleNotices } from '@/api/contacts'
import { defineStore } from 'pinia'
import { sessionStorage } from '@/utils/storage'
import { ContactsListType } from '@/types/contacts'

const useStore = defineStore('main', {
  state: () => {
    return {
      clickContactsType: '',
      user_id: -1,
      contactUnHandleNoticeIds: [-1],
      groupUnHandleNoticeIds: [-1],
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
    // 更新联系人列表
    async updateContactList(friendsList: ContactsListType[]) {
      const storage = sessionStorage(`${this.user_id}`)
      const { data } = await getContactsList({
        userId: this.user_id,
      })
      storage.set('contactsList', data)
      friendsList.splice(0, friendsList.length, ...data)
    },
    // 更新群聊列表
    async updateGroupList(groupsList: ContactsListType[]) {
      const storage = sessionStorage(`${this.user_id}`)
      const { data } = await getGroupsList({
        userId: this.user_id,
      })
      storage.set('groupsList', data)
      groupsList.splice(0, groupsList.length, ...data)
    },
  },
})

export default useStore
