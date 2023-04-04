<template>
    <div id="GridAlbum">
        <div v-if="type == 0" class="gridContent">
            <div class="gridBox" v-for="(item) in albums" :key="item.id">
                <div class="cover">
                    <img class="coverPic" :src="item.blurPicUrl" alt="">
                    <PlayCircleFilled />
                </div>
                <h3 class="title">{{ item.name }}</h3>
                <div class="publishTime">{{ dateFormat(item.publishTime) }}</div>
            </div>
        </div>
        <div v-else-if="type == 1" class="rowContent">
            <div class="row" v-for="(item) in albums" :key="item.id">
                <div class="cover">
                    <img class="coverPic" :src="item.blurPicUrl" alt="">
                </div>
                <h3 class="title">{{ item.name }}</h3>
                <div class="count">{{item.size}}首</div>
                <div class="publishTime">发行时间：{{ dateFormat(item.publishTime) }}</div>
            </div>
        </div>
        <div v-else-if="type == 2" class="graphContent">
            <div >
                <div class="graphBox" v-for="(item,index) in albums" :key="item.id">
                    <div class="albumInfo">
                        <div class="cover">
                            <img class="coverPic" :src="item.blurPicUrl" alt="">
                        </div>
                        <div class="publishTime">{{ dateFormat(item.publishTime) }}</div>
                    </div>
                    <div class="list">
                        <h2 class="title">{{ item.name }}</h2>
                        <div class="listTable">
                            <MyTable :columns="columns" :data-source="dataSource[index]" :pagination="false" :spinning="spinning[index]" @handlePlaySong="handlePlaySong" :showHeader="false" :id="item.id"></MyTable>
                        </div>
                        <div class="total" v-if="item.size > 10"><router-link to="/" class="toComplete">查看全部{{item.size}}首<RightOutlined /></router-link></div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import {PlayCircleFilled,RightOutlined,DownloadOutlined,HeartOutlined} from '@ant-design/icons-vue';
import MyTable from '../unit/MyTable.vue';
import {getCurrentInstance, ref, watchEffect, reactive, watch} from 'vue';
import timeFormat from '@/utils/timeFormat';
import mvIcon from '@/components/icon/mv.vue'
import vipIcon from '@/components/icon/vip.vue'
import noCopyright from '../icon/noCopyright.vue';
import dateFormat from '@/utils/dateFormat';
import { useStore } from 'vuex';
const props = defineProps({
    albums:Array,
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
  },
  {
    title: '时长',
    dataIndex: 'dt',
    width:'12%'
  },
];
const store = useStore();
const spinning = reactive([]);
const dataSource = ref([]);
const {proxy:{$axios}} = getCurrentInstance();
const getList = async (id,ind)=>{
  spinning[ind] = true;
  const {data:res} = await $axios({
    method:'get',
    url:`/api/album?id=${id}`,
  });
  const songs = res.songs;
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
      song: <div class="song">{item.name}<vipIcon style={item.fee === 1 ? '' : 'display:none'} /><mvIcon style={item.mv != 0 ? '' : 'display:none'} /><noCopyright style={item.noCopyrightRcmd !== null ? '' : 'display:none'} /> </div>,
      dt:<div class='dt'>{timeFormat(item.dt)}</div>,
    })
  }
  spinning[ind] = false;
}
const handlePlaySong = async (songId,index,id)=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/album?id=${id}`
    });
    const songList = [];
    const songs = res.songs;
    songs.forEach(item => {
        songList.push({
            id:item.id,
            name:item.name,
            singer:item.ar,
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
watch(()=>props.albums,val=>{
    const len = spinning.length;
    spinning.splice(len,0,...new Array(val.length-len).fill(false));
    for(let i = len;i < props.albums.length;i++){
        getList(props.albums[i].id,i);
    }
},{
    immediate:true,
    deep:true,
})
</script>
<style scoped lang="less">
@import '@/assets/theme.less';
#GridAlbum{
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
                height: auto;
                object-fit: contain;
                position: relative;
                margin-bottom: 6px;
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
                line-height: 22px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                margin-bottom: 6px;
            }
            .publishTime{
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
                border-radius: 6px;
                overflow: hidden;
            }
            .title{
                color: @black-font-color;
                font-size: 14px;
                flex: 1;
                margin-left: 8px;
            }
            .count{
                min-width: 120px;
                width: 30%;
                padding-right: 12px;
            }
            .publishTime{
                width: 20%;
                display: flex;
                align-items: center;
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
            .albumInfo{
                position: relative;
                .cover{
                    width: 166px;
                    height: 166px;
                    border-radius: 6px;
                    margin-right: 64px;
                }
                
                .publishTime{
                    text-align: left;
                    color: @black-font-color;
                    font-size: 12px;
                    line-height: 20px;
                }
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