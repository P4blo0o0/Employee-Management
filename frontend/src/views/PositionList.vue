<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Positions</h1>
        <p class="text-sm text-gray-500 mt-1">{{ positions.length }} total</p>
      </div>
      <button @click="showForm = true" class="btn-primary text-sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Add Position
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
    <div v-else-if="positions.length === 0" class="card p-12 text-center">
      <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
        <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No positions</h3>
      <p class="text-sm text-gray-500 mt-1">Create your first position to get started.</p>
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Department</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Salary Range</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Employees</th>
            <th class="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="pos in positions" :key="pos.id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-5 py-3">
              <p class="text-sm font-medium text-gray-900">{{ pos.title }}</p>
            </td>
            <td class="px-5 py-3 hidden sm:table-cell">
              <span class="text-xs text-gray-400 font-mono">{{ pos.code }}</span>
            </td>
            <td class="px-5 py-3 hidden md:table-cell">
              <p class="text-sm text-gray-600">{{ pos.department_name || '—' }}</p>
            </td>
            <td class="px-5 py-3 hidden lg:table-cell">
              <p class="text-sm text-gray-600">
                {{ pos.salary_range_min ? formatCurrency(pos.salary_range_min) : '—' }}
                <span class="text-gray-300 mx-1">–</span>
                {{ pos.salary_range_max ? formatCurrency(pos.salary_range_max) : '—' }}
              </p>
            </td>
            <td class="px-5 py-3">
              <div class="flex items-center space-x-1.5">
                <div class="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center">
                  <span class="text-2xs text-gray-400">{{ pos.employee_count || 0 }}</span>
                </div>
                <span class="text-xs text-gray-400">{{ pos.employee_count === 1 ? 'person' : 'people' }}</span>
              </div>
            </td>
            <td class="px-5 py-3 text-right">
              <div class="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="editPosition(pos)" class="btn-ghost text-xs !px-2 !py-1">Edit</button>
                <button @click="confirmDelete(pos)" class="text-xs !px-2 !py-1 text-gray-400 hover:text-red-500 transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20" @click="closeForm"></div>
      <div class="relative bg-white rounded-xl shadow-dropdown p-6 w-full max-w-md mx-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-5">
          {{ editingPosition ? 'Edit Position' : 'New Position' }}
        </h3>

        <form @submit.prevent="savePosition" class="space-y-4">
          <div>
            <label class="label">Title</label>
            <input v-model="formData.title" type="text" class="input" required placeholder="e.g. Senior Developer" />
          </div>
          <div>
            <label class="label">Code</label>
            <input v-model="formData.code" type="text" class="input" required placeholder="e.g. SRDEV" />
          </div>
          <div>
            <label class="label">Department</label>
            <select v-model="formData.department_id" class="select">
              <option value="">Select Department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Min Salary</label>
              <input v-model="formData.salary_range_min" type="number" step="0.01" class="input" placeholder="0.00" />
            </div>
            <div>
              <label class="label">Max Salary</label>
              <input v-model="formData.salary_range_max" type="number" step="0.01" class="input" placeholder="0.00" />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="closeForm" class="btn-secondary text-xs">Cancel</button>
            <button type="submit" class="btn-primary text-xs">
              {{ editingPosition ? 'Save Changes' : 'Create Position' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20" @click="showDeleteDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-dropdown p-6 w-full max-w-sm mx-4">
        <h3 class="text-sm font-semibold text-gray-900">Delete Position</h3>
        <p class="text-sm text-gray-500 mt-2">
          Are you sure you want to delete <strong>{{ posToDelete?.title }}</strong>?
        </p>
        <div class="flex justify-end space-x-2 mt-5">
          <button @click="showDeleteDialog = false" class="btn-secondary text-xs">Cancel</button>
          <button @click="deletePosition" class="btn-danger text-xs">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import positionService from '../api/positionService'
import departmentService from '../api/departmentService'
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore = useNotificationStore()

const positions = ref([])
const departments = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingPosition = ref(null)
const showDeleteDialog = ref(false)
const posToDelete = ref(null)
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
      notificationStore.showNotification('Position updated', 'success')
    } else {
      await positionService.create(formData.value)
      notificationStore.showNotification('Position created', 'success')
    }
    closeForm()
    loadPositions()
  } catch (error) {
    notificationStore.showNotification('Failed to save position', 'error')
  }
}

const confirmDelete = (pos) => {
  posToDelete.value = pos
  showDeleteDialog.value = true
}

const deletePosition = async () => {
  try {
    await positionService.delete(posToDelete.value.id)
    notificationStore.showNotification('Position deleted', 'success')
    showDeleteDialog.value = false
    posToDelete.value = null
    loadPositions()
  } catch (error) {
    notificationStore.showNotification('Failed to delete position', 'error')
  }
}

onMounted(loadPositions)
</script>