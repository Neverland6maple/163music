<template>
    <div id="album">
        <div id="albumHead">
            <div id="albumCover">
                <img :src="`${album.picUrl}?param=185y185`" alt="picUrl" id="albumPic">
            </div>
            <div id="albumInfos">
                <div id="albumName">
                    <div class="albumIcon">专辑</div>
                    <div class="albumName">{{ album.name }}</div>
                </div>
                <div id="albumFn">
                    <PlayAll></PlayAll>
                   <TransparemtBtn>
                    <template #icon>
                      <FolderAddOutlined/>
                    </template>
                    <template #content>
                      收藏({{ dynamic.subCount }})
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
                      <ShareAltOutlined/>
                    </template>
                    <template #content>
                      {{ dynamic.shareCount }}
                    </template>
                   </TransparemtBtn>
                </div>
                <div id="albumInfo">
                    <div id="albumAr">
                        歌手：<span v-for="(item,index) in ar" :key="index">
                          <template v-if="index % 2 === 0"><router-link :to="`/artist/${item.id}`" class="ar">{{ item.name }}</router-link></template>
                          <template v-else>/</template>
                        </span>
                    </div>
                    <div id="albumPublishTime">
                        时间：<span class="publishTime">{{ dateFormat(album.publishTime) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="albumList">
            <div id="albumTab">
                <a-tabs v-model:activeKey="activeKey" :animated="false" :tabBarGutter="20" @change="handleIndexChange">
                    <a-tab-pane key="1" tab="歌曲列表"></a-tab-pane>
                    <a-tab-pane key="2" :tab="`评论(${dynamic.commentCount})`"></a-tab-pane>
                    <a-tab-pane key="3" tab="专辑详情"></a-tab-pane>
                </a-tabs>
            </div>
            <myTable :columns="columns" :dataSource="dataSource" @handle-play-song="handlePlaySong" :spinning="spinning" v-if="activeKey === '1'" :pagination=false></myTable>
            <albumComment v-else-if="activeKey === '2'" :id="albumId" :type=3></albumComment>
            <albumDescription v-else-if="activeKey === '3'" :description="album.description"></albumDescription>
          </div>
    </div>
</template>
<script setup>
import PlayAll from '../unit/PlayAll.vue';
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import myTable from '@/components/unit/MyTable.vue';
import albumComment from '@/components/album/albumComment.vue';
import albumDescription from '@/components/album/albumDescription.vue';
import {FolderAddOutlined ,DownloadOutlined,ShareAltOutlined,LoadingOutlined,HeartOutlined,HeartFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import Pop from '@/components/search/Pop.vue'
import { getCurrentInstance, watch, reactive,ref,h,computed } from 'vue';
import timeFormat from '@/utils/timeFormat';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import nameFormat from '@/utils/nameFormat';
import dateFormat from '@/utils/dateFormat';
import mvIcon from '@/components/icon/mv.vue'
import vipIcon from '@/components/icon/vip.vue'
import noCopyright from '../icon/noCopyright.vue';
const spinning = ref(false);
const {proxy:{$axios,$post}} = getCurrentInstance();
const likelist = computed(()=>store.state.user.likelist);
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
          try{
            const like = likelist.value.has(record.key) ? false : true;
            const data = await $post(`/api/like?id=${record.key}&like=${like}`)
            if(data.code === 200){
              if(like){
                store.commit('user/addLike',record.key);
              }else{
                store.commit('user/deleteLike',record.key);
              }
            }
          }catch(e){
            console.log(e);
          }
        }
      }
    },
  },
  {
    dataIndex: 'download',
    width:'25px',
  },
  {
    title: '音乐标题',
    dataIndex: 'song',
    width:'38%',
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          const id = event.target.dataset.id
          if(id){
            router.push(`/mv/${event.target.dataset.id}`)
          }
        }
      }
    },
  },
  {
    title: '歌手',
    dataIndex: 'singer',
    width:'16%',
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          const singerId = event.target.dataset.singerid
          if(singerId){
            router.push(`/artist/${event.target.dataset.singerid}`)
          }
        }
      }
    }
  },
  {
    title: '专辑',
    dataIndex: 'album',
    width:'19%',
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          if(record.album.props.albumId == albumId.value){
            message.info('是同一张专辑');
          }else{
            router.push(`/album/${record.album.props.albumId}`)
          }
        }
      }
    }
  },
  {
    title: '时长',
    dataIndex: 'dt',
    width:'8%'
  },
  {
    title: '热度',
    dataIndex: 'pop',
  },
];
const dataSource = ref([]);
const route = useRoute();
const router = useRouter();
const store = useStore();
const songs = ref([]);
const album = ref({});
const dynamic = ref({});
const albumId = ref(null);
const activeKey = ref('1');
let songList = [];
const getList = async (id)=>{
  spinning.value = true;
  const {data:res} = await $axios({
    method:'get',
    url:`/api/album?id=${id}`,
  });
  const {data:res1} = await $axios({
    method:'get',
    url:`/api/album/detail/dynamic?id=${id}`,
  });
  dataSource.value = [];
  songList = [];
  songs.value = res.songs;
  album.value = res.album;
  dynamic.value = res1;
  songs.value.forEach((item,index)=>{
    const content = []
    item.ar.forEach((el,index)=>{
      if(index > 0){
        content.push(<span class="slash">/</span>);
      }
      content.push(<router-link to={'/artist/'+el.id} class='singerName' singerId={el.id}>{el.name}</router-link>);
    });
    const liked = likelist.value.has(item.id);
    dataSource.value.push({
      key: item.id,
      index,
      number:index+1,
      like:liked ? <HeartFilled style={'color:#ec4141'} class={'likeIcon liked'}/> : <HeartOutlined class={'likeIcon'}/>,
      download:<DownloadOutlined/>,
      song: <div class="song">{item.name}<vipIcon style={item.fee === 1 ? '' : 'display:none'} /><mvIcon data-id={item.mv} style={item.mv != 0 ? '' : 'display:none'} /><noCopyright style={item.noCopyrightRcmd !== null ? '' : 'display:none'} /></div>,
      singer: <div class="singer">{content}</div>,
      album: <div class="album" albumId={item.al.id}>{item.al.name}</div>,
      dt:timeFormat(item.dt),
      pop:<Pop>{item.pop}</Pop>,
    })
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
  spinning.value = false;
}
const handlePlaySong = (id,index)=>{
  store.commit('player/setSongList',songList);
  store.commit('player/changePlayingIndex',index);
  store.dispatch('player/changeSong',id);
  store.commit('player/clearHistoryList',index);
}
const handleIndexChange = (key)=>{
}
const ar = computed(()=>nameFormat(album.value.artist));
watch(()=>route.params.albumId,(newValue)=>{
  albumId.value = newValue;
  getList(albumId.value);
},{
  immediate:true
})
watch(likelist,val=>{
  dataSource.value.forEach((item,index)=>{
    item.like  = val.has(item.key) ? <HeartFilled style={'color:#ec4141'} class={'likeIcon liked'}/> : <HeartOutlined class={'likeIcon'}/>;
  })
},{
  deep:true
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#album{
    width: 100%;
    #albumHead{
        width: 100%;
        box-sizing: border-box;
        padding:32px 28px 20px 28px;
        display: flex;
        justify-content: left;
        #albumCover{
            width: 185px;
            height: 185px;
            #albumPic{
                width: 100%;
                height: 100%;
            }
        }
        #albumInfos{
            display: flex;
            flex-direction: column;
            justify-content: left;
            align-items: flex-start;
            margin-left: 40px;
            #albumName{
                display: flex;
                align-items: center;
                text-align: left;
                .albumIcon{
                  font-size: 13px;
                  padding: 3px 4px;
                  border-radius: 2px;
                  border: solid 1px #ec4141;
                  color: #ec4141;
                  min-width: 36px;
                }
                .albumName{
                    margin-left: 8px;
                    font-size: 22px;
                    font-weight: bold;
                }
            }
            #albumFn{
                display: flex;
                margin-top: 32px;
              >div{
                margin-right: 10px;
              }
            }
            #albumInfo{
                margin-top: 20px;
                #albumAr{
                    font-size: 12px;
                    text-align: left;
                    margin-bottom: 10px;
                    color: #d5d5d5;
                    .ar{
                      color: #85b9e6;
                    }
                }
                #albumPublishTime{
                    font-size: 12px;
                    color: #d5d5d5;
                    .publishTime{
                      color: #8b8b8b;
                    }
                }
            }
        }
    }
    #albumList{
        #albumTab{
            margin-left: 32px;
            margin-top: 0px;
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
        }
    }
    
}
</style>