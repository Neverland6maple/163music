<template>
    <myTable :user="true" :columns="columns" :dataSource="dataSource" @handle-play-song="handlePlaySong"  :pagination=false v-if="!spinning"></myTable>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import mvIcon from '@/components/icon/mv.vue';
import MyTable from './unit/MyTable.vue';
export default defineComponent({
  components:{
    mvIcon,
    MyTable
  },
  setup() {
    const dataSource = ref([])
    const spinning = ref(true);
    const columns = [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
          },
      ];
    const handlePlaySong = ()=>{

    }
    setTimeout(()=>{
      spinning.value = false;
    },100)
      
    setTimeout(()=>{
      for(let i = 0;i <= 500;i++){
      dataSource.value.push({
          key: '1',
          name: <div class="abc">胡彦斌</div>,
          age: 32,
          address: '西湖区湖底公园1号',
        })
        dataSource.value.push({
          key: '2',
          name: <mvIcon/>,
          age: 42,
          address: '西湖区湖底公园1号',
        })
      }
    },101)
    // setTimeout(()=>{
      
    // },3000)
    return {
      dataSource,
      columns,
      handlePlaySong,
      spinning
    };
  },
});
</script>