 <template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Employees</h1>
        <p class="text-sm text-gray-500 mt-1">{{ totalEmployees }} total</p>
      </div>
      <router-link to="/employees/create" class="btn-primary text-sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Add Employee
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-wrap gap-3">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or code..."
            class="input"
          />
        </div>
        <select v-model="statusFilter" @change="loadEmployees" class="select w-40">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
          <option value="on-leave">On Leave</option>
        </select>
        <select v-model="departmentFilter" @change="loadEmployees" class="select w-48">
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-12 flex justify-center">
        <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>

      <!-- Empty -->
      <div v-else-if="employees.length === 0" class="p-12 text-center">
        <p class="text-sm text-gray-500">No employees found</p>
      </div>

      <!-- Table Content -->
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Employee</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Department</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Position</th>
            <th class="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th class="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="emp in employees" :key="emp.id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-5 py-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-medium text-gray-500">{{ emp.first_name?.charAt(0) }}{{ emp.last_name?.charAt(0) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ emp.first_name }} {{ emp.last_name }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ emp.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 hidden md:table-cell">
              <p class="text-sm text-gray-600">{{ emp.department_name || '—' }}</p>
            </td>
            <td class="px-5 py-3 hidden lg:table-cell">
              <p class="text-sm text-gray-600">{{ emp.position_title || '—' }}</p>
            </td>
            <td class="px-5 py-3">
              <span :class="statusBadgeClass(emp.employment_status)">{{ emp.employment_status }}</span>
            </td>
            <td class="px-5 py-3 text-right">
              <div class="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="viewEmployee(emp.id)" class="btn-ghost text-xs !px-2 !py-1">View</button>
                <button @click="editEmployee(emp.id)" class="btn-ghost text-xs !px-2 !py-1">Edit</button>
                <button @click="confirmDelete(emp)" class="text-xs !px-2 !py-1 text-gray-400 hover:text-red-500 transition-colors">Archive</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          Showing {{ startItem }}–{{ endItem }} of {{ totalEmployees }}
        </p>
        <div class="flex items-center space-x-1">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn-ghost text-xs !px-2 !py-1 disabled:opacity-30"
          >
            Previous
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="page !== '...' && changePage(page)"
            :class="[
              'text-xs px-2.5 py-1 rounded',
              page === currentPage ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50',
              page === '...' ? 'cursor-default' : ''
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn-ghost text-xs !px-2 !py-1 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20" @click="showDeleteDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-dropdown p-6 w-full max-w-sm mx-4">
        <h3 class="text-sm font-semibold text-gray-900">Archive Employee</h3>
        <p class="text-sm text-gray-500 mt-2">
          Are you sure you want to archive {{ selectedEmployee?.first_name }} {{ selectedEmployee?.last_name }}?
        </p>
        <div class="flex justify-end space-x-2 mt-5">
          <button @click="showDeleteDialog = false" class="btn-secondary text-xs">Cancel</button>
          <button @click="deleteEmployee" class="btn-danger text-xs">Archive</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import employeeService from '../api/employeeService'
import departmentService from '../api/departmentService'
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
const perPage = ref(15)
const showDeleteDialog = ref(false)
const selectedEmployee = ref(null)

const startItem = computed(() => ((currentPage.value - 1) * perPage.value) + 1)
const endItem = computed(() => Math.min(currentPage.value * perPage.value, totalEmployees.value))

const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage.value > 3) pages.push('...')
    for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(total - 1, currentPage.value + 1); i++) {
      pages.push(i)
    }
    if (currentPage.value < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

const statusBadgeClass = (status) => {
  const base = 'inline-flex px-2 py-0.5 text-2xs font-medium rounded-full capitalize'
  switch (status) {
    case 'active': return `${base} bg-emerald-50 text-emerald-700`
    case 'inactive': return `${base} bg-gray-100 text-gray-500`
    case 'terminated': return `${base} bg-red-50 text-red-600`
    case 'on-leave': return `${base} bg-amber-50 text-amber-700`
    default: return `${base} bg-blue-50 text-blue-700`
  }
}

let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadEmployees()
  }, 200)
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

const viewEmployee = (id) => router.push(`/employees/${id}`)
const editEmployee = (id) => router.push(`/employees/${id}/edit`)

const confirmDelete = (emp) => {
  selectedEmployee.value = emp
  showDeleteDialog.value = true
}

const deleteEmployee = async () => {
  try {
    await employeeService.delete(selectedEmployee.value.id)
    notificationStore.showNotification('Employee archived', 'success')
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