import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import axios from "axios";
import request from "@/utils/request";

Vue.config.productionTip = false
Vue.use(ElementUI,{size:"small"})
Vue.prototype.request=request

new Vue({
  axios,//注册axios
  router,
  render: h => h(App)
}).$mount('#app')
