// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
  }),
  getters: {
    getTheme: (state) => state.darkMode,
  },
})
