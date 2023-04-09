<template>
    <div class="myVideo" ref="myVideoRef">
        <div class="videoTop" ref="videoTopRef" :class="{'inactive':inActive}" :style="{'display':isShow ? 'flex' : 'none'}">
            <div class="left">
                <div class="name">{{ mvData.name }}</div>
                &nbsp;-&nbsp;
                <div class="ar">
                    <span v-for="(item,index) in mvData.artists" :key="item.id" class="arItem">
                        <span class="arItemName">{{ item.name }}</span>
                        <span v-if="index !== mvData.artists.length-1" class="slash">/</span>
                    </span>
                </div>
            </div>
            <div class="right">
                <LikeOutlined></LikeOutlined>
                <FolderAddOutlined></FolderAddOutlined>
                <CommentOutlined />
                <LinkOutlined></LinkOutlined>
                <DownloadOutlined></DownloadOutlined>
            </div>
        </div>
        <div class="videoBox">
            <div data-vjs-player class="videoBody" ref="videoBoxRef">
                <video ref="videoRef" class="video-js vjs-default-skin">抱歉，您的浏览器不支持</video>
            </div>
        </div>
        <div class="controls" ref="controlsRef" :class="{'inactive':inActive}">
            <div class="progress" ref="progressRef" @click="skip">
                <div class="progressBar" :style="{'width':(progressVal*100 )+ '%',}">
                </div>
                <div class="bufferBar" :style="{'width':(bufferVal*100 )+ '%',}"></div>
                <div class="dot" @mousedown="handleProgressDrag" ref="progressDot"></div>
            </div>
            <div class="controlsFns">
                <div class="left">
                    <div class="course">
                        <PauseCircleOutlined v-if="isPlaying" @click="pause" />
                        <PlayCircleOutlined v-else @click="play"/>
                    </div>
                    <div class="duration">
                        <span class="currentTime">{{ timeFormat(currentTime*1000) }}</span>
                        <span class="slash">&nbsp;/&nbsp;</span>
                        <span class="totalDuration">{{ timeFormat(duration*1000) }}</span>
                    </div>
                </div>
                <div class="right">
                    <div class="volumes">
                        <div class="volumesIcon">
                            <FilterOutlined :style="{transform:'rotate(90deg)'}" @click="mute" v-if="!isMute"/>
                            <AudioMutedOutlined @click="cancelMute" v-else/>
                        </div>
                        <div class="volumesProgress" ref="volumesRef" @click="skipVolumes">
                            <div class="progressBar" :style="{'width':(volumesVal*100 )+ '%',}" >
                                <div class="dot" @mousedown="handleVolumesDrag" ref="volumesDot"></div>
                            </div>
                        </div>
                    </div>
                    <div class="quality" @click="changeShow">
                        <DesktopOutlined />
                        {{ brs.get(br) }}
                        <div class="qualityList" :style="{'display':showQuailty ? 'block' : ''}">
                            <div v-if="brs.has(1080)" :class="{'qualityItem':true, 'select':props.br === 1080}" style="letterSpacing: 0px;paddingLeft:10px" @click="changeUrl(1080)">1080P</div>
                            <div v-if="brs.has(720)" :class="{'qualityItem':true, 'select':props.br === 720}" @click="changeUrl(720)">超清</div>
                            <div v-if="brs.has(480)" :class="{'qualityItem':true, 'select':props.br === 480}" @click="changeUrl(540)">高清</div>
                            <div v-if="brs.has(240)" :class="{'qualityItem':true, 'select':props.br === 240}" @click="changeUrl(360)">标清</div>
                        </div>
                    </div>
                    <div class="extent">
                        <FullscreenOutlined @click="fullScreen" v-if="!isFullscreen"/>
                        <FullscreenExitOutlined @click="exitFullscreen" v-else/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import videojs from "video.js";
