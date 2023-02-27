import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './router'
import store from './store'
import Axios from './request/axios'

import 'ant-design-vue/dist/antd.css';
import '@/assets/reset.css'
import '@/assets/common.less'
import 'ant-design-vue/dist/antd.css';

createApp(App).use(store).use(router).use(Antd).use(Axios).mount('#app')
