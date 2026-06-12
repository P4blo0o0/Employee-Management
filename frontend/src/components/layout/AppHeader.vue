<template>
  <header class="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
    <!-- Left -->
    <div class="flex items-center space-x-3">
      <div class="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
        <span class="text-white font-bold text-2xs">HR</span>
      </div>
      <span class="text-sm font-medium text-gray-400 hidden sm:inline">Workforce</span>
    </div>

    <!-- Right -->
    <div class="flex items-center space-x-3">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
          <span class="text-2xs font-medium text-gray-500">
            {{ authStore.user?.username?.charAt(0).toUpperCase() || 'A' }}
          </span>
        </div>
        <span class="text-sm text-gray-600 hidden sm:inline">{{ authStore.user?.username || 'Admin' }}</span>
      </div>
      <button @click="handleLogout" class="btn-ghost text-xs !px-2 !py-1">
        Sign out
      </button>
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