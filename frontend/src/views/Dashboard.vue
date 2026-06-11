<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="text-3xl mr-4">👥</div>
          <div>
            <p class="text-sm text-gray-600">Total Employees</p>
            <p class="text-2xl font-bold">{{ stats?.total_employees || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="text-3xl mr-4">✅</div>
          <div>
            <p class="text-sm text-gray-600">Active Employees</p>
            <p class="text-2xl font-bold text-green-600">{{ stats?.active_employees || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="text-3xl mr-4">🏢</div>
          <div>
            <p class="text-sm text-gray-600">Departments</p>
            <p class="text-2xl font-bold">{{ stats?.total_departments || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="text-3xl mr-4">💰</div>
          <div>
            <p class="text-sm text-gray-600">Avg Salary</p>
            <p class="text-2xl font-bold">{{ formatCurrency(stats?.average_salary) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link to="/employees/create" class="btn-primary text-center">
          + Add New Employee
        </router-link>
        <router-link to="/departments" class="btn-secondary text-center">
          Manage Departments
        </router-link>
        <router-link to="/positions" class="btn-secondary text-center">
          Manage Positions
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import employeeService from '../api/employeeService'

const stats = ref(null)

const formatCurrency = (amount) => {
  if (!amount) return '₱0'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(amount)
}

onMounted(async () => {
  try {
    const response = await employeeService.getStats()
    stats.value = response.data.stats
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>