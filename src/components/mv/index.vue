<template>
    <div id="mvPage">
        <div class="content">
            <div class="mvBox">
                    <div class="goBack"><LeftOutlined />MV详情</div>
                    <div class="mvVideo">
                        <myVideo :src="mvSrc.url" :mvData="mvData" :mvInfo="mvInfo" @changeUrl="changeUrl" :br="mvSrc.r"></myVideo>
                    </div>
                    <div class="ar">
                        <div class="arPic"><img class="coverPic" :src="mvData.artists[0].img1v1Url" alt=""></div>
                        <h3 class="arName">
                            <span v-for="(item,index) in mvData.artists" :key="item.id" class="arItem">
                                <router-link :to="`/artist/${item.id}`" class="arItemName">{{ item.name }}</router-link>
                                <span v-if="index !== mvData.artists.length-1" class="slash">/</span>
                            </span>
                        </h3>
                    </div>
                    <div class="mvName">
                        <h2 class="name" ref="nameRef">{{ mvData.name }}</h2>
                        <CaretDownOutlined />
                    </div>
                    <div class="mvInfos">
                        <div class="infos">
                            <span class="publishTime">发布：{{ mvData.publishTime }}</span>
                            <span class="playCount">播放：{{mvData.playCount}}次</span>
                        </div>
                        <div class="tags">
                            <div class="tagItem" v-for="(item) in mvData.videoGroup" :key="item.id">{{ item.name }}</div>
                        </div>
                        <!-- <div class="desc">v走红i好萨蒂哦吼i全额归还迫切我给你破欧珀爱死你公婆爱护你山坡上你哈是离开你小破车不弄i活泼安德森给你看了你呕啦麻辣看过那艘i共i不干净，大使馆办理快把改变</div> -->
                    </div>
                    <div class="mvBtns">
                        <transparentBtn>
                            <template #icon>
                                <LikeOutlined />
                            </template>
                            <template #content>
                                赞({{ mvInfo.likedCount }})
                            </template>
                        </transparentBtn>
                        <transparentBtn>
                            <template #icon>
                                <FolderAddOutlined />
                            </template>
                            <template #content>
                                收藏({{ mvData.subCount }})
                            </template>
                        </transparentBtn>
                        <transparentBtn>
                            <template #icon>
                                <LinkOutlined />
                            </template>
                            <template #content>
                                分享({{ mvInfo.shareCount }})
                            </template>
                        </transparentBtn>
                        <transparentBtn>
                            <template #icon>
                                <DownloadOutlined />
                            </template>
                            <template #content>
                                下载MV
                            </template>
                        </transparentBtn>
                    </div>
            </div> 
            <div class="sideBar">
                123123
            </div>
            <div class="commentBox">
                <div>
                    <h3 class="title">评论<span class="commentCount">({{ total }})</span></h3>
                    <div class="textarea">
                        <a-textarea
                        v-model:value="value"
                        :auto-size="{ minRows: 3, maxRows: 3 }"
                        />
                        <div class="letterLimit">
                            123
                        </div>
                    </div>
                    <div class="textareaFn">
                        <div class="textareaOption">
                            <div>#</div>
                            <div>@</div>
                            <div>&#9786; &#65039;</div>
                        </div>
                        <div class="commentBtn">
                            <TransparemtBtn :styleObj="{'padding':'0 14px'}">
                                <template #content>评论</template>
                            </TransparemtBtn>
                        </div>
                    </div>
                </div>
                <commentList @handlePageChange="handlePageChange" :hotComments="hotComments" :latestComments="latestComments" :spinning="spinning" :total="total"></commentList>
            </div>
        </div>
    </div>
</template>
<script setup>
import store from '@/store';
import { getCurrentInstance, onMounted, onUnmounted, ref ,watch} from 'vue';
import {LeftOutlined,CaretDownOutlined,DownloadOutlined,LikeOutlined,FolderAddOutlined,LinkOutlined} from '@ant-design/icons-vue';
import transparentBtn from '@/components/unit/TransparemtBtn.vue';
import myVideo from './myVideo.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import commentList from '../unit/commentList.vue';
const route = useRoute();
const {proxy:{$axios}} = getCurrentInstance();
const mvData = ref({'artists':[{}]});
const mvSrc = ref({});
const mvInfo = ref({});
const nameRef = ref(null);
const total = ref(0);
const spinning = ref(true);
const hotComments = ref([]);
const latestComments = ref([]);
const getData = async (id)=>{
    const {data:res} = await $axios({
        method:"get",
        url:`/api/mv/detail?mvid=${id}`,
    })
    mvData.value = res.data;
    const {data:res1} = await $axios({
        method:"get",
        url:`/api/mv/url?id=${id}`,
    })
    mvSrc.value = res1.data;
    const {data:res2} = await $axios({
        method:"get",
        url:`/api/mv/detail/info?mvid=${id}`,
    })
    mvInfo.value = res2;
    
}
const changeUrl =async (r)=>{
    const {data:res} = await $axios({
        method:"get",
        url:`/api/mv/url?id=${route.params.mvId}&r=${r}`,
    })
    mvSrc.value = res.data;
}
const getCommentList = async (id,current)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url: `/api/comment/mv?id=${id}&limit=20&offset=${20*(current-1)}`
    })
    if(res.hotComments) hotComments.value = res.hotComments;
    latestComments.value = res.comments;
    total.value = res.total;
    // time.val = latestComments.value[latestComments.value.length-1].time;
    spinning.value = false;
}

