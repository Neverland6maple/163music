<template>
    <div id="downloadAll">
        <a-button type="primary" :loading="iconLoading" @click="enterIconLoading">
            <template #icon><DownloadOutlined /></template>
            播放全部
        </a-button>
    </div>
</template>
<script setup>
import {DownloadOutlined} from '@ant-design/icons-vue'

</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#downloadAll{
    .ant-btn{
        height: 32px;
        border-radius: 176px;
        color: @black-font-color;
        background-color: transparent;
        border-color: #4b4b4b;
        padding: 0 16px;
        box-sizing: content-box;
    }
    
}

</style>