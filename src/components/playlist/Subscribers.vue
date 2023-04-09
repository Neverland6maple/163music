<template>
    <div id="subscribers">
        <div class="subscriberItem" v-for="(item) in subscribers" :key="item.avatarImgId">
            <div class="userPic" @click="toUser(item.userId)">
                <img :src="item.avatarUrl" alt="" class="coverPic">
            </div>
            <div class="userInfo">
                <div class="userName" @click="toUser(item.userId)">{{ item.nickname }}</div>
                <div class="userSignature" v-if="item.signature">{{ item.signature }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
    id:Number,
})
const {proxy:{$axios}} = getCurrentInstance();
const router = useRouter();
const subscribers = ref([]);
const getSubscribers = async (id)=>{
    const {data:res} = await $axios({
        method:'get',
        url:`/api/playlist/subscribers?id=${id}&limit=60`
    })
    subscribers.value = res.subscribers;
}
const toUser = (id)=>{
    router.push(`/u/${id}`);
}
getSubscribers(props.id);
</script>
<style scoped lang="less">
#subscribers{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 28px;
    .subscriberItem{
        flex: 1;
        min-width: 370px;
        height: 90px;
        margin-bottom: 20px;
        display: flex;
        overflow: hidden;
        justify-content: left;
        .userPic{
            width: 90px;
            height: 90px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
        }
        .userInfo{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
            margin: 16px 0;
            margin-left: 10px;
            color: #d5d5d5;
            flex: 1;
            width: 100%;
            overflow: hidden;
            .userName{
                font-size: 14px;
                cursor: pointer;
            }
            .userSignature{
                width: 100%;
                font-size: 13px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                text-align: left;
            }
        }
    }
}
</style>