<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-full">
    <nav class="mt-6 px-4">
      <div class="space-y-1">
        <!-- Admin Links -->
        <template v-if="authStore.isAdmin">
          <router-link
            to="/"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path === '/' }"
          >
            <span class="text-lg mr-3">📊</span>
            Dashboard
          </router-link>
          
          <router-link
            to="/employees"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/employees') }"
          >
            <span class="text-lg mr-3">👥</span>
            Employees
          </router-link>
          
          <router-link
            to="/departments"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/departments') }"
          >
            <span class="text-lg mr-3">🏢</span>
            Departments
          </router-link>
          
          <router-link
            to="/positions"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/positions') }"
          >
            <span class="text-lg mr-3">💼</span>
            Positions
          </router-link>
        </template>

        <!-- Employee Links -->
        <template v-if="!authStore.isAdmin">
          <router-link
            to="/employee/portal"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path === '/employee/portal' }"
          >
            <span class="text-lg mr-3">👤</span>
            My Portal
          </router-link>
        </template>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()
</script>