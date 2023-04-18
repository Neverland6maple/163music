<template>
  <div id="music">
    <a-layout>
       <!-- header -->
      <Suspense>
        <a-layout-header><myHeader></myHeader></a-layout-header>
      </Suspense>
      
         <!-- body -->
        <a-layout>

          <!-- sider -->
          <a-layout-sider v-if="isCover === false" width="200">
            <mySlider></mySlider>
          </a-layout-sider>

          <!-- content -->
          <a-layout-content>
            <Suspense>
                <router-view></router-view>
            </Suspense>
          </a-layout-content>

          <Suspense><Login v-if="loginShow"></Login></Suspense>
          <PlayerPage v-if="isCover === false" @showScrollToTop="showScrollToTop" ref="playerPageRef"></PlayerPage>
          <SongList v-if="slider === 1"></SongList>
          <Msg v-else-if="slider === 2"></Msg>
          <div class="commentBox" v-if="isSpreading" @click="showCommentBox">快来说点什么吧</div>
          <div :class="{'toTop':true,'hide':!scrollToTop}" @click="scrollToTopFn" v-if="isSpreading"><VerticalAlignTopOutlined /></div>
        </a-layout>

        <!-- footer -->
        <a-layout-footer v-if="isCover === false"><myFooter :skipTime="skipTime" a="1"></myFooter></a-layout-footer>
    </a-layout>
    <TableMenu></TableMenu>
  </div>
</template>
<script>
import mySlider from '@/components/Slider.vue'
import myHeader from '@/components/Header.vue'
import myFooter from '@/components/Footer.vue'
import {getCurrentInstance, provide, ref} from 'vue'
import {useStore} from 'vuex'
import { computed } from '@vue/reactivity'
import PlayerPage from './components/PlayerPage.vue'
import SongList from '@/components/songList/SongList.vue'
import Login from '@/components/Login.vue'
import Msg from './components/Msg.vue'
import TableMenu from './components/unit/TableMenu.vue'
import { VerticalAlignTopOutlined} from '@ant-design/icons-vue'
export default {
  components:{ mySlider, myHeader, myFooter, PlayerPage , SongList , Login , VerticalAlignTopOutlined ,Msg,TableMenu },
  setup(){
    const store = useStore();
    const slider = computed(()=>store.state.slider);
    const isSpreading = computed(()=>store.state.isSpreading);
    const skipTime = ref(0);
    const isCover = computed(()=>store.state.isCover);
    const {proxy:{$axios}} = getCurrentInstance();
    const profile = computed(()=>store.state.user.profile);
    const scrollToTop = ref(false);
    const playerPageRef = ref(null);
    const setSkipTime = (value)=>{
      skipTime.value = value;
    }
    provide('setSkipTime',setSkipTime);
    const loginShow = computed(()=>store.state.loginShow);
    const getLikes = async (id)=>{
        const {data:res} = await $axios({
            method:'get',
            url:`/api/likelist?uid=${id}&timestamp=${Date.now()}`
        })
        store.commit('user/setLikelist',res.ids);
    }
    const showScrollToTop = (show)=>{
      scrollToTop.value = show;
    }
    const scrollToTopFn = ()=>{
      playerPageRef.value.scrollToTop();
    }
    const showCommentBox = ()=>{
      playerPageRef.value.showCommentBox(true);
    }
    getLikes(profile.value.userId);
    return {
      isSpreading,
      slider,
      skipTime,
      loginShow,
      isCover,
      showScrollToTop,
      scrollToTop,
      scrollToTopFn,
      playerPageRef,
      showCommentBox,
    }
  },
}
</script>
<style lang="less" scoped>
.commentBox{
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 135px;
  height: 35px;
  border-radius: 17px;
  background-color: #3e3e3e;
  color: #d8d8d8;
  line-height: 35px;
  font-size: 12px;
  transform: translateX(-50%);
  z-index: 999;
  cursor: pointer;
  transition: all .5s;
  &:hover{
    background-color: #505050;
  }
}
.toTop{
  position: absolute;
  bottom:10px;
  right: 15%;
  width: 44px;
  height: 44px;
  border-radius:50%;
  background-color: #3e3e3e;
  color: #d8d8d8;
  line-height: 44px;
  font-size: 20px;
  z-index: 999;
  cursor: pointer;
  transition: all .5s;
  &:hover{
    background-color: #505050;
  }
  &.hide{
    transform: translateX(-80px);
    opacity: 0;
  }
}
</style>
