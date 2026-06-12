<template>
  <div class="max-w-3xl">
    <!-- Back + Header -->
    <div class="mb-8">
      <router-link 
        to="/employees" 
        class="inline-flex items-center text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
        </svg>
        All Employees
      </router-link>
      <h1 class="text-xl font-semibold text-gray-900">Add New Employee</h1>
      <p class="text-sm text-gray-500 mt-1">Fill in the details to create a new employee record</p>
    </div>

    <EmployeeForm
      submit-text="Create Employee"
      @submit="createEmployee"
      @cancel="$router.push('/employees')"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import EmployeeForm from '../components/employees/EmployeeForm.vue'
import employeeService from '../api/employeeService'
import { useNotificationStore } from '../stores/notificationStore'

const router = useRouter()
const notificationStore = useNotificationStore()

const createEmployee = async (formData) => {
  try {
    await employeeService.create(formData)
    notificationStore.showNotification('Employee created', 'success')
    router.push('/employees')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create employee'
    notificationStore.showNotification(message, 'error')
  }
}
</script>