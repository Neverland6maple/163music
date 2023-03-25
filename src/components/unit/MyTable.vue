<template>
    <div id="myTable">
        <a-spin :indicator="indicator" tip="加载中" :spinning="props.spinning" :style="{color:'#666',display:'flex',alignItems:'center',justifyContent:'center'}"/>  
        <a-table
        class="albumTable"
        size="small"
        :columns="props.columns"
        :data-source="props.dataSource"
        :pagination=pagination
        :rowClassName="(record, index) => (index % 2 === 0 ? 'table-striped' : null)"
        :customRow=customRow
        v-if="!props.spinning"
        @change="handleTableChange"
        />
    </div>
</template>
<script setup>
import { LoadingOutlined, } from '@ant-design/icons-vue'
import { getCurrentInstance, watch, reactive,ref,h,computed } from 'vue';
const props = defineProps({
    columns:Array,
    dataSource:Array,
    spinning:Boolean,
    pagination:Object || Boolean,
});
const emit = defineEmits(['handlePlaySong','handleTableChange'])
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '20px',
    marginRight:'16px',
  },
  spin: true,
});
const customRow = (record) => {
  return {
    onDblclick: (event) => {
      handlePlaySong(record.key,record.index);
    },
  };
}
const handlePlaySong = (id,index)=>{
    emit('handlePlaySong',id,index);
}
const  handleTableChange = (pagination,filters, sorter, { currentDataSource })=>{
   emit('handleTableChange',pagination,filters,sorter,{ currentDataSource });
}
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#myTable{
    .albumTable{
        :deep(.ant-table){
            background-color: transparent;
        }
        :deep(.ant-table-content){
          table{
            table-layout: fixed !important;
          }
            .album{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
            .song{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .singer{
              cursor: pointer;
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