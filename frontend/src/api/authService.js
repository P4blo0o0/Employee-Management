import apiClient from './axios'

export default {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  
  getCurrentUser() {
    return apiClient.get('/auth/me')
  },
  
  logout() {
    return apiClient.post('/auth/logout')
  }
}