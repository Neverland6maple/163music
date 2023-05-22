<template>
    <div class="playlistBoxFrame">
        <div class="exit" @click="exit"><CloseOutlined/></div>
        <h3 class="boxTitle">新建歌单</h3>
        <div class="content">
            <div class="tableSearch">
              <input type="text" v-model="value" class="searchIpt" placeholder="请输入新歌单标题">
            </div>
            <div>
                <a-checkbox v-model:checked="checked" class="privateCheckbox">设置为隐私歌单</a-checkbox>
            </div>
        </div>
        <div class="createBtn" @click="comment">
            <a-button type="primary" shape="round" :size="size" :class="{'actived':value}" @click="createPlaylist">
                创建
            </a-button>
        </div>
    </div>
</template>
<script setup>
import {CloseOutlined,} from '@ant-design/icons-vue';
import {computed, getCurrentInstance, onBeforeUnmount, ref, } from 'vue';
import { message } from 'ant-design-vue';
import {useStore} from 'vuex'
const store = useStore();
const {proxy:{$axios,$post}} = getCurrentInstance();
const id = computed(()=>store.state.createPlaylist.id);
const value = ref('');
const checked = ref(false);
const exit = (value)=>{
    store.commit('changeCreatePlaylist',{show:false});
}
const createPlaylist = async ()=>{
    if(value.value.length > 0){
        const key = '123';
        message.loading({
            content:' ',
            key,
            duration:3
        });
        const {data:res} = await $axios({
            method:'get',
            url:`/api/playlist/create?name=${value.value}${checked.value ? '&private=10' : ''}`
        })
        if(res.code === 200){
            if(id.value){
                const {data:res1} = await $axios({
                    method:'get',
                    url:`/api/playlist/tracks?op=add&pid=${res.id}&tracks=${id.value}`
                })
                if(res1.body.code === 200){
                    message.success({
                        content:'已收藏到歌单',
                        key,
                        duration:2.5
                    });
                }else if(res1.body.code === 502){
                    message.error({
                        content:res1.body.message,
                        key,
                        duration:2.5
                    });
                }
            }else{
                message.success({
                    content:'新建成功',
                    key,
                    duration:2.5
                });
            }
            store.commit('changeCreatePlaylist',{show:false,update:true});
        }else{
            message.error({
                content:res.body.message,
                key,
                duration:2.5
            });
            console.log(res);
        }
    }
}
onBeforeUnmount(()=>{
    store.commit('changeCreatePlaylist',{id:null});
    console.log('unmounted');
})
</script>
<style scoped lang='less'>
@import '@/assets/theme.less';
.playlistBoxFrame{
    position: absolute;
    width: 470px;
    height: 225px;
    background-color: #363636;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 999;
    overflow: hidden;
    .content{
        padding: 0 16px;
        >div{
            text-align-last: left;
        }
        .tableSearch{
          background-color: #444444;
          border-radius: 4px;
          padding-left: 10px;
          padding-right: 20px;
          padding-top: 4px;
          padding-bottom: 4px;
          margin-bottom: 4px;
          .searchIpt{
            background-color: transparent;
            outline: none;
            border: none;
            font-size: 12px;
            color:@black-font-color;
            line-height: 20px;
          }
        }
        :deep(.ant-checkbox){
            .ant-checkbox-inner{
                background-color: transparent;
                border-color: #5e5e5e;
            }
            &:hover .ant-checkbox-inner{
                border-color: transparent;
            }
        }
        :deep(.ant-checkbox-checked){
            .ant-checkbox-inner{
                background-color: #ec4141;
                border-color: #ec4141;
            }
        } 
        .privateCheckbox{
            color: @black-font-color;
            font-size: 12px;
        }
    }
    .boxTitle{
        line-height: 70px;
        text-align: center;
        color: @black-font-color;
        font-size: 16px;
        font-weight: bold;
        cursor: move;
    }
    .exit{
        position: absolute;
        right: 12px;
        top: 12px;
        color: #999999;
        font-size: 18px;
        cursor: pointer;
    }
    .createBtn{
        margin-top: 38px;
        .ant-btn{
            background-color: #903b3b;
            padding: 0 30px;
            height: 30px;
            line-height: 30px;
            color: #9a9a9a;
            border: none;
            transition: none;
            &.actived{
                background-color: #ec4141;
                color: #ffffff;
                &:hover{
                    background-color: #d73535;
                }
            }
        }
    }
}
</style>