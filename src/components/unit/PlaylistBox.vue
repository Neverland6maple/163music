<template>
    <div id="playlistBoxMask">
        <div class="playlistBoxFrame">
            <div class="exit" @click="exit"><CloseOutlined/></div>
            <h3 class="boxTitle">收藏到歌单</h3>
            <div class="playlistItem" @click="showCreatePlaylist">
                <div class="playlistCov">
                    <div class="temp">+</div>
                </div>
                <div class="title">新建歌单</div>
            </div>
            <div class="playlistBox">
                <div class="playlistItem" v-for="(item,index) in playlist" :key="item.id" @click="subscribe(item.id,index === 0)">
                    <div class="playlistCov">
                        <img :src="item.coverImgUrl" alt="coverImgUrl" class="coverPic">
                    </div>
                    <div class="playlistInfo">
                        <div class="playlistName">{{ item.name }}</div>
                        <div class="info">{{item.trackCount}}首音乐，0首已下载</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {CloseOutlined,} from '@ant-design/icons-vue';
import {computed, getCurrentInstance, } from 'vue';
import { message } from 'ant-design-vue';
import {useStore} from 'vuex'
const store = useStore();
const playlist = computed(()=>store.state.user.playlist);
const {proxy:{$axios,$post}} = getCurrentInstance();
const songInfo = computed(()=>store.state.player.songInfo ?? {});
const exit = (value)=>{
    store.commit('changePlaylistBoxShow',false);
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
        url:`/api/playlist/tracks?op=add&pid=${pid}&tracks=${songInfo.value.id}`
    })
    if(res.body.code === 200){
        message.success({
            content:'收藏成功',
            key,
            duration:2.5
        });
        if(like){
            store.commit('user/addLike',songInfo.value.id);
        }
    }else if(res.body.code === 502){
        message.error({
            content:res.body.message,
            key,
            duration:2.5
        });
    }
    exit();
}
const showCreatePlaylist = ()=>{
    exit();
    store.commit('changeCreatePlaylist',{show:true,id:songInfo.value.id});
}
</script>
<style scoped lang='less'>
@import '@/assets/theme.less';
#playlistBoxMask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 999;
    .playlistBoxFrame{
        position: absolute;
        width: 470px;
        height: 465px;
        background-color: #363636;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        overflow: hidden;
        .boxTitle{
            line-height: 70px;
            text-align: center;
            color: @black-font-color;
            font-size: 16px;
            font-weight: bold;
        }
        .exit{
            position: absolute;
            right: 12px;
            top: 12px;
            color: #999999;
            font-size: 18px;
            cursor: pointer;
        }
        .playlistBox{
            overflow: auto;
            width: 100%;
            height: 317px;
            .playlistItem{
                cursor: pointer;
                &:hover{
                    background-color: #3e3e3e;
                }
            }
        }
        .playlistItem{
            height: 80px;
            padding: 11px;
            display: flex;
            align-items: center;
            justify-content: left;
            .title{
                font-size: 14px;
                color: @black-font-color;
            }
            .playlistCov{
                height: 58px;
                width: 58px;
                border-radius: 4px;
                overflow: hidden;
                margin-right: 11px;
                background-color: #454448;
                .temp{
                    height: 100%;
                    line-height: 58px;
                    font-size: 30px;
                    color: white;
                    cursor:default;
                }
            }
            .playlistInfo{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                .playlistName{
                    font-size: 12px;
                    color: @black-font-color;
                    line-height: 23px;
                }
                .info{
                    font-size: 12px;
                    color: #959595;
                    line-height: 23px;
                }
            }
        }
    }
}
</style>