//播放器中文，不能使用.js文件
import videozhCN from "video.js/dist/lang/zh-CN.json";
import {PauseCircleOutlined ,FullscreenOutlined, FullscreenExitOutlined, DesktopOutlined , PlayCircleOutlined , FilterOutlined , AudioMutedOutlined ,DownloadOutlined,LikeOutlined,FolderAddOutlined,LinkOutlined,CommentOutlined} from '@ant-design/icons-vue';
//样式文件注意要加上
import "video.js/dist/video-js.css"; 
import {ref,onMounted,watch, onBeforeUnmount, nextTick} from 'vue';
import timeFormat from "@/utils/timeFormat";
import debounce from "@/utils/debounce.js"
import { computed } from "@vue/reactivity";
const videoRef = ref(null);
const props = defineProps({
    src:String,
    mvData:Object,
    mvInfo:Object,
    br:Number,
})
const emit = defineEmits(['changeUrl']);
const isPlaying = ref(true);
const isMute = ref(false);
const player = ref(null);
const volumesRef = ref(null);
const progressRef = ref(null);
const currentTime = ref(0);
const progressVal = ref(0);
const volumesVal = ref(100);
const duration = ref(0);
const progressDot = ref(null);
const volumesDot = ref(null);
const videoBoxRef = ref(null);
const myVideoRef = ref(null);
const controlsRef = ref(null);
const videoTopRef = ref(null);
const isFullscreen = ref(false);
const inActive = ref(false);
const bufferVal = ref(0); 
const isShow = ref(false);
const isChange = ref(false);
const showQuailty = ref(false);
const brsObj = {
    '1080':'1080P',
    '720':'超清',
    '480':'高清',
    '240':'标签',
}
const brs = computed(()=>{
    const umap = new Map();
    try{
        props.mvData.brs.forEach(item=>{
            umap.set(item.br,brsObj[item.br]);
        })
    }catch(e){
        e;
    }
    return umap;
})
const changeShow = ()=>{
    showQuailty.value = !showQuailty.value;
}
let flag = true;
const skip = (e)=>{
    if(e.target !== progressDot.value){
        progressVal.value = (e.offsetX  / progressRef.value.offsetWidth).toFixed(4);
        player.value.currentTime(progressVal.value * duration.value);
    }
}
const play = ()=>{
    player.value.play();
    isPlaying.value = true;
}
const pause = ()=>{
    player.value.pause();
    isPlaying.value = false;
}
let clientX;
const handleProgressDrag = (e)=>{
    clientX = e.clientX;
    flag = false;
    window.addEventListener('mousemove',progressMouseMove);
    window.addEventListener('mouseup',progressMouseUp)
}
const progressMouseUp = (e)=>{
    player.value.currentTime(progressVal.value * duration.value);
    flag = true;
    window.removeEventListener('mousemove',progressMouseMove);
    window.removeEventListener('mouseup',progressMouseUp);
}
const progressMouseMove = (e)=>{
    const offset = e.clientX - clientX;
    if( progressVal.value * progressRef.value.offsetWidth + offset  >= progressRef.value.offsetWidth){
        progressVal.value  = 1;
    }else if(progressVal.value * progressRef.value.offsetWidth + offset <= 0){
        progressVal.value = 0;
    }else{
        progressVal.value = ((progressVal.value * progressRef.value.offsetWidth + offset) / progressRef.value.offsetWidth).toFixed(4);
    }
    clientX = e.clientX;
}

const skipVolumes = (e)=>{
    if(e.target !== volumesDot.value){
        volumesVal.value = (e.offsetX  / volumesRef.value.offsetWidth).toFixed(4);
        player.value.volume(volumesVal.value);
    }
}
let clientXVolumes;
const handleVolumesDrag = (e)=>{
    clientXVolumes = e.clientX;
    window.addEventListener('mousemove',volumessMouseMove);
    window.addEventListener('mouseup',volumesMouseUp)
}
const volumessMouseMove = (e)=>{
    const offset = e.clientX - clientXVolumes;
    if( volumesVal.value * volumesRef.value.offsetWidth + offset  >= volumesRef.value.offsetWidth){
        isMute.value = false;
        volumesVal.value  = 1;
    }else if(volumesVal.value * volumesRef.value.offsetWidth + offset <= 0){
        isMute.value = true;
        volumesVal.value = 0;
    }else{
        isMute.value = false;
        volumesVal.value = ((volumesVal.value * volumesRef.value.offsetWidth + offset) / volumesRef.value.offsetWidth).toFixed(4);
    }
    player.value.volume(volumesVal.value);
    clientXVolumes = e.clientX;
}
const volumesMouseUp = (e)=>{
    window.removeEventListener('mousemove',volumessMouseMove);
    window.removeEventListener('mouseup',volumesMouseUp);
}
const mute = ()=>{
    player.value.volume(0);
    isMute.value = true;
}
const cancelMute = ()=>{
    player.value.volume(1);
    isMute.value = false;
}

