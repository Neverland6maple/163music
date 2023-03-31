<template>
    <div id="playlist">
        <div id="playlistHead">
            <div id="playlistCover">
                <img :src="`${playlist.coverImgUrl}?param=185y185`" alt="picUrl" id="playlistPic">
            </div>
            <div id="playlistInfos">
                <div id="playlistName">
                    <div class="playlistIcon">歌单</div>
                    <div class="playlistName">{{ playlist.name }}</div>
                </div>
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
                    <PlayAll></PlayAll>
                   <TransparemtBtn>
                    <template #icon>
                      <FolderAddOutlined/>
                    </template>
                    <template #content>
                      收藏({{ playlist.subscribedCount }})
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
            </div>
            <myTable :columns="columns" :dataSource="dataSource" @handle-play-song="handlePlaySong" :spinning="spinning" v-if="activeKey === '1'" :pagination=false></myTable>
            <albumComment v-else-if="activeKey === '2'" :id="playlistId" :type=2></albumComment>
            <subscribers v-else-if="activeKey === '3'" :id="playlistId">收藏者</subscribers>
        </div>
    </div>
</template>
<script setup>
import PlayAll from '../unit/PlayAll.vue';
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import myTable from '@/components/unit/MyTable.vue';
import {FolderAddOutlined ,DownloadOutlined,HeartOutlined } from '@ant-design/icons-vue'
import Pop from '@/components/search/Pop.vue'
import { getCurrentInstance, watch ,ref,h,computed } from 'vue';
import timeFormat from '@/utils/timeFormat';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import mvIcon from '@/components/icon/mv.vue'
import vipIcon from '@/components/icon/vip.vue'
import noCopyright from '../icon/noCopyright.vue';
import albumComment from '../album/albumComment.vue';
import dateFormat from '@/utils/dateFormat';
import subscribers from '@/components/playlist/Subscribers.vue'
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
    customCell:(recod,rowIndex) => {
      return {
        onClick:(event)=>{
          console.log(recod.singer.props.singerId);
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
          if(record.album.props.playlistId == playlistId.value){
            console.log('是同一张专辑');
          }else{
            router.push(`/album/${record.album.props.playlistId}`)
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
const creator = ref({});
const dataSource = ref([]);
const route = useRoute();
const router = useRouter();
const store = useStore();
const songs = ref([]);
const profile = computed(()=>store.state.user.profile);
const playlist = ref({tags:[]});
const playlistId = ref(null);
const activeKey = ref('1');
let songList = [];
const isCreator = computed(()=>profile.value.userId === creator.value.userId)
const getList = async (id)=>{
  spinning.value = true;
  const {data:res} = await $axios({
    method:'get',
    url:`/api/playlist/track/all?id=${id}`,
  });
  const {data:res1} = await $axios({
    method:'get',
    url:`/api/playlist/detail?id=${id}`,
  });
  dataSource.value = [];
  songList = [];
  songs.value = res.songs;
  creator.value = res1.playlist.creator;
  playlist.value = res1.playlist;
  songs.value.forEach((item,index)=>{
    const content = []
    item.ar.forEach((el,index)=>{
      if(index > 0){
        content.push(<span class="slash">/</span>);
      }
        content.push(<router-link to='/' class='singerName'>{el.name}</router-link>);
    });
    dataSource.value.push({
      key: item.id,
      index,
      number:index+1,
      like:<HeartOutlined/>,
      download:<DownloadOutlined/>,
      song: <div class="song">{item.name}<vipIcon style={item.fee === 1 ? '' : 'display:none'} /><mvIcon style={item.mv != 0 ? '' : 'display:none'} /><noCopyright style={item.noCopyrightRcmd !== null ? '' : 'display:none'} /></div>,
      singer: <div class="singer">{content}</div>,
      album: <div class="album" playlistId={item.al.id}>{item.al.name}</div>,
      dt:<div class='dt'>{timeFormat(item.dt)}</div>,
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
const playCount = computed(()=>{
    if(playlist.value.playCount >= 100000){
        return parseInt(playlist.value.playCount/10000) + '万';
    }
    return playlist.value.playCount;
})
watch(()=>route.params.playlistId,(newValue)=>{
  playlistId.value = newValue;
  getList(playlistId.value);
},{
  immediate:true
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
            align-items: start;
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
                  .tagItem{
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