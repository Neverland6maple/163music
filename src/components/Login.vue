<template>
    <div id="login">
        <div class="exit" @click="exit"><CloseOutlined /></div>
        <component :is="showCom"></component>
    </div>
</template>
<script setup>
import {CloseOutlined,} from '@ant-design/icons-vue';
import ScanPre from '@/components/Login/ScanPre.vue'
import ScanAfter from './Login/ScanAfter.vue';
import { useStore } from 'vuex';
import { ref } from 'vue';
const store = useStore();
const showCom = ref(ScanPre);
const exit = ()=>{
    store.commit('changeLoginShow',false);
}
</script>
<style lang="less">
#login{
    position: absolute;
    width: 348px;
    height: 530px;
    background-color: white;
    left: 50%;
    top: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(-50%,-50%);
    transition: all 1s;
    .exit{
        position: absolute;
        right: 6px;
        top: 6px;
        color: #969696;
        font-size: 20px;
        cursor: pointer;
    }
}
</style>