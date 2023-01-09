import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => {
    return {
      count: 1,
    }
  },
  getters: {},
  actions: {},
})

export default useStore
