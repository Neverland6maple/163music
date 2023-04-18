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
    },
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
    },
    changeTableMenu(state,value){
      if(value.x >= 0) state.tableMenu.x = value.x;
      if(value.y >= 0) state.tableMenu.y = value.y;
      if(value.commentCount >= 0) state.tableMenu.commentCount = value.commentCount;
      if(typeof value.show === 'boolean') state.tableMenu.show = value.show;
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
