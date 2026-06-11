<template>
  <div class="card">
    <div v-if="loading" class="p-6">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="employees.length === 0" class="p-6">
      <EmptyState message="No employees found. Try adjusting your search or add a new employee." />
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
              {{ employee.employee_code }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ employee.first_name }} {{ employee.last_name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ employee.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ employee.department_name || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ employee.position_title || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge :status="employee.employment_status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                @click="$emit('view', employee.id)"
                class="text-primary-600 hover:text-primary-900"
              >
                View
              </button>
              <button
                @click="$emit('edit', employee.id)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', employee)"
                class="text-red-600 hover:text-red-900"
              >
                Archive
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '../common/LoadingSpinner.vue'
import EmptyState from '../common/EmptyState.vue'
import StatusBadge from '../common/StatusBadge.vue'

defineProps({
  employees: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

defineEmits(['view', 'edit', 'delete'])
</script>