<template>
    <div id="SongPage">
      <a-spin :indicator="indicator" tip="加载中" :spinning="spinning" :style="{color:'#666',display:'flex',alignItems:'center',justifyContent:'center'}"/>  
      <template v-if="!spinning">
        <div class="playFn">
            <PlayAll></PlayAll>
            <DownloadAll></DownloadAll>
        </div>
        <a-table
            class="ant-table-striped"
            size="small"
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :rowClassName="(record, index) => (index % 2 === 0 ? 'table-striped' : null)"
            @change="handleTableChange"
            :customRow=customRow
            />
      </template>
    </div>
</template>
<script setup>
import PlayAll from '@/components/unit/PlayAll.vue'
import DownloadAll from '@/components/unit/DownloadAll.vue'
import {HeartOutlined,DownloadOutlined,LoadingOutlined } from '@ant-design/icons-vue'
import Pop from '@/components/search/Pop.vue'
import { getCurrentInstance, watch, reactive,ref,h,computed } from 'vue';
import timeFormat from '@/utils/timeFormat';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '20px',
    marginRight:'16px',
  },
  spin: true,
});
const spinning = ref(true);
const {proxy:{$axios}} = getCurrentInstance();
const columns = [
  {
    dataIndex: 'number',
    width:'58px'
  },
  {
    dataIndex: 'like',
    width:'16px'
  },
  {
    dataIndex: 'download',
    width:'16px'
  },
  {
    title: '音乐标题',
    dataIndex: 'song',
    width:'36%'
  },
  {
    title: '歌手',
    dataIndex: 'singer',
    width:'15%'
  },
  {
    title: '专辑',
    dataIndex: 'album',
    width:'18%'
  },
  {
    title: '时长',
    dataIndex: 'dt',
    width:'8%'
  },
  {
    title: '热度',
    dataIndex: 'pop',
    width:''
  },
];
const customRow = (record) => {
  return {
    onDblclick: (event) => {
      handlePlaySong(record.key,record.index);
    },
  };
}
const dataSource = ref([]);
const route = useRoute();
let current = ref(1);
const offset = ref(0);
const store = useStore();
const songList = [];
const getList = async (keyword)=>{
  spinning.value = true;
  const {data:res} = await $axios({
    method:'get',
    url:`/api/cloudsearch?keywords=${keyword}&limit=100&offset=${offset.value}`
  })
  spinning.value = false;
  offset.value++;
  dataSource.value = [];
  const songs = res.result.songs;
  songs.forEach((item,index)=>{
    dataSource.value.push({
      key: item.id,
      index,
      number:(current.value-1)*100+index+1,
      like:<HeartOutlined/>,
      download:<DownloadOutlined/>,
      song: item.name,
      singer: <route-link data-name={item.ar[0].name}>{item.ar[0].name}</route-link>,
      album: item.al.name,
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
  store.commit('setSongList',songList);
  store.commit('changePlayingIndex',index);
  store.dispatch('changeSong',id);
}
const pagination = reactive({
    pageSize:100,
    total:300,
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
            .ant-table-cell{
                background-color: transparent;
                border-bottom: 0;
                padding-top: 6px;
                padding-bottom: 6px;
                color: @black-font-color;
                font-size: 13px;
                transition: none;
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