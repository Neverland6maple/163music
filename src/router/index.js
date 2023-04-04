import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    name:'Index',
    path:'/',
    component:()=>import('@/components/Index.vue'),
    children:[{
      path:'',
      component:()=>import('@/components/index/homepage/Homepage.vue')
    },]
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
    },]
  },{
    name:'Album',
    path:'/album/:albumId',
    component:()=>import('@/components/album/index.vue')
  },{
    name:'Playlist',
    path:'/Playlist/:playlistId',
    component:()=>import('@/components/playlist/index.vue')
  },{
    name:'User',
    path:'/u/:userId',
    component:()=>import('@/components/user/index.vue')
  },{
    name:'Artist',
    path:'/artist/:artistId',
    component:()=>import('@/components/ar/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
