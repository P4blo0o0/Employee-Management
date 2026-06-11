<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <div class="mb-6">
        <router-link :to="`/employees/${id}`" class="text-primary-600 hover:text-primary-900">
          ← Back to Employee Details
        </router-link>
        <h2 class="text-2xl font-bold text-gray-900 mt-2">Edit Employee</h2>
      </div>

      <EmployeeForm
        :initial-data="employee"
        submit-text="Update Employee"
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
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
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
    notificationStore.showNotification('Employee updated successfully', 'success')
    router.push(`/employees/${id}`)
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update employee'
    notificationStore.showNotification(message, 'error')
  }
}
</script>