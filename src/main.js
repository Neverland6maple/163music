import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { request } from './request/axios'
import antd from "ant-design-vue";
import VueLazyload from 'vue-lazyload'
import 'ant-design-vue/dist/antd.min.css';
import '@/assets/reset.css'
import '@/assets/common.less'
import '@/assets/animation.css';
import '@/assets/theme.less';


createApp(App).use(request).use(router).use(store).use(antd).use(VueLazyload).mount('#app')
