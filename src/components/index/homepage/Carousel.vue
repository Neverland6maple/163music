<template>
    <div id="indexCarousel">
        <div id="indexContainer">
            <ul class="carousel" @mouseover="dotOver" @mouseleave="dotLeave">
                <li v-for="(item,index) in props.images" :key="item.bannerId" :class="{'mid':active === index,'left':((active-1+len)%len) === index,'right':((active+1)%len) === index,'carouselItem':true}" :data-index="index" @click="goUrl(active === index)">
                        <img :src='`${item.pic}?param=538y194`' alt="">
                        <div class="typeTitle">{{ item.typeTitle }}</div>
                </li>
                <div id="preArrow" class="arrow" @click="slidePre"><LeftOutlined /></div>
                <div id="nextArrow" class="arrow" @click="slideNext"><RightOutlined /></div>
            </ul>
            <ul class="carouselDot" ref="carouselDot">
                <li v-for="(item,index) in props.images" :key="index" :class="{dot:true,'activeDot':index === active}" @mouseover="dotOver(index)" @mouseleave="dotLeave"></li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';
import { onMounted, reactive, ref } from 'vue';
import {LeftOutlined,RightOutlined} from '@ant-design/icons-vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const active = ref(0);
const carouselDot = ref(null);
const store = useStore();
const router = useRouter();
const props = defineProps({
    images:{
        type:Array,
        required:true,
    }
})
const len = computed(()=>props.images.length);
const slideTo = (id)=>{
    active.value = id;
}
const slidePre = ()=>{
    slideTo((active.value-1+len.value) % len.value);
}
const slideNext = ()=>{
    slideTo(active.value = (active.value+1) % len.value);
}
let timer = ref(null);
const dotOver = (id)=>{
    stop();
    if(typeof id === 'number'){
        slideTo(id);
    }
}
const dotLeave = ()=>{
    start();
}
const stop = ()=>{
    timer.value && clearInterval(timer.value);   
}
const start = ()=>{
    stop();
    timer.value = setInterval(() => {
        slideNext();
    }, 2000);
}
const goUrl = (mid)=>{
    if(mid){
        if(props.images[active.value].targetType === 3000){
            location.href=props.images[active.value].url;
        }else if(props.images[active.value].targetType === 1){
            store.dispatch('player/insertSong',props.images[active.value].song);
        }else if(props.images[active.value].targetType === 10){
            router.push(`/album/${props.images[active.value].targetId}`)
        }
        
    };
};
onMounted(()=>{
    start();
})
</script>
<style lang="less" scoped>
#indexCarousel{
    width: 100%;
}
#indexContainer{
    
    position: relative;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .carousel{
        display: flex;
        align-items: center;
        height: 200px;
        width: 100%;
        position: relative;;
        #preArrow{
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
        }
        #nextArrow{
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
        }
        .arrow{
            font-size: 12px;
            color: #aaa;
            text-align: center;    
            height: 32px;
            width: 32px;  
            line-height: 32px;   
            z-index: 99; 
            background-color: rgba(0, 0, 0, .2);
            border-radius: 50%;
            position: absolute;
            cursor: pointer;
            &:hover{
                color: #eee;
            }
        }
        &:hover{
            #preArrow,#nextArrow{
                opacity: 1;
            }
        }
        .typeTitle{
            position: absolute;
            right: 0;
            bottom: 0;
            width: 70px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            color: white;
            font-size: 12px;
            border-top-left-radius: 8px;
            background-color: #cc4a4a;
        }
    }
    .carouselItem{
        display: block;
        position: absolute;
        width: 540px;
        height: 160px;
        transition: all .7s;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
        border-radius: 8px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
        &.left{
            left: 0;
            transform: translateX(0);
            z-index: 1;
        }
        &.mid{
            left: 50%;
            transform: translateX(-50%);
            height: 194px;
            width: 538px;
            z-index: 99;
            cursor: pointer;
        }
        &.right{
            left: 100%;
            z-index: 1;
            transform: translateX(-100%);
        }
    }
    .carouselDot{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 10px;
        margin-top: 8px;
        margin-bottom: 8px;
        .dot{
            margin-left: 5px;
            margin-right: 5px;
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #3a3a3a;
        }
        .activeDot{
            background-color: #ec4141;
        }
    }
}
</style>