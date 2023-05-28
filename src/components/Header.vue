<template>
    <div id="myHeader" :class="{'header-spreading' : myIsSpreading}">
        <div id="hdLeft">
            <div id="logo" v-if="!myIsSpreading">
                <router-link to="/" id="logoImg"></router-link>
            </div>
            <div class="fold" v-else @click="handleSpread">
                    <DownOutlined />
            </div>
            <div id="subnav" ref="subnavRef" @click="hideLock">
                <div id="goNav">
                    <span id="goPre"></span>
                    <span id="goNext"></span>
                </div>
                <div id="search">
                    <a-input id="ipt" placeholder="Basic usage" v-model:value="keyword" @change="getSuggest(keyword)" @pressEnter="handleSearch(keyword)" @focus="changeIsSearching"> 
                        <template #prefix>
                            <user-outlined type="user" style="color: #b3b3b4;"/>
                        </template>
                    </a-input>
                </div>
                <div id="singToSearch">
                    <CustomerServiceOutlined />
                </div>
                <div id="searchRecommand" v-if="isSearching">
                    <div class="hot" v-if="!keyword">
                        <div id="searchHistory">
                            <div class="title">搜索历史<DeleteOutlined class="deleteAllIcon" @click="handleDeleteAll"/></div>
                            <div id="historyBox" :style="{'max-height': isCheckAll ? '' : '68px'}">
                                <div class="historyItem" v-for="(item,index) in searchHistory" :key="index" @click="handleSearch(item)">
                                    {{ item }}
                                    <div class="deleteIcon" @click="handleDelete(index,$event)">
                                        X
                                    </div>
                                </div>
                            </div>
                            <div id="checkAll" @click="changeIsCheckAll" v-if="!isCheckAll">查看全部</div>
                        </div>
                        <div id="searchHot">
                            <div class="title">热搜榜</div>
                            <div class="hotItem" v-for="(item,index) in hotItem" :key="index" @click="handleSearch(item.searchWord)">
                                <div class="itemNo">{{ index }}</div>
                                <div class="hotItemBody">
                                    <div class="up">
                                        <div class="itemName">{{ item.searchWord }}</div>
                                        <div class="itemHot" v-if="item.iconType === 1">
                                            <img :src="item.iconUrl" alt="" class="hotImg">
                                        </div>
                                        <div class="itemPop">{{ item.score }}</div>
                                    </div>
                                    <div class="bottom">
                                        {{ item.content }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="suggest" v-else>
                        <div v-for="(item,index) in suggestList.order" :key="index">
                            <div class="title">
                                <span class="titleIcon"><CustomerServiceOutlined /></span>
                                {{ suggestObj[item] }}
                            </div>
                            <div class="suggestItem" v-for="(item1) in suggestList[item]" :key="item1.id" @click="handleSearch(item1.name)">
                                <span class="name">{{ item1.name }}</span>
                                <template v-if="item === 'songs'">
                                    <span class="slash">-</span>
                                    <span class="Arname" v-for="(ar) in item1.artists" :key="ar.id">{{ ar.name }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="hdRight">
            <ul id="fn">
                <li v-if="!myIsSpreading">
                    <SkinOutlined />
                </li>
                <li v-if="myIsSpreading" class="expand">
                    <ExpandAltOutlined />
                    <span :style="{fontSize:'12px',marginLeft:'4px'}">全屏纯享</span>
                </li>
                <li>
                    <SettingOutlined />
                </li>
                <li id="userMessage" @click="showMsg">
                    <MailOutlined />
                    <div id="messageCount">{{newMsgCount}}+</div>
                </li>
                <li>
                    <ExpandOutlined />
                </li>
                <li>
                    <MinusOutlined />
                </li>
                <li>
                    <BorderOutlined />
                </li>
                <li>
                    <CloseOutlined />
                </li>
            </ul>
            <div id="user" v-if="!myIsSpreading">
                <div id="userImg" @click="toUser(profile.userId)"><img :src="profile.avatarUrl" alt="" class="coverPic"></div>
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                        <span id="username" @click="toUser(profile.userId)">
                            {{  profile.nickname|| '未登录' }}
                        </span>
                        <DownOutlined />
                    </a>
                    <template #overlay v-if="islogin">
                        <userNav :follows="profile.follows" :followeds="profile.followeds" :eventCount="profile.eventCount"></userNav>
                    </template>
                </a-dropdown>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import {CustomerServiceOutlined,UserOutlined,DownOutlined,SkinOutlined,SettingOutlined,MailOutlined,ExpandOutlined,MinusOutlined,BorderOutlined,CloseOutlined,ExpandAltOutlined,DeleteOutlined} from '@ant-design/icons-vue'
import { computed } from '@vue/reactivity';
import { getCurrentInstance, ref,watch} from 'vue';
import { onBeforeRouteUpdate, useRouter ,useRoute } from 'vue-router';
import { useStore } from 'vuex';
import userNav from '@/components/UserNav.vue'
import debounce from '@/utils/debounce';
const keyword = ref('');
const router = useRouter();
const route = useRoute();
const store = useStore();
const {proxy:{$axios,$post}} = getCurrentInstance()
const myIsSpreading = ref(false);
const isCheckAll = ref(false);
const isSearching = ref(false);
const subnavRef = ref(null);
const hotItem = ref([]);
const suggestList = ref([]);
const newMsgCount = ref(0);
const suggestObj = ref({
    'songs':'单曲',
    'artists':'歌手',
    'albums':'专辑',
    'playlists':'歌单',
})
let lock = false;
const isSpreading = computed(()=>store.state.isSpreading);
const islogin = computed(()=>store.getters['user/islogin']);
const profile = computed(()=>store.state.user.profile);
const searchHistory = computed(()=>store.state.history.searchHistory);
const handleSearch = (value)=>{
    keyword.value = value;
    store.commit('history/setSearchHistory',value);
    hide();
    router.push({
        path:'/search',
        query:{
            keyword:value
        }
    })
}
const hideLock = ()=>{
    lock = true;
}
const hide = function (e){
    if(!lock){
        isSearching.value = false;
        isCheckAll.value = false;
        window.removeEventListener('click',hide);
    }
    lock = false;
}
const changeIsSearching = async ()=>{
    isSearching.value = true;
    window.addEventListener('click',hide);
    if(keyword.value){
        const {data:res} = await $axios({
            method:'get',
            url:`/api/search/suggest?keywords=${keyword.value}`
        })
        if(res.result) suggestList.value = res.result;
    }else{
        const {data:res} = await $axios('/api/search/hot/detail');
        hotItem.value = res.data;
    }
}
const changeIsCheckAll = ()=>{
    isCheckAll.value = !isCheckAll.value;
}
const handleSpread = ()=>{
    store.commit('changeIsSpreading',false);
}
const toUser = (userId)=>{
    if(JSON.stringify(profile.value) === "{}"){
        store.commit('changeLoginShow',true)
    }else{
        router.push(`/u/${userId}`);
    }
}
const handleDelete = (index,e)=>{
    store.commit('history/deleteSearchHistory',index);
    e.stopPropagation();
}
const handleDeleteAll = ()=>{
    store.commit('history/deleteSearchHistoryAll');
}
const showMsg = ()=>{
    store.commit('changeSlider',2);
}
const getSuggest = debounce(async (key)=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/search/suggest?keywords=${key}`
    })
    if(res.result) suggestList.value = res.result;
},300)
watch(()=>route.query.from,val=>{
    store.commit('changeLoginShow',true)
})
const getMsg = async ()=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/msg/private?timestamp=${Date.now()}`
    })
    if(res.code === 200){
        newMsgCount.value = res.newMsgCount;
    }
}
getMsg();
watch(isSpreading,(newValue)=>{
    if(newValue){
        setTimeout(()=>{
            myIsSpreading.value = newValue;
        },300)
    }else{
        myIsSpreading.value = newValue;
    }
},{immediate:true})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#myHeader{
    height: 100%;
    min-width: 1028px;
    position: relative;
    border-bottom: solid 1px #a71e1e;
    &.header-spreading{
        background-color: #2b2b2b;
        border-bottom: 0;
        transition: all 0.05s ease-out;
    }
    #hdLeft{
        float: left;
        height: 100%;
        position: relative;
        .fold{
            float: left;
            height: 100%;
            margin-left: 28px;
            color: @black-font-color;
            cursor: pointer;
        }
        #logo{
            float: left;
            cursor: pointer;
            height: 100%;
            margin-top: 1px;
            #logoImg{
                float: left;
                height: 90%;
                width: 180px;
                background-image: url('@/assets/topbar.png');
                background-position: 0 -7px;
                transform: scale(0.8);
            }
        }
        #subnav{
            position: absolute;
            left: 230px;
            height: 100%;
            display: flex;
            #goNav{
                display: flex;
                justify-content: center;
                align-items: center;
                span{
                    &.available{
                        cursor: pointer;
                        border-color: #b2b2b3 !important;
                    }
                    border: solid 1px #58585a;
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    transform: rotate(45deg);
                    margin-right: 24px;
                }
                #goPre{
                    border-top: none;
                    border-right: none;
                }
                #goNext{
                    border-bottom: none;
                    border-left: none;
                }
            }
            #singToSearch{
                color: #adafb2;
                margin-left: 14px;
                cursor: pointer;
            }
            #searchRecommand{
                position: absolute;
                top: 66px;
                left: -14px;
                max-height: 520px;
                background-color: #363636;
                z-index: 100;
                border-radius: 8px;
                box-shadow: 0 0 8px #111;
                overflow: auto;
                transition: all .5s;
                .hot{
                    width: 324px;
                    padding: 16px;
                    #searchHistory{
                        position: relative;
                        overflow: hidden;
                        .deleteAllIcon{
                            padding-left: 4px;
                            cursor: pointer;
                        }
                        #historyBox{
                            padding: 6px;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content:left;
                            .historyItem{
                                padding: 0px 16px;
                                border: solid 1px #545454;
                                line-height: 24px;
                                margin-right: 10px;
                                color: #d7d7d7;
                                border-radius: 12px;
                                font-size: 13px;
                                margin-bottom: 7px;
                                max-width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                position: relative;
                                cursor: pointer;
                                &:hover .deleteIcon{
                                    display: block;
                                }
                                .deleteIcon{
                                    display: none;
                                    content: 'x';
                                    position: absolute;
                                    right: 4px;
                                    top: 0;
                                    font-size: 13px;
                                    color: #717171;
                                    cursor: pointer;
                                }

                            }
                        }
                        #checkAll{
                            position: absolute;
                            top: 2px;
                            right: 0;
                            font-size: 13px;
                            line-height: 13px;
                            color: #797979;
                            cursor: pointer;
                        }
                    }
                    #searchHot{
                        .title{
                            margin-top: 4px;
                            margin-bottom: 18px;
                        }
                        .hotItem{
                            height: 56px;
                            width: 100%;
                            display: flex;
                            cursor: pointer;
                            &:hover{
                                background-color: #333333;
                            }
                            .itemNo{
                                width: 35px;
                                height: 100%;
                                padding-left: 4px;
                                display: flex;
                                justify-content: left;
                                align-items: center;
                            }
                            .hotItemBody{
                                display: flex;
                                flex-direction: column;
                                align-items: flex-start;
                                font-size: 13px;
                                .up{
                                    display: flex;
                                    align-items: center;
                                    margin-top: 8px;
                                    line-height: 20px;
                                    .itemName,.itemHot,.itemPop{
                                        margin-right: 4px;
                                    }
                                    .itemName{
                                        color: #d7d7d7;
                                    }
                                    .itemPop{
                                        font-size: 12px;
                                        color: #5e5e5e;
                                    }
                                    .itemHot{
                                        width: 24px;
                                        .hotImg{
                                            width: 100%;
                                        }
                                    }
                                }
                                .bottom{
                                    color: #737373;
                                    line-height: 20px;
                                }
                            }
                        }
                        .hotItem:nth-child(2),.hotItem:nth-child(3),.hotItem:nth-child(4){
                            .itemNo{
                                color: #ff3a3a;
                            }
                        }
                    }
                    .title{
                        text-align: left;
                        line-height: 16px;
                        color: #8c8c8c;
                        font-size: 14px;
                    }
                }
                .suggest{
                    width: 360px;
                    text-align: left;
                    padding-bottom: 15px;
                    .title{
                        padding-left: 36px;
                        position: relative;
                        color: #737373;
                        font-size: 14px;
                        line-height: 44px;
                        .titleIcon{
                            position: absolute;
                            left: 12px;
                        }
                    }
                    .suggestItem{
                        padding-left: 36px;
                        color: @black-font-color;
                        font-size: 12px;
                        line-height: 30px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        &:hover{
                            background-color: #333333;
                        }
                        .slash{
                            margin: 0 3px;
                        }
                        .Arname{
                            margin-right: 4px;
                        }
                    }
                }
            }
        }
        #search{
            width: 160px;
            .ant-input-affix-wrapper{
                border-radius: 17px;
                height: 34px;
                line-height: 30px;
                background-color: rgba( 255, 255, 255, 0.05);
                border: none;
                :deep(#ipt) {
                    background-color: transparent;
                    color: @black-font-color;
                }
            }
        }
    }
    #hdRight{
        float: right;
        height: 100%;
        #user{
            float: right;
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 150px;
            height: 100%;
            #userImg{
                height: 30px;
                width: 30px;
                cursor: pointer;           
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                align-items: center;
            }
            :deep(.ant-dropdown-trigger){
                #username{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 80%;
                    text-align: left;
                    margin-right: 10px;
                }
                margin-left: 10px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-align: right;
                max-width: 75%;
                height: 100%;
                font-size: 12px;
                color: #ccc;
                
            }
            
        }
        #fn{
            float: right;
            display: flex;
            justify-content: space-around;
            margin-right: 10px;
            li{
                width: 36px;
                color: #adafb2;
                cursor: pointer;
                &.expand{
                    display: flex;
                    width: 80px;
                    justify-content: center;
                    align-items: center;
                    line-height: 12px;
                }
            }
            #userMessage{
                position: relative;
                margin-right: 10px;
                #messageCount{
                    position: absolute;
                    top: 16px;
                    right: -15px;
                    background-color: #ec4141;
                    // width: 26px;
                    padding: 1px 5px;
                    border-radius: 7px;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    line-height: 12px;
                }
                
            }
        }
    }
}

</style>