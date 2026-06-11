<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="employee">
      <!-- Header -->
      <div class="mb-6">
        <router-link to="/employees" class="text-primary-600 hover:text-primary-900">
          ← Back to Employees
        </router-link>
        <div class="flex justify-between items-center mt-2">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ employee.first_name }} {{ employee.last_name }}
          </h2>
          <div class="space-x-2">
            <router-link
              :to="`/employees/${employee.id}/edit`"
              class="btn-primary"
            >
              Edit
            </router-link>
            <button @click="archiveEmployee" class="btn-danger">
              Archive
            </button>
          </div>
        </div>
      </div>

      <!-- Employee Details -->
      <div class="space-y-6">
        <!-- Basic Info -->
        <div class="card p-6">
          <h3 class="text-lg font-medium mb-4">Basic Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">Employee Code</label>
              <p class="font-mono">{{ employee.employee_code }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Full Name</label>
              <p>{{ employee.first_name }} {{ employee.middle_name }} {{ employee.last_name }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Email</label>
              <p>{{ employee.email }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Phone</label>
              <p>{{ employee.phone || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Status</label>
              <StatusBadge :status="employee.employment_status" />
            </div>
          </div>
        </div>

        <!-- Employment Info -->
        <div class="card p-6">
          <h3 class="text-lg font-medium mb-4">Employment Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">Department</label>
              <p>{{ employee.department_name || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Position</label>
              <p>{{ employee.position_title || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Hire Date</label>
              <p>{{ formatDate(employee.hire_date) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Employment Type</label>
              <p>{{ employee.employment_type }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Salary</label>
              <p>{{ formatCurrency(employee.salary) }}</p>
            </div>
          </div>
        </div>

        <!-- Government IDs -->
        <div class="card p-6" v-if="hasGovernmentIds">
          <h3 class="text-lg font-medium mb-4">Government IDs</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-if="employee.sss_number">
              <label class="text-sm text-gray-500">SSS Number</label>
              <p>{{ employee.sss_number }}</p>
            </div>
            <div v-if="employee.philhealth_number">
              <label class="text-sm text-gray-500">PhilHealth Number</label>
              <p>{{ employee.philhealth_number }}</p>
            </div>
            <div v-if="employee.pagibig_number">
              <label class="text-sm text-gray-500">Pag-IBIG Number</label>
              <p>{{ employee.pagibig_number }}</p>
            </div>
            <div v-if="employee.tin_number">
              <label class="text-sm text-gray-500">TIN Number</label>
              <p>{{ employee.tin_number }}</p>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="card p-6" v-if="employee.emergency_contact_name">
          <h3 class="text-lg font-medium mb-4">Emergency Contact</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="text-sm text-gray-500">Name</label>
              <p>{{ employee.emergency_contact_name }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Relationship</label>
              <p>{{ employee.emergency_contact_relationship || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Phone</label>
              <p>{{ employee.emergency_contact_phone || '-' }}</p>
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
import StatusBadge from '../components/common/StatusBadge.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
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
  return sss_number || philhealth_number || pagibig_number || tin_number
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}

onMounted(async () => {
  try {
    const response = await employeeService.getById(route.params.id)
    employee.value = response.data
  } catch (error) {
    notificationStore.showNotification('Failed to load employee', 'error')
    router.push('/employees')
  } finally {
    loading.value = false
  }
})

const archiveEmployee = async () => {
  if (confirm('Are you sure you want to archive this employee?')) {
    try {
      await employeeService.delete(employee.value.id)
      notificationStore.showNotification('Employee archived successfully', 'success')
      router.push('/employees')
    } catch (error) {
      notificationStore.showNotification('Failed to archive employee', 'error')
    }
  }
}
</script>