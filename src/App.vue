<template>
  <div id="music">
    <a-layout>
      <Suspense>
        <a-layout-header><myHeader></myHeader></a-layout-header>
      </Suspense>
      <a-layout>
        <a-layout-sider width="200">
          <mySlider></mySlider>
        </a-layout-sider>
        <a-layout-content>
          <router-view></router-view>
        </a-layout-content>
        <PlayerPage></PlayerPage>
        <SongList v-if="slider === 1"></SongList>
      </a-layout>
      <a-layout-footer>
        <myFooter :skipTime="skipTime" a="1"></myFooter>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
import mySlider from '@/components/Slider.vue'
import myHeader from '@/components/Header.vue'
import myFooter from '@/components/Footer.vue'
import {provide,ref} from 'vue'
import {useStore} from 'vuex'
import { computed } from '@vue/reactivity'
import PlayerPage from './components/PlayerPage.vue'
import SongList from '@/components/songList/SongList.vue'
export default {
  components:{ mySlider, myHeader, myFooter, PlayerPage , SongList  },
  setup(){
    const store = useStore();
    const slider = computed(()=>store.state.slider);
    const isSpreading = computed(()=>store.state.isSpreading);
    const skipTime = ref(0);
    const setSkipTime = (v)=>{
      skipTime.value = v;
    }
    provide('setSkipTime',setSkipTime);
    return {
      isSpreading,
      slider,
      skipTime,
    }
  }
}
</script>
<style lang="less" scoped>

</style>
