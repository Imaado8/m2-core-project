<template>
  <div>
    <button @click="toggleSidebar" class="toggle-btn" aria-label="Toggle sidebar">
      <span class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <transition name="sidebar">
      <nav :class="['sidebar', { collapsed: isCollapsed }]">
        <div class="sidebar-inner">
          <h4 class="text-center mb-4" v-if="!isCollapsed">ModernTech Solutions</h4>

          <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item" v-for="item in menuItems" :key="item.path">
              <RouterLink
                :to="item.path"
                class="nav-link d-flex align-items-center"
                :class="{ active: isActive(item.path) }"
              >
                <i :class="['bi', item.icon, 'me-2']"></i>
                <span v-if="!isCollapsed">{{ item.label }}</span>
              </RouterLink>
            </li>
          </ul>
          <button @click="logout" class="btn btn-outline-danger mt-4 w-100 d-flex align-items-center justify-content-center">
            <i class="bi bi-box-arrow-right me-2"></i>
            <span v-if="!isCollapsed">Logout</span>
          </button>
        </div>
      </nav>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isCollapsed = ref(true)
const route = useRoute()
const router = useRouter()

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

const menuItems = [
  { path: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/employees', label: 'Employees', icon: 'bi-people-fill' },
  { path: '/payroll', label: 'Payroll', icon: 'bi-currency-dollar' },
  { path: '/leave', label: 'Leave Requests', icon: 'bi-calendar-x-fill' },
  { path: '/attendance', label: 'Attendance', icon: 'bi-clock-fill' },
  { path: '/performance', label: 'Performance', icon: 'bi-graph-up-arrow' },
]

const isActive = (path) => {
  return route.path === path || (path === '/' && route.path === '/dashboard')
}

function logout() {
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>

<style scoped>
.toggle-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  padding: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 1100;
}

.hamburger-icon {
  display: inline-block;
  width: 30px;
  height: 22px;
  position: relative;
}
.hamburger-icon span {
  background-color: #333;
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  border-radius: 2px;
  left: 0;
  transition: all 0.25s ease-in-out;
}
.hamburger-icon span:nth-child(1) { top: 0; }
.hamburger-icon span:nth-child(2) { top: 9px; }
.hamburger-icon span:nth-child(3) { top: 18px; }

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 220px;
  background-color: #fbf9f5;
  border-right: 1px solid #dee2e6;
  padding: 1rem;
  transition: width 0.3s ease;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
  /* color: #333; */
}
.sidebar.collapsed {
  width: 70px;
  padding: 1rem 0.5rem;
}

.sidebar-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  overflow-y: auto;

}

.sidebar.collapsed .nav-link span,
.sidebar.collapsed h4,
.sidebar.collapsed button span {
  display: none;
}

.nav-link {
  background-color: #708090;
  color: white !important;
  font-weight: bold;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.active {
  background-color: #41464a;
  color: white !important;
}

.nav-link.active,
.router-link-active.nav-link {
  background-color: #41464a !important;
  color: white !important;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}
.sidebar.collapsed .nav-link i {
  margin-right: 0 !important;
}

.btn {
  width: 100%;
  transition: all 0.3s ease;
}

.sidebar.collapsed button {
  justify-content: center;
}

</style>
