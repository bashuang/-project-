import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode:"hash", //1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL, ////自动获取根目录路径
    routes:[
        {
            path:"/",
            name:"home",
            component:()=>import("./pages/home/main/index"),
            redirect:"/index",
            children:[
                {
                    path:"index",
                    name:"index",
                    component:()=>import("./pages/home/index/index"),
                    meta:{keepAlive:true,title:"首页"}
                },
                {
                    path:"cart",
                    name:"cart",
                    component:()=>import("./pages/home/cart/index"),
                    meta:{keepAlive:false,title:"购物车"}
                },
                {
                    path:"my",
                    name:"my",
                    component:()=>import("./pages/user/my/index"),
                    meta:{keepAlive:false,auth:false,title:"我的"}
                }
            ]
        },
        {
            path:"/login",
            name:"login",
            component:()=>import("./pages/home/login/index"),
            meta:{keepAlive:true}
        },
        {
            path:"/reg",
            name:"reg",
            component:()=>import("./pages/home/reg/index"),
            meta:{keepAlive:false}
        }
    ]
})
