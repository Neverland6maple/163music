import { createStore } from 'vuex';
import {$axios} from '@/request/axios';
import { Math } from 'core-js';



export default createStore({
  state: {
    songURL:'',
    songInfo:{
      url:'',
      id:'',
      name:'',
      ar:[],
      al:{},
      lyric:[],
    },
    isSpreading:false,
    isPlaying:false,
    current:0,
    slider:0, // 0为不展示，1为播放列表，2为消息,
    songList:{
      id:'',
      name:'',
      ar:[],
      dt:'00:00',
    },
    playingIndex:0,
    sequence:0, //0为顺序播放,1为心动模式，2为循环播放，3为单曲循环，4为随机播放
  },
  getters: {
  },
  mutations: {
    changeSongURL(state,newURL){
      state.songURL = newURL;
    },
    changeIsSpreading(state,value){
      state.isSpreading = value;
    },
    changeSongInfo(state,obj){
      state.songInfo.url = obj.url;
      state.songInfo.id = obj.id;
      state.songInfo.name = obj.name;
      state.songInfo.ar = obj.ar;
      state.songInfo.al = obj.al;
      state.songInfo.lyric = obj.lyric;
    },
    changeIsPlaying(state,value){
      state.isPlaying = value;
    },
    setCurrent(state,value){
      state.current = value;
    },
    changeSlider(state,value){
      state.slider = value;
    },
    setSongList(state,value){
      state.songList = value;
    },
    changePlayingIndex(state,value){
      if(value < 0){
        state.playingIndex = state.songList.length-value;
      }else{
        state.playingIndex = value;
      }
    },
    nextSong(state){
      switch (state.sequence){
        case 0:
          if(state.playingIndex+1 === state.songList.length){
            this.commit('changeIsPlaying',false);
            break;
          }
          this.commit('changePlayingIndex',state.playingIndex+1);
          this.dispatch('changeSong',state.songList[state.playingIndex].id);
          break;
        case 1:
          break;
        case 2:
          this.commit('changePlayingIndex',(state.playingIndex+1) % state.songList.length);
          this.dispatch('changeSong',state.songList[state.playingIndex].id)
          break;
        case 3:
          break;
        case 4:
          this.commit('changePlayingIndex',Math.floor(Math.random()*state.songList.length));
          this.dispatch('changeSong',state.songList[state.playingIndex].id)
          break;
      }
    },
    preSong(state){
      switch (state.sequence){
        case 0:
          this.commit('changePlayingIndex',state.playingIndex-1);
          this.dispatch('changeSong',state.songList[state.playingIndex].id);
          break;
      }
    },
    changeSequence(state,value){
      state.sequence = (value % 5);
    }
  },
  actions: {
    async changeSong(store,id){
      const {data:urlRes} = await $axios({
        method:'get',
        url:`/api/song/url?id=${id}`
      })
      const {data:songRes} = await $axios({
        method:'get',
        url:`/api/song/detail?ids=${id}`
      })
      const {data:lyricRes} = await $axios({
        method:'get',
        url:`/api/lyric?id=${id}`
      })
      if(!urlRes.data[0].url){
        console.log('该歌曲没有音频文件')
      }
      const obj = {
        url: urlRes.data[0].url,
        id :songRes.songs[0].id,
        name:songRes.songs[0].name,
        ar :songRes.songs[0].ar,
        al :songRes.songs[0].al,
        lyric:[lyricRes.lrc.lyric,lyricRes?.tlyric?.lyric ?? null],
      }
      store.commit('changeSongInfo',obj);
    }
  },
  modules: {
  }
})
