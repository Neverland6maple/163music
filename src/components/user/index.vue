<template>
    <div id="userPage">
        <div id="userPageHead">
            <div id="userCover">
                <img :src="userInfo.avatarUrl" alt="picUrl" class="coverPic">
            </div>
            <div id="userInfos">
                <div id="userName">
                    <div class="userName">{{ userInfo.nickname }}</div>
                </div>
                <div id="userHonour">
                  <div id="userRights">
                    
                  </div>
                  <div id="userTitle">
                    
                  </div>
                  <div id="userLevel">
                    创建
                  </div>
                </div>
                <a-divider style="margin: 0;height:1px;width: 100%;background-color: #454545;margin-top: 14px;"></a-divider>
                <div id="userStatistic">
                    <div class="logs statisticItem">
                        <div class="statisticNum">{{ userInfo.eventCount ?? 0}}</div>
                        <div class="statisticTag">动态</div>
                    </div>
                    <div class="follows statisticItem">
                        <div class="statisticNum">{{ userInfo.follows ?? 0}}</div>
                        <div class="statisticTag">关注</div>
                    </div>
                    <div class="fans statisticItem">
                        <div class="statisticNum">{{ userInfo.followeds ?? 0 }}</div>
                        <div class="statisticTag">粉丝</div>
                    </div>
                </div>
                <div id="userInfo">
                    <div id="userLocation" >
                      <div class="profileLable">所在地区:</div>
                      <div class="userLocation">123</div>
                    </div>
                    <div id="userSocial">
                        <div class="profileLable">社交网络:</div>
                        <div class="userSocial">123</div>
                    </div>
                    <div id="userProfile" :class="{'userProfileSpreading' : isSpreading}">
                        <div class="profileLable">个人介绍:</div>
                        {{ userInfo.signature || "暂无介绍" }}
                        <br>
                        <CaretUpOutlined v-if="isSpreading" @click="spreadProfile"/>
                        <CaretDownOutlined v-else @click="spreadProfile"/>
                    </div>
                </div>
            </div>
        </div>
        <div id="userPageMusic">
            <div id="userTab">
                <a-tabs v-model:activeKey="activeKey" :animated="false" :tabBarGutter="20" @change="handleIndexChange">
                    <a-tab-pane key="1" tab="创建的歌单"></a-tab-pane>
                    <a-tab-pane key="2" tab="收藏的歌单"></a-tab-pane>
                    <a-tab-pane key="3" tab="收藏的博客"></a-tab-pane>
                    <a-tab-pane key="4" tab="创建的音乐专栏"></a-tab-pane>
                    <template #rightExtra>
                        <div class="setType">
                            <div :class="{'typeBtnActive':type === 0 ,'typeBtn':true} " @click="setType(0)"><AppstoreOutlined /></div>
                            <div :class="{'typeBtnActive':type === 1 ,'typeBtn':true} " @click="setType(1)"><MenuOutlined /></div>
                            <div :class="{'typeBtnActive':type === 2 ,'typeBtn':true} " @click="setType(2)"><PicLeftOutlined /></div>
                        </div>
                    </template>
                </a-tabs>
            </div>
            <GridPlaylist :playlist="userCreators" :type="type" v-if="activeKey === '1'"></GridPlaylist>
            <GridPlaylist :playlist="userCollections" :type="type" v-if="activeKey === '2'"></GridPlaylist>
        </div>
    </div>
