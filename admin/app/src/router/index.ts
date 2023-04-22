import { createRouter, createWebHashHistory } from 'vue-router'
import Settings from '../pages/Settings.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      alias: '/settings',
      component: Settings,
    },
  ],
})

export default router
