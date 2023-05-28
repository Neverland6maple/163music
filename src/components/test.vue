<template>
  <a-table :dataSource="dataSource" :columns="columns" :pagination=false />
</template>
<script>
import { defineComponent } from 'vue';
import mvIcon from '@/components/icon/mv.vue'
export default defineComponent({
  components:{
    mvIcon,
  },
  setup() {
    const dataSource = [
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          },
        ];
    for(let i = 0;i <= 300;i++){
      dataSource.push({
        key: '1',
        name: <div class="abc">胡彦斌</div>,
        age: 32,
        address: '西湖区湖底公园1号',
      })
      dataSource.push({
        key: '2',
        name: <mvIcon/>,
        age: 42,
        address: '西湖区湖底公园1号',
      })
    }
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
    return {
      dataSource,
      columns
    };
  },
});
</script>