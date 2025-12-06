import { createRouter, createWebHistory } from 'vue-router'
import Dashbord from './components/page/Dashbord.vue'
import Room from './components/page/RoomManagement.vue'
// import AboutPage from '../components/AboutPage.vue';
// import TopBar from '../components/share/TopBar.vue';
// import BottomBar from '../components/share/BottomBar.vue';


const routes = [
  { path: '/', component: Dashbord },
  { path: '/room', component:  Room},
//   { path: '/topbar', component: TopBar },
//   { path: '/bottombar', component: BottomBar },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;