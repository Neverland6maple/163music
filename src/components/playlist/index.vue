<template>
    <div id="playlist" ref="playlistRef">
        <div id="playlistHead">
            <div id="playlistCover">
                <img :src="`${playlist.coverImgUrl}?param=185y185`" alt="picUrl" id="playlistPic" v-if="playlist.coverImgUrl">
            </div>
            <div id="playlistInfos">
                <div id="playlistName">
                    <div class="playlistIcon">歌单</div>
                    <div class="playlistName">{{ playlist.name }}</div>
                </div>
                {{ state }}
                <div id="playlistCreator">
                  <div id="creatorPic">
                    <img :src="creator.avatarUrl" alt="" class="coverPic">
                  </div>
                  <div id="creatorName">
                    {{ creator.nickname }}
                  </div>
                  <div id="createTime">
                    {{ dateFormat(profile.createTime) }}创建
                  </div>
                </div>
                <div id="playlistFn">
                    <PlayAll @click="playAll"></PlayAll>
                   <TransparemtBtn @click="subscribe">
                    <template #icon>
                      <FolderAddOutlined/>
                    </template>
                    <template #content>
                      {{playlist.subscribed ? '已收藏' : '收藏'}}({{ playlist.subscribedCount }})
                    </template>
                   </TransparemtBtn>
                   <TransparemtBtn>
                    <template #icon>
                      <DownloadOutlined/>
                    </template>
                    <template #content>
                      VIP下载
                    </template>
                   </TransparemtBtn>
                   <TransparemtBtn>
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                    <template #content>
                      下载全部
                    </template>
                   </TransparemtBtn>
                </div>
                <div id="playlistInfo">
                    <div id="playlistTag" v-if="isCreator || playlist.tags.length > 0">
                      <div class="profileTable">标签:</div>
                      <div v-if="isCreator && playlist.tags.length == 0"><router-link to="/">添加标签</router-link></div>
                      <div class="tags" v-else-if="playlist.tags.length > 0">
                        <template v-for="(item,index) in playlist.tags" :key="index">
                          <span v-if="index !== 0" class="slash">/</span>
                          <router-link to="/" class="tagItem">{{ item }}</router-link>
                        </template>
                      </div>
                    </div>
                    <div id="playlistStatistics">
                        <div class="statisticsItem">
                            歌曲：<span class="songsCount">{{ playlist.trackCount }}</span>
                        </div>
                        <div class="statisticsItem">
                            播放：<span class="songsPlay">{{ playCount }}</span>
                        </div>
                    </div>
                    <div id="playlistProfile" v-if="isCreator || playlist.description ">
                        <div class="profileTable">简介:</div><router-link to="/" v-if="isCreator && !playlist.description">添加简介</router-link>
                        <div v-else-if="playlist.description" class="description">{{ playlist.description }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div id="playlistList">
            <div id="playlistTab">
                <a-tabs v-model:activeKey="activeKey" :animated="false" :tabBarGutter="20" @change="handleIndexChange">
                    <a-tab-pane key="1" tab="歌曲列表"></a-tab-pane>
                    <a-tab-pane key="2" :tab="`评论(${playlist.commentCount})`"></a-tab-pane>
                    <a-tab-pane key="3" tab="收藏者"></a-tab-pane>
                </a-tabs>
                <div class="tableSearch">
                  <input type="text" v-model="value" class="searchIpt" placeholder="搜索歌单音乐" @keydown="filterDataDB">
                  <div class="modifier">
                    <span v-if="value.length > 0" style="cursor: pointer;" @click="{value = '';rovoke();}">×</span>
                    <FileSearchOutlined v-else/>
                  </div>
                </div>
            </div>
            <myTable :user="isCreator" :columns="columns" :dataSource="dataSource" @handle-play-song="handlePlaySong" :spinning="spinning" v-if="activeKey === '1'" :pagination=false></myTable>
            <albumComment v-else-if="activeKey === '2'" :id="playlistId" :type=2></albumComment>
            <subscribers v-else-if="activeKey === '3'" :id="playlistId">收藏者</subscribers>
        </div>
    </div>
</template>
<script setup>
import PlayAll from '../unit/PlayAll.vue';
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import myTable from '@/components/unit/MyTable.vue';
import {FolderAddOutlined ,DownloadOutlined,HeartOutlined,HeartFilled,FileSearchOutlined } from '@ant-design/icons-vue'
import { getCurrentInstance, watch ,ref,h,computed, onMounted, onUnmounted, nextTick, shallowRef, unref  } from 'vue';
import timeFormat from '@/utils/timeFormat';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import TableMenu from '@/components/unit/TableMenu.vue'
import mvIcon from '@/components/icon/mv.vue'
import vipIcon from '@/components/icon/vip.vue'
import noCopyright from '../icon/noCopyright.vue';
import albumComment from '../album/albumComment.vue';
import dateFormat from '@/utils/dateFormat';
import subscribers from '@/components/playlist/Subscribers.vue';
import debounce from '@/utils/debounce';
import throttle from '@/utils/throttle';
import {produce} from "immer";
import { useEventListener } from '@/composables/event';
import { useHistory } from '@/composables/history';
const spinning = ref(false);
const value = ref('')
const {proxy:{$axios,$post}} = getCurrentInstance();
const playlistRef = ref(null);
const props = defineProps({
  like:{
    type:Boolean,
    required:false,
  }
})
const columns = [
  {
    dataIndex: 'number',
    width:'50px',
  },
  {
    dataIndex: 'like',
    width:'25px',
    customCell : (record,rowIndex) => {
      return {
        onClick:async (event) => {
          const like = likelist.value.has(record.key) ? false : true;
          const data = await $post(`/api/like?id=${record.key}&like=${like}`)
          if(data.code === 200){
            if(like){
              store.commit('user/addLike',record.key);
            }else{
              store.commit('user/deleteLike',record.key);
            }
          }
        }
      }
    },
    customRender:({text, record, index, column})=>{
      return text ? <HeartFilled style={'color:#ec4141'} class={'likeIcon liked'}/> : <HeartOutlined class={'likeIcon'}/>
    }
  },
  {
    dataIndex: 'download',
    width:'25px',
    customCell : (record,rowIndex) => {
      return {
        onClick: async (event) => {
          const {data:res1} = await $axios({
            method:'get',
            url:`/api/song/detail?ids=${record.key}`
          })
          const {data:res} = await $axios({
            method:'get',
            url:`/api/song/download/url?id=${record.key}&br=${res1.songs[0].m.br}`
          })
        }
      }
    },
    customRender:({text, record, index, column})=>{
      return <DownloadOutlined class={'downloadIcon'}/>
    }
  },
  {
    title: '音乐标题',
    dataIndex: 'song',
    width:'40%',
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          const id = event.target.dataset.id;
          if(id){
            router.push(`/mv/${event.target.dataset.id}`)
          }
        }
      }
    },
    sorter:(a,b)=>{
      return a.song.name < b.song.name
    },
    customRender:({text, record, index, column})=>{
      if(!text.highlight){
        return <div class="song">{text.name}<vipIcon style={text.fee === 1 ? '' : 'display:none'} /><mvIcon data-id={text.mv} style={text.mv != 0 ? '' : 'display:none'} /><noCopyright style={text.noCopyrightRcmd !== null ? '' : 'display:none'} /></div>
      }else{
        return <div class="song">{highlight(text.name,text.highlight)}<vipIcon style={text.fee === 1 ? '' : 'display:none'} /><mvIcon data-id={text.mv} style={text.mv != 0 ? '' : 'display:none'} /><noCopyright style={text.noCopyrightRcmd !== null ? '' : 'display:none'} /></div>
      }
    }
  },
  {
    title: '歌手',
    dataIndex: 'singer',
    width:'19%',
    ellipsis:true,
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          const singerId = event.target.dataset.singerid;
          if(singerId){
            router.push(`/artist/${event.target.dataset.singerid}`)
          }
        }
      }
    },
    sorter:(a,b)=>{
      return a.singer[0].name < b.singer[0].name
    },
    customRender:({text, record, index, column})=>{
      const content = [];
      // if(!text.highlight){
      text.forEach((el,index)=>{
        if(index > 0){
          content.push(<span class="slash">/</span>);
        }
        if(!el.highlight){
          content.push(<span class='singerName' data-singerId={el.id}>{el.name}</span>);
        }else{
          content.push(<span class='singerName' data-singerId={el.id}>{(highlight(el.name,value.value))}</span>);
        }
        
      });
      return <div class="singer">{content}</div>
    }
  },
  {
    title: '专辑',
    dataIndex: 'album',
    width:'26%',
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          if(record.album.id == playlistId.value){
            message.info('是同一张专辑');
          }else{
            router.push(`/album/${record.album.id}`)
          }
        }
      }
    },
    sorter:(a,b)=>{
      return a.album.name < b.album.name;
    },
    customRender:({text, record, index, column})=>{
      if(!text.highlight){
        return <div class="album" playlistId={text.id}>{text.name}</div>
      }else{
        return <div class={'album'} playlistId={text.id}>{highlight(text.name,value.value)}</  div>
      }
    }
  },
  {
    title: '时长',
    dataIndex: 'dt',
    width:'10%',
    sorter: (a, b) => {
      return b.dt - a.dt;
    },
    customRender:({text, record, index, column})=>{
      return <div class='dt' dt={text} >{timeFormat(text)}</div>
    }
  },
];
const creator = ref({});
let dataSource = shallowRef([]);
const route = useRoute();
const router = useRouter();
const store = useStore();
const songs = shallowRef([]);
const profile = computed(()=>store.state.user.profile);
const playlist = ref({tags:[]});
const playlistId = ref(null);
const activeKey = ref('1');
const unsubscribeState = computed(()=>store.getters.unsubscribe); 
const tableMenu = computed(()=>store.state.tableMenu);
const likelist = computed(()=>store.state.user.likelist);
const isCreator = computed(()=>profile.value.userId === creator.value.userId);
let songList = [];
let showCount = 0;
let trackCount = 0;
let baseState = [];


