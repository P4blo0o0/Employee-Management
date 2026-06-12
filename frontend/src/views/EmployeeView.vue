<template>
  <div class="max-w-3xl">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>

    <div v-else-if="employee">
      <!-- Back + Actions -->
      <div class="flex items-center justify-between mb-8">
        <router-link to="/employees" class="flex items-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
          </svg>
          All Employees
        </router-link>
        <div class="flex space-x-2">
          <router-link :to="`/employees/${employee.id}/edit`" class="btn-secondary text-xs">
            Edit
          </router-link>
          <button @click="archiveEmployee" class="btn-danger text-xs">
            Archive
          </button>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="card p-6 mb-6">
        <div class="flex items-start space-x-4">
          <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span class="text-lg font-semibold text-gray-400">{{ employee.first_name?.charAt(0) }}{{ employee.last_name?.charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-semibold text-gray-900">{{ employee.first_name }} {{ employee.last_name }}</h1>
            <p class="text-sm text-gray-500">{{ employee.position_title || 'No position' }}</p>
            <div class="flex items-center space-x-3 mt-2">
              <span :class="statusBadgeClass(employee.employment_status)">{{ employee.employment_status }}</span>
              <span class="text-xs text-gray-400 font-mono">{{ employee.employee_code }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Sections -->
      <div class="space-y-4">
        <!-- Employment -->
        <div class="card p-5">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Employment Details</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-2xs text-gray-400">Department</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.department_name || '—' }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Position</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.position_title || '—' }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Type</p>
              <p class="text-sm text-gray-900 mt-0.5 capitalize">{{ employee.employment_type || '—' }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Hire Date</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ formatDate(employee.hire_date) }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Salary</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ formatCurrency(employee.salary) }}</p>
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div class="card p-5">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-2xs text-gray-400">Email</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.email || '—' }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Phone</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.phone || '—' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-2xs text-gray-400">Address</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ [employee.address, employee.city, employee.state].filter(Boolean).join(', ') || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Government IDs -->
        <div class="card p-5" v-if="hasGovernmentIds">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Government IDs</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-if="employee.sss_number">
              <p class="text-2xs text-gray-400">SSS</p>
              <p class="text-sm text-gray-900 mt-0.5 font-mono">{{ employee.sss_number }}</p>
            </div>
            <div v-if="employee.philhealth_number">
              <p class="text-2xs text-gray-400">PhilHealth</p>
              <p class="text-sm text-gray-900 mt-0.5 font-mono">{{ employee.philhealth_number }}</p>
            </div>
            <div v-if="employee.pagibig_number">
              <p class="text-2xs text-gray-400">Pag-IBIG</p>
              <p class="text-sm text-gray-900 mt-0.5 font-mono">{{ employee.pagibig_number }}</p>
            </div>
            <div v-if="employee.tin_number">
              <p class="text-2xs text-gray-400">TIN</p>
              <p class="text-sm text-gray-900 mt-0.5 font-mono">{{ employee.tin_number }}</p>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="card p-5" v-if="employee.emergency_contact_name">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Emergency Contact</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-2xs text-gray-400">Name</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.emergency_contact_name }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Relationship</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.emergency_contact_relationship || '—' }}</p>
            </div>
            <div>
              <p class="text-2xs text-gray-400">Phone</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ employee.emergency_contact_phone || '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import employeeService from '../api/employeeService'
import { useNotificationStore } from '../stores/notificationStore'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const employee = ref(null)
const loading = ref(true)

const hasGovernmentIds = computed(() => {
  if (!employee.value) return false
  const { sss_number, philhealth_number, pagibig_number, tin_number } = employee.value
  return !!(sss_number || philhealth_number || pagibig_number || tin_number)
})

const statusBadgeClass = (status) => {
  const base = 'inline-flex px-2 py-0.5 text-2xs font-medium rounded-full capitalize'
  switch (status) {
    case 'active': return `${base} bg-emerald-50 text-emerald-700`
    case 'inactive': return `${base} bg-gray-100 text-gray-500`
    case 'terminated': return `${base} bg-red-50 text-red-600`
    default: return `${base} bg-blue-50 text-blue-700`
  }
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (amount) => {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(amount)
}

const archiveEmployee = async () => {
  if (confirm('Archive this employee?')) {
    try {
      await employeeService.delete(employee.value.id)
      notificationStore.showNotification('Employee archived', 'success')
      router.push('/employees')
    } catch (error) {
      notificationStore.showNotification('Failed to archive', 'error')
    }
  }
}

onMounted(async () => {
  try {
    const response = await employeeService.getById(route.params.id)
    employee.value = response.data
  } catch (error) {
    notificationStore.showNotification('Employee not found', 'error')
    router.push('/employees')
  } finally {
    loading.value = false
  }
})
</script>