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
      </a-layout>
      <a-layout-footer>
        <myFooter id="myFooter"></myFooter>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
import mySlider from '@/components/Slider.vue'
import myHeader from '@/components/Header.vue'
import myFooter from '@/components/Footer.vue'

export default {
  components:{mySlider,myHeader},
  setup(){
    
  }
}
</script>
<style lang="less">
</style>