const getList = async (id)=>{
  spinning.value = true;
  const {data:res1} = await $axios({
    method:'get',
    url:`/api/playlist/detail?id=${id}&timestamp=${Date.now()}`,
  });
  creator.value = res1.playlist.creator;
  playlist.value = res1.playlist;

  dataSource.value = [];
  songList = [];
  songs.value = [];

  trackCount = res1.playlist.trackCount;
  let count = 0,limit = 0;
  limit = trackCount > 500 ? 500 : trackCount;

  const {data:res} = await $axios({
    method:'get',
    url:`/api/playlist/track/all?id=${id}&limit=${limit}&offset=${count}&timestamp=${Date.now()}`,
  });
  songs.value.push(...res.songs);
  count += limit;
  limit = trackCount - count > 500 ? 500 : trackCount - count;
  if(count !== trackCount){
    getMoreList(id,limit,count);
  }else{
    setSongList(songs.value);
  }
  renderList(songs.value.slice(dataSource.value.length,dataSource.value.length+500))
  spinning.value = false;
}

const getMoreList = (id,limit,count)=>{
  $axios({
    method:'get',
    url:`/api/playlist/track/all?id=${id}&limit=${limit}&offset=${count}&timestamp=${Date.now()}`,
  }).then((res)=>{
    songs.value.push(...res.data.songs);
    count += limit;
    limit = trackCount - count > 500 ? 500 : trackCount - count;

    if(count !== trackCount){
      getMoreList(id,limit,count);
    }else{
      setSongList(songs.value);
    }
  })
}
const renderList = (songs)=>{
  const arr = [];
  songs.forEach((item,index)=>{
    const liked = likelist.value.has(item.id);
    arr.push({
      key: item.id,
      index:showCount++,
      number:showCount,
      like:liked,
      song: item,
      singer: item.ar,
      album: item.al,
      dt:item.dt,
      liked,
    })
  })
  dataSource.value = dataSource.value.concat(arr);
  baseState = dataSource.value;
}
const setSongList = (songs)=>{
  songs.forEach((item,index)=>{
    songList.push({
      id:item.id,
      name:item.name,
      singer:item.ar,
      dt:timeFormat(item.dt),
      fee:item.fee,
      noCopyrightRcmd:item.noCopyrightRcmd,
      mv:item.mv,
    })
  })
}
const handlePlaySong = (id,index)=>{
  store.commit('player/setSongList',songList);
  store.commit('player/changePlayingIndex',index);
  store.dispatch('player/changeSong',id);
  store.commit('player/clearHistoryList',index);
}
const handleIndexChange = (key)=>{
}
const playCount = computed(()=>{
    if(playlist.value.playCount >= 100000){
        return parseInt(playlist.value.playCount/10000) + '万';
    }
    return playlist.value.playCount;
})
const subscribe = async ()=>{
  const t = playlist.value.subscribed ? '2' : '1';
  await $post(`/api/playlist/subscribe?t=${t}&id=${playlistId.value}`);
  const {data:res1} = await $axios({
    method:'get',
    url:`/api/playlist/detail?id=${playlistId.value}&timestamp=${Date.now()}`,
  });
  creator.value = res1.playlist.creator;
  playlist.value = res1.playlist;
}
const filterData = ()=>{
  if(value.value.length === 0) {
    dataSource.value = baseState
    return;
  };
  const {state,update} = useHistory(baseState);
  update(draftState=>{
    for(let i = 0;i < draftState.length;i++){
      const e = draftState[i];
      const resSong = e.song.name.toLowerCase().includes(value.value.toLowerCase());
      const resAlbum = e.album.name && e.album.name.toLowerCase().includes(value.value.toLowerCase());
      let resSinger = false; 
      for(let i = 0;i<e.singer.length;i++){
        if(e.singer[i].name && e.singer[i].name.toLowerCase().includes(value.value.toLowerCase())){
          resSinger = true;
          e.singer[i].highlight = value.value;
        }
      }
      if(resSong){
        e.song.highlight = value.value;
      }
      if(resAlbum){
        e.album.highlight = value.value;
      }
      if(!(resSong || resSinger || resAlbum)){
        draftState.splice(i,1);
        i--;
      }
    }
  })
  // dataSource.value = state.value;


  // const nextState = produce(baseState,draftState=>{
  //   for(let i = 0;i < draftState.length;i++){
  //     const e = draftState[i];
  //     const resSong = e.song.name.toLowerCase().includes(value.value.toLowerCase());
  //     const resAlbum = e.album.name && e.album.name.toLowerCase().includes(value.value.toLowerCase());
  //     let resSinger = false; 
  //     for(let i = 0;i<e.singer.length;i++){
  //       if(e.singer[i].name && e.singer[i].name.toLowerCase().includes(value.value.toLowerCase())){
  //         resSinger = true;
  //         e.singer[i].highlight = value.value;
  //       }
  //     }
  //     if(resSong){
  //       e.song.highlight = value.value;
  //     }
  //     if(resAlbum){
  //       e.album.highlight = value.value;
  //     }
  //     if(!(resSong || resSinger || resAlbum)){
  //       draftState.splice(i,1);
  //       i--;
  //     }
  //   }
  //   // dataSource.value = dataSource.value.filter(e=>{
  //   //   // 发现revoke之后text节点全都变成了字符串，故重写此方法
  //   //   const resSong = e.song.name.toLowerCase().includes(value.value.toLowerCase());
  //   //   const resAlbum = e.album.name && e.album.name.toLowerCase().includes(value.value.toLowerCase());
  //   //   let resSinger = false; 
  //   //   for(let i = 0;i<e.singer.length;i+=2){
  //   //     if(e.singer[i].name && e.singer[i].name.toLowerCase().includes(value.value.toLowerCase())){
  //   //       resSinger = true;
  //   //       break;
  //   //     }
  //   //   }
  //   //   if(resSong){
  //   //     e.song.highlight = value.value;
  //   //     // <div class={'song'}>{highlight(e.song.children[0],value.value)}{...e.song.children.slice(1)}</div>;
  //   //   }
  //   //   // if(resSinger){
  //   //   //   const content = []
  //   //   //   e.singer.children[0].forEach((el,index)=>{
  //   //   //     if(index % 2 === 1){
  //   //   //       content.push(el);
  //   //   //     }else{
  //   //   //       content.push(<router-link to={el.props.to} class='singerName' singerId={el.props.singerId}>{(highlight(el. children[0],value.value))}</router-link>);
  //   //   //     }
  //   //   //   });
  //   //   //   e.singer = <div class={'singer'}>{content}</div>
  //   //   // }
  //   //   // if(resAlbum){
  //   //   //   e.album = <div class={'album'} playlistId={e.album.props.playlistId}>{highlight(e.album.children[0],value.value)}</  div>;
  //   //   // }
  //   //   return resSong || resSinger || resAlbum;
  //   // })
  // })
  // dataSource.value = nextState;
  
}
const filterDataDB = debounce(filterData,200);

