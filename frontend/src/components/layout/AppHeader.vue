<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold text-gray-900">
          HR Management System
        </h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="text-sm text-gray-600">
          Welcome, {{ authStore.user?.username || 'Admin' }}
        </div>
        <button @click="handleLogout" class="btn-secondary text-sm">
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>