import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
const routes = [
  {
    name:'Index',
    path:'/',
    component:()=>import('@/components/Index.vue'),
    children:[{
      path:'',
      component:()=>import('@/components/index/homepage/Homepage.vue')
    },],
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
    component:()=>import('@/components/playlist/index.vue'),
    props:route => ({like:route.query.like})
  },{
    name:'User',
    path:'/u/:userId',
    component:()=>import('@/components/user/index.vue')
  },{
    name:'Artist',
    path:'/artist/:artistId',
    component:()=>import('@/components/ar/index.vue')
  },{
    name:'Mv',
    path:'/mv/:mvId',
    component:()=>import('@/components/mv/index.vue'),
  },{
    path:'/test',
    component:()=>import('@/components/test.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to,from,next)=>{
  if(to.name === 'Mv'){
    store.commit('changeIsCover',true);
  }
  store.commit('changeIsSpreading',false);
  next();
})
export default router