const highlight = (data,key)=>{
  const arr = data.toLowerCase().split(key.toLowerCase());
  const content = [];
  let index1 = 0,index2 = 0;
  for(let i = 0;i<arr.length;i++){
    if(arr[i] === ''){
      index1 = data.toLowerCase().indexOf(key.toLowerCase(),index1);
      content.push(<mark>{data.slice(index1,index1+key.length)}</mark>);
      index1 += key.length;
      continue;
    }else{
      index2 = data.toLowerCase().indexOf(arr[i],index2);
      content.push(data.slice(index2,index2+arr[i].length));
      index2 += arr[i].length;
    }
    if(i !== arr.length-1){
      index1 = data.toLowerCase().indexOf(key.toLowerCase(),index1);
      content.push(<mark>{data.slice(index1,index1+key.length)}</mark>);
      index1 += key.length;
    }
  }
  return content;
}
const revoke = ()=>{
  dataSource.value = baseState

  // dataSource.value = [];
  // const temp =showCount;
  // showCount = 0;
  // renderList(songs.value.slice(0,temp))

  // dataSource.value.forEach(e=>{
  //   e.song = <div class={'song'}>{unHighlight(e.song.children[0])}{...e.song.children.slice(1)}</div>
  //   e.album = <div class={'album'}>{unHighlight(e.album.children[0])}</div>
  //   const content = [];
  //   e.singer.children[0].children.forEach((el,index)=>{
  //     if(index % 2 === 1){
  //       content.push(el);
  //     }else{
  //       content.push(<router-link to={el.props.to} class='singerName' singerId={el.props.singerId}>{(unHighlight(el.children[0]))}</router-link>);
  //     }
  //   });
  //   e.singer = <div class={'singer'}>{content}</div>
  // })

}
const unHighlight = (data)=>{
  if(data.type.description === 'Fragment'){
    let str = '';
    for(let i = 0;i<data.children.length;i++){
      if(data.children[i].type === 'mark'){
        str += data.children[i].children[0].children;
      }else{
        str += data.children[i].children;
      }
    }
    return str;
  }
  return data.children;
}
const playAll = ()=>{
  handlePlaySong(songList[0].id,0);
}
const getNewList = throttle((start,songs)=>{
  if(start < songs.value.length){
    renderList(songs.value.slice(start,start+500));
  }
},1000)
const monitor = (e)=>{
  if(value.value.length === 0){
    if(playlistRef.value.offsetHeight-e.target.scrollTop-e.target.offsetHeight < 10){
      getNewList(dataSource.value.length,songs);
    }
  }
}
useEventListener(window,'scroll',monitor,true);

