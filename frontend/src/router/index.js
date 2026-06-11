import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/employees',
    name: 'EmployeeList',
    component: () => import('../views/EmployeeList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/employees/create',
    name: 'EmployeeCreate',
    component: () => import('../views/EmployeeCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/employees/:id',
    name: 'EmployeeView',
    component: () => import('../views/EmployeeView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/employees/:id/edit',
    name: 'EmployeeEdit',
    component: () => import('../views/EmployeeEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/departments',
    name: 'DepartmentList',
    component: () => import('../views/DepartmentList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/positions',
    name: 'PositionList',
    component: () => import('../views/PositionList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/employee/portal',
    name: 'EmployeePortal',
    component: () => import('../views/EmployeePortal.vue'),
    meta: { requiresAuth: true, requiresEmployee: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage
  if (!authStore.user) {
    authStore.initialize()
  }

  // Protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // Guest only routes (like login)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  }
  // Admin only routes
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/employee/portal')
  }
  // Employee only routes
  else if (to.meta.requiresEmployee && authStore.isAdmin) {
    next('/')
  }
  else {
    next()
  }
})

export default router