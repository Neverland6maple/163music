<template>
    <div id="albumComment">
        <div>
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
        <div id="commentList">
            <a-spin :indicator="indicator" tip="加载中" :spinning="spinning" :style="{color:'#666',display:'flex',alignItems:'center',justifyContent:'center'}"/>  
            <template v-if="!spinning">
                <div id="hotComment" v-if="hotComment > 0 && current === 1">
                    <h3 class="title">精彩评论</h3>
                    <div class="commentList">
                        <div class="commentItem">
                            <div class="userPic">
                                <img src="" alt="" class="picImg">
                            </div>
                            <div class="commentBody">
                                <div class="commentline">
                                    <div class="username">
                                        小明
                                    </div>
                                    :
                                    <div class="comment">
                                        123123123123,123123123
                                    </div>
                                </div>
                                <div class="commentTime">
                                    2022年12月9日 04:44
                                </div>
                            </div>
                            <div class="commentOther">
                                <span class="anticon">举报</span>
                                <LikeOutlined />
                                <ShareAltOutlined />
                                <CommentOutlined />
                            </div>
                        </div>
                        <div class="commentItem">
                            <div class="userPic">
                                <img src="" alt="" class="picImg">
                            </div>
                            <div class="commentBody">
                                <div class="commentline">
                                    <div class="username">
                                        小明
                                    </div>
                                    :
                                    <div class="comment">
                                        123123123123,123123123
                                    </div>
                                </div>
                                <div class="commentTime">
                                    2022年12月9日 04:44
                                </div>
                            </div>
                            <div class="commentOther">
                                <span class="anticon">举报</span>
                                <LikeOutlined />
                                <ShareAltOutlined />
                                <CommentOutlined />
                            </div>
                        </div>
                        <div class="commentItem">
                            <div class="userPic">
                                <img src="" alt="" class="picImg">
                            </div>
                            <div class="commentBody">
                                <div class="commentline">
                                    <div class="username">
                                        小明
                                    </div>
                                    :
                                    <div class="comment">
                                        123123123123,123123123
                                    </div>
                                </div>
                                <div class="commentTime">
                                    2022年12月9日 04:44
                                </div>
                            </div>
                            <div class="commentOther">
                                <span class="anticon">举报</span>
                                <LikeOutlined />
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
                                <div class="commentline">
                                    <div class="username">
                                        {{ item.user.nickname }}
                                        <img :src="item.user.vipRights.associator ? item.user.vipRights.associator. iconUrl : (item.user.vipRights.musicPackage ? item.user.vipRights.musicPackage.  iconUrl : '')" alt="" v-if="item.user.vipRights && (item.user.vipRights.  associator || item.user.vipRights.musicPackage)" class="vipPic">
                                    </div>
                                    :
                                    <div class="comment">
                                        {{ item.content }}
                                    </div>
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
    </div>
</template>
<script setup>
import { getCurrentInstance, ref } from 'vue';
import dateFormat from '@/utils/dateFormat';
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import {LikeOutlined , ShareAltOutlined , CommentOutlined ,} from '@ant-design/icons-vue'
const value = ref('');
const current = ref(1);
const spinning = ref(false);
const {proxy:{$axios}} = getCurrentInstance();
const total = ref(0);
const hotComment = ref([]);
const latestComment = ref([]);
const props = defineProps({
    id:String
})
const cursor = ref('');
const getHotList = async (id)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url:`/api/comment/new?type=3&id=${id}&pageSize=10&pageNo=1&sortType=2`,
    })
    hotComment.value = res.data.comments.filter(e=>e.likedCount > 10);
    spinning.value = false;
}
const getLatestComments = async (id,pageNo)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url:`/api/comment/new?type=3&id=${id}&pageSize=30&pageNo=${pageNo}&sortType=3&cursor=${cursor.value}`,
    })
    latestComment.value = res.data.comments;
    total.value = res.data.totalCount;
    cursor.value = res.data.cursor;
    spinning.value = false;
}
const handlePageChange = async (newPage)=>{
    await getLatestComments(props.id,newPage);
}
getHotList(props.id);
getLatestComments(props.id,current.value);
</script>
<style lang="less" scoped>
#albumComment{
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;
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
        text-align: left;
        color: #d5d5d5;
        font-weight: bold;
        font-size: 14px;
    }
    #commentList{
        width: 100%;
        .commentItem{
            width: 100%;
            display: flex;
            align-items: flex-start;
            position: relative;
            min-height: 48px;
            padding-top: 15px;
            margin-bottom: 20px;
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
                height: 30px;
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
            .commentline{
                display: flex;
                align-items: center;
                font-size: 12px;
                line-height: 20px;
                .comment{
                    color: #cbcbcb;
                    padding-left: 6px;
                }
                .username{
                    color: #7cacd5;
                    padding-right: 4px;
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
                background-color: transparent;
                a{
                    color: #8b8b8b;
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
}
</style>