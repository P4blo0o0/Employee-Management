<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Departments</h1>
        <p class="text-sm text-gray-500 mt-1">{{ departments.length }} total</p>
      </div>
      <button @click="showForm = true" class="btn-primary text-sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Add Department
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>

    <!-- Empty -->
    <div v-else-if="departments.length === 0" class="card p-12 text-center">
      <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
        <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No departments</h3>
      <p class="text-sm text-gray-500 mt-1">Create your first department to get started.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="dept in departments"
        :key="dept.id"
        class="card-hover p-5 group cursor-pointer"
        @click="editDepartment(dept)"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span class="text-xs text-gray-400 font-mono">{{ dept.code }}</span>
        </div>

        <h3 class="text-sm font-semibold text-gray-900">{{ dept.name }}</h3>
        
        <div class="flex items-center space-x-2 mt-2">
          <div class="flex -space-x-1">
            <div class="w-5 h-5 rounded-full bg-gray-100 border border-white flex items-center justify-center">
              <span class="text-2xs text-gray-400">{{ dept.employee_count || 0 }}</span>
            </div>
          </div>
          <span class="text-xs text-gray-400">{{ dept.employee_count || 0 }} employees</span>
        </div>

        <p v-if="dept.description" class="text-xs text-gray-400 mt-3 line-clamp-2">{{ dept.description }}</p>

        <!-- Actions (visible on hover) -->
        <div class="flex items-center space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click.stop="editDepartment(dept)"
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Edit
          </button>
          <span class="text-gray-200">·</span>
          <button
            @click.stop="confirmDelete(dept)"
            class="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20" @click="closeForm"></div>
      <div class="relative bg-white rounded-xl shadow-dropdown p-6 w-full max-w-md mx-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-5">
          {{ editingDepartment ? 'Edit Department' : 'New Department' }}
        </h3>

        <form @submit.prevent="saveDepartment" class="space-y-4">
          <div>
            <label class="label">Name</label>
            <input v-model="formData.name" type="text" class="input" required placeholder="e.g. Engineering" />
          </div>
          <div>
            <label class="label">Code</label>
            <input v-model="formData.code" type="text" class="input" required placeholder="e.g. ENG" />
          </div>
          <div>
            <label class="label">Description</label>
            <textarea v-model="formData.description" class="input" rows="3" placeholder="Brief description..."></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="closeForm" class="btn-secondary text-xs">Cancel</button>
            <button type="submit" class="btn-primary text-xs">
              {{ editingDepartment ? 'Save Changes' : 'Create Department' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20" @click="showDeleteDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-dropdown p-6 w-full max-w-sm mx-4">
        <h3 class="text-sm font-semibold text-gray-900">Delete Department</h3>
        <p class="text-sm text-gray-500 mt-2">
          Are you sure you want to delete <strong>{{ deptToDelete?.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-2 mt-5">
          <button @click="showDeleteDialog = false" class="btn-secondary text-xs">Cancel</button>
          <button @click="deleteDepartment" class="btn-danger text-xs">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import departmentService from '../api/departmentService'
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore = useNotificationStore()

const departments = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingDepartment = ref(null)
const showDeleteDialog = ref(false)
const deptToDelete = ref(null)
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
      notificationStore.showNotification('Department updated', 'success')
    } else {
      await departmentService.create(formData.value)
      notificationStore.showNotification('Department created', 'success')
    }
    closeForm()
    loadDepartments()
  } catch (error) {
    notificationStore.showNotification('Failed to save department', 'error')
  }
}

const confirmDelete = (dept) => {
  deptToDelete.value = dept
  showDeleteDialog.value = true
}

const deleteDepartment = async () => {
  try {
    await departmentService.delete(deptToDelete.value.id)
    notificationStore.showNotification('Department deleted', 'success')
    showDeleteDialog.value = false
    deptToDelete.value = null
    loadDepartments()
  } catch (error) {
    notificationStore.showNotification('Failed to delete department', 'error')
  }
}

onMounted(loadDepartments)
</script>