<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <div class="text-sm text-gray-700">
      Showing {{ startItem }} to {{ endItem }} of {{ total }} results
    </div>
    
    <div class="flex space-x-2">
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      
      <template v-for="page in displayedPages" :key="page">
        <button
          v-if="page !== '...'"
          @click="$emit('page-change', page)"
          :class="[
            'px-3 py-1 border rounded-md text-sm',
            page === currentPage
              ? 'bg-primary-600 text-white'
              : 'hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 py-1">...</span>
      </template>
      
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  total: Number,
  perPage: Number
})

defineEmits(['page-change'])

const startItem = computed(() => ((props.currentPage - 1) * props.perPage) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.total))

const displayedPages = computed(() => {
  const pages = []
  const total = props.totalPages
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (props.currentPage > 3) pages.push('...')
    
    for (let i = Math.max(2, props.currentPage - 1); i <= Math.min(total - 1, props.currentPage + 1); i++) {
      pages.push(i)
    }
    
    if (props.currentPage < total - 2) pages.push('...')
    pages.push(total)
  }
  
  return pages
})
</script>