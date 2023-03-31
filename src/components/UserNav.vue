<template>
    <div id="userNav">
        <div class="statistic">
            <div class="userStatistic">
                <div class="logs statisticItem">
                    <div class="statisticNum">{{ eventCount || 0}}</div>
                    <div class="statisticTag">动态</div>
                </div>
                <div class="follows statisticItem">
                    <div class="statisticNum">{{ follows || 0}}</div>
                    <div class="statisticTag">关注</div>
                </div>
                <div class="fans statisticItem">
                    <div class="statisticNum">{{ followeds || 0 }}</div>
                    <div class="statisticTag">粉丝</div>
                </div>
            </div>
            <div class="signIn">
                <TransparemtBtn>
                    <template #icon>
                        <TrophyOutlined style="font-size: 16px;"/>
                    </template>
                    <template #content>
                        签到
                    </template>
                </TransparemtBtn>
            </div>
            <a-divider style="height: 2px; background-color: #404040;margin: 0;"/>
        </div>
        <div class="userNav">
            <div class="navItem"><span class="left"><SketchOutlined />我的会员</span> <span class="rightArrow">2023.04.11到期<RightOutlined /></span></div>
            <div class="navItem"><span class="left"><CrownOutlined />等级</span><span class="rightArrow">Lv.9<RightOutlined /></span></div>
            <div class="navItem"><span class="left"><ShoppingCartOutlined />商城</span><span class="rightArrow"><RightOutlined /></span></div>
            <div class="divider"><a-divider style="height: 2px; background-color: #404040;margin: 0;"/></div>
            <div class="navItem"><span class="left"><UserOutlined />个人信息设置</span> <span class="rightArrow"><RightOutlined /></span></div>
            <div class="navItem"><span class="left"><UsergroupAddOutlined />绑定社交账号</span> <span class="rightArrow"><WeiboCircleOutlined style="font-size: 18px;color:#9c9b9b;"/><RightOutlined /></span></div>
            <div class="divider"><a-divider style="height: 2px; background-color: #404040;margin: 0;"/></div>
            <div class="navItem"><span class="left"><CustomerServiceOutlined />我的客服</span> <span class="rightArrow"><RightOutlined /></span></div>
            <div class="divider"><a-divider style="height: 2px; background-color: #404040;margin: 0;"/></div>
            <div class="navItem"><span class="left"><PoweroffOutlined />退出登录</span></div>
        </div>
    </div>
</template>
<script setup>
import {RightOutlined,WeiboCircleOutlined,CustomerServiceOutlined,PoweroffOutlined,UserOutlined,UsergroupAddOutlined,ShoppingCartOutlined,CrownOutlined,SketchOutlined,TrophyOutlined} from '@ant-design/icons-vue'
import TransparemtBtn from './unit/TransparemtBtn.vue';
const props = defineProps({
    follows:Number,
    followeds:Number,
    eventCount:Number,
})
</script>
<style scoped lang="less">
@import '@/assets/theme.less';
#userNav{
    width: 275px;
    height: 405px;
    background-color:#363636;
    box-shadow: 0 0 8px #111;
    transform: translateX(-30%);
    .statistic{
        height: 120px;
        padding-top: 20px;
        padding-left: 14px;
        padding-right: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .userStatistic{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .statisticItem{
                width: 72px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                margin-bottom: 6px;
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
        }
    }
    .userNav{
        .navItem{
            color: @black-font-color;
            font-size: 13px;
            line-height: 38px;
            cursor: pointer;
            padding-left: 14px;
            padding-right: 14px;
            display: flex;
            justify-content: space-between;
            &:hover{
                background-color: #424242;
            }
            .rightArrow{
                font-size: 12px;
                color: #5c5e58;
                .anticon{
                    margin-left: 2px;
                }
            }
            .left{
                .anticon{
                    font-size: 18px;
                    margin-right: 4px;
                }
            }
        }
        .divider{
            padding-left: 14px;
            padding-right: 14px;
        }
    }
}
</style>