<template>
    <div id="searchPage">
        <h2 id="searchTitle">搜索
            <span id="searchKey">kanye</span>
        </h2>
        <div id="maybeInterest">
            <h4 id="maybeInterestTitle">你可能感兴趣</h4>
            <SingerTag :sgInfo="sgInfo"></SingerTag>
        </div>
        <div id="searchNav">
            <a-tabs v-model:activeKey="activeKey" :animated="false" size="small" @change="changeNav">
                <a-tab-pane v-for="item in searchNav" :key="item.id" :tab="item.title">                </a-tab-pane>
                <template #rightExtra>
                    <span class="otherInfo">找到<span class="num">xx</span>{{ activeTitle }}</span>
                </template>
            </a-tabs>
            <Suspense>
                <router-view></router-view>
            </Suspense>
        </div>
    </div>
</template>

<script setup>
import SingerTag from '@/components/search/SingerTag.vue'
import { computed } from '@vue/reactivity';
import {  reactive, ref } from 'vue';
const sgInfo = ref({
    img:require('@/assets/user.jpg'),
    name:'Kanye West',
    alias:'侃爷·韦斯特',
    fans:'52万',
    songs:'1362',
})
const searchNav = reactive([
    {id:'1',title:'单曲',classifier:'首'},
    {id:'2',title:'歌手',classifier:''},
    {id:'3',title:'专辑',classifier:''},
    {id:'4',title:'视频',classifier:''},
    {id:'5',title:'歌单',classifier:''},
    {id:'6',title:'歌词',classifier:''},
    {id:'7',title:'博客',classifier:''},
    {id:'8',title:'声音',classifier:''},
    {id:'9',title:'用户',classifier:''},
])
const activeKey = ref('1');
const activeTitle = computed(()=>{
    const e = searchNav.find(e=>e.id == activeKey.value);
    return e.classifier + e.title
})
const changeNav = (activeKey)=>{
    console.log(activeKey);
}
</script>

<style lang="less" scoped>
@import '@/assets/theme.less';
#searchPage{
    padding: 30px;
    width: 100%;
    height: 100%;
    text-align: left;
    color: @black-font-color;
    #searchTitle{
        font-weight: bold;
        color: inherit;
        font-size: 20px;
        margin-bottom: 30px;
        #searchKey{
            font-weight: inherit;
        }
    }
    #maybeInterest{
        #maybeInterestTitle{
            color: #8b8b8b;
            font-size: 12px;
            margin-bottom: 10px;
        }
    }
    #searchNav{
        margin-top: 16px;
        .ant-tabs-top {
            :deep(> .ant-tabs-nav::before){
                display: none;
            }
            :deep(.ant-tabs-tab-active){
                .ant-tabs-tab-btn{
                    color: @black-font-color;
                    text-shadow: 0 0.5 0.5px currentcolor;
                }
            }
            :deep(.ant-tabs-ink-bar){
                background-color: #ec4141;
                height: 2px;
                box-sizing: border-box;
                border-radius: 1px;
                width: 26px !important;
                margin-left: 4px;
            }
            
            :deep(.ant-tabs-tab){
                color: @black-font-color;
                padding-bottom: 5px;
                font-size: 15px;
            }
            .otherInfo{
                color: #717171;
                font-size: 12px;
                letter-spacing: px;
                .num{
                    padding: 3px
                }
            }
        }
    }
    
}
</style>