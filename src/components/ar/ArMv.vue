<template>
    <div id="GridMv">
        <div class="gridContent">
            <div class="gridBox" v-for="(item) in mvs" :key="item.id">
                <div class="cover">
                    <img class="coverPic" :src="item.imgurl16v9" alt="">
                    <div class="playCount"><YoutubeOutlined />{{ playCountFormat(item.playCount) }}</div>
                    <div class="publishTime">{{ item.publishTime }}</div>
                    <div class="mask"></div>
                </div>
                <h3 class="name">{{ item.name }}</h3>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref, watchEffect, reactive, watch} from 'vue';
import {YoutubeOutlined} from '@ant-design/icons-vue';
const props = defineProps({
    mvs:Array,
})
const playCountFormat = (count) =>{
    if(count > 100000){
        return parseInt(count/10000) + '万'
    }
    return count;
}
</script>
<style scoped lang="less">
@import '@/assets/theme.less';
#GridMv{
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
            overflow: hidden;
            .cover{
                width: 100%;
                height: auto;
                overflow: hidden;
                border-radius: 6px;
                object-fit: contain;
                position: relative;
                margin-bottom: 6px;
                cursor: pointer;
                .publishTime{
                    font-size: 12px;
                    color:#eee;
                    position: absolute;
                    bottom: 6px;
                    right: 8px;
                    z-index: 1;
                }
                .playCount{
                    position: absolute;
                    top:4px;
                    right: 8px;
                    font-size: 12px;
                    color:white;
                    z-index: 1;
                    .anticon{
                        margin-right: 4px;
                        font-size: 13   px;
                    }
                }
                .mask{
                    position: absolute;
                    width:100%;
                    height: 100%;
                    background :linear-gradient(rgba(0,0,0,.5),1%,transparent,99%,rgba(0,0,0,.5));
                    left: 0;
                    top: 0;
                }
                &:hover{
                    .anticon{
                        opacity: 1;
                    }
                }
            }
            .name{
                width: 100%;
                color: @black-font-color;
                line-height: 22px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 6px;
                cursor: pointer;
                &:hover{
                    color: white;
                }
            }
            
        }
    }
}
</style>