import { createStore } from 'vuex';
import player from './player';
import history from './history';
import user from './user';
export default createStore({
  state:{
    isSpreading:false,
    slider:0, // 0为不展示，1为播放列表，2为消息,
    loginShow:false,
    isCover:false,
    tableMenu:{
      show:false,
      commentCount:0,
      x:0,
      y:0,
      user:false,
      song:null,
    },
    sliderMenu:{
      show:false,
      x:0,
      y:0,
      id:null,
      user:false,
    },
    comfirmShow:{
      show:false,
      comfirmText:'',
    },
    comfirmRes:false,
    playlistBoxShow:false,
    createPlaylist:{
      show:false,
      update:false,
      id:undefined,
    },
  },
  getters:{
    unsubscribe(state){
      return !state.comfirmShow.show && state.comfirmRes;
    }
  },
  mutations:{
    changeIsSpreading(state,value){
      state.isSpreading = value;
    },
    changeSlider(state,value){
      state.slider = value;
    },
    changeLoginShow(state,value){
      state.loginShow = value;
    },
    changeIsCover(state,value){
      state.isCover = value;
    },
    changeTableMenu(state,value){
      Object.assign(state.tableMenu,value);
    },
    changeSliderMenu(state,value){
      Object.assign(state.sliderMenu,value);
    },
    changeComfirmShow(state,value){
      Object.assign(state.comfirmShow,value)
    },
    setComfirmRes(state,value){
      state.comfirmRes = value;
    },
    changePlaylistBoxShow(state,value){
      state.playlistBoxShow = value;
    },
    changeCreatePlaylist(state,{show,update,id}){
      if(show !== undefined) state.createPlaylist.show = show;
      if(update !== undefined) state.createPlaylist.update = update;
      if(id !== undefined) state.createPlaylist.id = id;
    },
  },
  actions:{

  },
  modules: {
    player:player,
    history,
    user,
  }
})
