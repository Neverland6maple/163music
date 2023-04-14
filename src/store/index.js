import { createStore } from 'vuex';
import player from './player';
import history from './history';
import user from './user';
export default createStore({
  state:{
    isSpreading:false,
    slider:2, // 0为不展示，1为播放列表，2为消息,
    loginShow:false,
    isCover:false,
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
    },
    changeIsCover(state,value){
      state.isCover = value;
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
