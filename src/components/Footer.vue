<template>
  <div id="player">
    <div class="overflowhidden">
      <div id="playerLeft" :class="{'reverse': isSpreading}" :style="{'opacity':songInfo.url  ? 1 : 0}">
        <div id="playerPageFn">
          <div class="fold"><DownOutlined @click="handleSpread(false)"/></div>
          <div class="spreadFn" @click="likeSong"><HeartOutlined v-if="!liked"/><HeartFilled style="color:#ec4141" class="likeIcon liked" v-else/></div>
          <div class="spreadFn" @click="showPlaylistBox"><FolderAddOutlined /></div>
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
              <div class="name">{{ songInfo.name }}{{ isSpreading }}</div>
              <div class="privilege"><vipIcon :style="{'display':songInfo.fee === 1 ? '' : 'none'}" /></div>
              <div class="like" @click="likeSong"><HeartOutlined v-if="!liked" /><HeartFilled style="color:#ec4141" class="likeIcon liked" v-else/></div>
            </div>
            <div class="songSinger">
              <template v-for="(item,index) in songInfo.ar" :key="item.id">
                {{ index !== 0 ? ' /' : ' ' }}
                <router-link :to="`/artist/${item.id}`" >{{ item.name }}</router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="playerCenter">
      <div id="playerController" >
        <div class="sequence">
          <AlignLeftOutlined class="playerControllerIcon" v-if="sequence === 0" @click="changeSequence"/>
          <HeartOutlined class="playerControllerIcon" v-else-if="sequence === 1" @click="changeSequence"/>
          <RetweetOutlined class="playerControllerIcon" v-else-if="sequence === 2" @click="changeSequence"/>
          <LoginOutlined class="playerControllerIcon" v-else-if="sequence === 3" @click="changeSequence"/>
          <QuestionCircleOutlined class="playerControllerIcon" v-else-if="sequence === 4" @click="changeSequence"/>
          <div class="overlay" v-show="isChanging">{{ sequenceMap[sequence] }}</div>
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
        <div id="progressTrack"  :style="{width:`${width}%`}" @click="handleClickProgress" ref="progressRef" >
          <div id="progress" :style="{width:`${percentage}%`}" ></div>
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
      <div class="volume" :class="{'isHover':isHover}">
        <div class="volumeBox" @mouseup="handleMouseUp">
          <div id="volumeTrack" @click="handleClickVolume" ref="volumeRef" > 
            <div id="volume" :style="{height:`${height}px`,opacity:isMute ? 0 : 1}">
              <div class="trackDot" ref="volumeDot" @mousedown="handleMouseDown"> </div>
            </div>
          </div> 
        </div>

        <FilterOutlined :style="{transform:'rotate(90deg)'}" @click="mute" v-if="!isMute"/>
        <AudioMutedOutlined @click="cancelMute" v-else/>
      </div>
      <div class="accompany"><TeamOutlined /></div>
      <div class="list" @click="getSongList"><MenuUnfoldOutlined /></div>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, nextTick, onMounted, ref, watch , getCurrentInstance} from 'vue';
