<template>
    <div id="lyricComponent" ref="box">
        <div class="content" ref="contentRef" @scroll="handleScroll" @wheel="handleWheel" >
            <ul class="scrollBox"  ref="lyricRef" :style="{transform: `translateY(${boxHeight}px)`}" >
                <li class="lyricItem" v-for="(item,index) in lyric" :class="{'activeLyric':activeIndex === index,'middleLyric':middle === index}" :key="item.id" :data-index="index">
                    {{item.lyricItem}}
                </li>
            </ul>
        </div>
        <div id="midPointer" :class="{'offset' : isOffset}">
            <div id="timePointer">
                {{ formatTime }}
            </div>
            <div class="rightarrow" @click="skip"></div>
        </div>
    </div>
</template>
<script setup>
import formatLyric from '@/utils/formatLyric';
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch,nextTick, inject } from 'vue';
import { useStore } from 'vuex';
const props = defineProps({
    lyric:String,
    tlyric:{
        type:String,
        require:false,
        default:'',
    },
});
const store = useStore();
const lyric = computed(()=>{
    return formatLyric(props.lyric);
})
const boxHeight = ref(0);
const box = ref(null);
let scrollY = 0;
const middle = ref(-1);
const current = computed(()=>store.state.player.currentTime);
const activeIndex = ref(0);
const scrollH = ref(0);
const lyricRef = ref(null);
const contentRef = ref(null);
const isOffset = ref(false);
let flag = true;
let spans = ref([]);
let timer = null;
const timePointer = ref('0.0');
const findActive = (current)=>{
    let index = -1;
    for(let i = 0;i<lyric.value.length;i++){
        if(current >= lyric.value[i].time){
            index = i;
        }else{
            break;
        }
    }
    return index;
}
const findMid = (height)=>{
    for(let i = 1;i<spans.value.length;i++){
        if(spans.value[i-1].offsetTop <= height && spans.value[i-1].offsetTop + spans.value[i-1].offsetHeight >= height){
            return i-1;
        }
    }
    return -1;
}
const handleScroll = (e)=>{
    scrollY = contentRef.value.scrollTop;
    middle.value = findMid(scrollY);
    if(middle.value >= 0){
        timePointer.value = lyric.value[middle.value].time;
    }
}

let setSkipTime = inject('setSkipTime');
const skip = ()=>{
    setSkipTime(timePointer.value);
}
const formatTime = computed(()=>{
    let time = Math.round(timePointer.value);
    let m = 0,s = 0;
    s = parseInt(time % 60);
    if(s < 10) s = '0' + s;
    m = parseInt(time / 60);
    if(m < 10) m = '0' + m;
    return m + ':' + s;
})
const handleWheel = (e)=>{
    flag = false;
    isOffset.value = true;
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
        flag = true;
        isOffset.value = false;
        setScroll(current.value);
    },2500);
}
const setScroll = (newValue)=>{
    activeIndex.value = findActive(newValue);
    if(activeIndex.value >= 0){
        nextTick(()=>{
            scrollH.value = spans.value[activeIndex.value].offsetTop;
            if(flag){
                try{
                    contentRef.value.scrollTo(0,scrollH.value);
                }catch(e){
                    console.log(e);
                }
            }
        })
    }
}

watch(current,setScroll);
watch(lyric,()=>{
    nextTick(()=>{
        spans.value = lyricRef.value.querySelectorAll('li');
        boxHeight.value = box.value.offsetHeight / 2;
    })
})
onMounted(()=>{
    boxHeight.value = box.value.offsetHeight / 2;
    spans.value = lyricRef.value.querySelectorAll('li');
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#lyricComponent{
    height: 100%;
    padding-right: 30px;
    position: relative;
    .content{
        &:hover{
            overflow: auto;
        }
        height: 100%;
        overflow: hidden;
        display: block;
        width: 100%;
        position: relative;
        transition: all 1s;
        .scrollBox{
            .lyricItem{
                font-size: 15px;
                line-height: 22px;
                margin-bottom: 16px;
                color: #606060;
                letter-spacing: 0.2px;
                font-weight: 500;
                &.activeLyric{
                    color: white;
                    font-weight: 900;
                    font-size: 16px;
                }
                &.middleLyric{
                    color: white;
                }
            }
        }
    }
    &:hover{
        .offset{
            opacity: 1 !important;
        }
    }
    #midPointer{
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 0;
        width: 330px;
        height: 1px;
        margin: 1px 0;
        background: linear-gradient(to right,white,transparent,transparent,transparent,white);
        #timePointer{
            position: absolute;
            left: -36px;
            top: -5px;
            font-size: 12px;
        }
        .rightarrow{
            position: absolute;
            right: -24px;
            top: -5px;
            border-left: solid 8px #d5d5d5;
            border-right: solid 8px transparent;
            border-bottom: solid 6px transparent;
            border-top: solid 6px transparent;
            cursor: pointer;
        }
        
    }
    
}
</style>