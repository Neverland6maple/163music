<template>
    <div id="scanPre">
        <h2 class="loginTitle">扫描登录</h2>
        <div class="mid">
            <div class="instruction">

            </div>
            <div class="QR">
                <img :src=qrImg alt="QRcode" class="QRcode"/>
                <div class="loginIntro">使用<span class="blue">网易云音乐APP</span>扫码登陆</div>
            </div>
        </div>
        <div class="otherLogin"><router-link to="/">选择其它登陆模式<RightOutlined /></router-link></div>
    </div>
</template>
<script setup>
import {RightOutlined,} from '@ant-design/icons-vue';
const props = defineProps({
    qrImg:String,
})
</script>
<style lang="less" scoped>
#scanPre{
    .loginTitle{
        margin-top: 100px;
        font-size: 28px;
    }
    .mid{
        transition: all 1s;
        position: relative;
        width: 100%;
        height: 220px;
        margin-top: 18px;
        .instruction{
            position: absolute;
            right: 20px;
            top: 18px;
            width: 120px;
            height: 190px;
            border-radius: 7px;
            background-color: gray;
            background: linear-gradient(gray,white);
            opacity: 0;
            transition: all .8s;
        }
        .QR{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: all .8s;
            .QRcode{
                width: 170px;
                height: 170px;
                margin-top: 18px;
                background-color: gray;
                transition: all 1s;
            }
            .loginIntro{
                margin-top: 14px;
                font-size: 14px;
                color: black;
                transition: all 1s;
                line-height: 22px;
                .blue{
                    color: #1679c4;
                    cursor: pointer;
                }
            }
        }
    }
    .otherLogin{
        margin-top: 90px;
        font-size: 12px;
        color: black;
    }
    &:hover{
        .mid{
            .instruction{
                opacity: 0.8;
                right: 180px;
            }
            .QR{
                margin-left: 150px;
                .QRcode{
                    margin-top: -3px;
                    transform: scale(0.75);
                }
                .loginIntro{
                    margin-top: 0px;
                    width: 130px;
                }
            }
        }
    }
}
</style>
