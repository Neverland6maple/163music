<template>
    <div id="commentList">
        <a-spin tip="加载中" :spinning="spinning" :style="{color:'#666',display:'flex',alignItems:'center',justifyContent:'center'}"/>  
        <template v-if="!spinning">
            <div id="hotComments" v-if="hotComments.length > 0 && current === 1">
                <h3 class="title">精彩评论({{ total }})</h3>
                <div class="commentList">
                    <div class="commentItem" v-for="(item) in partHotComments" :key="item.commentId">
                        <div class="userPic">
                            <img v-lazy="item.user.avatarUrl" alt="" class="picImg" @click="toUser(item.user.userId)">
                        </div>
                        <div class="commentBody">
                            <div class="comment">
                                <div class="username" @click="toUser(item.user.userId)">
                                    {{ item.user.nickname }}
                                    <img :src="item.user.vipRights.associator ? item.user.vipRights.associator. iconUrl : (item.user.vipRights.musicPackage ? item.user.vipRights.musicPackage.  iconUrl : '')" alt="" v-if="item.user.vipRights && (item.user.vipRights.  associator || item.user.vipRights.musicPackage)" class="vipPic">
                                </div>
                                :
                                {{ item.content }}
                            </div>
                            <div class="commentTime">
                                {{ dateFormat(item.time,true) + ' ' + item.timeStr}}
                            </div>
                        </div>
                        <div class="commentOther">
                            <span class="anticon">举报</span>
                            <span class="anticon"><LikeOutlined />{{ item.likedCount === 0 ? '' : item.likedCount }}    </span>
                            <ShareAltOutlined />
                            <CommentOutlined />
                        </div>
                    </div>
                </div>
                <div class="toMoreHot">
                    <TransparemtBtn>
                        <template #content>
                            更多精彩评论
                        </template>
                    </TransparemtBtn>
                </div>
            </div>
            <div id="latestComments">
                <h3 class="title">最新评论({{ total }})</h3>
                <div class="commentList">
                    <div class="commentItem" v-for="(item) in latestComments" :key="item.commentId">
                        <div class="userPic">
                            <img :src="item.user.avatarUrl" alt="" class="picImg" @click="toUser(item.user.userId)">
                        </div>
                        <div class="commentBody">
                            <div class="comment">
                                <div class="username" @click="toUser(item.user.userId)">
                                    {{ item.user.nickname }}
                                    <img :src="item.user.vipRights.associator ? item.user.vipRights.associator. iconUrl : (item.user.vipRights.musicPackage ? item.user.vipRights.musicPackage.  iconUrl : '')" alt="" v-if="item.user.vipRights && (item.user.vipRights.  associator || item.user.vipRights.musicPackage)" class="vipPic">
                                </div>
                                :
                                {{ item.content }}
                            </div>
                            <div class="commentTime">
                                {{ dateFormat(item.time,true) + ' ' + item.timeStr}}
                            </div>
                        </div>
                        <div class="commentOther">
                            <span class="anticon">举报</span>
                            <span class="anticon"><LikeOutlined />{{ item.likedCount === 0 ? '' : item.likedCount }}    </span>
                            <ShareAltOutlined />
                            <CommentOutlined />
                        </div>
                    </div>
                </div>
            </div>
            <a-pagination v-model:current="current" :total="total" @change="handlePageChange" :showSizeChanger="false" />
        </template>
    </div>
</template>
<script setup>
import { ref , computed} from 'vue';
import dateFormat from '@/utils/dateFormat';
import TransparemtBtn from './TransparemtBtn.vue';
import {LikeOutlined , ShareAltOutlined , CommentOutlined ,} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router';
const props = defineProps({
    hotComments:Array,
    latestComments:Array,
    spinning:Boolean,
    total:Number,
})
const current = ref(1);
const router = useRouter();
const emit = defineEmits(['handlePageChange']);
const partHotComments = computed(()=>props.hotComments.slice(0,10))
const handlePageChange = (newPage)=>{
    emit('handlePageChange',newPage);
}
const reset = ()=>{
    current.value = 1;
}
const toUser = (id)=>{
    router.push(`/u/${id}`);
}
defineExpose({
    reset,
})
</script>
<style scoped lang="less">
@import '@/assets/theme.less';
#commentList{
    width: 100%;
    #hotComments{
        margin-bottom: 10px;
        .toMoreHot{
            display: flex;
            place-content: center center;
        }
    }
    .commentItem{
        width: 100%;
        display: flex;
        align-items: flex-start;
        position: relative;
        min-height: 48px;
        padding-top: 0px;
        margin-bottom: 15px;
        padding-bottom: 15px;
        text-align: left;
        border-bottom: solid 1px #363636;
        .userPic{
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin: 0px 14px;
            overflow: hidden;
        }
        .commentBody{
            flex: 1;
        }
        .commentOther{
            position: absolute;
            right: 0;
            bottom: 12px;
            font-size: 13px;
            color: @black-font-color;
            > .anticon{
                padding: 0 10px;
                border-right: solid 1px #555;
                color: #d5d5d5;
                &:last-child{
                    border-right: 0;
                }
                line-height: 16px;
                &:first-child{
                    visibility: hidden;
                }
            }
            
        }
            
        .comment{
            color: #cbcbcb;
            padding-left: 6px;
            align-items: flex-start;
            font-size: 12px;
            line-height: 20px;
            .username{
                float: left;
                color: #7cacd5;
                padding-right: 4px;
                display: flex;
                align-items: center;
            }
        }
        .commentTime{
            font-size: 12px;
            color: #646259;
            line-height: 20px;
        }
        .vipPic{
            height: 14px;
            margin-left: 4px;
        }
        &:hover{
            .commentOther :first-child{
                visibility:visible
            }
        }
    }
    :deep(.ant-pagination){
        margin-top: 40px;
        .ant-pagination-item{
            min-width: 24px;
            height: 24px;
            line-height: 24px;
            border-radius: 4px;
            background-color: transparent;
            margin-right: 4px;
            border-color: #414141;
            a{
                color: #8b8b8b;
                font-size: 13px;
            }
        }
        .ant-pagination-item-active{
            border-color: none;
            background-color: #ec4141;
            a{
                color: white;
            }
        }
        .ant-pagination-prev,.ant-pagination-next{
            min-width: 26px;
            height: 26px;
            line-height: 26px;
            margin-right:4px;
            .ant-pagination-item-link{
                color: #8b8b8b;
                border-color: #414141;
                background-color: transparent;
            }
        }
    }
    .username{
        cursor: pointer;
    }
}
.picImg{
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.title{
    text-align: left;
    color: #d5d5d5;
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
}
</style>