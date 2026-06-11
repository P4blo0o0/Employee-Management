import apiClient from './axios'

export default {
  getAll() {
    return apiClient.get('/departments')
  },
  
  getById(id) {
    return apiClient.get(`/departments/${id}`)
  },
  
  create(departmentData) {
    return apiClient.post('/departments', departmentData)
  },
  
  update(id, departmentData) {
    return apiClient.put(`/departments/${id}`, departmentData)
  },
  
  delete(id) {
    return apiClient.delete(`/departments/${id}`)
  },
  
  getEmployees(id) {
    return apiClient.get(`/departments/${id}/employees`)
  }
}