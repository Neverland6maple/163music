<template>
    <div id="commentList">
        <a-spin :indicator="indicator" tip="加载中" :spinning="spinning" :style="{color:'#666',display:'flex',alignItems:'center',justifyContent:'center'}"/>  
        <template v-if="!spinning">
            <div id="hotComment" v-if="hotComment.length > 0 && current === 1">
                <h3 class="title">精彩评论</h3>
                <div class="commentList">
                    <div class="commentItem" v-for="(item) in hotComment" :key="item.commentId">
                        <div class="userPic">
                            <img :src="item.user.avatarUrl" alt="" class="picImg">
                        </div>
                        <div class="commentBody">
                            <div class="comment">
                                <div class="username">
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
            <div id="latestComment">
                <h3 class="title">最新评论</h3>
                <div class="commentList">
                    <div class="commentItem" v-for="(item) in latestComment" :key="item.commentId">
                        <div class="userPic">
                            <img :src="item.user.avatarUrl" alt="" class="picImg">
                        </div>
                        <div class="commentBody">
                            <div class="comment">
                                <div class="username">
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
            <a-pagination v-model:current="current" :total="50" show-less-items @change="handlePageChange"/>
        </template>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import dateFormat from '@/utils/dateFormat';
import {LikeOutlined , ShareAltOutlined , CommentOutlined ,} from '@ant-design/icons-vue'
const props = defineProps({
    hotComment:Array,
    latestComment:Array,
    spinning:Boolean,
    total:Number,
})
const current = ref(1);
const emit = defineEmits(['handlePageChange','change']);
const handlePageChange = (newPage)=>{
    emit('handlePageChange',newPage);
}
</script>
<style scoped lang="less">

#commentList{
    width: 100%;
    .commentItem{
        width: 100%;
        display: flex;
        align-items: flex-start;
        position: relative;
        min-height: 48px;
        padding-top: 15px;
        margin-bottom: 15px;
        text-align: left;
        border-top: solid 1px #363636;
        &:first-child{
            border-top: 0;
        }
        .userPic{
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin: 0px 14px;
            background-color: yellow;
            overflow: hidden;
        }
        .commentBody{
            flex: 1;
        }
        .commentOther{
            position: absolute;
            right: 0;
            bottom: 0;
            height: 10px;
            font-size: 13px;
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
            width: 40px;
            height: 14px;
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
    
}
.picImg{
    width: 100%;
    height: 100%;
}
.title{
    text-align: left;
    color: #d5d5d5;
    font-weight: bold;
    font-size: 14px;
}
</style>