<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gray-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950"></div>
      
      <!-- Decorative grid -->
      <div class="absolute inset-0 opacity-[0.03]"
           style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 40px 40px;">
      </div>
      
      <div class="relative flex flex-col justify-center px-16">
        <div class="space-y-6">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span class="text-gray-900 font-bold text-sm">HR</span>
            </div>
            <span class="text-white/60 text-sm font-medium tracking-wide">Workforce</span>
          </div>
          
          <h1 class="text-4xl font-bold text-white tracking-tight leading-tight">
            Manage your team<br>with clarity
          </h1>
          <p class="text-lg text-white/40 max-w-md leading-relaxed">
            Streamline employee management, track attendance, and handle payroll — all in one place.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8 flex items-center space-x-2">
          <div class="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
            <span class="text-white font-bold text-xs">HR</span>
          </div>
          <span class="text-sm font-medium text-gray-500">Workforce</span>
        </div>

        <div class="space-y-2 mb-8">
          <h2 class="text-xl font-semibold text-gray-900">Sign in</h2>
          <p class="text-sm text-gray-500">Enter your credentials to continue</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="label">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="input"
              placeholder="Enter your username"
              autocomplete="username"
            />
          </div>

          <div>
            <label for="password" class="label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full mt-2"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-1 border-t border-gray-100"></div>
          <span class="px-3 text-xs text-gray-400 font-medium">DEMO CREDENTIALS</span>
          <div class="flex-1 border-t border-gray-100"></div>
        </div>

        <!-- Demo Cards -->
        <div class="space-y-2">
          <button
            @click="fillCredentials('admin', 'admin123')"
            class="w-full p-3 text-left border border-gray-100 rounded-md hover:border-gray-200 hover:bg-gray-50 transition-all duration-150 group"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">Admin Account</p>
                <p class="text-xs text-gray-400 mt-0.5">Full access to all features</p>
              </div>
              <span class="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
            </div>
          </button>
          
          <button
            @click="fillCredentials('juan.delacruz', 'employee123')"
            class="w-full p-3 text-left border border-gray-100 rounded-md hover:border-gray-200 hover:bg-gray-50 transition-all duration-150 group"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">Employee Account</p>
                <p class="text-xs text-gray-400 mt-0.5">Limited self-service portal</p>
              </div>
              <span class="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const fillCredentials = (user, pass) => {
  username.value = user
  password.value = pass
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.login(username.value, password.value)

  if (result.success) {
    if (authStore.isAdmin) {
      router.push('/')
    } else {
      router.push('/employee/portal')
    }
  } else {
    error.value = result.message
  }

  loading.value = false
}
</script>