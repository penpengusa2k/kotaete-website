import { defineStore } from 'pinia'

export const useCreateStore = defineStore('create', {
  state: () => ({
    title: '',
    viewingKey: '',
    isRestricted: false,
    deadline: '',
    creatorName: ''
  }),
  persist: true
})
