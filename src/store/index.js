import { createStore } from 'vuex';
import player from './player';
import history from './history';
import user from './user';
export default createStore({
  state:{
    isSpreading:true,
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
    history,
    user,
  }
})
