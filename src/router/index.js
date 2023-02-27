import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    name:'Index',
    path:'/',
    component:()=>import('@/components/Index.vue')
    
  },{
    name:'Likes',
    path:'/likes',
    component:()=>import('@/components/likes/index.vue')
  },{
    name:'Search',
    path:'/search',
    component:()=>import('@/components/Search.vue'),
    children:[{
      path:'',
      component:()=>import('@/components/search/SongPage.vue')
    },{
      path:'singer',
      component:()=>import('@/components/test2.vue')
    },]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
