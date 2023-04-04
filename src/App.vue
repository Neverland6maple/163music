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
        <a-layout-sider width="200">
          <mySlider></mySlider>
        </a-layout-sider>

        <!-- content -->
        <a-layout-content>
          <Suspense>
              <router-view></router-view>
          </Suspense>
        </a-layout-content>

        <Suspense><Login v-if="loginShow"></Login></Suspense>
        <PlayerPage></PlayerPage>
        <SongList v-if="slider === 1"></SongList>
     
      </a-layout>

      <!-- footer -->
      <a-layout-footer><myFooter :skipTime="skipTime" a="1"></myFooter></a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
import mySlider from '@/components/Slider.vue'
import myHeader from '@/components/Header.vue'
import myFooter from '@/components/Footer.vue'
import {provide, ref} from 'vue'
import {useStore} from 'vuex'
import { computed } from '@vue/reactivity'
import PlayerPage from './components/PlayerPage.vue'
import SongList from '@/components/songList/SongList.vue'
import Login from '@/components/Login.vue'
export default {
  components:{ mySlider, myHeader, myFooter, PlayerPage , SongList , Login ,  },
  setup(){
    const store = useStore();
    const slider = computed(()=>store.state.slider);
    const isSpreading = computed(()=>store.state.isSpreading);
    const skipTime = ref(0);
    const setSkipTime = (value)=>{
      skipTime.value = value;
    }
    provide('setSkipTime',setSkipTime);
    const loginShow = computed(()=>store.state.loginShow);
    return {
      isSpreading,
      slider,
      skipTime,
      loginShow,
    }
  }
}
</script>
<style lang="less" scoped>

</style>
