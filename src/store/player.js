import {$axios} from '@/request/axios';
import timeFormat from '@/utils/timeFormat';
export default {
  namespaced:true,
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
    current:0,
    songList:[],
    isPlaying:false,
    playingIndex:0,
    sequence:0, //0为顺序播放,1为心动模式，2为循环播放，3为单曲循环，4为随机播放
    historyList:[],
    historyIndex:-1,
  },
  getters: {
  },
  mutations: {
    changeSongURL(state,newURL){
      state.songURL = newURL;
    },
    changeSongInfo(state,obj){
      state.songInfo.url = obj.url;
      state.songInfo.id = obj.id;
      state.songInfo.name = obj.name;
      state.songInfo.ar = obj.ar;
      state.songInfo.al = obj.al;
      state.songInfo.lyric = obj.lyric;
    },
    setCurrent(state,value){
      state.current = value;
    },
    changeIsPlaying(state,value){
      state.isPlaying = value;
    },
    setSongList(state,value){
      state.songList = value;
    },
    changePlayingIndex(state,value){
      if(value < 0){
        state.playingIndex = state.songList.length+value;
      }else{
        state.playingIndex = value;
      }
    },
    changeSequence(state,value){
      state.sequence = (value % 5);
    },
    clearHistoryList(state,index){
      state.historyList = [index];
      state.historyIndex = 0;
    },
    insertSong(state,song){
      state.songList.splice(state.playingIndex+1,0,song);
      console.log(state.songList);
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
    },
    preSong({state,commit,dispatch}){
      switch (state.sequence){
        case 0:
        case 2:
          commit('changePlayingIndex',state.playingIndex-1);
          dispatch('changeSong',state.songList[state.playingIndex].id);
          commit('clearHistoryList',state.playingIndex);
          break;
        case 1:
          break;
        case 4:
          if(state.historyIndex - 1 >= 0){
            commit('changePlayingIndex',state.historyList[state.historyIndex - 1]);
            dispatch('changeSong',state.songList[state.playingIndex].id);
            state.historyIndex--;
          }else{
            commit('changePlayingIndex',Math.floor(Math.random()*state.songList.length));
            dispatch('changeSong',state.songList[state.playingIndex].id);
            state.historyList.unshift(state.playingIndex);
          }
          break;
      }
    },
    nextSong({state,commit,dispatch}){
      switch (state.sequence){
        case 0:
        case 2:
          commit('changePlayingIndex',(state.playingIndex+1) % state.songList.length);
          dispatch('changeSong',state.songList[state.playingIndex].id);
          commit('clearHistoryList',state.playingIndex);
          break;
        case 1:
          break;
        case 4:
          if(state.historyList.length-1 >= state.historyIndex+1){
            commit('changePlayingIndex',state.historyList[state.historyIndex+1]);
            dispatch('changeSong',state.songList[state.playingIndex].id);
          }else{
            commit('changePlayingIndex',Math.floor(Math.random()*state.songList.length));
            dispatch('changeSong',state.songList[state.playingIndex].id);
            state.historyList.push(state.playingIndex);
          }
          state.historyIndex++;
          break;
      }
    },
    insertSong({state,commit,dispatch},song){
      const item = {
        id:song.id,
        name:song.name,
        singer:song.ar[0].name,
        dt:timeFormat(song.dt),
      };
      commit('changeIsPlaying',false);
      commit('insertSong',item);
      commit('changePlayingIndex',(state.playingIndex+1) % state.songList.length);
      dispatch('changeSong',state.songList[state.playingIndex].id);
      commit('clearHistoryList',state.playingIndex);
      commit('changeIsPlaying',true);
    }
  },
}