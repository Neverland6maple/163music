<template>
    <div class="menu" :style="{'left':left + 'px','top' : top + 'px'}" v-if="tableMenu.show" ref="menuRef">
        <div>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                查看评论
                ({{ tableMenu.commentCount }})
            </div>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                播放(Enter)
            </div>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'" @click="insertSong">
                <MessageOutlined />
                下一首播放
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem subscribe" @mouseenter="showSubscribe">
                <MessageOutlined/>
                收藏到歌单(Ctrl+S)
            </div>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                分享…
            </div>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                复制链接
            </div>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'">
                <MessageOutlined />
                下载(L)
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;" v-if="tableMenu.user"/>
            <div class="menuItem" @mouseenter="subscribeBoxStyle.display = 'none'" v-if="tableMenu.user" @click="unsubscribe">
                <MessageOutlined />
                从歌单中删除(Delete)
            </div>
        </div>
        <div class="subscribeBox" :style="subscribeBoxStyle">
            <div class="menuItem">
                <MessageOutlined />
                创建新歌单
            </div>
            <a-divider style="height: 1px; background-color: #ededed;margin: 0;"/>
            <div class="menuItem" v-for="(item,index) in playlist" :key="item.id" @click="subscribe(item.id,index === 0)">
                <MessageOutlined />
                {{ item.name }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';
import { getCurrentInstance, onMounted, ref, watchEffect,watch } from 'vue';
import { useStore } from 'vuex';
import {MessageOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
const menuRef = ref(null)
const store = useStore();
const tableMenu = computed(()=>store.state.tableMenu);
const playlist = computed(()=>store.state.user.playlist);
const unsubscribeState = computed(()=>store.getters.unsubscribe); 
const {proxy:{$axios}} = getCurrentInstance(); 
const left = ref(0);
const top = ref(0);
const subscribeBoxStyle = ref({})
const route = useRoute();
const exit = (e)=>{
    if(!menuRef.value.contains(e.target)){
        store.commit('changeTableMenu',{
            show:false
        })
    }
}
const showSubscribe = ()=>{
    subscribeBoxStyle.value = {
        display:'block'
    }
}
const subscribe = async (pid,like)=>{
    const key = '123';
    message.loading({
        content:' ',
        key,
        duration:3
    });
    const {data:res} = await $axios({
        method:'get',
        url:`/api/playlist/tracks?op=add&pid=${pid}&tracks=${tableMenu.value.song.id}`
    })
    if(res.body.code === 200){
        message.success({
            content:'收藏成功',
            key,
            duration:2.5
        });
        if(like){
            store.commit('user/addLike',tableMenu.value.song.id);
        }
    }else if(res.body.code === 502){
        message.error({
            content:res.body.message,
            key,
            duration:2.5
        });
    }
    subscribeBoxStyle.value.display = 'none';
    store.commit('changeTableMenu',{
        show:false
    })
}
const unsubscribe = async ()=>{
    store.commit('changeTableMenu',{
        show:false
    })
    store.commit('changeComfirmShow',{show:true,text:'确定删除该歌单？'});
}
const insertSong = ()=>{
    store.commit('player/insertSong',tableMenu.value.song);
    store.commit('changeTableMenu',{show:false})
}
watch(unsubscribeState,async (val)=>{
    if(val){
        const {data:res} = await $axios({
            method:'get',
            url:`/api/playlist/tracks?op=del&pid=${route.params.playlistId}&tracks=${tableMenu.value.song.id}`
        })
        subscribeBoxStyle.value.display = 'none';
        store.commit('changeTableMenu',{
            show:false
        })
        store.commit('setComfirmRes',false);
    }
})
onMounted(()=>{
    watchEffect(()=>{
        if((tableMenu.value.x || tableMenu.value.y )&& tableMenu.value.show){
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
    .subscribeBox{
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