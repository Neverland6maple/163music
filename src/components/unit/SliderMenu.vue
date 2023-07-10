<template>
    <div class="menu" :style="{'left':left + 'px','top' : top + 'px'}" v-if="sliderMenu.show" ref="menuRef">
        <div>
            <div class="menuItem" >
                <MessageOutlined />
                播放(Enter)
            </div>
            <div class="menuItem" >
                <MessageOutlined />
                下一首播放
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem" >
                <MessageOutlined />
                分享…
            </div>
            <div class="menuItem" >
                <MessageOutlined />
                复制链接
            </div>
            <div class="menuItem" >
                <MessageOutlined />
                下载全部(L)
            </div>
            <div class="menuItem"  v-if="sliderMenu.user">
                <MessageOutlined />
                复制已下载的MP3文件
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem"  v-if="sliderMenu.user">
                <MessageOutlined />
                编辑歌单信息
            </div>
            <div class="menuItem"  @click="unsubscribe">
                <MessageOutlined />
                删除歌单(Delete)
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';
import { getCurrentInstance, nextTick, onMounted, ref, watchEffect,watch } from 'vue';
import { useStore } from 'vuex';
import {MessageOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
const menuRef = ref(null)
const store = useStore();
const unsubscribeState = computed(()=>store.getters.unsubscribe); 
const comfirmRes = computed(()=>store.state.comfirmRes);
const sliderMenu = computed(()=>store.state.sliderMenu);
const comfirmShow = computed(()=>store.state.comfirmShow);
const {proxy:{$axios}} = getCurrentInstance(); 
const left = ref(0);
const top = ref(0);
const route = useRoute();
const exit = (e)=>{
    if(menuRef.value && !menuRef.value.contains(e.target)){
        store.commit('changeSliderMenu',{
            show:false
        })
    }
}
const unsubscribe = async ()=>{
    store.commit('changeSliderMenu',{
        show:false
    })
    console.log(123);
    store.commit('changeComfirmShow',{show:true,text:'确定删除该歌单？'});
}
watch(unsubscribeState,async (val)=>{
    if(val){
        const {data:res} = await $axios({
            method:'get',
            url:`/api/playlist/delete?id=${sliderMenu.value.id}`
        })
        if(res.code === 200){
            store.commit('changeCreatePlaylist',{update:true});
        }
        store.commit('setComfirmRes',false);
    }
})
onMounted(()=>{
    watchEffect(()=>{
        if((sliderMenu.value.x  || sliderMenu.value.y ) && sliderMenu.value.show){
            left.value = sliderMenu.value.x + 10 + menuRef.value.offsetWidth <= document.body.clientWidth ? sliderMenu.value.x + 10 : sliderMenu.value.x - 10 - menuRef.value.offsetWidth;
            top.value = sliderMenu.value.y + menuRef.value.offsetHeight + 10 < document.body.clientHeight ? sliderMenu.value.y + 10 : sliderMenu.value.y - menuRef.value.offsetHeight - 10;
            window.addEventListener('click',exit);
        }else if(!sliderMenu.value.show){
            window.removeEventListener('click',exit);
        }
    },{
        flush:'post'
    })
})
</script>
<style scoped lang='less'>
@import '@/assets/theme.less';
.menu{
    width: 240px;
    background-color: #363636;
    position: absolute;
    left: 0;
    top:0;
    z-index: 999;
    padding: 8px 0;
    .menuItem{
        position: relative;
        line-height: 34px;
        color: @black-font-color;
        font-size: 13px;
        text-align: left;
        padding-left: 13px;
        overflow: hidden;
        .anticon{
            font-size: 17px;
            margin-right: 10px;
        }
        &:hover{
            background-color: #4a4a4a;
        }
    }
    .subscribe::after{
        display: block;
        content: '';
        border: solid 5px #d2d2d2;
        border-top-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        position: absolute;
        right: 6px;
        top: 13px;;
    }
}
</style>