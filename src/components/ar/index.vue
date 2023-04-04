<template>
    <div id="arPage" ref="arPageRef">
        <div id="arPageHead">
            <div id="arCover">
                <img :src="arInfo.img1v1Url" alt="picUrl" class="coverPic">
            </div>
            <div id="arInfos">
                <div id="arName">
                    <div class="arName">{{ arInfo.name }}</div>
                </div>
                <div class="collectBtn">
                  <TransparemtBtn>
                    <template #icon><FolderAddOutlined /></template>
                    <template #content>收藏</template>
                  </TransparemtBtn>
                </div>
                <div id="arInfo">
                    <div id="arStatistics">
                        <div class="statisticItem">
                            单曲数：<span class="songsCount">{{ arInfo.musicSize }}</span>
                        </div>
                        <div class="statisticItem">
                            专辑数：<span class="songsPlay">{{ arInfo.albumSize }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="arPageMusic">
            <div id="arTab">
                <a-tabs v-model:activeKey="activeKey" :animated="false" :tabBarGutter="20" @change="handleIndexChange">
                    <a-tab-pane key="1" tab="专辑"></a-tab-pane>
                    <a-tab-pane key="2" tab="MV"></a-tab-pane>
                    <a-tab-pane key="3" tab="歌手详情"></a-tab-pane>
                    <a-tab-pane key="4" tab="相似歌手"></a-tab-pane>
                    <template #rightExtra v-if="activeKey === '1'">
                        <div class="setType">
                            <div :class="{'typeBtnActive':type === 0 ,'typeBtn':true} " @click="setType(0)"><AppstoreOutlined /></div>
                            <div :class="{'typeBtnActive':type === 1 ,'typeBtn':true} " @click="setType(1)"><MenuOutlined /></div>
                            <div :class="{'typeBtnActive':type === 2 ,'typeBtn':true} " @click="setType(2)"><PicLeftOutlined /></div>
                        </div>
                    </template>
                </a-tabs>
            </div>
            <GridAlbum :albums="arAlbums" :type="type" v-if="activeKey === '1'"></GridAlbum>
            <ArMv :mvs="mvs" v-else-if="activeKey === '2'"></ArMv>
            <arDescription :ar-name="arInfo.name" :introduction="desc.introduction" :briefDesc="desc.briefDesc" v-else-if="activeKey === '3'"></arDescription>
            <SimiAr :simi="simi" v-else-if="activeKey === '4' "></SimiAr>
        </div>
    </div>
</template>
<script setup>
import {CaretDownOutlined,CaretUpOutlined,AppstoreOutlined,MenuOutlined,PicLeftOutlined} from '@ant-design/icons-vue'
import { getCurrentInstance, onUnmounted, ref, watch } from 'vue';
import { HeartOutlined,DownloadOutlined,FieldTimeOutlined,CloudOutlined,LogoutOutlined,UserAddOutlined,FolderAddOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import GridAlbum from '@/components/ar/GridAlbum.vue';
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import arDescription from './arDescription.vue'
import SimiAr from './SimiAr.vue'
import ArMv from './ArMv.vue';
import throttle from '@/utils/throttle.js';
const {proxy:{$axios,$post}} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const arAlbums = ref([]);
const arId = ref();
const arInfo = ref({picUrl:''});
const arPageRef = ref(null);
const type = ref(2);
const activeKey = ref('1');
const mvs = ref([]);
const simi = ref([]);
const pagesize = 20;
const desc = ref({
    introduction:[],
    briefDesc:""
});
let offset = 0;
let more = true;
const setType = (val)=>{
    type.value = val;
}
const handleIndexChange = async (key)=>{
    if(key === "3"){
        ({data:desc.value} = await $axios({
            method:"get",
            url:`/api/artist/desc?id=${arId.value}`
        }))
    }else if(key === "4"){
        const {data:res} = await $axios({
            method:"get",
            url:`/api/simi/artist?id=${arId.value}`
        })
        simi.value = res.artists;
        console.log(simi.value);
    }else if(key === "2"){
        const {data:res} = await $axios({
            method:"get",
            url:`/api/artist/mv?id=${arId.value}`
        })
        mvs.value = res.mvs;
    }else if(key === "1"){
        getAlbum(arId.value)
    }
}
const getAlbum = async (id)=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/artist/album?id=${id}&&offset=${pagesize*offset++}&limit=20`
    })
    if(JSON.stringify(arInfo.value) === "{}") arInfo.value = res.artist;
    arAlbums.value.push(...res.hotAlbums);
    more = res.more;
}
const getNewData = throttle(()=>{
    more && getAlbum(arId.value);
},1000);
const monitor = (e)=>{
    let distance = 0;
    if(type.value === 0){
        distance = 400;
    }else if(type.value === 1){
        distance = 800;
    }else{
        distance = 1200;
    }
    if(arPageRef.value.offsetHeight-e.target.scrollTop-e.target.offsetHeight < distance){
        getNewData();
    }
}
window.addEventListener('scroll',monitor,true)
watch(() => route.params.artistId, val => {
    arAlbums.value = [];
    offset = 0;
    arInfo.value = {};
    arId.value = val;
    console.log(activeKey.value);
    handleIndexChange(activeKey.value);
},{
    immediate:true,
});
onUnmounted(()=>{
    window.removeEventListener('scroll',monitor,true);
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#arPage{
    width: 100%;
    #arPageHead{
        width: 100%;
        box-sizing: border-box;
        padding:32px 28px 20px 28px;
        display: flex;
        justify-content: left;
        #arCover{
            width: 185px;
            height: 185px;
            border-radius: 6px;
            overflow: hidden;
        }
        #arInfos{
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: left;
            align-items: start;
            margin-left: 20px;
            overflow: hidden;
            #arName{
                display: flex;
                align-items: center;
                text-align: left;
                color: @black-font-color;
                .arName{
                    font-size: 22px;
                    font-weight: bold;
                }
            }
            .collectBtn{
                margin-top: 13px;
            }
            #arInfo{
                width: 100%;
                margin-top: 16px;
                #arStatistics{
                    display: flex;
                    justify-content: left;
                    font-size: 13px;
                    text-align: left;
                    color: @black-font-color;
                    .statisticItem{
                        margin-right: 10px;
                    }
                }
                .profileLable{
                  float: left;
                  margin-right: 10px;
                    color: #d5d5d5 !important;
                }
            }
        }
    }
    #arPageMusic{
        #arTab{
            margin-left: 32px;
            margin-right: 32px;
            margin-top: 0px;
            :deep(.ant-tabs-nav){
                margin-bottom:3px;
            }
            :deep(.ant-tabs-top) {
                > .ant-tabs-nav::before{
                    display: none;
                }
                .ant-tabs-nav-list{
                    display: flex;
                    justify-content: center;
                }
                .ant-tabs-tab-active{
                    .ant-tabs-tab-btn{
                        color: @black-font-color;
                        text-shadow: 0 0.5 0.5px currentcolor;
                        font-size: 18px;
                        font-weight: bold;
                        position: relative;
                        &::after{
                            content: '';
                            position: absolute;
                            bottom: -3px;
                            left: 50%;
                            transform: translateX(-50%);
                            background-color: #ec4141;
                            height: 3px;
                            box-sizing: border-box;
                            border-radius: 1px;
                            width: 80% !important;
                        }
                    }
                }
                .ant-tabs-tab-btn{
                  &:active{
                    color: inherit;
                  }
                    transition: 0s;
                }
                .ant-tabs-ink-bar{
                    display: none;
                }
                .ant-tabs-tab{
                    color: @black-font-color;
                    font-size: 15px;
                    transition: 0s;
                }
            }
        }
    }
    .setType{
        display: flex;
        height: 22px;
        width: 81px;
        align-items: center;
        .typeBtn{
            flex: 1;
            height: 100%;
            background-color: #363636;
            line-height: 22px;
            color: #646464;
            cursor: pointer;
            &:nth-child(2){
                margin-left: 1px;
                margin-right: 1px;
            }
            &:hover{
                background-color: #3e3e3e;
                color: #959595;
            }
            &.typeBtnActive{
                color: white;
                background-color: #606060;
            }
        }
    }
    
}
</style>