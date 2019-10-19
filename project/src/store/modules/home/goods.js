import {getClassifyData,getGoodsRData,getDetailData,getSizeData} from '../../../api/home/goods.js'
import Vue from 'vue'
let modules={
    namespaced:"goods",
    state:{
        classifyList:[],
        rightGoodsList:[],
        detailsList:{},
        size:[]
    },
    mutations:{
        // 获取分类数据
        getClassify(state,payload){
            getClassifyData().then(res=>{
                if(res.code===200){
                    for(let key in res.data){
                        res.data[key].toRed=false;
                        res.data[key].checked=false
                    }
                    state.classifyList=res.data;
                    if(payload&&payload.success){
                        payload.success()
                    }
                }
            })
        },
        getRed(state,payload){  //点击变红
            if(state.classifyList.length>0){
                for(let key in state.classifyList){
                    if(state.classifyList[key].toRed){
                        state.classifyList[key].toRed=false;
                    }
                }
            }
            state.classifyList[payload.index].toRed=true;
        },
        // 获取右侧分类的商品数据
        getGoodsR(state,payload){
            getGoodsRData(payload.cid).then(res=>{
                if(res.code===200){
                    state.rightGoodsList=res.data;
                    if(payload&&payload.success){
                        payload.success()
                    }
                }else{
                    state.rightGoodsList=[]
                }
            })
        },
        // 获取商品详情
        getDetail(state,payload){
            getDetailData(payload.gid).then(res=>{
                if(res.code===200){
                    state.detailsList=res.data
                    if(payload&&payload.success){
                        payload.success();
                    }
                }
            })
        },
        // 获取商品规格
        getSize(state,payload){
            getSizeData(payload.gid).then(res=>{
                if(res.code===200){
                    for(let key in res.data){
                        for(let key2 in res.data[key].values){
                            res.data[key].values[key2].choose=false
                        }
                    }
                    state.size=res.data;
                }
            })
        },
        // 获取你所选择的商品规格
        getChoose(state,payload){
            if(state.size.length>0){
                for(let i=0;i<state.size[payload.index].values.length;i++){
                    if(state.size[payload.index].values[i].choose){
                        state.size[payload.index].values[i].choose=false;
                        break;
                    }
                }
                state.size[payload.index].values[payload.index2].choose=true;
                Vue.set(state.size[payload.index].values,payload.index2,state.size[payload.index].values[payload.index2]);//放置点击规格，数据改变，状态不该变的问题
            }

        }
    },
    actions:{
        getClassify(conText,payload){
            conText.commit("getClassify",payload)
        },
        getRed(tijiao,payload){
            tijiao.commit("getRed",payload)
        },
        getGoodsR(conText,payload){
            conText.commit("getGoodsR",payload)
        },
        getDetail(conText,payload){
            conText.commit("getDetail",payload)
        },
        getSize(conText,payload){
            conText.commit("getSize",payload)
        },
        getChoose(conText,payload){
            conText.commit("getChoose",payload)
        },
    }
};
export default modules


