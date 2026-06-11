<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Positions</h2>
      <button @click="showForm = true" class="btn-primary">
        + Add Position
      </button>
    </div>

    <div v-if="loading">
      <LoadingSpinner />
    </div>

    <div v-else-if="positions.length === 0">
      <EmptyState message="No positions found. Create your first position!" />
    </div>

    <div v-else class="card">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary Range</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="pos in positions" :key="pos.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium">{{ pos.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ pos.code }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ pos.department_name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ pos.salary_range_min ? formatCurrency(pos.salary_range_min) : '-' }} - 
              {{ pos.salary_range_max ? formatCurrency(pos.salary_range_max) : '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ pos.employee_count || 0 }}</td>
            <td class="px-6 py-4 text-sm space-x-2">
              <button @click="editPosition(pos)" class="text-primary-600 hover:underline">
                Edit
              </button>
              <button @click="deletePosition(pos.id)" class="text-red-600 hover:underline">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Position Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">
          {{ editingPosition ? 'Edit Position' : 'Add Position' }}
        </h3>
        
        <form @submit.prevent="savePosition" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input v-model="formData.title" type="text" class="input-field" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Code</label>
            <input v-model="formData.code" type="text" class="input-field" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Department</label>
            <select v-model="formData.department_id" class="input-field">
              <option value="">Select Department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Min Salary</label>
              <input v-model="formData.salary_range_min" type="number" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Max Salary</label>
              <input v-model="formData.salary_range_max" type="number" class="input-field">
            </div>
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
import positionService from '../api/positionService'
import departmentService from '../api/departmentService'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore = useNotificationStore()

const positions = ref([])
const departments = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingPosition = ref(null)
const formData = ref({
  title: '',
  code: '',
  department_id: null,
  salary_range_min: null,
  salary_range_max: null
})

const formatCurrency = (amount) => {
  if (!amount) return '₱0'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(amount)
}

const loadPositions = async () => {
  loading.value = true
  try {
    const [posResponse, deptResponse] = await Promise.all([
      positionService.getAll(),
      departmentService.getAll()
    ])
    positions.value = posResponse.data
    departments.value = deptResponse.data
  } catch (error) {
    notificationStore.showNotification('Failed to load positions', 'error')
  } finally {
    loading.value = false
  }
}

const editPosition = (pos) => {
  editingPosition.value = pos
  formData.value = {
    title: pos.title,
    code: pos.code,
    department_id: pos.department_id,
    salary_range_min: pos.salary_range_min,
    salary_range_max: pos.salary_range_max
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingPosition.value = null
  formData.value = {
    title: '', code: '', department_id: null,
    salary_range_min: null, salary_range_max: null
  }
}

const savePosition = async () => {
  try {
    if (editingPosition.value) {
      await positionService.update(editingPosition.value.id, formData.value)
      notificationStore.showNotification('Position updated successfully', 'success')
    } else {
      await positionService.create(formData.value)
      notificationStore.showNotification('Position created successfully', 'success')
    }
    closeForm()
    loadPositions()
  } catch (error) {
    notificationStore.showNotification('Failed to save position', 'error')
  }
}

const deletePosition = async (id) => {
  if (confirm('Are you sure you want to delete this position?')) {
    try {
      await positionService.delete(id)
      notificationStore.showNotification('Position deleted successfully', 'success')
      loadPositions()
    } catch (error) {
      notificationStore.showNotification('Failed to delete position', 'error')
    }
  }
}

onMounted(loadPositions)
</script>