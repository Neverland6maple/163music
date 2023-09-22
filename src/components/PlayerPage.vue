<template>
    <div id="playerPage" :class="{'reverse': isSpreading}" ref="playerPageRef" @scroll="showScrollToTop">
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
                        <lyricComponent :lyric="songInfo?.lyric[0]"></lyricComponent>
                    </div>
                </div>
            </div>
            <div class="lowerLevel">
                <div class="commentListBox">
                    <commentList :total="total" :spinning="spinning" :hotComments="hotComments" :latestComments="latestComments" @handlePageChange="handlePageChange" ref="commentListRef"></commentList>
                </div>
                <div class="sideBar">
                    侧边栏
                </div>
            </div>
        </div>
    </div>
    
    <div class="commentMask" v-if="isShowCommentBox">
        <div class="commentFrame">
            <div class="title">歌曲：{{ songInfo.name }}</div>
            <div class="ipt">
                <div class="textarea">
                    <a-textarea
                    v-model:value="value"
                    :auto-size="{ minRows: 6, maxRows: 6 }"
                    placeholder="快来说点什么吧"
                    />
                </div>
                <div class="textareaFn">
                    <div class="textareaOption">
                        <div>#</div>
                        <div>@</div>
                        <div>&#9786; &#65039;</div>
                    </div>
                    <div class="letterLimit">
                        123
                    </div>
                </div>
            </div>
            <div class="commentBtn" @click="comment">
                <a-button type="primary" shape="round" :class="{'actived':value}">
                    发布
                </a-button>
            </div>
            <CloseOutlined class="closeIcon" @click="showCommentBox(false)"/>
        </div>
    </div>
    <Teleport to="#app">
        <div class="commentBox"  @click="showCommentBox(true)" v-if="isSpreading">快来说点什么吧</div>
    </Teleport>
</template>
<script setup>
import {useStore} from 'vuex'
import router from '@/router';
import { computed } from '@vue/reactivity'
import { getCurrentInstance,watch,ref } from 'vue';
import lyricComponent from '@/components/player/lyric.vue'
import commentList from './unit/commentList.vue';
import vipIcon from '@/components/icon/vip.vue'
import mvIcon from './icon/mv.vue';
import {CloseOutlined} from '@ant-design/icons-vue'
const store = useStore();
const time = ref(0);
const spinning = ref(false);
const playerPageRef = ref(null);
const hotComments = ref([]);
const latestComments = ref([]);
const value = ref('');
const total = ref(0);
const commentListRef = ref(null);
const {proxy:{$axios}} = getCurrentInstance();
const isSpreading = computed(()=>store.state.isSpreading);
const isPlaying = computed(()=>store.state.player.isPlaying);
const songInfo = computed(()=>store.state.player.songInfo);
const isShowCommentBox = ref(false);
const emit = defineEmits(['showScrollToTop']);
const getList = async (id,before,current)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url: `/api/comment/music?id=${id}&limit=20&offset=${20*(current-1)}&before=${before}&timestamp=${Date.now()}`
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
const scrollToTop = ()=>{
    playerPageRef.value.scrollTop = 0;
}
const handlePageChange = (page)=>{
    getList(songInfo.value.id,time.value,page);
}
const showScrollToTop = ()=>{
    emit('showScrollToTop',playerPageRef.value.scrollTop > 400);
}
const showCommentBox = (value)=>{
    isShowCommentBox.value = value;
}
const comment = async ()=>{
    const data = await $axios({
        method:"get",
        url:`/api/comment?t=1&type=0&id=${songInfo.value.id}&content=${value.value}`
    })
    if(data.data.code === 200){
        value.value = '';
        showCommentBox(false);
        await getList(songInfo.value.id,time.value,1);
    }else{
        console.log(data);
    }
}
watch(()=>isSpreading.value,(val)=>{
    if(val){
        if(!hotComments.value.length){
            getList(songInfo.value.id,time.value,1);
        }
    }else{
        hotComments.value = [];
        latestComments.value = [];
        commentListRef.value.reset();
    }
})
watch(()=>songInfo.value,(val)=>{
    if(commentListRef.value){
        commentListRef.value.reset();
        if(isSpreading.value) getList(val.id,time.value,1);
    }
},{
    immediate:true,
    deep:true,
})

defineExpose({
    scrollToTop,
    // showCommentBox, 使用teleport后注释
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
.commentBox{
  position: absolute;
  bottom: 90px;
  left: 50%;
  width: 135px;
  height: 35px;
  border-radius: 17px;
  background-color: #3e3e3e;
  color: #d8d8d8;
  line-height: 35px;
  font-size: 12px;
  transform: translateX(-50%);
  z-index: 999;
  cursor: pointer;
  transition: all .5s;
  padding: 0 20px;
  &:hover{
    background-color: #505050;
  }
}
#playerPage{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-color: #2b2b2b;
  transform: translateY(100%);
  transition: all 0.3s linear;
  overflow: auto;
  z-index: 1;
  &.reverse{
    transform:translateY(0);
  }
  .player-content-box{
    min-width: 864px;
    max-width: 864px;
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
        display: flex;
        justify-content: space-around;
        .commentListBox{
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

.commentMask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .commentFrame{
        width: 470px;
        height: 300px;
        border-radius: 4px;
        box-shadow: 2px 2px 1px #282828;
        background-color: #363636;
        padding: 20px;
        position: relative;
        .title{
            line-height: 50px;
            color:@black-font-color;
            font-size: 18px;
            font-weight: bold;
        }
        .ipt{
            padding: 8px 18px;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 6px;
        }

        .textarea{
            position: relative;
            .ant-input{
                border: 0;
                background-color: transparent;
                color: #d8d8d8;
                padding: 0;
                padding-top: 8px;
                line-height: 16px;
                font-size: 13px;
                &::-webkit-input-placeholder{
                    color: #696969;
                }
                &:-ms-input-placeholder { /* IE 10+ */
                    color: #696969;
                }
                &:-moz-placeholder { /* Firefox 18- */
                    color: #696969;
                    opacity: 1;
                }
                &::-moz-placeholder { /* Firefox 19+ */
                    color: #696969;
                    opacity: 1;
                }
                &:focus{
                   box-shadow: none;
                }
            }
        }
        .textareaFn{
            height: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            .textareaOption{
                display: flex;
            }
            
            .letterLimit{
                position: absolute;
                right: 0;
                bottom: 5px;
                color: #616161;
                font-size: 12px;
            }
        }
        .commentBtn{
            margin-top: 18px;
            .ant-btn{
                background-color: #903b3b;
                padding: 0 50px;
                height: 35px;
                line-height: 35px;
                color: #9a9a9a;
                border: none;
                transition: none;
                &.actived{
                    background-color: #ec4141;
                    color: #ffffff;
                    &:hover{
                        background-color: #d73535;
                    }
                }
            }
        }
        .closeIcon{
            position: absolute;
            right: 12px;
            top: 12px;
            color: #737373;
            font-size: 20px;
            cursor: pointer;
        }
    }
}


</style>
