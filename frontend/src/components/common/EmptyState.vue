<template>
  <div class="text-center py-12">
    <div class="text-4xl mb-4">📭</div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">No data found</h3>
    <p class="text-gray-500">{{ message || 'There are no items to display.' }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>