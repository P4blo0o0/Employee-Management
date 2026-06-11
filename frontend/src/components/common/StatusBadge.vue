<template>
  <span :class="badgeClass">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: String
})

const badgeClass = computed(() => {
  const base = 'px-2 py-1 text-xs font-medium rounded-full'
  
  switch (props.status) {
    case 'active':
      return `${base} bg-green-100 text-green-800`
    case 'inactive':
      return `${base} bg-gray-100 text-gray-800`
    case 'terminated':
      return `${base} bg-red-100 text-red-800`
    case 'on-leave':
      return `${base} bg-yellow-100 text-yellow-800`
    case 'suspended':
      return `${base} bg-orange-100 text-orange-800`
    default:
      return `${base} bg-blue-100 text-blue-800`
  }
})
</script>