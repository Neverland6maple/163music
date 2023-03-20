<template>
    <div id="myHeader" :class="{'header-spreading' : myIsSpreading}">
        <div id="hdLeft">
            <div id="logo" v-if="!myIsSpreading">
                <router-link to="/" id="logoImg"></router-link>
            </div>
            <div class="fold" v-else @click="handleSpread">
                    <DownOutlined />
            </div>
            <div id="subnav">
                <div id="goNav">
                    <span id="goPre"></span>
                    <span id="goNext"></span>
                </div>
                <div id="search">
                    <a-input id="ipt" placeholder="Basic usage" v-model:value="keyword" @pressEnter="handleSearch"> 
                        <template #prefix>
                            <user-outlined type="user" />
                        </template>
                        <template #suffix>
                            <a-tooltip title="Extra information">
                            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                            </a-tooltip>
                        </template>
                    </a-input>
                </div>
                <div id="singToSearch">
                    <CustomerServiceOutlined />
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
                <li id="userMessage">
                    <MailOutlined />
                    <div id="messageCount">99+</div>
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
                <div id="userImg"><img src="@/assets/user.jpg" alt=""></div>
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                        <span id="username" @click="toLogin">
                            未登录
                        </span>
                        <DownOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0">
                            <a href="http://www.alipay.com/">1st menu item</a>
                            </a-menu-item>
                            <a-menu-item key="1">
                            <a href="http://www.taobao.com/">2nd menu item</a>
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item key="3">3rd menu item</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            
        </div>
    </div>
</template>

<script>
import {CustomerServiceOutlined,DownOutlined,SkinOutlined,SettingOutlined,MailOutlined,ExpandOutlined,MinusOutlined,BorderOutlined,CloseOutlined,ExpandAltOutlined} from '@ant-design/icons-vue'
import { computed } from '@vue/reactivity';
import { defineComponent, ref,watch} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
    components:{
        CustomerServiceOutlined,
        DownOutlined,
        SkinOutlined,
        SettingOutlined,
        MailOutlined,
        ExpandOutlined,
        MinusOutlined,
        BorderOutlined,
        CloseOutlined,
        ExpandAltOutlined,
    },
    setup(){
        const keyword = ref('');
        const router = useRouter();
        const store = useStore();
        const isSpreading = computed(()=>store.state.isSpreading);
        const myIsSpreading = ref(false);
        watch(isSpreading,(newValue)=>{
            if(newValue){
                setTimeout(()=>{
                    myIsSpreading.value = newValue;
                },300)
            }else{
                myIsSpreading.value = newValue;
            }
            
        },{immediate:true})
        const handleSearch = ()=>{
            router.push({
                path:'/search',
                query:{
                    keyword:keyword.value
                }
            })
        }
        const handleSpread = ()=>{
            store.commit('changeIsSpreading',false);
        }
        const toLogin = ()=>{
            store.commit('changeLoginShow',true)
        }
        return {
            handleSearch,
            keyword,
            myIsSpreading,
            handleSpread,
            toLogin,
        }
     
    }
})
</script>

<style lang="less" scoped>
@import '@/assets/theme.less';
#myHeader{
    &.header-spreading{
        background-color: #2b2b2b;
        border-bottom: 0;
        transition: all 0.05s ease-out;
    }
    height: 100%;
    min-width: 1028px;
    position: relative;
    border-bottom: solid 1px #a71e1e;
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
                img{
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .ant-dropdown-trigger{
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