const fullScreen = ()=>{
    player.value.requestFullscreen();
}
const exitFullscreen = ()=>{
    player.value.exitFullscreen();
}
const changeActive = debounce((value)=>{
    inActive.value = value;
},2000)
const mouseMoving = ()=>{
    inActive.value = true;
    changeActive(false);
}
const changeUrl = (br)=>{
    emit('changeUrl',br);
}
watch(()=>props.src,val=>{
    if(!player.value){
        const options = {
            autoplay: true, //自动播放
            language: "zh-CN",
            preload: "auto", //自动加载
            errorDisplay: true, //错误展示
            width: "100%",
            height: "100%",
            controlBar: false,
            controls:true,
            fluid: true,
            userActions: {
              hotkeys: true //是否支持热键
            },
            notSupportedMessage: "此视频暂无法播放，请稍后再试",
            techOrder: ["html5"],//定义Video.js技术首选的顺序
            sources: [
              {
                src:props.src,
                type: 'video/mp4',
              }
            ]
        }
        player.value = videojs(videoRef.value,options,()=>{
            player.value.on("loadedmetadata",(e)=>{
                duration.value = player.value.duration();
            })
            player.value.on('timeupdate',(e)=>{
                if(flag){
                    currentTime.value = player.value.currentTime();
                    progressVal.value = (currentTime.value / duration.value).toFixed(4);
                }
            })
            player.value.on('play',(e)=>{
                isPlaying.value = true;
            })
            player.value.on('pause',(e)=>{
                isPlaying.value = false;
            })
            player.value.on('fullscreenchange',()=>{
                 // 如果有元素处于全屏模式，则 document.fullscreenElement 将指向该元素。如果没有元素处于全屏模式，则该属性的值为 null。
                if(document.fullscreenElement){
                    videoBoxRef.value.appendChild(controlsRef.value);
                    isFullscreen.value = true;
                    isShow.value = true;
                    window.addEventListener('mousemove',mouseMoving);
                }else{
                    myVideoRef.value.appendChild(controlsRef.value);
                    isFullscreen.value = false;
                    isShow.value = false;
                    window.removeEventListener('mousemove',mouseMoving);
                }
            })
            player.value.on("progress",function(e){
                const timeRange = player.value.buffered();
                bufferVal.value = (player.value.buffered().end(player.value.buffered().length-1) / duration.value).toFixed(4);
            })
            videoBoxRef.value.appendChild(videoTopRef.value);
        })
        videojs.addLanguage("zh-CN", videozhCN);
    }else{
        player.value.reset();
        const time = player.value.currentTime();
        player.value.src([{
            src:val,
            type:'video/mp4'
        }])
        player.value.load();
        isChange.value = true;
        setTimeout(()=>{
            player.value.currentTime(time);
            isChange.value = false;
        },0)
    }
    
})
onMounted(()=>{
  
})
onBeforeUnmount(()=>{
    if (player.value) {
      player.value.dispose();
    }
})
</script>
<style scoped lang='less'>
.myVideo{
    width: 100%;
    min-height: 354px;
    display: flex;
    flex-direction: column;
    background-color: black;
    .videoBox{
        flex: 1;
        background-color: black;
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        .video-js{
            width: 100% !important;
        }
        .controls{
            width: 100%;
            position: absolute;
            bottom: -42px;
            transition: all 0.6s;
            opacity: 0;
            &.inactive{
                opacity: 1;
                bottom: 0;
            }
            .controlsFns{
                background-color: black;
            }
        }
        .videoTop{
            position: absolute;
            top: -50px;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 50px;
            width: 100%;
            padding-left: 20px;
            transition: all 0.6s;
            background-color: rgba(0, 0, 0, 0.6);
            cursor:default;
            .left{
                display: flex;
                align-items: center;
                font-size: 21px;
                color: #aaa;
                // word-spacing: 3px;
                .name{
                    margin-right: 7px;
                }
                .ar{
                    margin-left: 7px;
                }
            }
            .right{
                display: flex;
                align-items: center;
                height: 100%;
                .anticon{
                    padding: 0 20px;
                    margin: 5px 0;
                    font-size: 21px;
                    border-right: solid 1px #333 ;
                    cursor: pointer;
                    &:last-of-type{
                        border-right: none;
                    }
                }
            }
            &.inactive{
                top: 0;
            }
        }
    }
    .controls{
        height: 42px;
        position: relative;
        .progress{
            width: 100%;
            height: 4px;
            cursor: pointer;
            display: flex;
            justify-content: left;
            align-items: center;
            position: relative;
            .progressBar{
                height: 100%;
                background-color: #ec4141;
                position: relative;
                z-index: 1;
            }
            .dot{
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: white;
                cursor: pointer;
                position: relative;
                z-index: 1;
            }
            .bufferBar{
                background-color: #6c6c6c;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 0;
            }
        }
        .controlsFns{
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #111111;
            .left{
                display: flex;
                align-items: center;
                .course{
                    font-size: 24px;
                    margin-left: 10px;
                    margin-right: 10px;
                    font-weight:lighter;
                    cursor: pointer;
                    color: #666;
                }
                .duration{
                    font-size: 12px;
                    color: #bbb;
                }
            }
            .right{
                display: flex;
                align-items: center;
                .volumes{
                    padding: 0 11px;
                    border-right: solid 1px #666;
                    font-size: 12px;
                    color: #a5a7a8;
                    display: flex;
                    align-items: center;
                    .volumesIcon{
                        cursor: pointer;
                    }
                    .volumesProgress{
                        cursor: pointer;
                        margin-left: 14px;
                        width: 100px;
                        height: 4px;
                        background-color: #292929;
                        border-radius: 2px;
                        display: flex;
                        justify-content: left;
                        align-items: center;
                        position: relative;
                        &:hover{
                            .dot{
                                display: block;
                            }
                        }
                        .progressBar{
                            background-color: #ec4141;
                            height: 100%;
                            border-radius: 2px;
                            position: relative;
                        }
                        .dot{
                            position: absolute;
                            top: 50%;
                            right: 0;
                            transform: translateY(-50%);
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: white;
                            cursor: pointer;
                            display: block;
                        }
                    }

                }
                .quality{
                    padding: 0 13px;
                    border-right: solid 1px #666;
                    font-size: 12px;
                    cursor: pointer;
                    color: #a5a7a8;
                    position: relative;
                    .qualityList{
                        width: 100%;
                        background-color: black;
                        position: absolute;
                        bottom: 0;
                        bottom: 34px;
                        left: 0;
                        border: solid 1px #383838;
                        display: none;
                        .qualityItem{
                            color: #e2e2e2;
                            letter-spacing: 8px;
                            padding-left: 19px;
                            font-size: 13px;
                            border-bottom: solid 1px #383838;
                            height: 27px;
                            line-height: 27px;
                            box-sizing: border-box;
                            cursor: pointer;
                            &:last-of-type{
                                border-bottom: none;
                            }
                            &.select:before{
                                content: '✓';
                                position: absolute;
                                left: 6px;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .extent{
                    font-size: 19px;
                    margin-left: 11px;
                    margin-right: 10px;
                    color: #666;
                    cursor: pointer;
                }
            }
            
        }
        
    }
    .slash{
        margin: 0 4px;
    }
}
</style>