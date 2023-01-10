import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => {
    return {
      clickContactsType: '',
    }
  },
  getters: {},
  actions: {},
})

export default useStore
