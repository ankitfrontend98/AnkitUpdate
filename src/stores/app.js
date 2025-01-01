// Utilities
import apiClient from '@/utils/axios';
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    poolList: [],
    favPoolList: []
  }),
  getters: {
    getTheme: (state) => state.darkMode,
    getPoolList: (state) => state.poolList,
  },
  actions: {
    async fetchPoolList() {
      try {
        const { data } = await apiClient.get('api/message/0');
        this.poolList = data
      } catch (error) {
        console.error('Failed to fetch pool list:', error)
      }
    },
    addToFavPoolList(item) {
        this.favPoolList.push(item);
    },
    setFavPoolList(array){
      this.favPoolList = array
    }
  },
})
