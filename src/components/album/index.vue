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
                          <template v-if="index % 2 === 0"><router-link to="/" class="ar">{{ item.name }}</router-link></template>
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
            <myTable :columns="columns" :dataSource="dataSource" @handle-play-song="handlePlaySong" :spinning="spinning" v-if="activeKey === '1'"></myTable>
            <albumComment v-else-if="activeKey === '2'" :id="albumId"></albumComment>
            <albumDescription v-else-if="activeKey === '3'" :description="album.description"></albumDescription>
          </div>
    </div>
</template>
<script setup>
import PlayAll from '../unit/PlayAll.vue';
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import myTable from '@/components/unit/Table.vue';
import albumComment from '@/components/album/albumComment.vue';
import albumDescription from '@/components/album/albumDescription.vue';
import {FolderAddOutlined ,DownloadOutlined,ShareAltOutlined,LoadingOutlined,HeartOutlined } from '@ant-design/icons-vue'
import Pop from '@/components/search/Pop.vue'
import { getCurrentInstance, watch, reactive,ref,h,computed } from 'vue';
import timeFormat from '@/utils/timeFormat';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import nameFormat from '@/utils/nameFormat';
import dateFormat from '@/utils/dateFormat';
const spinning = ref(false);
const {proxy:{$axios}} = getCurrentInstance();
const columns = [
  {
    dataIndex: 'number',
    width:'50px',
  },
  {
    dataIndex: 'like',
    width:'25px',
  },
  {
    dataIndex: 'download',
    width:'25px',
  },
  {
    title: '音乐标题',
    dataIndex: 'song',
    width:'38%'
  },
  {
    title: '歌手',
    dataIndex: 'singer',
    width:'16%',
  },
  {
    title: '专辑',
    dataIndex: 'album',
    width:'19%'
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
    dataSource.value.push({
      key: item.id,
      index,
      number:index+1,
      like:<HeartOutlined/>,
      download:<DownloadOutlined/>,
      song: <div class="song">{item.name}</div>,
      singer: <route-link data-name={item.ar[0].name}>{item.ar[0].name}</route-link>,
      album: <div class="album">{item.al.name}</div>,
      dt:timeFormat(item.dt),
      pop:<Pop>{item.pop}</Pop>,
      })
      songList.push({
        id:item.id,
        name:item.name,
        singer:item.ar[0].name,
        dt:timeFormat(item.dt),
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
            align-items: start;
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