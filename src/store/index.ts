import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => {
    return {
      clickContactsType: '',
      user_id: -1,
    }
  },
  getters: {},
  actions: {},
})

export default useStore
