<template>
    <div id="SongPage">
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
            />
    </div>
</template>
<script setup>
import PlayAll from '@/components/unit/PlayAll.vue'
import DownloadAll from '@/components/unit/DownloadAll.vue'
import {HeartOutlined,DownloadOutlined,} from '@ant-design/icons-vue'
import Pop from '@/components/search/Pop.vue'
import { getCurrentInstance,computed, watch, reactive,ref } from 'vue';
import timeFormat from '@/utils/timeFormat';
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
const dataSource = ref([]);
let current = ref(1);
const offset = ref(0);
const getList = async ()=>{
  const {data:res} = await $axios({
    method:'get',
    url:`/api/cloudsearch?keywords=kanyewest&limit=100&offset=${offset.value}`
  })
  offset.value++;
  dataSource.value = [];
  const songs = res.result.songs;
  songs.forEach((item,index)=>{
    dataSource.value.push({
      key: item.id,
      number:(current.value-1)*100+index+1,
      like:<HeartOutlined/>,
      download:<DownloadOutlined/>,
      song: item.name,
      singer: item.ar[0].name,
      album: item.al.name,
      dt:timeFormat(item.dt),
      pop:<Pop>{item.pop}</Pop>,
      })
  })
}
getList();
const  handleTableChange = async (pagination,filters, sorter, { currentDataSource })=>{
    console.log(pagination);
    current.value = pagination.current;
    getList();
    
}

const pagination = reactive({
    pageSize:100,
    total:300,
    showSizeChanger:false,
    current,
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