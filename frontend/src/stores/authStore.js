import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../api/authService'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Load user from localStorage on app start
  function initialize() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }

  async function login(username, password) {
    try {
      const response = await authService.login({ username, password })
      user.value = response.data.user
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    initialize,
    login,
    logout
  }
})