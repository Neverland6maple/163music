<template>
    <div id="msgBox">
        <div v-if="!showDialog" style="height: 100%;">
            <div class="hd">
                <div class="title">消息</div>
                <div class="msgNavs">
                    <div :class="{'navItem':true, 'actived':activedNav === 0}" @click="activedNav = 0">
                        私信
                        <a-badge :count="msgsObj.newMsgCount" :overflow-count="999" :offset="['22px','-17px']" class="badge">
                          <a href="#" class="head-example" />
                        </a-badge>
                    </div>
                    <div :class="{'navItem':true, 'actived':activedNav === 1}" @click="activedNav = 1">私信</div>
                    <div :class="{'navItem':true, 'actived':activedNav === 2}" @click="activedNav = 2">私信</div>
                    <div :class="{'navItem':true, 'actived':activedNav === 3}" @click="activedNav = 3">私信</div>
                </div>
                <div class="quickRead">一件已读</div>
            </div>
            <div class="list">
                <div class="listItem" v-for="(item,index) in msgs" :key="index" @click="toDialog(item.fromUser.userId)">
                    <div class="newTag" v-if="item.user.newMsgCount > 0"></div>
                    <div class="userPic">
                        <img :src="item.fromUser.avatarUrl" alt="" class="coverPic">
                    </div>
                    <div class="msgBody">
                        <div class="username">
                            {{ item.fromUser.nickname }}
                            <div class="msgTime">{{ timeFormat(item.user.lastMsgTime) }}</div>
                        </div>
                        <div class="msg">{{ item.user.lastMsg.msg.msg}}</div> 
                    </div>
                </div>
            </div>
        </div>
        <div class="dialogBox" v-else>
            <div class="dialogHd">
                <div class="back" @click="showDialog = false"><LeftOutlined /></div>
                {{ msgDetail[0].fromUser.nickname }}
            </div>
            <div class="dialogContent">
                <div class="batch" v-for="(item) in msgDetail" :key="item.id">
                    <div class="userPic">
                        <img :src="item.fromUser.avatarUrl" alt="" class="coverPic">
                    </div>
                    <div class="batchContent">
                        <div class="text">{{ item.msg.msg }}</div>
                        <div class="substance" @click="toUrl(item.msg.generalMsg.webUrl)">
                            <div class="cover">
                                <img :src="item.msg.generalMsg.cover" alt="" class="coverPic">
                            </div>
                            <div class="detail">
                                <div class="title">{{ item.msg.generalMsg.inboxBriefContent }}</div>
                                <div class="subtitle" v-if="item.msg.generalMsg.noticeMsg">abc</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dialogIpt">
                <div class="textarea">
                    <a-textarea
                    v-model:value="value"
                    :auto-size="{ minRows: 3, maxRows: 3}"
                    :placeholder="`回复：`"
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
                    <div class="commentBtn" @click="comment">
                        <TransparemtBtn :styleObj="{'padding':'0 14px'}">
                            <template #content>发送</template>
                        </TransparemtBtn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref , reactive, getCurrentInstance} from 'vue';
