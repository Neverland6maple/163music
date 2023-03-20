<template>
    <div id="homepage">
        <div class="main">
            <Carousel :images="images"></Carousel>
        </div>
    </div>
</template>
<script>
import { defineComponent, getCurrentInstance , reactive, ref} from 'vue';
import Carousel from '@/components/index/homepage/Carousel.vue'

export default defineComponent({
components:{
    Carousel,
},
async setup(){
    const {proxy:{$axios}} = getCurrentInstance();
    const images = reactive([]);
    const {data:res} = await $axios({
        method:'get',
        url:'/api/homepage/block/page',
    });
    const blocks = res.data.blocks;
    const banners = blocks[0].extInfo.banners;
    banners.forEach(item => {
        images.push({
        id:item.bannerId,
        pic:item.pic,
        typeTitle:item.typeTitle,
        url:item.url,
        song:item.song,
        targetType:item.targetType,
        targetId:item.targetId})
    });
    return {
        images
    }
}
})

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