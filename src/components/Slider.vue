<template>
    <a-menu
      id="myMenu"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 256px"
      mode="inline"
      @click="handleClick"
    >
      <a-menu-item key="1"><router-link to="/">发现音乐</router-link></a-menu-item>
      <a-menu-item key="2">博客</a-menu-item>
      <a-menu-item key="3">视频</a-menu-item>
      <a-menu-item key="4">关注</a-menu-item>
      <a-menu-item key="5">直播</a-menu-item>
      <a-menu-item key="6">私人FM</a-menu-item>

      <a-menu-item-group key="g2" title="我的音乐">
        <a-menu-item key="7"><router-link to="/likes"><heart-outlined class="sliderIcon"/>我很喜欢的音乐</router-link></a-menu-item>
        <a-menu-item key="9"><download-outlined class="sliderIcon"/>本地与下载</a-menu-item>
        <a-menu-item key="10"><field-time-outlined class="sliderIcon"/>最近播放</a-menu-item>
        <a-menu-item key="11"><cloud-outlined class="sliderIcon"/>我的音乐云盘</a-menu-item>
        <a-menu-item key="12"><logout-outlined class="sliderIcon"/>我的博客</a-menu-item>
        <a-menu-item key="13"><user-add-outlined class="sliderIcon"/>我的收藏</a-menu-item>
      </a-menu-item-group>

      <a-sub-menu key="sub1" @titleClick="titleClick">
        <template #title>创建的歌单</template>
        <a-menu-item key="14">ye</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="sub2" @titleClick="titleClick">
        <template #title>收藏的歌单</template>
        <a-menu-item key="15">Option 5</a-menu-item>
      </a-sub-menu>

    </a-menu>
  </template>
  <script>
  import { defineComponent, ref, watch } from 'vue';
  import { HeartOutlined,DownloadOutlined,FieldTimeOutlined,CloudOutlined,LogoutOutlined,UserAddOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    components: {
      HeartOutlined,
      DownloadOutlined,
      FieldTimeOutlined,
      CloudOutlined,
      LogoutOutlined,
      UserAddOutlined,
    },
    setup() {
      const selectedKeys = ref(['1']);
      const openKeys = ref(['sub1']);
      const handleClick = e => {
        console.log('click', e);
      };
      const titleClick = e => {
        console.log('titleClick', e);
      };
      watch(() => openKeys, val => {
        console.log('openKeys', val);
      });
      return {
        selectedKeys,
        openKeys,
        handleClick,
        titleClick,
      };
    },
  });
  </script>

<style lang="less" scoped>
.sliderIcon{
  margin-right: 4px;
  font-size:16px;
}
</style>