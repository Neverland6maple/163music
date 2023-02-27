<template>
    <div id="pop">
        <div id="popBar" :style="{flex:width}"></div>
    </div>
</template>
<script setup>
import {ref,useSlots} from 'vue'
const slot = useSlots();
const width = ref((slot.default()[0].children/100).toFixed(2));
</script>
<style lang="less" scoped>
#pop{
    height: 8px;
    width: 80px;
    display: flex;
    justify-content: left;
    box-sizing: border-box;
    border: solid 1px #444444;
    border-radius: 4px ;
    #popBar{
        height: 100%;
        background-color: #444444;
    }
}
</style>