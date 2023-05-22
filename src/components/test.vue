<template>
  <a-button type="primary" @click="openMessage">Open the message box</a-button>
</template>
<script>
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
const key = 'updatable';
export default defineComponent({
  setup() {
    const openMessage = async () => {
      message.loading({
        content: 'Loading...',
        key,
      });
      setTimeout(() => {
        message.success({
          content: 'Loaded!',
          key,
          duration: 2,
        });
      }, 1000);
    };
    return {
      openMessage,
    };
  },
});
</script>