import timeFormat from '@/utils/timeFormat'
import TransparemtBtn from './unit/TransparemtBtn.vue';
import {LeftOutlined,} from '@ant-design/icons-vue';
const {proxy:{$axios}} = getCurrentInstance();
const activedNav = ref(0);
const msgsObj = ref({});
const msgs = ref([]);
const msgDetail = ref([{
    fromUser:{},
    toUser:{},
    msg:{}
}]);
const showDialog = ref(false);
const getMsg = async ()=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/msg/private`
    })
    if(res.code === 200){
        msgsObj.value = res;
        msgs.value = res.msgs;
        for(let i = 0;i<msgs.value.length;i++){
            msgs.value[i].user.lastMsg = JSON.parse(msgs.value[i].user.lastMsg);
            msgs.value[i].user.lastMsg.msg = JSON.parse(msgs.value[i].user.lastMsg.msg)
        }
    }else{
        console.log(res);
    }
}
const getDialog = async (id)=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/msg/private/history?uid=${id}`
    })
    if(res.code === 200){
        for(let i = 0;i<res.msgs.length;i++){
            res.msgs[i].msg = JSON.parse(res.msgs[i].msg);
        }
        msgDetail.value = res.msgs;
    }else{
        console.log(res);
    }
}
const toUrl = (url)=>{
    location.href = url;
}
const toDialog = (id)=>{
    showDialog.value = true;
    getDialog(id);
}
getMsg();
</script>
<style scoped lang='less'>
@import '@/assets/theme.less';
#msgBox{
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width: 360px;
    box-shadow: -1px -1px 6px #111;
    background-color: #363636;
    z-index: 999;
    .hd{
        margin: 18px;
        position: relative;
        .title{
            line-height: 28px;
            font-size: 18px;
            color:@black-font-color;
            text-align: left;
            margin-bottom: 14px;
            margin-left: 6px;
        }
        .msgNavs{
            display: flex;
            width: 100%;
            height: 28px;
            border-radius: 14px;
            border: solid 1px #666666;
            .navItem{
                flex: 1;
                height: 100%;
                border-radius: 14px;
                cursor: pointer;
                line-height: 28px;
                font-size: 13px;
                color: #919191;
                &:hover{
                    background-color: #3e3e3e;
                }
                &.actived{
                    background-color: #666666;
                    color: white;
                }
                :deep(.ant-scroll-number){
                    box-shadow: none;
                    height: 15px;
                    line-height: 15px;
                    padding: 0 4px;
                }
            }
        }
        .quickRead{
            color: #85b9e6;
            font-weight: bold;
            font-size: 14px;
            position: absolute;
            right: 6px;
            top: 12px;
            cursor: pointer;
        }
    }
    .list{
       overflow: scroll; 
       width: 100%;
       height: 100%;
       .listItem{
            display: flex;
            width: 100%;
            align-items: center;
            cursor: pointer;
            position: relative;
            .newTag{
                position: absolute;
                left: 7px;
                top: 32px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #d0021b;
            }
            .userPic{
                height: 32px;
                width: 32px;
                overflow: hidden;
                border-radius: 50%;
                margin-right: 6px;
                margin-left: 20px;
            }
            .msgBody{
                flex: 1;
                position: relative;
                overflow: hidden;
                border-bottom: solid 1px #3c3c3c;
                padding: 16px 0px;
                margin-right: 16px;
                .username{
                    color: #85b9e6;
                    font-size: 13px;
                    text-align: left;
                    line-height: 18px;
                    position: relative;
                    
                    .msgTime{
                        position: absolute;
                        top: -3px;
                        right: 6px;
                        color: #5e5e5e;
                        font-size: 12px;
                    }
                }
                .msg{
                    font-size: 12px;
                    line-height: 18px;
                    color: @black-font-color;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            &:hover{
                background-color: #3e3e3e;
            }
       }
    }
    .dialogBox{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .dialogHd{
            height: 50px;
            width: 100%;
            background-color: #393b3e;
            position: relative;
            line-height: 50px;
            font-size: 12px;
            font-weight: bold;
            .back{
                position: absolute;
                left: 12px;
                font-size: 16px;
                color: #666666;
                cursor: pointer;
                &:hover{
                    color: #8d8d8d;
                }
            }
        }
        .dialogContent{
            overflow: auto;
            flex: 1;
            width: 100%;
            padding-right: 40px;
            .batch{
                display: flex;
                width: 100%;
                margin-top: 20px;
                margin-bottom: 20px;
                overflow: hidden;
                .userPic{
                    margin: 0 17px;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                }
                .batchContent{
                    flex: 1;
                    background-color: #424242;
                    padding: 9px;
                    padding-bottom: 12px;
                    border-radius: 0 14px 14px 14px;
                    overflow: hidden;
                    .text{
                        font-size: 13px;
                        line-height: 18px;
                        color: @black-font-color;
                        text-align: left;
                        margin-bottom: 2px;
                    }
                    .substance{
                        background-color: #383838;
                        display: flex;
                        padding: 8px;
                        overflow: hidden;
                        cursor: pointer;
                        .cover{
                            width: 34px;
                            height: 34px;
                            border-radius: 3px;
                            margin-right: 16px;
                        }
                        .detail{
                            font-size: 12px;
                            line-height: 16px;
                            text-align: left;
                            flex: 1;
                            .title{
                                color: @black-font-color;

                            }
                            .subtitle{
                                color: #717171;
                            }
                        }
                    }
                }
            }
        }
        .dialogIpt{
            width: 100%;
            height: 125px;
            padding: 8px 18px;
            .textarea{
                position: relative;
                margin-bottom: 10px;
                .ant-input{
                    border: 0;
                    background-color: transparent;
                    color: #d8d8d8;
                    padding: 0;
                    padding: 6px 10px;
                    line-height: 17px;
                    font-size: 13px;
                    background-color: #444444;
                    &::-webkit-input-placeholder{
                        color: #696969;
                    }
                    &:-ms-input-placeholder { /* IE 10+ */
                        color: #696969;
                    }
                    &:-moz-placeholder { /* Firefox 18- */
                        color: #696969;
                        opacity: 1;
                    }
                    &::-moz-placeholder { /* Firefox 19+ */
                        color: #696969;
                        opacity: 1;
                    }
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
                height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                .textareaOption{
                    display: flex;
                }
            }
        }
    }
}
</style>