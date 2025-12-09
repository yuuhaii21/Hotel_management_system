import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../components/page/Dashbord.vue'
import Rooms from '../components/page/RoomManagement.vue'
import Bookings from '../components/page/Bookings.vue'
import Customers from '../components/page/Customer.vue'
import Settings from '../components/page/settings.vue'

const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/rooms', name: 'rooms', component: Rooms },
  { path: '/bookings', name: 'bookings', component: Bookings },
  { path: '/customers', name: 'customers', component: Customers },
  { path: '/settings', name: 'settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
