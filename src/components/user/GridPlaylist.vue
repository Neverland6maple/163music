<template>
    <div id="gridPlaylist">
        <div v-if="type == 0" class="gridContent">
            <div class="gridBox" v-for="(item) in playlist" :key="item.id">
                <div class="cover" @click="toPlaylist(item.id)">
                    <img class="coverPic" :src="item.coverImgUrl" alt="">
                    <PlayCircleFilled />
                </div>
                <h3 class="title" @click="toPlaylist(item.id)">{{ item.name }}</h3>
                <div class="count">{{item.trackCount}}首</div>
            </div>
        </div>
        <div v-else-if="type == 1" class="rowContent">
            <div class="row" v-for="(item) in playlist" :key="item.id">
                <div class="cover" @click="toPlaylist(item.id)">
                    <img class="coverPic" :src="item.coverImgUrl" alt="">
                </div>
                <h3 class="title" @click="toPlaylist(item.id)">{{ item.name }}</h3>
                <div class="count">歌曲：{{item.trackCount}}首</div>
                <div class="creator">by<span class="creatorName">{{ item.creator.nickname }}</span></div>
                <div class="subscribed"><FolderAddOutlined />{{ item.subscribedCount }}</div>
                <div class="playCount"><PlayCircleOutlined />{{ item.playCount }}</div>
            </div>
        </div>
        <div v-else-if="type == 2" class="graphContent">
            <div  v-show="!refresh">
                <div class="graphBox" v-for="(item,index) in graphPlaylist" :key="item.id">
                    <div class="cover" @click="toPlaylist(item.id)">
                        <img class="coverPic" :src="item.coverImgUrl" alt="">
                    </div>
                    <div class="list">
                        <h2 class="title">{{  item.name }}</h2>
                        <div class="listTable">
                            <MyTable :columns="columns" :data-source="dataSource[index]" :pagination="false" :spinning="spinning[index]" @handlePlaySong="handlePlaySong" :showHeader="false" :id="item.id"></MyTable>
                        </div>
                        <div class="total"><router-link :to="`/playlist/${item.id}`" class="toComplete">查看全部{{umap.get(item.id)}}首<RightOutlined /></router-link></div>
                    </div>
                </div>
                <a-pagination v-model:current="current" :total="playlist.length" :pageSize="pagesize" show-less-items @change="handlePageChange" :showSizeChanger="false"/>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import {PlayCircleFilled,FolderAddOutlined,PlayCircleOutlined,RightOutlined,DownloadOutlined,HeartOutlined} from '@ant-design/icons-vue';
