import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode:"hash", //1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL, ////自动获取根目录路径
    scrollBehavior(to,from,position){
        if(position){
            return position
        }else{
            return {x:0,y:0}
        }
    },
    routes:[
        {//首页
            path:"/",
            name:"home",
            component:()=>import("./pages/home/main/index"),
            redirect:"/index",
            children:[  //首页的子组件
                {
                    path:"index",  //子组件首页
                    name:"index",
                    component:()=>import("./pages/home/index/index"),
                    meta:{keepAlive:true,title:"首页"}
                },
                {
                    path:"cart",//子组件购物车
                    name:"cart",
                    component:()=>import("./pages/home/cart/index"),
                    meta:{keepAlive:false,title:"购物车"}
                },
                {
                    path:"ucenter",  //子组件我的会员中心
                    name:"ucenter",
                    component:()=>import("./pages/user/ucenter/index"),
                    meta:{keepAlive:false,auth:false,title:"会员中心"}
                }
            ]
        },
        {  //商品分类
            path:"/goods/classify",
            name:"classify",
            component:()=>import("./pages/home/goods/classify"),
            meta:{keepAlive:false,title:"商品分类"},
            redirect:"/goods/classify/item",
            children:[
                {
                    path: "item",
                    name: "classify_item",
                    component: () => import("./pages/home/goods/classify_item"),
                    meta:{keepAlive:false,title:"商品分类"}
                }
            ]
        },
        {  //商品详情
            path:"/goods/details",
            name:"details",
            component:()=>import("./pages/home/goods/details"),
            meta:{keepAlive:false,title:"商品详情"},
            redirect:"/goods/details/item",
            children:[  //子组件
                {
                    path:"item",  //商品详情
                    name:"item",
                    component:()=>import("./pages/home/goods/details_item")
                },
                {
                    path:"content",  //商品信息
                    name:"content",
                    component:()=>import("./pages/home/goods/details_content")
                },{
                    path:"review",  //商品评价
                    name:"review",
                    component:()=>import("./pages/home/goods/details_review")
                },
            ]
        },
        {  //登录页面
            path:"/login",
            name:"login",
            component:()=>import("./pages/home/login/index"),
            meta:{keepAlive:true,title:"登录"}
        },
        {  //注册
            path:"/reg",
            name:"reg",
            component:()=>import("./pages/home/reg/index"),
            meta:{keepAlive:false,title:"注册"}
        },
        {// 搜索页面
            path:"/goods/search",
            name:"goods-search",
            component:()=>import("./pages/home/goods/search")
        },
        {//个人资料
            path:"/profile",
            name:"profile",
            component:()=>import("./pages/user/profile/index"),
            meta:{auth:true,keepAlive:false,title:"个人资料"}
        },
        {
            path:"/address",
            name:"address",
            component:()=>import("./pages/user/address/index")
        },
        {
            path:"/address/add",
            name:"addressAdd",
            component:()=>import("./pages/user/address/add")
        },
        {
            path:"/address/mod",
            name:"addressMod",
            component:()=>import("./pages/user/address/mod")
        },
        {
            path:"/goods/search",
            name:"goodsSearch",
            component:()=>import("./pages/home/goods/search")
        }

    ]
})
