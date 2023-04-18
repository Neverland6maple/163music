<template>
    <div class="menu" :style="{'left':left + 'px','top' : top + 'px'}" v-if="tableMenu.show" ref="menuRef">
        <div>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                查看评论
                ({{ tableMenu.commentCount }})
            </div>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                播放(Enter)
            </div>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                下一首播放
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem subscribe" @mouseenter="showSuscribe">
                <MessageOutlined/>
                收藏到歌单(Ctrl+S)
            </div>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                分享…
            </div>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                复制链接
            </div>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                下载(L)
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem" @mouseenter="suscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                从歌单中删除(Delete)
            </div>
        </div>
        <div class="suscribeBox" :style="suscribeBoxStyle">
            <div class="menuItem">
                <MessageOutlined />
                创建新歌单
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem" v-for="(item) in playlist" :key="item.id">
                <MessageOutlined />
                {{ item.name }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';
import { nextTick, onMounted, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import {MessageOutlined} from '@ant-design/icons-vue'
const menuRef = ref(null)
const store = useStore();
const tableMenu = computed(()=>store.state.tableMenu);
const playlist = computed(()=>store.state.user.playlist);
const left = ref(0);
const top = ref(0);
const suscribeBoxStyle = ref({})
const isShow =ref(false);
const exit = (e)=>{
    if(!menuRef.value.contains(e.target)){
        store.commit('changeTableMenu',{
            show:false
        })
    }
}
const showSuscribe = ()=>{
    suscribeBoxStyle.value = {
        display:'block'
    }
}
onMounted(()=>{
    watchEffect(()=>{
        if((tableMenu.value.x || tableMenu.value.x )&& tableMenu.value.show){
            left.value = tableMenu.value.x + 10 + menuRef.value.offsetWidth <= document.body.clientWidth ? tableMenu.value.x + 10 : tableMenu.value.x - 10 - menuRef.value.offsetWidth;
            top.value = tableMenu.value.y - menuRef.value.offsetHeight - 10 < 0 ? tableMenu.value.y + 10 : tableMenu.value.y - menuRef.value.offsetHeight - 10;
            window.addEventListener('click',exit);
        }else if(!tableMenu.value.show){
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
    .suscribeBox{
        display:none;
        z-index: 999;
        padding: 8px 0;
        background-color: #363636;
        width: 240px;
        position: absolute;
        left: 103%;
        top: -60px;
        max-height: 1000px;
    }
}
</style>