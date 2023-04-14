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
        <a-menu-item key="7" @click="toPlaylist(myLikes.id,true)"><heart-outlined class="sliderIcon"/>我喜欢的音乐</a-menu-item>
        <a-menu-item key="9"><download-outlined class="sliderIcon"/>本地与下载</a-menu-item>
        <a-menu-item key="10"><field-time-outlined class="sliderIcon"/>最近播放</a-menu-item>
        <a-menu-item key="11" v-if="islogin"><cloud-outlined class="sliderIcon"/>我的音乐云盘</a-menu-item>
        <a-menu-item key="12" v-if="islogin"><logout-outlined class="sliderIcon"/>我的博客</a-menu-item>
        <a-menu-item key="13" v-if="islogin"><user-add-outlined class="sliderIcon"/>我的收藏</a-menu-item>
      </a-menu-item-group>

      <a-sub-menu key="sub1" @titleClick="titleClick">
        <template #title>创建的歌单</template>
        <a-menu-item v-for="(item) in userCreators" :key="item.id" @click="toPlaylist(item.id)">{{item.name}}</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="sub2" @titleClick="titleClick" v-if="islogin">
        <template #title>收藏的歌单</template>
        <a-menu-item v-for="(item) in userCollections" :key="item.id" @click="toPlaylist(item.id)">{{ item.name }}</a-menu-item>
      </a-sub-menu>

    </a-menu>
  </template>
<script setup>
import { getCurrentInstance, ref, watch, watchEffect } from 'vue';
import { HeartOutlined,DownloadOutlined,FieldTimeOutlined,CloudOutlined,LogoutOutlined,UserAddOutlined } from '@ant-design/icons-vue';
import { computed } from '@vue/reactivity';
import store from '@/store';
import { useRouter } from 'vue-router';
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1','sub2']);
const {proxy:{$axios,$post}} = getCurrentInstance();
const profile = computed(()=>store.state.user.profile);
const islogin = computed(()=>store.getters['user/islogin']);
const myLikes = ref({});
const router = useRouter();
const userCreators = ref([]);
const userCollections = ref([]);
const handleClick = e => {
  // console.log('click', e);
};
const titleClick = e => {
  // console.log('titleClick', e);
};
const toPlaylist = (id,like)=>{
  if(like){
    router.push(`/playlist/${id}?like=true`);
  }else{
    router.push(`/playlist/${id}`);
  }
}
const getPlaylist = async ()=>{
    const {data:res} = await $axios({
      method:'get',
      url:`/api/user/playlist?uid=${profile.value.userId}`
    })
    const playlist = res.playlist;
    myLikes.value = playlist[0];
    for(let i = 1;i<playlist.length;i++){
      if(playlist[i].creator.userId === profile.value.userId){
        userCreators.value.push(playlist[i]);
      }else{
        userCollections.value.push(playlist[i]);
      }
    }
};
watch(islogin,(newVal)=>{
  if(newVal){
    getPlaylist();
  }
},{
  immediate:true,
})
</script>

<style lang="less" scoped>
.sliderIcon{
  margin-right: 4px;
  font-size:16px;
}
</style>