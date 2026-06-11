<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <router-link to="/employees" class="text-primary-600 hover:text-primary-900">
        ← Back to Employees
      </router-link>
      <h2 class="text-2xl font-bold text-gray-900 mt-2">Add New Employee</h2>
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
    notificationStore.showNotification('Employee created successfully', 'success')
    router.push('/employees')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create employee'
    notificationStore.showNotification(message, 'error')
  }
}
</script>