<template>
    <div id="songList" ref="songListRef">
        <div class="songListHeader">
            <h2 class="songListHeaderTitle">当前播放</h2>
            <div class="songListInfo">
                <div class="songListSum">共{{songList.length}}首</div>
                <div class="songListCollect"><FolderAddOutlined :style="{fontSize:'16px',marginRight:'4px'}"/>收藏全部</div>
                <div class="songListClear">清空列表</div>
            </div>
        </div>
        <div class="songListContent" ref="songListContentRef">
            <a-table
            class="songListTable"
            size="small"
            :columns="columns"
            :data-source="dataSource"
            :pagination=false
            :customRow="customRow"
            :rowClassName="(record, index) => {
                return [index === playingIndex ? 'playingItem' : 'abc',index % 2 === 1 ? 'table-striped' : null]
            }"
            />
        </div>
    </div>
</template>
<script setup>
import {FolderAddOutlined,LinkOutlined} from '@ant-design/icons-vue'
import { getCurrentInstance, watch, reactive,ref,h, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import mvIcon from '@/components/icon/mv.vue'
import vipIcon from '@/components/icon/vip.vue'
import noCopyright from '../icon/noCopyright.vue';
import { useEventListener } from '@/composables/event';
const {proxy:{$axios}} = getCurrentInstance();
const columns = [
  {
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
    dataIndex: 'singer',
  },
  {
    dataIndex: 'share',
  },
  {
    dataIndex: 'dt',
}
];
const songListContentRef = ref(null);
let isFirst = true;
const songListRef = ref(null);
const dataSource = ref([]);
const store = useStore();
const songList = computed(()=>store.state.player.songList);
const playingIndex = computed(()=>store.state.player.playingIndex)

const setScroll = (index)=>{
    songListContentRef.value.scrollTo(0,32.425*(index-6))
}
const close = e=>{
    if(isFirst){
        isFirst = false;
    }else{
        if(!songListRef.value.contains(e.target)){
            store.commit('changeSlider',0);
        }
    }
}
const customRow = (record) => {
  return {
    onDblclick: (event) => {
      handlePlaySong(record.id,record.index);
    },
  };
}
const handlePlaySong = (id,index)=>{
  store.commit('player/changePlayingIndex',index);
  store.dispatch('player/changeSong',id);
}

useEventListener(window,'click',close);
watch(playingIndex,()=>{
    setScroll(playingIndex.value);
})
onMounted(()=>{
    Promise.resolve().then(()=>{
        dataSource.value = songList.value.map((e,index)=>{
            const content = []
            e.singer.forEach((el,index)=>{
            if(index > 0){
                content.push(<span class="slash">/</span>);
            }
            content.push(<router-link to={'/artist/'+el.id} class='singerName' singerId={el.id}>{el.name}</router-link>);
            });
            return {
                id:e.id,
                index,
                song:<div class="song">{e.name}<vipIcon style={e.fee === 1 ? '' : 'display:none'} /><mvIcon style={e.mv != 0 ? '' : 'display:none'} data-id={e.mv} /><noCopyright style={e.noCopyrightRcmd !== null ? '' : 'display:none'} /></div>,
                singer:<div class="singer">{content}</div>,
                share:<div class={'share'}><LinkOutlined /></div>,
                dt:<div class='dt'>{e.dt}</div>,
            }
        }); 
    })

    setScroll(playingIndex.value);
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#songList{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    background-color: #363636;
    display: flex;
    flex-direction: column;
    z-index: 999;
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
            .songListClear{
                color: #739bbd;
                cursor: pointer;
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
                .song{
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  display: flex;
                  align-items: center;
                  justify-content:left;
                  width: 200px;
                  .vipIcon,mvIcon,noCopyrightIcon{
                    margin-left: 1px;
                  }
                }
                .singer{
                    width: 88px;
                    margin-right: 10px;
                    color: #919191;
                    cursor: pointer;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .singerName{
                      transition: none;
                      color: #919191;
                    }
                }
                .share{
                    margin-right: 15px;
                }
                .dt{
                    width: 70px;
                    color: #999;
                }
            }
            .table-striped td {
                background-color: #3a3a3a;
            }
            tr:hover {
                .dt,.song{
                    color: white;
                }
                .singer .singerName,.slash{
                    color: white;
                }
                background-color: #3e3e3e;
            }
            tr td:first-child{
                padding-left: 16px;
                font-size: 13px;
                color: @black-font-color;
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