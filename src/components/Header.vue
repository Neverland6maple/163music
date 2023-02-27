<template>
    <div id="myHeader">
        <div id="hdLeft">
            <div id="logo">
                <router-link to="/" id="logoImg"></router-link>
            </div>
            <div id="subnav">
                <div id="goNav">
                    <span id="goPre"></span>
                    <span id="goNext"></span>
                </div>
                <div id="search">
                    <a-input id="ipt" placeholder="Basic usage" v-model:value="userName"> 
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
                <li>
                    <SkinOutlined />
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
            <div id="user">
                <div id="userImg"><img src="@/assets/user.jpg" alt=""></div>
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                        <span id="username">
                            没见过这么帅的名字
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
import {CustomerServiceOutlined,DownOutlined,SkinOutlined,SettingOutlined,MailOutlined,ExpandOutlined,MinusOutlined,BorderOutlined,CloseOutlined,} from '@ant-design/icons-vue'
import { defineComponent,getCurrentInstance} from 'vue';
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
    },
    async setup(){
        getCurrentInstance();
        // const { proxy:{$axios} } = getCurrentInstance();
        // const res = await $axios({
        //     method:'get',
        //     url:'/api'
        // })
        // console.log(res);
    }
})
</script>

<style lang="less" scoped>
#myHeader{
    height: 100%;
    min-width: 1028px;
    position: relative;
    #hdLeft{
        float: left;
        height: 100%;
        #logo{
            float: left;
            height: 100%;
            #logoImg{
                float: left;
                margin-top: 1px;
                height: 90%;
                width: 180px;
                background-image: url('@/assets/topbar.png');
                background-position: 0 -7px;
                transform: scale(0.8);
            }
        }
        #subnav{
            float: left;
            margin-left: 58px;
            height: 100%;
            #goNav{
                float: left;
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
            #search{
                float: left;
            }
            #singToSearch{
                float: left;
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
        #user{
            float: right;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 148px;
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
                position: relative;
                #username{
                    position: absolute;
                    left: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 80%;
                }
                text-align: right;
                width: 75%;
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