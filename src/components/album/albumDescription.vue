<template>
    <div id="albumDescription">
        <h3 class="title">专辑介绍</h3>
        <p v-for="(item,index) in descriptionArr" :key="index" class="paragraph">{{ item }}</p>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
    description:String,
})
const descriptionArr = computed(()=>{
    return props.description.split('/n');
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#albumDescription{
    .title{
        text-align: left;
        color: #d5d5d5;
        font-weight: bold;
        margin-bottom: 10px;
    }
    margin-left: 32px;
    color:#8b8b8b;
    font-size: 14px;
    text-align: left;
    .paragraph{
        text-indent: 26px;
        line-height: 28px;
    }
}
</style>