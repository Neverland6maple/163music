<template>
    <div id="songList">
        <div class="songListHeader">
            <h2 class="songListHeaderTitle">当前播放</h2>
            <div class="songListInfo">
                <div class="songListSum">共xxxx首</div>
                <div class="songListCollect"><FolderAddOutlined :style="{fontSize:'16px',marginRight:'4px'}"/>收藏全部</div>
                <div class="songListClear">清空列表</div>
            </div>
        </div>
        <div class="songListContent" ref="songListRef">
            <a-table
            class="songListTable"
            size="small"
            :columns="columns"
            :data-source="dataSource"
            :pagination=false
            :customRow="customRow"
            :rowClassName="(record, index) => (index % 2 === 0 ? 'table-striped' : null,index === playingIndex ? 'playingItem' : 'abc')"
            />
        </div>
    </div>
</template>
<script setup>
import {FolderAddOutlined,LinkOutlined} from '@ant-design/icons-vue'
import { getCurrentInstance, watch, reactive,ref,h, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
const {proxy:{$axios}} = getCurrentInstance();
const columns = [
  {
    dataIndex: 'name',
  },
  {
    dataIndex: 'singer',
  },
  {
    dataIndex: 'share',
  },
  {
    dataIndex: 'dt',
}
];
const songListRef = ref(null);
const dataSource = ref([]);
const store = useStore();
const songList = computed(()=>store.state.songList);
const playingIndex = computed(()=>store.state.playingIndex)
dataSource.value = songList.value.map((e,index)=>({
    id:e.id,
    index,
    name:<div class={'name'}>{e.name}</div>,
    singer:<div class={'singer'}>{e.singer}</div>,
    share:<div class={'share'}><LinkOutlined /></div>,
    dt:<div class={'dt'}>{e.dt}</div>,
})); 

const setScroll = (index)=>{
    songListRef.value.scrollTo(0,32.425*(index-6))
}
onMounted(()=>{
    setScroll(playingIndex.value);
})
const customRow = (record) => {
  return {
    onDblclick: (event) => {
      handlePlaySong(record.id,record.index);
    },
  };
}
const handlePlaySong = (id,index)=>{
  store.commit('changePlayingIndex',index);
  store.dispatch('changeSong',id);
}
watch(playingIndex,()=>{
    setScroll(playingIndex.value);
})
</script>
<style lang="less" scoped>
#songList{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    background-color: #363636;
    display: flex;
    flex-direction: column;
    .songListHeader{
        display: flex;
        flex-direction: column;
        height: 88px;
        width: 100%;
        padding: 22px 16px 16px;
        text-align: left;
        .songListHeaderTitle{
            font-size: 22px;
            color: #d7d7d7;
            margin-bottom: 14px;
        }
        .songListInfo{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            .songListSum{
                width: 240px;
                color: #5e5e5e;
            }
            .songListCollect{

            }
            .songListClear{
                color: #739bbd;
            }
        }
    }
    .songListContent{
        overflow: auto;
        width: 100%;
        height: 100%;
        :deep(.ant-table){
            background-color: transparent;
        }
        :deep(.ant-table-content){
            .playingItem{
                td:nth-child(1), td:nth-child(2){
                    color: #ec4141;
                }
                td:nth-child(1)::before{
                    position: absolute;
                    display: inline-block;
                    border-left: solid 6px #ec4141;
                    border-right: solid 6px transparent;
                    border-bottom: solid 4px transparent;
                    border-top: solid 4px transparent;
                    content: '';
                    left: 6px;
                    top: 12px;
                }
            } 
            .ant-table-cell{
                background-color: transparent;
                border-bottom: 0;
                padding-top: 6px;
                padding-bottom: 6px;
                padding-left: 0;
                padding-right: 0;
                color: #666;
                font-size: 13px;
                transition: none;
                div{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space:nowrap;   
                }
                .name{
                    width: 200px;
                }
                .singer{
                    width: 88px;
                    margin-right: 10px;
                }
                .share{
                    margin-right: 15px;
                }
                .dt{
                    width: 70px;
                }
            }
            .table-striped td {
                background-color: #2f2f2f;
            }
            tr:hover .ant-table-cell{
                background-color: #373737;
                color: white;
            }
            tr td:first-child{
                padding-left: 16px;
                font-size: 13px;
                color: #ffffff;
            }
            .abc{
                font-size: 13px;
                color: #666;
                width: 50px;
            }
            .ant-table-thead {
                display: none;
            }
        }
    }
}
</style>