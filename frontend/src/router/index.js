import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import AttendanceView from '@/views/AttendanceView.vue'
import EmployeesView from '@/views/EmployeesView.vue'
import PerformanceView from '@/views/PerformanceView.vue'
import PayrollView from '@/views/PayrollView.vue'
import LeaveView from '@/views/LeaveRequestsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: AttendanceView
  },
  {
    path: '/payroll',
    name: 'payroll',
    component: PayrollView
  },
  {
    path: '/leave',
    name: 'leave',
    component: LeaveView
  },
  {
    path: '/performance',
    name: 'performance',
    component: PerformanceView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
  path: '/employees',
  name: 'Employees',
  component: EmployeesView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.name !== 'login' && !isLoggedIn) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isLoggedIn) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