watch(()=>route.params.playlistId,(newValue)=>{
  if(newValue === 'undefined'){
    // const path = route.fullPath;
    // const arr = path.split('?');
    // if(arr.at(-1).includes('=')){
    //   arr[arr.length-1] = '?' + arr.at(-1);
    //   console.log(arr.at(-1));
    // }
    // const newPath = arr.reduce((pre,cur)=> pre + cur, arr.shift().slice(0,-9) + playlistId );
    // 要请求到歌单的id才能替换
    router.replace('/');
  }else{
    playlistId.value = newValue;
    value.value = '';
    showCount = 0;
    getList(playlistId.value);
  }
},{
  immediate:true
})
watch(likelist,async (newVal,oldVal)=>{
  const uset = new Set(newVal);
  if(props.like){
    for(let i = 0;i<dataSource.value.length;i++){
      // 找不到key 要删掉
      if(!uset.has(dataSource.value[i].key)){
        dataSource.value.splice(i,1);
        i--;
      }else{
        uset.delete(dataSource.value[i].key);
      }
    }

    if(uset.size){
      const arr = Array.from(uset);
      for(let i = 0;i<arr.length;i++){
        const {data:res} = await $axios(`/api/song/detail?ids=${arr[i]}`);
        const item = res.songs[0];
        dataSource.value.unshift({
          key: item.id,
          index:i,
          number:i+1,
          like:true,
          song: item.name,
          singer: item.ar,
          album: item.al,
          dt:item.dt,
          liked:true,
        })
      }
    }
    dataSource.value.forEach((item,index)=>{
      item.index = index;
      item.number = index + 1;
    })
  }else{
    dataSource.value.forEach((item,index)=>{
      item.like  = newVal.has(item.key);
    })
  }
},{
  deep:true
})
watch(unsubscribeState,val=>{
  if(val){
    for(let i = 0;i<dataSource.value.length;i++){
      dataSource.value[i].index = i;
      dataSource.value[i].number = i + 1;
      if(dataSource.value[i].key === tableMenu.value.song.id){
        dataSource.value.splice(i,1);
        i--;
      }
    }
  }
})


