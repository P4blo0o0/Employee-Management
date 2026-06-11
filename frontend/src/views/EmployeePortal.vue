<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h2 class="text-2xl font-bold">My Portal</h2>
    
    <div v-if="authStore.user" class="card p-6">
      <h3 class="text-lg font-medium mb-4">Welcome, {{ authStore.user.first_name || authStore.user.username }}!</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500">Username</label>
          <p class="font-medium">{{ authStore.user.username }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">Role</label>
          <p class="font-medium capitalize">{{ authStore.user.role }}</p>
        </div>
        <div v-if="authStore.user.employee_code">
          <label class="text-sm text-gray-500">Employee Code</label>
          <p class="font-medium font-mono">{{ authStore.user.employee_code }}</p>
        </div>
        <div v-if="authStore.user.department_name">
          <label class="text-sm text-gray-500">Department</label>
          <p class="font-medium">{{ authStore.user.department_name }}</p>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Quick Info</h3>
      <p class="text-gray-600">Employee self-service portal - more features coming soon!</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
</script>