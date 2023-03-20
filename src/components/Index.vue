<template>
    <div id="discoverMusic">
        <div id="discoverTabs">
            <a-tabs v-model:activeKey="activeKey" :animated="false" :tabBarGutter="20" @change="handleIndexChange">
                <a-tab-pane key="1" tab="个性推荐"></a-tab-pane>
                <a-tab-pane key="2" tab="专属订制"></a-tab-pane>
                <a-tab-pane key="3" tab="歌单"></a-tab-pane>
            </a-tabs>
        </div>
        <div id="tabsContent">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { defineComponent,reactive,ref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
    async setup(){
        const activeKey = ref('1');
        const router = useRouter();
        const handleIndexChange = (e)=>{
            switch(e){
                case '1':
                    router.push('/')
                    break;
                case '2':
                    router.push('/test')
                    break;
            }
        }
        
        return {
            activeKey,
            handleIndexChange,
        }    
    }
})
</script>
<style lang="less" scoped>
@import '@/assets/theme.less';
#discoverMusic{
    #discoverTabs{
        margin-left: 32px;
        margin-top: 10px;
        :deep(.ant-tabs-nav){
            margin-bottom: 6px;
        }
        :deep(.ant-tabs-top) {
            > .ant-tabs-nav::before{
                display: none;
            }
            
            .ant-tabs-nav-list{
                display: flex;
                justify-content: center;
            }
            .ant-tabs-tab-active{
                .ant-tabs-tab-btn{
                    color: @black-font-color;
                    text-shadow: 0 0.5 0.5px currentcolor;
                    font-size: 20px;
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        bottom: -4px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #ec4141;
                        height: 2px;
                        box-sizing: border-box;
                        border-radius: 1px;
                        width: 80% !important;
                    }
                }
            }
            .ant-tabs-tab-btn{
                transition: 0s;
            }
            .ant-tabs-ink-bar{
                display: none;
            }
            .ant-tabs-tab{
                color: @black-font-color;
                font-size: 15px;
                transition: 0s;
            }
        }
    }
    #tabsContent{
        width: 100%;
    }
}
</style>