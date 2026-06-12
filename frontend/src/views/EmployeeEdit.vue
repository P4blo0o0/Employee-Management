<template>
  <div class="max-w-3xl">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>

    <div v-else>
      <!-- Back + Header -->
      <div class="mb-8">
        <router-link 
          :to="`/employees/${id}`" 
          class="inline-flex items-center text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Employee
        </router-link>
        <h1 class="text-xl font-semibold text-gray-900">Edit Employee</h1>
        <p class="text-sm text-gray-500 mt-1">Update employee information</p>
      </div>

      <EmployeeForm
        :initial-data="employee"
        submit-text="Save Changes"
        @submit="updateEmployee"
        @cancel="router.push(`/employees/${id}`)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmployeeForm from '../components/employees/EmployeeForm.vue'
import employeeService from '../api/employeeService'
import { useNotificationStore } from '../stores/notificationStore'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const id = route.params.id
const employee = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await employeeService.getById(id)
    employee.value = response.data
  } catch (error) {
    notificationStore.showNotification('Failed to load employee', 'error')
    router.push('/employees')
  } finally {
    loading.value = false
  }
})

const updateEmployee = async (formData) => {
  try {
    await employeeService.update(id, formData)
    notificationStore.showNotification('Employee updated', 'success')
    router.push(`/employees/${id}`)
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update employee'
    notificationStore.showNotification(message, 'error')
  }
}
</script>