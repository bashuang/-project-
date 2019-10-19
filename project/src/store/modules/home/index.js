// vue中，目录接口与api里面的目录结构相同
import {getSwiperData,getNavData,getGoodsData,getLikeGoodsData} from '../../../api/home/index.js'  //获取幻灯片api接口数据的方法

let modules={
    namespaced:true,
    state:{
        slides:[],
        navList:[],
        goods:[],
        ulikeGoods:[]
    },
    mutations:{  //同步获取接口数据
        getSwiper(state,payload){
            getSwiperData().then(res=>{
                if(res.code==200){
                    state.slides=res.data;
                    if(payload&&payload.success){
                        payload.success();
                    }
                }
            })
        },
        getNav(state,payload){
            getNavData().then(res=>{
                if(res.code==200){
                    state.navList=res.data;
                    if(payload&&payload.success){
                        payload.success();
                    }
                }
            })
        },
        getGoods(state,payload){
            getGoodsData().then(res=>{
                if(res.code==200) {
                    state.goods = res.data;
                    if(payload&&payload.success){
                        payload.success();
                    }
                }
            })
        },
        getLikeGoods(state,payload){
            getLikeGoodsData().then(res=>{
                if(res.code==200) {
                    state.ulikeGoods = res.data;
                    if(payload&&payload.success){
                        payload.success();
                    }
                }
            })
        }
    },
    actions:{
        getSwiper(conText,payload){
            conText.commit("getSwiper",payload)
        },
        getNav(conText,payload){
            conText.commit("getNav",payload)
        },
        getGoods(conText,payload){
            conText.commit("getGoods",payload)
        },
        getLikeGoods(conText,payload){
            conText.commit("getLikeGoods",payload)
        }
    }
};

export default modules;


