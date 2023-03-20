import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    name:'Index',
    path:'/',
    component:()=>import('@/components/Index.vue'),
    children:[{
      path:'',
      component:()=>import('@/components/index/homepage/Homepage.vue')
    },{
      path:'test',
      component:()=>import('@/components/test.vue')
    }]
    
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
  },{
    name:'Album',
    path:'/album/:albumId',
    component:()=>import('@/components/album/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
