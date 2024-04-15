import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'
import Manage from "@/views/Manage.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '../views/Manage.vue'),
    redirect:"/home",
    children:[
      { path:'home', name:'借阅信息', component:()=>import('../views/Home.vue')},
      { path:'reservation', name:'我的借阅', component:()=>import('../views/Reservation.vue')},
      { path:'user', name:'借阅管理', component:()=>import('../views/User.vue')},
      { path:'person', name:'个人信息', component:()=>import('../views/Person.vue')},
      { path:'room', name:'会议室管理', component:()=>import('../views/Room.vue')}
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name:'Login',
    component:()=>import('../views/Login.vue')
  },{
    path: '/register',
    name:'Register',
    component:()=>import('../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  localStorage.setItem("currentPathName",to.name)//设置当前的路由
  next()
})

export default router
