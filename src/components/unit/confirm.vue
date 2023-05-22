<template>
    <div id="confirmMask">
        <div class="confirmFrame">
            <h2 class="text">{{ comfirmShow.text }}</h2>
            <div class="btnBlock"><a-button type="primary" shape="round" :size="size" class="btn" @click="exit(true)">确定</a-button></div>
            <div class="exit" @click="exit(false)"><CloseOutlined /></div>
        </div>
    </div>
</template>
<script setup>
import {CloseOutlined,} from '@ant-design/icons-vue';
import {computed} from 'vue'
import {useStore} from 'vuex'
const store = useStore();
const comfirmShow = computed(()=>store.state.comfirmShow)
const exit = (value)=>{
    store.commit('changeComfirmShow',{show:false,text:''});
    store.commit('setComfirmRes',value);
}
</script>
<style scoped lang='less'>
#confirmMask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 999;
    .confirmFrame{
        position: absolute;
        width: 470px;
        height: 192px;
        background-color: #363636;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .text{
            line-height: 192px;
            text-align: center;
            color: white;
            font-size: 14px;
        }
        .btnBlock{
            position: absolute;
            width: 100%;
            height: 30px;
            bottom: 20px;
            left: 0;
            text-align: center;
            .btn{
                background-color: #ec4141;
                padding: 0 18px;
                height: 26px;
                line-height: 26px;
                color: #ffffff;
                border: none;
                transition: none;
                &:hover{
                    background-color: #d73535
                    
                }
            }
        }
        
        .exit{
            position: absolute;
            right: 12px;
            top: 12px;
            color: #999999;
            font-size: 18px;
            cursor: pointer;
        }
    }
}
</style>