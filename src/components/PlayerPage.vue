
<template>
    <div id="playerPage" :class="{'reverse': isSpreading}">
        <div class="player-content-box">
            <div class="player">
                <div id="gramophone">
                    <div id="gramophoneRecord" :style="{'animationPlayState' : isPlaying ? '' : 'paused' }">
                        <img :src="songInfo?.al?.picUrl ?? ''" alt="album picture">
                    </div>
                </div>
                <div class="songInfoBody">
                    <div class="songInfoSketch">
                        <h2 class="songName">
                            {{ songInfo.name }}
                            <vipIcon :style="{'display':songInfo.fee === 1 ? '' : 'none'}" />
                            <router-link :to="`/mv/${songInfo.mv}`"><mvIcon :style="{'display':songInfo.mv != 0 ? '' :'none'}" /></router-link>
                        </h2>
                        <div class="songInfo">
                            <div>歌手:
                                <template v-for="(item,index) in songInfo.ar" :key="item.id">
                                    {{ index !== 0 ? ' /'  : ' '}}
                                    <a @click="toAr(item.id)">{{ item.name }}</a>
                                </template>
                            </div>
                            <div>专辑:<router-link :to="`/album/${songInfo?.al?.id}`">{{ songInfo?.al?.name }}</router-link></div>
                            <div>来源:</div>
                        </div>
                    </div>
                    <div id="lyric">
                        <lyricComponent :lyric="songInfo?.lyric[0]" :current="current"></lyricComponent>
                    </div>
                </div>
            </div>
            <div class="lowerLevel">
                <div class="commentBox">
                    <commentList :total="total" :spinning="spinning" :hotComments="hotComments" :latestComments="latestComments" @handlePageChange="handlePageChange" ref="commentListRef"></commentList>
                </div>
                <div class="sideBar">
                    123
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {useStore} from 'vuex'
import router from '@/router';
import { computed } from '@vue/reactivity'
import { defineComponent, getCurrentInstance,watch,ref, onMounted } from 'vue';
import lyricComponent from '@/components/player/lyric.vue'
import commentList from './unit/commentList.vue';
import vipIcon from '@/components/icon/vip.vue'
import mvIcon from './icon/mv.vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
const store = useStore();
const time = ref(0);
const spinning = ref(false);
const hotComments = ref([]);
const latestComments = ref([]);
const total = ref(0);
const commentListRef = ref(null);
const {proxy:{$axios}} = getCurrentInstance();
const isSpreading = computed(()=>store.state.isSpreading);
const isPlaying = computed(()=>store.state.player.isPlaying);
const songInfo = computed(()=>store.state.player.songInfo);
const getList = async (id,before,current)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url: `/api/comment/music?id=${id}&limit=20&offset=${20*(current-1)}&before=${before}`
    })
    if(res.hotComments) hotComments.value = res.hotComments;
    latestComments.value = res.comments;
    total.value = res.total;
    // time.val = latestComments.value[latestComments.value.length-1].time;
    spinning.value = false;
}
const toAr = (id)=>{
    router.push(`/artist/${id}`);
}
const handlePageChange = (page)=>{
    getList(songInfo.value.id,time.value,page);
}
watch(()=>songInfo.value,(val)=>{
    if(commentListRef.value) commentListRef.value.reset();
    getList(val.id,time.value,1);
},{
    immediate:true,
    deep:true,
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#playerPage{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height:inherit;
  background-color: #2b2b2b;
  transform: translateY(100%);
  transition: all 0.3s linear;
  overflow: auto;
  &.reverse{
    transform:translateY(0);
  }
  .player-content-box{
    min-width: 864px;
    max-width: 864px;
    height: 100%;
    margin: 0 auto;
    .player{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 422px;
        margin-bottom: 74px;
        #gramophone{
            width: 480px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items:flex-end;
            #gramophoneRecord{
                width: 326px;
                height: 326px;
                background:linear-gradient(135deg,#1e1f21 0%,#1c1c1e 38%,#37383a 50%,#1c1c1e 62%,#1e1f21 100%);
                border: solid 12px #373737;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
                border-radius: 50%;
                margin-right: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                animation-name: revolve;
                animation-duration: 40s;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
                img{
                    width: 230px;
                    height: 230px;
                    border-radius: 50%;
                }
            }
        }
        .songInfoBody{
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .songInfoSketch{
                width: 100%;

                .songName{
                    font-size: 28px;
                    line-height: 28px;
                    color: #d5d5d5;
                    text-align: left;
                    margin-bottom: 16px;
                }
                .songInfo{
                    display: flex;
                    justify-content: space-between;
                    div{
                        width: 100px;
                        font-size: 14px;
                        color: #6b6b6b;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        text-align: left;
                        white-space:nowrap;
                    }
                }
            }
            #lyric{
                width: 100%;
                height: 350px;
                text-align: left;
                position: relative;
            }
        }
    }
    .lowerLevel{
        width: 100%;
        margin: 0 auto;
        height: 100px;
        display: flex;
        justify-content: space-around;
        .commentBox{
            width: 560px;
            height: 100%;
        }
        .sideBar{
            flex: 1;
            margin-left: 60px;
        }
    }
    }
}

</style>