</template>
<script setup>
import {CaretDownOutlined,CaretUpOutlined,AppstoreOutlined,MenuOutlined,PicLeftOutlined} from '@ant-design/icons-vue'
import { getCurrentInstance, ref, watch } from 'vue';
import { HeartOutlined,DownloadOutlined,FieldTimeOutlined,CloudOutlined,LogoutOutlined,UserAddOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import GridPlaylist from './GridPlaylist.vue';
const {proxy:{$axios,$post}} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const userCreators = ref([]);
const userCollections = ref([]);
const userId = ref();
const userInfo = ref({});
const type = ref(0);
const setType = (val)=>{
    type.value = val;
}
const activeKey = ref('1');
const isSpreading = ref(false);
const getPlaylist = async (id)=>{
    userCreators.value = [];
    userCollections.value = [];
    let res = null;
    let offset = 0;
    const pagesize = 20;
    ({data:res} = await $axios({
        method:'get',
        url:`/api/user/playlist?uid=${id}&&offset=${pagesize*offset++}`
    }))
    const playlist = res.playlist;
    for(let i = 0;i<playlist.length;i++){
        if(playlist[i].creator.userId == id){
            userCreators.value.push(playlist[i]);
        }else{
            userCollections.value.push(playlist[i]);
        }
    }
    while(res.more){
        ({data:res} = await $axios({
            method:'get',
            url:`/api/user/playlist?uid=${id}&&offset=${pagesize*offset++}`
        }))
        const playlist = res.playlist;
        for(let i = 0;i<playlist.length;i++){
            if(playlist[i].creator.userId == id){
                userCreators.value.push(playlist[i]);
            }else{
                userCollections.value.push(playlist[i]);
            }
        }
    }
}
const getUserInfo = async (id)=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/user/detail?uid=${id}`
    })
    userInfo.value = res.profile;
}
const spreadProfile = ()=>{
    isSpreading.value = !isSpreading.value;
}
watch(() => route.params.userId, val => {
    userId.value = val;
    getPlaylist(userId.value);
    getUserInfo(userId.value);
},{
    immediate:true,
});
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#userPage{
    width: 100%;
    #userPageHead{
        width: 100%;
        box-sizing: border-box;
        padding:32px 28px 20px 28px;
        display: flex;
        justify-content: left;
        #userCover{
            width: 185px;
            height: 185px;
            border-radius: 50%;
            overflow: hidden;
        }
        #userInfos{
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: left;
            align-items: flex-start;
            margin-left: 20px;
            overflow: hidden;
            #userName{
                display: flex;
                align-items: center;
                text-align: left;
                .userName{
                    font-size: 22px;
                    font-weight: bold;
                }
            }
            #userHonour{
              display: flex;
              align-items: center;
              justify-content: left;
              font-size: 12px;
              margin-top: 14px;
              #userRights{
                height: 14px;
                width: 50px;
                border-radius: 10px;
                margin-right: 8px;
                background-color: aliceblue;
              }
              #userTitle{
                margin-right: 8px;
                background-color: saddlebrown;
              }
              #userLevel{
                background-color: cadetblue;
              }
            }
            #userStatistic{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                width: 206px;
                padding-top: 16px;
                .statisticItem{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    margin-bottom: 6px;
                    height: 36px;
                    cursor: pointer;
                    &:hover{
                        .statisticNum{
                            color: white;
                        }
                        .statisticTag{
                            color: #b9b9b9;
                        }
                    }
                    .statisticNum{
                        font-weight: bold;
                        font-size: 21px;
                        color: #d7d7d7;
                        line-height: 21px;
                    }
                    .statisticTag{
                        font-size: 12px;
                        color: #919191;
                    }
                }
                .follows{
                    flex: 1;
                    align-items: center;
                    border-left: solid 1px #454545;
                    border-right: solid 1px #454545;
                }
                .logs{
                    margin-right: 35px;
                }
                .fans{
                    margin-left: 32px;
                }
            }
            #userInfo{
                width: 100%;
                #userLocation,#userSocial,#userProfile{
                    font-size: 12px;
                    text-align: left;
                    line-height: 22px;
                }
                #userLocation{
                    .userLocation{
                        
                        color: #8b8b8b;
                    }
                }
                #userSocial{
                    .userSocial{
                        color: #8b8b8b;

                    }
                }
                #userProfile{
                    width: 100%;
                    padding-right: 28px;
                    position: relative;
                    color: #8b8b8b;
                    height: 20px;
                    .anticon{
                        position: absolute;
                        right: 0;
                        top: 3px;
                        font-size: 14px;
                        color: #999999;
                        cursor: pointer;
                    }
                    &.userProfileSpreading{
                        white-space: normal;
                        overflow:auto;
                        height: auto;
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
    #userPageMusic{
        #userTab{
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