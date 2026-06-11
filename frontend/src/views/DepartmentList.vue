<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Departments</h2>
      <button @click="showForm = true" class="btn-primary">
        + Add Department
      </button>
    </div>

    <div v-if="loading">
      <LoadingSpinner />
    </div>

    <div v-else-if="departments.length === 0">
      <EmptyState message="No departments found. Create your first department!" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="dept in departments" :key="dept.id" class="card p-6">
        <h3 class="text-lg font-medium">{{ dept.name }}</h3>
        <p class="text-sm text-gray-600 mt-1">{{ dept.code }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ dept.employee_count || 0 }} employees</p>
        
        <div class="mt-4 flex space-x-2">
          <button @click="editDepartment(dept)" class="text-primary-600 text-sm hover:underline">
            Edit
          </button>
          <button @click="deleteDepartment(dept.id)" class="text-red-600 text-sm hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Department Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">
          {{ editingDepartment ? 'Edit Department' : 'Add Department' }}
        </h3>
        
        <form @submit.prevent="saveDepartment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input v-model="formData.name" type="text" class="input-field" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Code</label>
            <input v-model="formData.code" type="text" class="input-field" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="formData.description" class="input-field" rows="3"></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import departmentService from '../api/departmentService'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore = useNotificationStore()

const departments = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingDepartment = ref(null)
const formData = ref({
  name: '',
  code: '',
  description: ''
})

const loadDepartments = async () => {
  loading.value = true
  try {
    const response = await departmentService.getAll()
    departments.value = response.data
  } catch (error) {
    notificationStore.showNotification('Failed to load departments', 'error')
  } finally {
    loading.value = false
  }
}

const editDepartment = (dept) => {
  editingDepartment.value = dept
  formData.value = {
    name: dept.name,
    code: dept.code,
    description: dept.description || ''
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingDepartment.value = null
  formData.value = { name: '', code: '', description: '' }
}

const saveDepartment = async () => {
  try {
    if (editingDepartment.value) {
      await departmentService.update(editingDepartment.value.id, formData.value)
      notificationStore.showNotification('Department updated successfully', 'success')
    } else {
      await departmentService.create(formData.value)
      notificationStore.showNotification('Department created successfully', 'success')
    }
    closeForm()
    loadDepartments()
  } catch (error) {
    notificationStore.showNotification('Failed to save department', 'error')
  }
}

const deleteDepartment = async (id) => {
  if (confirm('Are you sure you want to delete this department?')) {
    try {
      await departmentService.delete(id)
      notificationStore.showNotification('Department deleted successfully', 'success')
      loadDepartments()
    } catch (error) {
      notificationStore.showNotification('Failed to delete department', 'error')
    }
  }
}

onMounted(loadDepartments)
</script>