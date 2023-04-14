<template>
    <div id="albumComment">
        <div>
            <div class="textarea">
                <a-textarea
                v-model:value="value"
                :auto-size="{ minRows: 3, maxRows: 3 }"
                />
                <div class="letterLimit">
                    123
                </div>
            </div>
            <div class="textareaFn">
                <div class="textareaOption">
                    <div>#</div>
                    <div>@</div>
                    <div>&#9786; &#65039;</div>
                </div>
                <div class="commentBtn" @click="comment">
                    <TransparemtBtn :styleObj="{'padding':'0 14px'}">
                        <template #content>评论</template>
                    </TransparemtBtn>
                </div>
            </div>
        </div>
        <commentList @handlePageChange="handlePageChange" :hotComments="hotComment" :latest-comments="latestComment" :current="current" :spinning="spinning" :total="total"></commentList>
    </div>
</template>
<script setup>
import TransparemtBtn from '../unit/TransparemtBtn.vue';
import commentList from '../unit/commentList.vue';
import { getCurrentInstance, ref } from 'vue';
const props = defineProps({
    id:String,
    type:Number,
})
const value = ref('');
const hotComment = ref([]);
const latestComment = ref([]);
const {proxy:{$axios}} = getCurrentInstance();
const current = ref(1);
const total = ref(0);
const cursor = ref('');
const spinning = ref(false);
const getHotList = async (id)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url:`/api/comment/new?type=${props.type}&id=${id}&pageSize=10&pageNo=1&sortType=2`,
    })
    hotComment.value = res.data.comments.filter(e=>e.likedCount > 10);
    spinning.value = false;
}
const getLatestComments = async (id,pageNo)=>{
    spinning.value = true;
    const {data:res} = await $axios({
        method:'get',
        url:`/api/comment/new?type=${props.type}&id=${id}&pageSize=30&pageNo=${pageNo}&sortType=3&cursor=${cursor.value}&timestamp=${Date.now()}`,
    })
    latestComment.value = res.data.comments;
    total.value = res.data.totalCount;
    cursor.value = res.data.cursor;
    spinning.value = false;
}
const handlePageChange = async (newPage)=>{
    current.value = newPage;
    await getLatestComments(props.id,newPage);
}
const comment = async ()=>{
    const data = await $axios({
        method:"get",
        url:`/api/comment?t=1&type=${props.type}&id=${props.id}&content=${value.value}`
    })
    if(data.data.code === 200){
        value.value = '';
        getLatestComments(props.id,1);
    }
}
getHotList(props.id);
getLatestComments(props.id,current.value);
</script>
<style lang="less" scoped>
#albumComment{
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;
    padding-bottom: 70px;
    .textarea{
        position: relative;
        .ant-input{
            background-color: rgba(255, 255, 255, .1);
            border: 0;
            border-radius: 6px;
            color: #d8d8d8;
            &:focus{
               box-shadow: none;
            }
        }
        .letterLimit{
            position: absolute;
            right: 6px;
            bottom: 5px;
            color: #616161;
            font-size: 12px;
        }
    }
    .textareaFn{
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .textareaOption{
            display: flex;
        }
    }
}
</style>