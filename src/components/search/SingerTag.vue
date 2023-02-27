<template>
    <div id="singerTag">
        <img :src="sgInfo.img" alt="singerTagImg" id="singerTagImg">
        <div id="singerTagInfo">
            <div id="singerTagName">
                歌手：{{ sgInfo.name }}
                <span class="otherInfo">{{ `(${sgInfo.alias})` }}</span>
            </div>
            <div id="singerTagOther" class="otherInfo">
                粉丝:{{ sgInfo.fans }},歌曲:{{ sgInfo.songs }}
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps({
    sgInfo:Object
})
</script>
<style lang="less" scoped>
#singerTag{
    height: 70px;
    width: 290px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.05);
    display: flex;
    padding-top: 14px;
    padding-left: 14px;
    #singerTagImg{
        width: 44px;
        height: 44px;
        border-radius: 50%;
    }
    #singerTagInfo{
        font-size: 13px;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        #singerTagName{
            margin-bottom: 7px;
            margin-top: 7px;
        }
        .otherInfo{
            color: #717171;
            font-size: 12px;
        }
        
    }
}
</style>