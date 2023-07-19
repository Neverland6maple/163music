<template>
    <div id="homepage">
        <div class="main">
            <Carousel :images="images"></Carousel>
        </div>
        <img src="@/assets/test150.png" alt="">
        <img :src="test400" alt="">
    </div>
</template>
<script setup>
import { getCurrentInstance , ref,computed, reactive, watch} from 'vue';
import Carousel from '@/components/index/homepage/Carousel.vue'
import { useStore } from 'vuex';
const {proxy:{$axios}} = getCurrentInstance();
const images = ref([]);
const store = useStore();
const islogin = computed(()=>store.getters['user/islogin']);
const profile = computed(()=>store.state.user.profile);
const blocks = ref([]);
const banners = ref([]);
const test400 = ref(require('@/assets/test400.png'))
const getBlocks = async ()=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/homepage/block/page`,
    });
    blocks.value= res.data.blocks;
    banners.value = blocks.value[0].extInfo.banners;
    images.value = [];
    banners.value.forEach(item => {
        images.value.push({
        id:item.bannerId,
        pic:item.pic,
        typeTitle:item.typeTitle,
        url:item.url,
        song:item.song,
        targetType:item.targetType,
        targetId:item.targetId})
    });
}
getBlocks();
</script>
<style lang="less" scoped>
#homepage{
    width: 100%;
    position: relative;
    box-sizing: border-box;
    .main{
        position: relative;
        width: 92%;
        max-width: 1100px;
        margin: 0 auto;
    }
}
</style>