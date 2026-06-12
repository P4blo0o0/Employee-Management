<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Overview of your workforce</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Employees -->
      <div class="card-hover p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Employees</p>
            <p class="text-2xl font-semibold text-gray-900 mt-2">{{ stats?.total_employees || 0 }}</p>
          </div>
          <div class="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">All departments</p>
      </div>

      <!-- Active -->
      <div class="card-hover p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Active</p>
            <p class="text-2xl font-semibold text-emerald-600 mt-2">{{ stats?.active_employees || 0 }}</p>
          </div>
          <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Currently employed</p>
      </div>

      <!-- Departments -->
      <div class="card-hover p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Departments</p>
            <p class="text-2xl font-semibold text-gray-900 mt-2">{{ stats?.total_departments || 0 }}</p>
          </div>
          <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Across organization</p>
      </div>

      <!-- Avg Salary -->
      <div class="card-hover p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Avg Salary</p>
            <p class="text-2xl font-semibold text-gray-900 mt-2">{{ formatCurrency(stats?.average_salary) }}</p>
          </div>
          <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Monthly average</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card p-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div class="flex flex-wrap gap-3">
        <router-link to="/employees/create" class="btn-primary text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </router-link>
        <router-link to="/employees" class="btn-secondary text-sm">
          View All Employees
        </router-link>
        <router-link to="/departments" class="btn-ghost text-sm">
          Manage Departments
        </router-link>
      </div>
    </div>

    <!-- Department Distribution -->
    <div class="card p-6" v-if="distribution?.length">
      <h3 class="text-sm font-semibold text-gray-900 mb-4">Department Distribution</h3>
      <div class="space-y-3">
        <div v-for="dept in distribution" :key="dept.name" class="flex items-center justify-between">
          <div class="flex items-center space-x-3 flex-1">
            <div class="w-2 h-2 rounded-full bg-gray-300"></div>
            <span class="text-sm text-gray-600">{{ dept.name || 'Unassigned' }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gray-400 rounded-full transition-all duration-500"
                :style="{ width: getPercentage(dept.count) + '%' }"
              ></div>
            </div>
            <span class="text-sm text-gray-500 w-8 text-right">{{ dept.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import employeeService from '../api/employeeService'

const stats = ref(null)
const distribution = ref([])

const formatCurrency = (amount) => {
  if (!amount) return '₱0'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getPercentage = (count) => {
  if (!distribution.value.length) return 0
  const max = Math.max(...distribution.value.map(d => d.count))
  return max > 0 ? (count / max) * 100 : 0
}

onMounted(async () => {
  try {
    const response = await employeeService.getStats()
    stats.value = response.data.stats
    distribution.value = response.data.departmentDistribution || []
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>