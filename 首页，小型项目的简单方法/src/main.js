import "babel-polyfill";//让es6的api转成es5兼容ie
import 'url-search-params-polyfill'; //让URLSearchParams兼容ie
import Vue from 'vue'
import App from './App.vue';
import router from './router.js';
import axios from 'axios';
import store from './store';
import {request} from './assets/js/libs/request.js';
import config from './assets/js/conf/config.js'

Vue.config.productionTip = false;
Vue.prototype.$config=config;
Vue.prototype.$request=request;

router.beforeEach((to,form,next)=>{
    if(to.meta.auth){
        if(Boolean(localStorage['isLogin'])){
            next();
        }else{
            next('/login');
        }
    }else{
        next();
    }
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
Vue.prototype.$axios=axios;