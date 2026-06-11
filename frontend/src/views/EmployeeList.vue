<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Employees</h2>
      <router-link to="/employees/create" class="btn-primary">
        + Add Employee
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <SearchBar v-model="searchQuery" placeholder="Search employees..." />
        </div>
        
        <div>
          <select v-model="statusFilter" class="input-field" @change="loadEmployees">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
        
        <div>
          <select v-model="departmentFilter" class="input-field" @change="loadEmployees">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Employee Table -->
    <EmployeeTable
      :employees="employees"
      :loading="loading"
      @view="viewEmployee"
      @edit="editEmployee"
      @delete="confirmDelete"
    />

    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="totalEmployees"
      :per-page="perPage"
      @page-change="changePage"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteDialog"
      title="Archive Employee"
      :message="`Are you sure you want to archive ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}?`"
      confirm-text="Archive"
      @close="showDeleteDialog = false"
      @confirm="deleteEmployee"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import employeeService from '../api/employeeService'
import departmentService from '../api/departmentService'
import EmployeeTable from '../components/employees/EmployeeTable.vue'
import SearchBar from '../components/common/SearchBar.vue'
import Pagination from '../components/common/Pagination.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import { useNotificationStore } from '../stores/notificationStore'

const router = useRouter()
const notificationStore = useNotificationStore()

const employees = ref([])
const departments = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const totalEmployees = ref(0)
const perPage = ref(10)

const showDeleteDialog = ref(false)
const selectedEmployee = ref(null)

// Watch search query with debounce
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadEmployees()
  }, 300)
})

const loadEmployees = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: perPage.value,
      search: searchQuery.value,
      status: statusFilter.value,
      department: departmentFilter.value
    }
    
    const response = await employeeService.getAll(params)
    employees.value = response.data
    totalPages.value = response.totalPages
    totalEmployees.value = response.total
  } catch (error) {
    notificationStore.showNotification('Failed to load employees', 'error')
  } finally {
    loading.value = false
  }
}

const loadDepartments = async () => {
  try {
    const response = await departmentService.getAll()
    departments.value = response.data
  } catch (error) {
    console.error('Failed to load departments:', error)
  }
}

const changePage = (page) => {
  currentPage.value = page
  loadEmployees()
}

const viewEmployee = (id) => {
  router.push(`/employees/${id}`)
}

const editEmployee = (id) => {
  router.push(`/employees/${id}/edit`)
}

const confirmDelete = (employee) => {
  selectedEmployee.value = employee
  showDeleteDialog.value = true
}

const deleteEmployee = async () => {
  try {
    await employeeService.delete(selectedEmployee.value.id)
    notificationStore.showNotification('Employee archived successfully', 'success')
    showDeleteDialog.value = false
    loadEmployees()
  } catch (error) {
    notificationStore.showNotification('Failed to archive employee', 'error')
  }
}

onMounted(() => {
  loadEmployees()
  loadDepartments()
})
</script>