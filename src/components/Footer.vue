<template>
  <div id="player">
    <div id="playerLeft" :class="{'reverse': isSpreading}" :style="{'opacity':songInfo.url  ? 1 : 0}">
      <div id="playerPageFn">
        <div class="fold"><DownOutlined @click="handleSpread(false)"/></div>
        <div class="spreadFn"><HeartOutlined /></div>
        <div class="spreadFn"><FolderAddOutlined /></div>
        <div class="spreadFn"><DownloadOutlined /></div>
        <div class="spreadFn"><ShareAltOutlined /></div>
      </div>
      <div id="playerSongInfo">
        <div id="playerSongImg" @click="handleSpread(true)">
          <img :src="songInfo?.al?.picUrl ?? ''" />
          <div class="mask" ></div>
          <UpOutlined />
        </div>
        <div class="songInfo">
          <div class="songName">
            <div class="name">{{ songInfo.name }}</div>
            <div class="privilege">2</div>
            <div class="like">3</div>
          </div>
          <div class="songSinger">
            <template v-for="(item,index) in songInfo.ar" :key="item.id">
              {{ index !== 0 ? ' /' : ' ' }}
              <router-link to="/">{{ item.name }}</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div id="playerCenter">
      <div id="playerController" >
        <div>
          <AlignLeftOutlined class="playerControllerIcon" v-if="sequence === 0"/>
        </div>
        <div @click="preSong"><StepBackwardOutlined class="playerControllerIcon"/></div>
        <div>
          <PauseCircleFilled class="playerControllerIcon playerControllerIcon-center" v-if="isPlaying" @click="pause"/>
          <PlayCircleFilled class="playerControllerIcon playerControllerIcon-center" v-else @click="play"/>
        </div>
        <div @click="nextSong"><StepForwardOutlined class="playerControllerIcon"/></div>
        <div>
          <div class="playerControllerIcon">词</div>
        </div>
      </div>
      <div id="progressBar">
        <div id="currentTime">
          {{ currentTime }}
        </div>
        <div id="progressTrack"  :style="{width:`${width}%`}" @click="handleClickProgress" ref="progressRef">
          <div id="progress" :style="{width:`${percentage}%`}"></div>
          <audio :src=songInfo.url ref="audio" @canplay="handleGetDuration" @timeupdate="handleTimeUpdate" @ended="handleMusicEnded"></audio>
        </div>
        <div id="totalTime">
          {{ totalTime }}
        </div>
      </div>
    </div>
    <div id="playeFn">
      <div class="quality"><span>标准</span></div>
      <div class="effect"><CustomerServiceOutlined/></div>
      <div class="volume"><FilterOutlined :style="{transform:'rotate(90deg)'}"/></div>
      <div class="accompany"><TeamOutlined /></div>
      <div class="list" @click="getSongList"><MenuUnfoldOutlined /></div>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import {useStore} from 'vuex'
