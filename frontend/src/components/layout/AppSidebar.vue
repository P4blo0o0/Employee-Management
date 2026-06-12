<template>
  <aside class="w-56 bg-gray-50 border-r border-gray-100 flex flex-col flex-shrink-0">
    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <!-- Section Label -->
      <div class="px-3 py-2">
        <p class="text-2xs font-semibold text-gray-400 uppercase tracking-widest">
          {{ authStore.isAdmin ? 'Management' : 'Portal' }}
        </p>
      </div>

      <!-- Admin Links -->
      <template v-if="authStore.isAdmin">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/employees" class="nav-item" :class="{ active: $route.path.startsWith('/employees') }">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span>Employees</span>
        </router-link>

        <router-link to="/departments" class="nav-item" :class="{ active: $route.path === '/departments' }">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Departments</span>
        </router-link>

        <router-link to="/positions" class="nav-item" :class="{ active: $route.path === '/positions' }">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Positions</span>
        </router-link>
      </template>

      <!-- Employee Link -->
      <template v-if="!authStore.isAdmin">
        <router-link to="/employee/portal" class="nav-item" :class="{ active: $route.path === '/employee/portal' }">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>My Portal</span>
        </router-link>
      </template>
    </nav>

    <!-- Footer -->
    <div class="px-3 py-3 border-t border-gray-100">
      <div class="flex items-center space-x-2 px-3 py-2">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
        <span class="text-2xs text-gray-400">System online</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()
</script>

<style scoped>
.nav-item {
  @apply flex items-center space-x-2.5 px-3 py-2 text-sm text-gray-500 rounded-md 
         hover:bg-gray-100 hover:text-gray-900 transition-all duration-100;
}
.nav-item.active {
  @apply bg-white text-gray-900 border border-gray-100 font-medium;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}
</style>