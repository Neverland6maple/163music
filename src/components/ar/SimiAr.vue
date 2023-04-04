<template>
    <div id="GridAr">
        <div class="gridContent">
            <div class="gridBox" v-for="(item) in simi" :key="item.id">
                <div class="cover" @click="toAr(item.id)">
                    <img class="coverPic" :src="item.img1v1Url" alt="">
                </div>
                <h3 class="name" @click="toAr(item.id)">{{ item.name }}</h3>
            </div>
        </div>
    </div>
</template>
<script setup>
import router from '@/router';
import {ref, watchEffect, reactive, watch} from 'vue';
const props = defineProps({
    simi:Array,
})
const toAr = (id)=>{
    router.push('/artist/'+id);
}
</script>
<style scoped lang="less">
@import '@/assets/theme.less';
#GridAr{
    margin-bottom: 50px;
    margin-left: 28px;
    margin-right: 28px;
    .gridContent{
        display: grid;
        grid-template-columns: repeat(5,1fr);
        justify-items: left;
        width: 100%;
        gap: 20px;
        .gridBox{
            width: 100%;
            text-align: left;
            .cover{
                width: 100%;
                height: auto;
                object-fit: contain;
                position: relative;
                margin-bottom: 6px;
                cursor: pointer;
                .anticon{
                    position: absolute;
                    background-color: #ec4141;
                    border-radius: 50%;
                    right: 10px;
                    bottom: 10px;
                    font-size: 40px;
                    transition: all 1s;
                    opacity: 0;
                }
                &:hover{
                    .anticon{
                        opacity: 1;
                    }
                }
            }
            .name{
                color: @black-font-color;
                line-height: 22px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                margin-bottom: 6px;
                cursor: pointer;
            }
            .publishTime{
                font-size: 12px;
                color:#6b6b6b;
            }
        }
    }
}
</style>