</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#playlist{
    width: 100%;
    #playlistHead{
        width: 100%;
        box-sizing: border-box;
        padding:32px 28px 20px 28px;
        display: flex;
        justify-content: left;
        #playlistCover{
            width: 185px;
            height: 185px;
            #playlistPic{
                width: 100%;
                height: 100%;
            }
        }
        #playlistInfos{
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: left;
            align-items: flex-start;
            margin-left: 40px;
            overflow: hidden;
            #playlistName{
                display: flex;
                align-items: center;
                text-align: left;
                .playlistIcon{
                  font-size: 13px;
                  padding: 3px 4px;
                  border-radius: 2px;
                  border: solid 1px #ec4141;
                  color: #ec4141;
                  min-width: 36px;
                }
                .playlistName{
                    margin-left: 8px;
                    font-size: 22px;
                    font-weight: bold;
                }
            }
            #playlistFn{
                display: flex;
                margin-top: 12px;
              >div{
                margin-right: 10px;
              }
            }
            #playlistInfo{
                margin-top: 16px;
                width: 100%;
                #playlistTag,#playlistStatistics,#playlistProfile{
                    font-size: 12px;
                    text-align: left;
                    line-height: 22px;
                    color: #d5d5d5;
                    a{
                        color: #85b9e6;
                    }
                }
                #playlistTag{
                  .slash{
                    margin: 0 4px;
                  }
                }
                #playlistStatistics{
                    display: flex;
                    justify-content: left;
                    .songsCount,.songsPlay{
                      color: #8b8b8b;
                    }
                    .statisticsItem{
                        margin-right: 10px;
                    }
                }
                #playlistProfile{
                  width: 100%;
                  padding-right: 30px;
                  .description{
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                }
                .profileTable{
                  float: left;
                  margin-right: 10px;
                }
            }
            #playlistCreator{
              display: flex;
              align-items: center;
              justify-content: left;
              font-size: 12px;
              margin-top: 12px;
              #creatorPic{
                height: 23px;
                width: 23px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 8px;
              }
              #creatorName{
                margin-right: 8px;
                color: #b3cee5;
              }
              #createTime{
                color: #8b8b8b;
              }
            }
        }
    }
    #playlistList{
        #playlistTab{
            margin-left: 32px;
            margin-top: 0px;
            position: relative;
            :deep(.ant-tabs-nav){
                margin-bottom: 6px;
            }
            :deep(.ant-tabs-top) {
                > .ant-tabs-nav::before{
                    display: none;
                }
                .ant-tabs-nav-list{
                    display: flex;
                    justify-content: center;
                }
                .ant-tabs-tab-active{
                    .ant-tabs-tab-btn{
                        color: @black-font-color;
                        text-shadow: 0 0.5 0.5px currentcolor;
                        font-size: 18px;
                        font-weight: bold;
                        position: relative;
                        &::after{
                            content: '';
                            position: absolute;
                            bottom: -3px;
                            left: 50%;
                            transform: translateX(-50%);
                            background-color: #ec4141;
                            height: 3px;
                            box-sizing: border-box;
                            border-radius: 1px;
                            width: 80% !important;
                        }
                    }
                }
                .ant-tabs-tab-btn{
                  &:active{
                    color: inherit;
                  }
                    transition: 0s;
                }
                .ant-tabs-ink-bar{
                    display: none;
                }
                .ant-tabs-tab{
                    color: @black-font-color;
                    font-size: 15px;
                    transition: 0s;
                }
            }
            .tableSearch{
              position: absolute;
              right: 40px;
              top: 16px;
              height: 20px;
              background-color: #323232;
              border-radius: 10px;
              padding-left: 10px;
              padding-right: 20px;
              .searchIpt{
                background-color: transparent;
                outline: none;
                border: none;
                font-size: 12px;
                color:@black-font-color;
                line-height: 20px;
              }
              .modifier{
                position: absolute;
                right: 10px;
                top: 2px;
                color: #adadad;
                .anticon{
                  font-size: 12px;
                }
              }
            }
        }
    }
}
</style>