<template>
    <div id="scanAfter">
        <h2 class="loginTitle">扫描登录</h2>
        <div class="mid">
            <MobileOutlined class="mobile" />
            <div class="loginIntro">扫描成功</div>
        </div>
        <div class="instruction">请在手机上确认登录</div>
    </div>
</template>
<script setup>
import {MobileOutlined,} from '@ant-design/icons-vue';

</script>
<style lang="less" scoped>
#scanAfter{
    .loginTitle{
        margin-top: 100px;
        font-size: 28px;
    }
    .mid{
        width: 100%;
        margin-top: 36px;
        .mobile{
            font-size: 90px;
            color: #f29c9f;
            transition: color 3s;
            &:hover{
                color: black;
                transition: color 0s;
            }
        }
        .loginIntro{
            margin-top: 20px;
            font-size: 14px;
            color: #999999;
        }
    }
    .instruction{
        margin-top: 40px;
        font-size: 16px;
        color: black;
    }
}
</style>
