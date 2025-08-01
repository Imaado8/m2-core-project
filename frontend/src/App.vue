<template>
  <div :class="['app-wrapper', { 'sidebar-open': !isCollapsed }]">
    <SideBar v-if="showSidebar" @toggle="isCollapsed = $event" />
    <div id="app-content" class="flex-grow-1 p-4">
      <router-view :sidebar-collapsed="isCollapsed" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import SideBar from './components/SideBar.vue'

const route = useRoute()
const isCollapsed = ref(false)
const showSidebar = computed(() => route.path !== '/login')


</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
/* template{
  background: linear-gradient(to right, #007bff, #0056b3);
  max-width: 100%;
} */

.app-wrapper {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  min-height: 100vh;
  transition: padding-left 0.3s ease;
  width: 100%;
}


#app-content {
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

body, html {
  /* overflow: hidden; */
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  display: flex;
  overflow: hidden;
}
</style>