import {PlayCircleFilled,AlignLeftOutlined,StepBackwardOutlined,StepForwardOutlined,PauseCircleFilled,CustomerServiceOutlined,FilterOutlined,TeamOutlined,MenuUnfoldOutlined,UpOutlined,DownOutlined,HeartOutlined,FolderAddOutlined,DownloadOutlined,ShareAltOutlined} from '@ant-design/icons-vue'
import timeFormat from '@/utils/timeFormat';
export default defineComponent({
  components:{
    PlayCircleFilled,
    AlignLeftOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    PauseCircleFilled,
    CustomerServiceOutlined,
    FilterOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    UpOutlined,
    DownOutlined,
    HeartOutlined,
    FolderAddOutlined,
    DownloadOutlined,
    ShareAltOutlined,
  },
  props:{
    skipTime:{
      require:false,
      type:String,
    },
  },
  setup(props,{emit}){
    const audio = ref(null);
    const progressRef = ref(null);
    const percentage = ref(0);
    const width = ref(80);
    const duration = ref(0);
    const store = useStore();
    const handleSpread = (value)=>{
      store.commit('changeIsSpreading',value)
      emit('spread');
    }
    
    watch(()=>props.skipTime,(newValue)=>{
      audio.value.currentTime = newValue;
    })
    const isSpreading = computed(()=>{
      return store.state.isSpreading;
    })
    const isPlaying = computed(()=>{
      return store.state.isPlaying;
    })
    const songInfo = computed(()=>{
      return store.state?.songInfo ?? {};
    })
    const getSongList = ()=>{
      store.commit('changeSlider',store.state.slider == 1 ? 0 : 1);
    }
    watch(()=>songInfo.value.id,(newValue)=>{
      nextTick(()=>{
        play()
      })
    })
    const play = ()=>{
      store.commit('changeIsPlaying',true);
      audio.value.play();
    }
    let totalTime = ref(0);
    const currentTime = computed(()=>{
      return timeFormat(store.state.current * 1000);
    })
    const sequence = computed(()=>store.state.sequence);
    const pause = ()=>{
      store.commit('changeIsPlaying',false);
      audio.value.pause();
    }
    const handleGetDuration = (e)=>{
      duration.value = e.target.duration;
      totalTime.value = timeFormat(e.target.duration * 1000);
    }
    const handleTimeUpdate = (e)=>{
      store.commit('setCurrent',e.target.currentTime);
      percentage.value = (e.target.currentTime * 100 / duration.value).toFixed(3);
    }
    const handleMusicEnded = (e)=>{
      store.commit('nextSong');
    }
    const handleClickProgress = (e)=>{
      percentage.value = ((e.clientX - progressRef.value.offsetLeft) / progressRef.value.offsetWidth).toFixed(2);
      audio.value.currentTime = percentage.value * duration.value;
    }
    watch(()=>store.state.current,(newValue)=>{
    })
    const nextSong = ()=>{
      store.commit('nextSong')
    }
    const preSong = ()=>{
      store.commit('preSong');
    }
    onMounted(()=>{
      watch(progressRef.value.offsetWidth,(newValue)=>{
        console.log(newValue);
        console.log(props.skipTime);
      })
    })
    return {
      audio,
      progressRef,
      pause,
      play,
      isPlaying,
      handleTimeUpdate,
      handleGetDuration,
      percentage,
      width,
      handleMusicEnded,
      handleClickProgress,
      totalTime,
      songInfo,
      handleSpread,
      isSpreading,
      getSongList,
      nextSong,
      currentTime,
      sequence,
      preSong,
      props,
    }
  }
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#player{
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  line-height: 70px;
  position: relative;
  #playerLeft{
    margin-left: 10px;
    transform: translateY(-50%);
    transition: all 0.55s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.reverse{
      transform: translateY(1px);
    }
    #playerSongInfo{
    align-items: center;
    display: flex;
    #playerSongImg{
      position: relative;
      width: 48px;
      height: 48px;
      line-height: normal;
      cursor: pointer;
      &:hover{
        img{
          -webkit-filter: blur(1px); /* Chrome, Opera */
          -moz-filter: blur(1px);
          -ms-filter: blur(1px);
          filter: blur(1px);
        }
        .mask{
          opacity: 0.1;
        }
        :deep(.anticon){
          display:inline-block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          opacity: 1;
          color: white;
          font-size: 18px;
          font-weight: 700;
        }
      }
      :deep(.anticon){
        display: none;
      }
      img{
        width: 100%;
        height: 100%;
        line-height: normal;
      }
      .mask{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: black;
        line-height: normal;
      }
    }
    .songInfo{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items:flex-start;
      line-height: normal;
      color: @black-font-color;
      margin-left: 12px;
      .songName{
        display: flex;
        justify-content: space-between;
        line-height: 16px;
        font-size: 16px;
        margin-bottom: 6px;
        div{
          margin-right: 8px;
        }
      }
      .songSinger{
        font-size: 14px;
        line-height: 14px;
      }
    }
    
    }
    #playerPageFn{
      margin-left: 10px;
      display: flex;
      align-items: center;
      .fold{
        flex: 3;
        text-align: left;
        margin-right: 76px;
      }
      .spreadFn{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        line-height: 30px;
        border: solid 1px #333;
        margin-right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: @black-font-color;
        &:hover{
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
  #playerCenter{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 37%;
    min-width: 450px;
    height: 100%;
    #progressBar{
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: normal;
      font-size: 12px;
      color: #666;
      width: 100%;
      #progressTrack{
        &:hover{
          height: 4px;
          box-shadow: 0 0 1px #444;
        }
        height: 2px;
        border-radius: 1px;
        background-color: #444;
        margin-left: 8px;
        margin-right: 8px;
        #progress{
          height: 100%;
          background-color: #ec4141;
          
        }
      }
    }
    #playerController{
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
      .playerControllerIcon{
        &.playerControllerIcon-center{
          &:hover{
          color: rgba(255, 255, 255, 0.8);
          }
          font-size: 30px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 14px;
        }
        &:hover{
          color: #c43b3b;
        }
        cursor: pointer;
        color: #d3d3d3;
        font-size: 16px;
        line-height: 16px;
        margin-top: 22px;
        margin-left: 18px;
        margin-right: 18px;
      }
     }
  }
  #playeFn{
    display: flex;
    justify-content: space-between;
    margin-right: 26px;
    height: 100%;
    width: 180px;
    align-items: center;
    font-size: 18px;
    color: @black-font-color;
    .quality span{
      font-size: 12px;
      padding: 1px 4px;
      border: solid 1px @black-font-color;
    }
    div{
      cursor: pointer;
    }
  }
}
</style>