<template>
    <div id="SongPage">
        <div class="playFn">
            <PlayAll></PlayAll>
            <DownloadAll></DownloadAll>
        </div>
        <!-- <a-table
            class="ant-table-striped"
            size="small"
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :rowClassName="(record, index) => (index % 2 === 0 ? 'table-striped' : null)"
            @change="handleTableChange"
            :customRow=customRow
            /> -->
      <MyTable :columns="columns" :data-Source="dataSource" :spinning="spinning" @handlePlaySong="handlePlaySong" :pagination="pagination" @handleTableChange="handleTableChange"></MyTable>
    </div>
</template>
<script setup>
import PlayAll from '@/components/unit/PlayAll.vue'
import DownloadAll from '@/components/unit/DownloadAll.vue'
import {HeartOutlined,DownloadOutlined } from '@ant-design/icons-vue'
import Pop from '@/components/search/Pop.vue'
import { getCurrentInstance, watch, reactive,ref,computed } from 'vue';
import timeFormat from '@/utils/timeFormat';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import MyTable from '../unit/MyTable.vue';
const spinning = ref(true);
const router = useRouter();
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
    width:'19%',
    customCell : (record,rowIndex) => {
      return {
        onClick:(event) => {
          router.push(`/album/${record.album.props.albumId}`);
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
let current = ref(1);
const store = useStore();
let songList = [];
const getList = async (keyword)=>{
  spinning.value = true;
  const {data:res} = await $axios({
    method:'get',
    url:`/api/cloudsearch?keywords=${keyword}&limit=100&offset=${(current.value-1)*100}`
  })
  spinning.value = false;
  dataSource.value = [];
  songList = [];
  pagination.total = res.result.songCount;
  const songs = res.result.songs;
  songs.forEach((item,index)=>{
    dataSource.value.push({
      key: item.id,
      index,
      number:(current.value-1)*100+index+1,
      like:<HeartOutlined/>,
      download:<DownloadOutlined/>,
      song: <div class="song">{item.name}</div>,
      singer: <route-link data-name={item.ar[0].name} class="singer">{item.ar[0].name}</route-link>,
      album: <div class="album" albumId={item.al.id}>{item.al.name}</div>,
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
}
const  handleTableChange = async (pagination,filters, sorter, { currentDataSource })=>{
    current.value = pagination.current;
    getList(route.query.keyword);
}
const handlePlaySong = (id,index)=>{
  store.commit('player/setSongList',songList);
  store.commit('player/changePlayingIndex',index);
  store.dispatch('player/changeSong',id);
  store.commit('player/clearHistoryList',index);
}
const pagination = reactive({
    pageSize:100,
    total:100,
    showSizeChanger:false,
    current,
})
watch(()=>route.query.keyword,(newValue)=>{
  if(newValue){
    getList(newValue);
  }
},{
  immediate:true
})


</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#SongPage{
    .playFn{
        display: flex;
        width: 270px;
        justify-content: space-between;
    }
    .ant-table-striped{
        :deep(.ant-table){
            background-color: transparent;
        }
        :deep(.ant-table-content){
            .album{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 200px;
            }
            .song{
              width: 250px;
            }
            .ant-table-cell{
                background-color: transparent;
                border-bottom: 0;
                padding-top: 6px;
                padding-bottom: 6px;
                color: @black-font-color;
                font-size: 13px;
                transition: none;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .table-striped td {
                background-color: #2f2f2f;
            }
            tr:hover .ant-table-cell{
                background-color: #373737;
            }
            tr td:first-child{
                padding-left: 20px;
                font-size: 13px;
                color: #666;
            }
            tr td:nth-child(2),td:nth-child(3){
                font-size: 15px;
                color: #666;
                padding-left: 2px;
            }
            .ant-table-thead .ant-table-cell{
                color: #666;
                &::before{
                    visibility: hidden;
                }
            }
        }
    } 
}
</style>