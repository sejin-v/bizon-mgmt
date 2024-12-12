import { defineStore } from 'pinia'


export const useBoardStore = defineStore('boardStore', () => {
  const atclKdCd = ref('FAQ')
  const setAtclKdCd = (target: string) => {
    atclKdCd.value = target
  }


  return {
    setAtclKdCd,
    atclKdCd,
  }
})
