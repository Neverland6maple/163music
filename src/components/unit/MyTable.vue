<template>
    <div id="myTable" @contextmenu="stopDefault">
        <a-table
        class="albumTable"
        size="small"
        :showHeader="showHeader"
        :columns="props.columns"
        :data-source="data"
        :pagination=pagination
        :rowClassName="(record, index) => (index % 2 === 0 ? 'table-striped' : null)"
        :customRow=customRow
        @change="handleTableChange"
        />
    </div>
</template>
<script setup>
import { $axios } from '@/request/axios';
import { computed, h, nextTick, onMounted,ref,watch } from 'vue';
import { useStore } from 'vuex';
import timeFormat from '@/utils/timeFormat';
const props = defineProps({
    columns:Array,
    dataSource:Array,
    pagination:[Object,Boolean],
    virtual:{
      validator(value){
        if(value.listHeight == undefined || value.itemSize == undefined){
          throw Error("error arguments for virtual");
        }
        return true;
      },
      default(rawProps) {
        return { listHeight: 0 , itemSize : 0}
      }
    },
    showHeader:{
      type:Boolean,
      default:true,
    },
    id:{
      type:Number,
      required:false
    },
    user:{
      type:Boolean,
      default:false,
    },
    bufferRange:{
      type:Number,
      default:0,
    },
});
const emit = defineEmits(['handlePlaySong','handleTableChange'])
const store = useStore();
const customRow = (record) => {
  return {
    style:{
      height: props.virtual ? props.virtual.itemSize + 'px' : null,
    },
    onDblclick: (event) => {
      if(typeof props.id === 'number'){
        handlePlaySong(record.key,record.index,props.id);
      }else{
        handlePlaySong(record.key,record.index);
      }
    },
    oncontextmenu:async (event)=>{
      const {data:res} = await $axios({
        method:'get',
        url:`/api/comment/music?id=${record.key}&limit=1`
      })
      const {data:{songs:song}} = await $axios({
        method:'get',
        url:`/api/song/detail?ids=${record.key}`
      })
      store.commit('changeTableMenu',{
        show:true,
        x:event.pageX,
        y:event.pageY,
        commentCount:res.total,
        song:{
          id:song[0].id,
          name:song[0].name,
          singer:song[0].ar,
          dt:timeFormat(song[0].dt),
          fee:song[0].fee,
          noCopyrightRcmd:song[0].noCopyrightRcmd,
          mv:song[0].mv,
        },
        user:props.user,
      })
    }
  };
}
const handlePlaySong = (songId,index,id)=>{
    emit('handlePlaySong',songId,index,id);
}
const  handleTableChange = (pagination,filters, sorter, { currentDataSource })=>{
   emit('handleTableChange',pagination,filters,sorter,{ currentDataSource });
}
const stopDefault = (e)=>{
  e.preventDefault();
}


const scrollTop = props.virtual.listHeight ? ref(0) : null;
const start = props.virtual.listHeight ? computed(()=>parseInt(scrollTop.value / props.virtual.itemSize)) : null;
const visibleCount = props.virtual.listHeight ? computed(()=>Math.ceil(props.virtual.listHeight / props.virtual.itemSize)) : null;
const end = props.virtual.listHeight ? computed(()=> start.value + visibleCount.value) : null;
const placeholderWrapper = props.virtual.listHeight ? document.createElement('div') : null;
const aboveCount = props.virtual.listHeight ? computed(()=>Math.min(props.bufferRange,start.value)) : null;
const belowCount = props.virtual.listHeight ? computed(()=>Math.min(props.bufferRange,props.dataSource.length-end.value)) : null;
const data = computed(()=>{
  if(props.virtual.listHeight){
    const startRange = start.value - aboveCount.value;
    const endRange = end.value + belowCount.value;
    return props.dataSource.slice(startRange,endRange);
  }else{
    return props.dataSource
  }
});

onMounted(()=>{
  if(props.virtual.listHeight){
    const parentNode = document.querySelector('.ant-table-content');
    const table = document.querySelector('.ant-table-content table');
    const tbody = document.querySelector('.ant-table-content table .ant-table-tbody');
    const myTable = document.querySelector('#myTable');
    parentNode.appendChild(placeholderWrapper);
    parentNode.style.position = 'relative';
    table.style.position = 'absolute';
    const toTop = myTable.offsetTop+tbody.offsetTop;
    window.addEventListener('scroll', (e)=>{
      if(e.target.scrollTop > toTop){
        scrollTop.value = e.target.scrollTop - toTop;
        table.style.transform = `translateY(${scrollTop.value - scrollTop.value % props.virtual.itemSize - (aboveCount.value * props.virtual.itemSize)}px)`;
      }
    },true)
  }
})
watch([()=>props.dataSource,()=>props.virtual.itemSize],props.virtual.listHeight ? ()=>{
  placeholderWrapper.style.height = props.dataSource.length * props.virtual.itemSize + 'px';
} : ()=>{},{
  immediate:true
})
</script>

<style lang="less" scoped>
@import '@/assets/theme.less';
#myTable{
  position: relative;
    .albumTable{
        :deep(.ant-table){
            background-color: transparent;
        }
        :deep(.ant-table-content){
            table{
              table-layout: fixed !important;
            }
            .slash{
              margin: 0 4px;
            }
            .likeIcon{
              cursor: pointer;
              &.liked:hover{
                color: #d73535 !important;
              }
            }
            .album,.song,.singer{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

            }
            .downloadIcon{
              cursor: pointer;
            }
            .album{
              cursor: pointer;
              color: #999;
              &:hover{
                color: #b1b9b9;
              }
              mark {
                background-color: transparent;
                color: #7ab9e6;
              }
            } 
            .song{
              display: flex;
              align-items: center;
              justify-content:left;
              .vipIcon,mvIcon,noCopyrightIcon{
                margin-left: 1px;
              }
              mark {
                background-color: transparent;
                color: #7ab9e6;
              }
            }
            .singer{
              cursor: pointer;
              color: #999;
              .singerName{
                transition: none;
              }
              .singerName:hover{
                color: #b1b9b9;
              }
              mark {
                background-color: transparent;
                color: #7ab9e6;
              }
            }
            .dt{
              color: #999;
            }
            .likeIcon:hover,.downloadIcon:hover{
              color: #949494;
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
                padding-left: 13px;
                text-align: center;
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