const handlePageChange = (page)=>{
    getCommentList(route.params.mvId,page);
}
watch(()=>route.params.mvId,val=>{
    getData(val);
    getCommentList(val,1);
},{
    immediate:true,
    deep:true,
})
onUnmounted(()=>{
    store.commit('changeIsCover',false);
})
</script>
<style scoped lang='less'>
@import '@/assets/theme.less';
#mvPage{
    background-color: @black-body;
    margin-bottom: 70px;
    .content{
        width: 930px;
        margin: 0 auto;
        margin-top: 16px;
        display: grid;
        grid-template-columns:620px 280px;
        justify-content: space-between;
        .mvBox{
                margin-bottom: 42px;
                .goBack{
                    text-align: left;
                    color: @black-font-color;
                    font-weight: bold;
                    font-size: 17px;
                    margin-bottom: 16px;
                    .anticon{
                        color: #666666;
                        margin-right: 8px;
                        font-size: 16px;
                    }
                }
                .mvVideo{
                    width: 100%;
                    margin-bottom: 14px;
                    overflow: hidden;
                    // min-height: 354px;
                }
                .ar{
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    margin-bottom: 30px;
                    .arPic{
                        width: 50px;
                        height: 50px;
                        overflow: hidden;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                    .arName{
                        font-size: 14px;
                        .arItemName{
                            color: #8b8b8b;
                            &:hover{
                                color: #ddd;
                            }
                        }
                        .slash{
                            margin: 0 4px;
                            color: #ddd;
                        }
                    }
                }
                .mvName{
                    text-align: left;
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    margin-bottom: 14px;
                    .name{
                        font-weight: bold;
                        font-size: 25px;
                        color: @black-font-color;
                    }
                    .anticon{
                        color:#333333;
                        margin-left: 8px;   
                        font-size: 18px;  
                        cursor: pointer;            
                    }
                }
                .mvInfos{
                    text-align: left;
                    margin-bottom: 30px;
                    .infos{
                        color: #4d5152;
                        font-size: 12px;
                        margin-bottom: 14px;
                        .publishTime{
                            margin-right: 18px;
                        }
                    }
                    .tags{
                        width: 100%;
                        display: flex;
                        justify-content:left;
                        flex-wrap: wrap;
                        margin-bottom: 22px;
                        .tagItem{
                            font-size: 13px;
                            padding: 4px 6px;
                            border-radius: 10px;
                            color: @black-font-color;
                            background-color: #313131;
                            margin-right: 3px;
                            cursor: pointer;
                        }
                    }
                    .desc{
                        color: @black-font-color;
                        font-size: 13px;
                        line-height: 17px;
                    }
                }
                .mvBtns{
                    display: flex;
                    .transparentBtn{
                        margin-left: 10px;
                        &:first-of-type{
                            margin-left: 0;
                        }
                    }
                }
        }
        .sideBar{
            grid-area: 1 / 2 / span 2 / span 1; /* 这里的顺序是：row-start / column-start / row-end / column-end */ 
            // margin-left: 30px;
        }
        .commentBox{
            .textarea{
                position: relative;
                .ant-input{
                    background-color: rgba(255, 255, 255, .1);
                    border: 0;
                    border-radius: 6px;
                    color: #d8d8d8;
                    &:focus{
                       box-shadow: none;
                    }
                }
                .letterLimit{
                    position: absolute;
                    right: 6px;
                    bottom: 5px;
                    color: #616161;
                    font-size: 12px;
                }
            }
            .textareaFn{
                height: 44px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .textareaOption{
                    display: flex;
                }
            }
            .title{
                color: @black-font-color;
                font-size: 20px;
                font-weight: bold;
                text-align: left;
                margin-bottom: 18px;
                .commentCount{
                    font-size: 12px;
                    color: #6b6b6b;
                }
            }
        }   
    }
    
}

</style>