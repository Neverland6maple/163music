<template>
    <div id="downloadAll">
        <a-button type="primary" :style="styleObj">
            <div class="icon">
                <slot name="icon"></slot>
            </div>
            <slot name="content"></slot>
        </a-button>
    </div>
</template>
<script setup>
defineProps({
    styleObj:Object,
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#downloadAll{
    .ant-btn{
        border-radius: 176px;
        color: @black-font-color;
        background-color: transparent;
        border-color: #4b4b4b;
        padding: 0px 16px;
        box-sizing: content-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon{
            font-size: 18px;
            margin-right: 4px;
        }
    }
}

</style>