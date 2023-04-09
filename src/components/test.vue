<template>
    <div>
        <div id="box" ref="box">
        abcabc
        
    </div>
    <div id="qwe" ref="qwe">qweqwe</div>
    </div>
</template>
<script setup>
import { onMounted, ref , createElementVNode} from 'vue';
const box = ref(null);
const qwe = ref(null)
onMounted(()=>{
    // const content = createElementVNode('div')
    const content = document.createElement('div');
    content.innerHTML = '123123';
    box.value.appendChild(content);
    // const content = document.getElementById('qwe')
    // const boxRef = document.getElementById('box');
    // console.log(boxRef.appendChild(qwe.value));
})
</script>
<style scoped lang='less'>

</style>