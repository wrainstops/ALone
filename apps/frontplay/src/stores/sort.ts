import { defineStore } from 'pinia'

export const useSortStore = defineStore('sort', {
  state: () => ({
    sortIndex: 0,
  }),
  getters: {
    getSortIndex(state): number {
      return state.sortIndex
    },
  },
  actions: {
    setSortIndex(index: number) {
      this.sortIndex = index
    },
  },
})