import MyTable from '../unit/MyTable.vue';
import {getCurrentInstance, ref, watchEffect,computed, reactive} from 'vue';
import timeFormat from '@/utils/timeFormat';
import mvIcon from '@/components/icon/mv.vue'
import vipIcon from '@/components/icon/vip.vue'
import noCopyright from '../icon/noCopyright.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const props = defineProps({
    playlist:Array,
    type:Number
})
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
    title: '时长',
    dataIndex: 'dt',
    width:'12%'
  },
];
const store = useStore();
const pagesize = ref(20);
const current = ref(1);
const router = useRouter();
const spinning = reactive(new Array(pagesize.value).fill(false));
const refresh  = ref(false);
const dataSource = ref([]);
// const songs = ref([]);
const {proxy:{$axios}} = getCurrentInstance();
const graphPlaylist = computed(()=>{
    return props.playlist.slice((current.value-1)*pagesize.value,current.value*pagesize.value);
})
const umap = reactive(new Map());
const getList = async (id,ind)=>{
  spinning[ind] = true;
  const {data:res} = await $axios({
    method:'get',
    url:`/api/playlist/detail?id=${id}`,
  });
  const songs = res.playlist.tracks;
  umap.set(id,res.playlist.trackIds.length)
  dataSource.value[ind] = [];
  for(let i = 0;i<songs.length && i<10;i++){
    const item = songs[i];
    const index = i;
    dataSource.value[ind].push({
      key: item.id,
      index,
      number:index+1,
      like:<HeartOutlined/>,
      download:<DownloadOutlined/>,
      song: <div class="song">{item.name}<vipIcon style={item.fee === 1 ? '' : 'display:none'} /><mvIcon data-id={item.mv} style={item.mv != 0 ? '' : 'display:none'} /><noCopyright style={item.noCopyrightRcmd !== null ? '' : 'display:none'} /> </div>,
      dt:<div class='dt'>{timeFormat(item.dt)}</div>,
    })
  }
  spinning[ind] = false;
}
const handlePlaySong = async (songId,index,id)=>{
    const len = umap.get(id) > 1000 ? 1000 : umap.get(id);
    const {data:res} = await $axios({
        method:'get',
        url:`/api/playlist/track/all?id=${id}&limit=${len}`
    });
    const songList = [];
    const songs = res.songs;
    songs.forEach(item => {
        songList.push({
            id:item.id,
            name:item.name,
            singer:item.ar[0].name,
            dt:timeFormat(item.dt),
            fee:item.fee,
            noCopyrightRcmd:item.noCopyrightRcmd,
            mv:item.mv,
        });
    });
    
    store.commit('player/setSongList',songList);
    store.commit('player/changePlayingIndex',index);
    store.dispatch('player/changeSong',songId);
    store.commit('player/clearHistoryList',index);
}
const handlePageChange = (newPage)=>{
    refresh.value = true;
    for(let i = 0;i<pagesize.value && (i+(newPage-1)*pagesize.value) < props.playlist.length;i++){
        getList(props.playlist[i+(newPage-1)*pagesize.value].id,i);
    }
    setTimeout(()=>{
        refresh.value = false
    },0)
}
const toPlaylist = (id)=>{
    router.push(`/playlist/${id}`)
}
watchEffect(()=>{
    if(props.playlist){
        for(let i = 0;i<pagesize.value && i < props.playlist.length;i++){
            getList(props.playlist[i].id,i);
        }
    }
})
</script>
<style scoped lang="less">
@import '@/assets/theme.less';
#gridPlaylist{
    margin-bottom: 50px;
    .gridContent{
        padding-left: 28px;
        padding-right: 28px;
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(182px,1fr));
        width: 100%;
        gap: 20px;
        .gridBox{
            width: 100%;
            margin-bottom: 40px;
            text-align: left;
            .cover{
                width: 100%;
                object-fit: contain;
                position: relative;
                cursor: pointer;
                .anticon{
                    position: absolute;
                    background-color: #ec4141;
                    border-radius: 50%;
                    right: 10px;
                    bottom: 10px;
                    font-size: 40px;
                    transition: all 1s;
                    opacity: 0;
                }
                &:hover{
                    .anticon{
                        opacity: 1;
                    }
                }
            }
            .title{
                color: @black-font-color;
                line-height: 30px;
                cursor: pointer;
            }
            .count{
                font-size: 12px;
                color:#6b6b6b;
            }
        }
    }
    .rowContent{
        .row{
            padding-left: 28px;
            padding-right: 28px;
            display: flex;
            align-items: center;
            height: 80px;
            width: 100%;
            color: #737373;
            font-size: 12px;
            text-align: left;
            &:nth-child(2n-1){
                background-color: #2f2f2f;
            }
            &:hover{
                background-color: #373737;
            }
            .cover{
                height: 60px;
                width: 60px;
                cursor: pointer;
                border-radius: 6px;
                overflow: hidden;
            }
            .title{
                color: @black-font-color;
                font-size: 14px;
                flex: 1;
                cursor: pointer;
                margin-left: 8px;
            }
            .count{
                min-width: 120px;
                width: 14%;
                padding-right: 12px;
            }
            .creator{
                min-width: 120px;
                width: 14%;
                padding-right: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .creatorName{
                    margin-left: 5px;
                }
            }
            .subscribed{
                min-width: 100px;
                width: 10%;
                display: flex;
                align-items: center;
                .anticon{
                    padding-right: 8px;
                    font-size: 18px;
                }
            }
            .playCount{
                min-width: 80px;
                width: 10%;
                display: flex;
                align-items: center;
                .anticon{
                    padding-right: 8px;
                    font-size: 18px;
                }
            }
        }
    }
    .graphContent{
        padding-left: 28px;
        padding-right: 28px;
        .graphBox{
            width: 100%;
            display: flex;
            margin-bottom: 56px;
            .cover{
                width: 166px;
                height: 166px;
                border-radius: 6px;
                overflow: hidden;
                margin-right: 64px;
                cursor: pointer;
            }
            .list{
                flex: 1;
                .title{
                    text-align: left;
                    line-height: 30px;
                    font-size: 16px;
                    font-weight: bold;
                    color: @black-font-color;
                }
                .listTable{
                    width: 100%;
                }
                .total{
                    text-align: right;
                    line-height: 24px;
                    .toComplete{
                        margin-right: 30px;
                        font-size: 12px;
                        color: #6a6a6a;
                        .anticon{
                            margin-left: 4px;
                            font-size: 10px;
                        }
                        &:hover{
                            color: #8a8a8a;
                        }
                    }
                }
            }
        }
        :deep(.ant-pagination){
            margin-top: 40px;
            .ant-pagination-item{
                min-width: 24px;
                height: 24px;
                line-height: 24px;
                border-radius: 4px;
                background-color: transparent;
                margin-right: 4px;
                border-color: #414141;
                a{
                    color: #8b8b8b;
                    font-size: 13px;
                }
            }
            .ant-pagination-item-active{
                border-color: none;
                background-color: #ec4141;
                a{
                    color: white;
                }
            }
            .ant-pagination-prev,.ant-pagination-next{
                min-width: 26px;
                height: 26px;
                line-height: 26px;
                margin-right:4px;
                .ant-pagination-item-link{
                    color: #8b8b8b;
                    border-color: #414141;
                    background-color: transparent;
                }
            }
        }
    }
}
</style>