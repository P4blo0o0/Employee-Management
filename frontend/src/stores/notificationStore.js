import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notification = ref({
    show: false,
    message: '',
    type: 'success'
  })

  let timeout = null

  function showNotification(message, type = 'success') {
    if (timeout) clearTimeout(timeout)
    
    notification.value = {
      show: true,
      message,
      type
    }

    timeout = setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }

  return {
    notification,
    showNotification
  }
})