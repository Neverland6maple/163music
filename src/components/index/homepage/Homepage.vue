<template>
    <div id="homepage">
        <!-- <div class="main">
            <Carousel :images="images"></Carousel>
        </div> -->
    </div>
</template>
<script setup>
import { getCurrentInstance , ref,computed} from 'vue';
import Carousel from '@/components/index/homepage/Carousel.vue'
import { useStore } from 'vuex';
const {proxy:{$axios}} = getCurrentInstance();
const images = ref([]);
const store = useStore();
const islogin = computed(()=>store.getters['user/islogin']);
const blocks = ref([]);
const banners = ref([]);
// const getBlocks = async ()=>{
//     const {data:res} = await $axios({
//         method:'get',
//         url:`/api/homepage/block/page`,
//     });
//     blocks.value= res.data.blocks;
//     banners.value = blocks.value[0].extInfo.banners;
//     images.value = [];
//     banners.value.forEach(item => {
//         images.value.push({
//         id:item.bannerId,
//         pic:item.pic,
//         typeTitle:item.typeTitle,
//         url:item.url,
//         song:item.song,
//         targetType:item.targetType,
//         targetId:item.targetId})
//     });
// }
// getBlocks();

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