import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'customers',
          name: 'Customers',
          component: () => import('../views/CustomersView.vue'),
        },
        {
          path: 'buildings',
          name: 'Buildings',
          component: () => import('../views/BuildingsView.vue'),
        },
        {
          path: 'rooms/:id',
          name: 'RoomDetail',
          component: () => import('../views/RoomDetailView.vue'),
        },
        {
          path: 'bills',
          name: 'Bills',
          component: () => import('../views/BillsView.vue'),
        },
        {
          path: 'messages',
          name: 'Messages',
          component: () => import('../views/MessagesView.vue'),
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/ProfileView.vue'),
        },
        {
          path: 'financial-settings',
          name: 'FinancialSettings',
          component: () => import('../views/FinancialSettingsView.vue'),
        },
        {
          path: 'change-password',
          name: 'ChangePassword',
          component: () => import('../views/ChangePasswordView.vue'),
        },
      ],
    },
  ],
})

export default router