import {useStore} from 'vuex'
import {PlayCircleFilled,AlignLeftOutlined,StepBackwardOutlined,HeartFilled,StepForwardOutlined,PauseCircleFilled,CustomerServiceOutlined,FilterOutlined,TeamOutlined,MenuUnfoldOutlined,UpOutlined,DownOutlined,HeartOutlined,FolderAddOutlined,DownloadOutlined,ShareAltOutlined,RetweetOutlined,LoginOutlined,QuestionCircleOutlined,AudioMutedOutlined,} from '@ant-design/icons-vue'
import timeFormat from '@/utils/timeFormat';
import vipIcon from './icon/vip.vue';
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
    RetweetOutlined,
    LoginOutlined,
    QuestionCircleOutlined,
    AudioMutedOutlined,
    HeartFilled,
    vipIcon,
  },
  props:{
    skipTime:{
      require:false,
      type:Number,
    },
  },
  setup(props,{emit}){
    const audio = ref(null);
    const progressRef = ref(null);
    const volumeRef = ref(null);
    const volumeDot = ref(null)
    const percentage = ref(0);
    const width = ref(80);
    const height = ref(50);
    const isMute = ref(false);
    const duration = ref(0);
    const store = useStore();
    const isChanging = ref(false);
    const isHover = ref(false);
    const {proxy:{$axios,$post}} = getCurrentInstance();
    const likelist = computed(()=>store.state.user.likelist);
    const handleSpread = (value)=>{
      store.commit('changeIsSpreading',value)
      emit('spread');
    }
    const sequenceMap = {
      0:'顺序播放',
      1:'心动模式',
      2:'循环播放',
      3:'单曲循环',
      4:'随机播放',
    }
    const playingIndex = computed(()=>store.state.player.playingIndex);
    const songListLength = computed(()=>store.state.player.songList.length);
    const ifCircle = computed(()=>{
      return store.state.player.sequence === 3;
    })
    const isSpreading = computed(()=>{
      return store.state.isSpreading;
    })
    const isPlaying = computed(()=>{
      return store.state.player.isPlaying;
    })
    const songInfo = computed(()=>{
      return store.state.player?.songInfo ?? {};
    })
    const liked = computed(()=>likelist.value.has(songInfo.value.id))
    const getSongList = ()=>{
      store.commit('changeSlider',store.state.slider == 1 ? 0 : 1);
    }
    const play = ()=>{
      store.commit('player/changeIsPlaying',true);
      audio.value.play();
    }
    const pause = ()=>{
      store.commit('player/changeIsPlaying',false);
      audio.value.pause();
    }
    const likeSong = async ()=>{
      try{
        const data = await $post(`/api/like?id=${songInfo.value.id}&like=${!liked.value}`)
        if(data.code === 200){
          if(liked.value){
            store.commit('user/deleteLike',songInfo.value.id);
          }else{
            store.commit('user/addLike',songInfo.value.id);
          }
        }
      }catch(e){
        console.log(e);
      }
    }
    let totalTime = ref("00:00");
    const currentTime = computed(()=>{
      return timeFormat(store.state.player.currentTime * 1000);
    })
    const sequence = computed(()=>store.state.player.sequence);
    const handleGetDuration = (e)=>{
      duration.value = e.target.duration;
      totalTime.value = timeFormat(e.target.duration * 1000);
    }
    const handleTimeUpdate = (e)=>{
      store.commit('player/setCurrentTime',e.target.currentTime);
      percentage.value = (e.target.currentTime * 100 / duration.value).toFixed(3);
    }
    const handleMusicEnded = (e)=>{
      if(playingIndex.value + 1 === songListLength.value && sequence.value === 0){
        pause();
      }else{
        nextSong()
      }
    }
    const handleClickProgress = (e)=>{
      percentage.value = ((e.clientX - progressRef.value.offsetLeft) / progressRef.value.offsetWidth).toFixed(2);
      audio.value.currentTime = percentage.value * duration.value;
    }
    const nextSong = ()=>{
      if(ifCircle.value){
        play();
      }else{
        store.dispatch('player/nextSong');
      }
    }
    const preSong = ()=>{
      if(ifCircle.value){
        play();
      }else{
        store.dispatch('player/preSong');
      }
    }
    let timer = null;
    const changeSequence = ()=>{
      if(timer) clearTimeout(timer);
      isChanging.value = true;
      store.commit('player/changeSequence',sequence.value+1);
      timer = setTimeout(()=>{
        isChanging.value = false;
      },800)
    }
    const mute = ()=>{
      isMute.value = true;
    }
    const cancelMute = ()=>{
      isMute.value = false;
    }
    const handleClickVolume = (e)=>{
      if(e.target !== volumeDot.value){
        height.value = (volumeRef.value.offsetHeight - e.layerY);
      }
    }
    let startY;
    const handleMouseDown = (e)=>{
      startY = e.clientY;
      window.addEventListener('mousemove',handleMouseMove);
      window.addEventListener('mouseup',handleMouseUp);
      isHover.value = true;
    }
    const handleMouseUp = (e)=>{
      setTimeout(()=>{
        isHover.value = false;
      },1000)
      window.removeEventListener('mousemove',handleMouseMove);
      window.removeEventListener('mouseup',handleMouseUp);
    }
    let handleMouseMove = (e)=>{
      if(height.value + startY - e.clientY >= volumeRef.value.offsetHeight){
        height.value = volumeRef.value.offsetHeight;
      }else if(height.value + startY - e.clientY <= 0){
        height.value = 0;          
      }else{
        height.value += startY-e.clientY;
      }
      startY = e.clientY;
    }
    const showPlaylistBox = ()=>{
      store.commit('changePlaylistBoxShow',true);
    }
    watch(()=>songInfo.value.id,(newValue)=>{
      nextTick(()=>{
        play()
      })
    })
    watch(height,(newValue)=>{
      audio.value.volume = newValue / volumeRef.value.offsetHeight
      if(height.value === 0){
        mute();
      }else{
        cancelMute();
      }
    })
    watch(()=>props.skipTime,(newValue)=>{
      audio.value.currentTime = newValue;
    })
    onMounted(()=>{
      watch(isPlaying,(newValue)=>{
        if(newValue){
          audio.value.play();
        }else{
          audio.value.pause();
        }
      },{
        immediate:true
      })
      const memorize = watch(duration,(newValue)=>{
        percentage.value = (store.state.player.currentTime / newValue).toFixed(2);
        audio.value.currentTime = percentage.value * duration.value;
        memorize();
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
      changeSequence,
      isChanging,
      height,
      mute,
      isMute,
      handleClickVolume,
      volumeRef,
      volumeDot,
      handleMouseDown,
      isHover,
      cancelMute,
      sequenceMap,
      likeSong,
      liked,
      showPlaylistBox,
    }
  }
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#player{
  display: flex;
  justify-content: space-between;
  line-height: 70px;
  position: relative;
  .overflowhidden{
    overflow: hidden;
  }
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
        place-content: space-between center;
        line-height: 16px;
        font-size: 16px;
        margin-bottom: 6px;
        .privilege{
          margin-left: 2px;
        }
        .like{
          margin-left: 6px;
          .anticon{
            color: #666;
            font-size: 16px;
            cursor: pointer;
          }
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
    .sequence{
      position: relative;
      /* 火狐 */
      -moz-user-select: none;
      /* Safari 和 欧朋 */
      -webkit-user-select: none;
      /* IE10+ and Edge */
      -ms-user-select: none;
      /* Standard syntax 标准语法(谷歌) */
      user-select: none;
      .overlay{
        position: absolute;
        left: -23px;
        top: -18px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background-color: #222;
        font-size: 12px;
        transition: opacity 1s;
      }
    }
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
    .volume{
      position: relative;
      &:hover .volumeBox,
      &.isHover .volumeBox{
        opacity: 1;
      }
      .volumeBox{
        opacity: 0;
        top: -86px;
        left: -5px;
        position: absolute;
        width: 28px;
        height: 100px;
        background-color: #252525;
        border: solid 1px #303030;
        box-shadow: 0 0 6px #151515;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-top: 7px;
        padding-bottom: 7px;
        #volumeTrack{
          height: 100%;
          width: 4px;
          background-color: #3b3b3b;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          #volume{
            width: 100%;
            background-color: #ec4141;
            border-radius: 2px;
          }
        }
        
        &::after{
          position: absolute;
          bottom: -5px;
          left: 9px;
          content: '';
          border: solid 5px #252525;
          border-radius: 5px;
          border-top-color: transparent;
        }
      }
    }
    
    div{
      cursor: pointer;
    }
  }
  .trackDot{
    cursor: pointer;
    height: 4px;
    width: 100%;
    border-radius: 50%;
    transform: scale(3);
    background-color: #ec4141;
  }
}
</style>