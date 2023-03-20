import { createStore } from 'vuex';
import { Math } from 'core-js';
import player from './player';

export default createStore({
  state:{
    isSpreading:false,
    slider:0, // 0为不展示，1为播放列表，2为消息,
    loginShow:false,
  },
  getters:{
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
    }
  },
  actions:{
  },
  modules: {
    player:player,
  }
})
