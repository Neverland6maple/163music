<template>
    <div class="mvIcon" @click="toMv">MV<CaretRightOutlined /></div>
</template>
<script setup>
import {CaretRightOutlined} from '@ant-design/icons-vue'
const emit = defineEmits(['toMv'])
const toMv = ()=>{
    emit('toMv');
}
</script>
<style scoped lang="less">
.mvIcon{
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    line-height: 12px;
    height: 12px;
    text-align: center;
    border: solid 1px #ec4141;
    transform: scale(0.8);
    color: #ec4141;
    cursor: pointer;
    .anticon{
        font-size: 10px;
    }
}
</style>