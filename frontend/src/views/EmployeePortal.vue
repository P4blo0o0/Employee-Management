<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">My Portal</h1>
      <p class="text-sm text-gray-500 mt-1">Welcome back{{ authStore.user?.first_name ? ', ' + authStore.user.first_name : '' }}</p>
    </div>

    <div class="card p-6" v-if="authStore.user">
      <div class="flex items-start space-x-4 mb-6">
        <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <span class="text-lg font-semibold text-gray-400">
            {{ authStore.user.username?.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-900">{{ authStore.user.username }}</h3>
          <p class="text-xs text-gray-400 capitalize">{{ authStore.user.role }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div v-if="authStore.user.employee_code">
          <p class="text-2xs text-gray-400">Employee Code</p>
          <p class="text-sm text-gray-900 mt-0.5 font-mono">{{ authStore.user.employee_code }}</p>
        </div>
        <div v-if="authStore.user.department_name">
          <p class="text-2xs text-gray-400">Department</p>
          <p class="text-sm text-gray-900 mt-0.5">{{ authStore.user.department_name }}</p>
        </div>
        <div v-if="authStore.user.position_title">
          <p class="text-2xs text-gray-400">Position</p>
          <p class="text-sm text-gray-900 mt-0.5">{{ authStore.user.position_title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
const authStore = useAuthStore()
</script>