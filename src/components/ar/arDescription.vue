<template>
    <div id="arDescription">
        <article class="briefDescArr">
            <h3 class="title">{{ arName }}简介</h3>
            <p v-for="(item,index) in briefDescArr" :key="index" class="paragraph">{{ item }}</p>
        </article>
        <article class="introduction" v-for="(item,index) in introduction" :key="item.ti">
            <h3 class="title">{{ item.ti }}</h3>
            <p v-for="(item1,index1) in introductionArr[index]" :key="index1" class="paragraph">{{ item1 }}</p>
        </article>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
    introduction:Array,
    arName:String,
    briefDesc:String,
})
const briefDescArr = computed(()=>{
    return props.briefDesc.split('/n');
})
const introductionArr = computed(()=>{
    return props.introduction.map((item)=>{
        return item.txt.split('/n');
    })
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#arDescription{
    margin-left: 32px;
    margin-right: 32px;
    color:#8b8b8b;
    font-size: 14px;
    text-align: left;
    .title{
        text-align: left;
        color: #d5d5d5;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .paragraph{
        text-indent: 26px;
        line-height: 28px;
    }
    .briefDescArr,.introduction{
        margin-bottom: 40px;
    }
    .briefDescArr{
        .title{
            margin-top: 10px;
        }
    }
}
</style>