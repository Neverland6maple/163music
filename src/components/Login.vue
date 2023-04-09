<template>
    <div id="login">
        <div class="exit" @click="exit"><CloseOutlined /></div>
        <component :is="showCom" :qrImg="qrImg"></component>
    </div>
</template>
<script setup>
import {CloseOutlined,} from '@ant-design/icons-vue';
import ScanPre from '@/components/Login/ScanPre.vue'
import ScanAfter from './Login/ScanAfter.vue';
import { useStore } from 'vuex';
import { getCurrentInstance, ref } from 'vue';
import {useRoute, useRouter} from 'vue-router'
const store = useStore();
const router = useRouter();
const route = useRoute();
const {proxy:{$axios,$post}} = getCurrentInstance();
const qrImg = ref('');
const showCom = ref(ScanPre);
let timer;
const exit = ()=>{
    store.commit('changeLoginShow',false);
    clearInterval(timer);
}
async function getLoginStatus() {
    const {data:res} = await $post(`/api/login/status?timerstamp=${Date.now()}`,{});
    if(res.code === 200){
        const {data:res1} = await $axios({
            method:'get',
            url:`/api/user/detail?uid=${res.profile.userId}`,
        })
        store.commit('user/setProfile',res1.profile);
    }
}
const login = async ()=>{
    if(!localStorage.getItem('cookie')){
        const {data:res} = await $axios({
            method:'get',
            url:`/api/login/qr/key?timerstamp=${Date.now()}`,
        })
        const unikey = res.data.unikey;
        const {data:res2} = await $axios({
            method:'get',
            url:`/api/login/qr/create?key=${unikey}&qrimg=true&timerstamp=${Date.now()}`,
        })
        qrImg.value = res2.data.qrimg;

        timer = setInterval(async () => {
            const {data:res3} = await $axios({
                method:'get',
                url:`/api/login/qr/check?key=${unikey}&timerstamp=${Date.now()}`,
            })
            if(res3.code === 802){
                showCom.value = ScanAfter;
            }
            console.log(res3);
            if (res3.code === 800) {
              alert('二维码已过期,请重新获取')
              clearInterval(timer)
            }
            if (res3.code === 803) {
              // 这一步会返回cookie
              alert('授权登录成功');
              localStorage.setItem('cookie', res3.cookie);
              await getLoginStatus();
              exit();
              router.push(JSON.parse(route.query.from))
            }
        }, 3000);
    }
}
login();
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
    z-index: 999;
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