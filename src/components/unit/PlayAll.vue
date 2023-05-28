<template>
    <div id="playAll">
        <a-button type="primary">
            <template #icon><caret-right-outlined /></template>
            播放全部
            <span class="playAllIcon">
                <plus-outlined />
            </span>
        </a-button>
    </div>
</template>
<script setup>
import {CaretRightOutlined,PlusOutlined} from '@ant-design/icons-vue'

</script>
<style lang="less" scoped>
#playAll{
    .ant-btn{
        height: 32px;
        border-radius: 176px;
        // width: 120px;
        background-color: #d93f3f;
        border: none;
        padding: 0 16px;
        box-sizing: content-box;
        .playAllIcon{
            // color: 12px;
            padding-left: 8px;
            display: inline-block;
            border-left: solid 1px rgba(255, 255, 255, 0.3);
            margin-left: 8px;
        }
    }
    
}

</style>