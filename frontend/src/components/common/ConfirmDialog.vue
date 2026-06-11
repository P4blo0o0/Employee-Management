<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-black opacity-30" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-medium mb-4">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        
        <div class="flex justify-end space-x-3">
          <button @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button @click="$emit('confirm')" class="btn-danger">
            {{ confirmText || 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: String
})

defineEmits(['close', 'confirm'])
</script>