import apiClient from './axios'

export default {
  getAll(params = {}) {
    return apiClient.get('/employees', { params })
  },
  
  getById(id) {
    return apiClient.get(`/employees/${id}`)
  },
  
  create(employeeData) {
    return apiClient.post('/employees', employeeData)
  },
  
  update(id, employeeData) {
    return apiClient.put(`/employees/${id}`, employeeData)
  },
  
  delete(id) {
    return apiClient.delete(`/employees/${id}`)
  },
  
  getStats() {
    return apiClient.get('/employees/stats')
  },
  
  bulkImport(employees) {
    return apiClient.post('/employees/bulk-import', { employees })
  }
}