import apiClient from './axios'

export default {
  getAll(departmentId = null) {
    const params = departmentId ? { department_id: departmentId } : {}
    return apiClient.get('/positions', { params })
  },
  
  getById(id) {
    return apiClient.get(`/positions/${id}`)
  },
  
  create(positionData) {
    return apiClient.post('/positions', positionData)
  },
  
  update(id, positionData) {
    return apiClient.put(`/positions/${id}`, positionData)
  },
  
  delete(id) {
    return apiClient.delete(`/positions/${id}`)
  }
}