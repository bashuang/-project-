import Vue from 'vue'
import {getHotKwordsData,getSearchGoodsData,getAttrsData} from '../../../api/home/search.js'
let modules={
    namespaced:true,
    state:{
        historyKwords:localStorage['historyKwords']?JSON.parse(localStorage['historyKwords']):[],
        hotKword:[],
        goods:[],
        cid:"",
        goodsTotal:0,
        priceList:{//价格列表
            isShow:true,
            data:[
                {priceMin:1,priceMax:50,checked:false},
                {priceMin:51,priceMax:99,checked:false},
                {priceMin:100,priceMax:300,checked:false},
                {priceMin:301,priceMax:1000,checked:false},
                {priceMin:1001,priceMax:4000,checked:false},
                {priceMin:4001,priceMax:9999,checked:false},
            ]
        },
        // 价格区间
        minPrice:"",
        maxPrice:"",
        attrs:[],
        params:[]
    },
    mutations: {
        getHistoryData(state, payload) { //将历史数据存储到vuex里
            state.historyKwords = payload.historyKwords;
            localStorage['historyKwords'] = JSON.stringify(payload.historyKwords)
        },
        clearHistory(state) {  //删除历史搜索记录
            state.historyKwords = [];
            localStorage.removeItem("historyKwords")
        },
        getHotKwords(state) {  //获取热搜关键词
            getHotKwordsData().then(res => {
                if (res.code == 200) {
                    state.hotKword = res.data;
                }
            })
        },
        // 搜索商品结果
        getSearchGoods(state, payload) {
            getSearchGoodsData(payload).then(res => {
                if (res.code == 200) {
                    state.goodsTotal = res.pageinfo.total;
                    if (payload && payload.success) {
                        payload.success(res.pageinfo);
                    }
                    state.goods = res.data;
                } else {
                    state.goods = [];
                    state.goodsTotal = 0
                }
            })
        },
        // 获取商品分页
        getSearchGoodsPage(state, payload) {
            getSearchGoodsData(payload).then(res => {
                if (res.code == 200) {
                    state.goods.push(...res.data);
                }
            })
        },
        // 选择价格
        selectPrice(state, payload) {
            if (state.priceList.data.length > 0) {
                for (let i = 0; i < state.priceList.data.length; i++) {
                    if (state.priceList.data[i].checked) {
                        state.priceList.data[i].checked = state.priceList.data[payload.index].checked;
                        break;
                    }
                }
            }
            state.priceList.data[payload.index].checked = !state.priceList.data[payload.index].checked;
            Vue.set(state.priceList.data, payload.index, state.priceList.data[payload.index]);
            state.minPrice = state.priceList.data[payload.index].checked ? state.priceList.data[payload.index].priceMin : "";
            state.maxPrice = state.priceList.data[payload.index].checked ? state.priceList.data[payload.index].priceMax : "";
        },
        // 获取用户输入的最低价格
        setMinPrice(state, payload) {
            state.minPrice = payload.minPrice;
            state.minPrice = state.minPrice.replace(/[^\d|^\.]/g, "");//只允许输入数字和小数点
        },
        // 获取用户输入的最高价格
        setMaxPrice(state, payload) {
            state.maxPrice = payload.maxPrice;
            state.maxPrice = state.maxPrice.replace(/[^\d|^\.]/g, "");//只允许输入数字和小数点
        },
        // 获取商品的属性
        getAttrs(state, payload) {
            getAttrsData(payload.kwords).then(res => {
                if (res.code == 200) {
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].isShow = true;
                        for(let j=0;j<res.data[i].param.length;j++){
                            res.data[i].param[j].checked=false
                        }
                    }
                    state.attrs = res.data;
                    if(payload&&payload.success){
                        payload.success()
                    }
                }else{
                    state.attrs=[]
                }
            })
        },
        // 显示或隐藏当前规格
        showAttr(state, payload) {
            state.attrs[payload.index].isShow = !state.attrs[payload.index].isShow;
            Vue.set(state.attrs,payload.index,state.attrs[payload.index]);
        },
        // 选择规格属性标签
        selectParam(state,payload){
            state.attrs[payload.index].param[payload.index2].checked=!state.attrs[payload.index].param[payload.index2].checked;
            Vue.set(state.attrs[payload.index].param[payload.index2],payload.index2,state.attrs[payload.index].param[payload.index2]);
        },
        // 添加属性值到数组
        pushParams(state,payload){
            if(state.attrs.length>0){
                state.params=[];
                for(let i=0;i<state.attrs.length;i++){
                    for(let j=0;j<state.attrs[i].param.length;j++){
                        if(state.attrs[i].param[j].checked){
                            state.params.push(state.attrs[i].param[j].pid)
                        }
                    }
                }
            }else{
                state.params=[];
            }
        },
        // 全部重置
        reserAttrs(state,payload){
            // 重置价格选项，点击的取消点击，价格区间内容清空
            if(state.priceList.data.length>0){
                for(let i=0;i<state.priceList.data.length;i++){
                    if(state.priceList.data[i].checked){
                        state.priceList.data[i].checked=false;
                        break
                    }
                }
                state.minPrice="";
                state.maxPrice=""
            }
            // 重置规则属性值选择，将点击的都改为false，并重置为空
            if(state.attrs.length>0){
                for(let i=0;i<state.attrs.length;i++){
                    for(let j=0;j<state.attrs[i].param.length;j++){
                        if(state.attrs[i].param[j].checked){
                            state.attrs[i].param[j].checked=false;
                        }
                    }
                }
                state.params=[];
            }
        }
    },
    actions:{
        getHotKwords(conText){
            conText.commit("getHotKwords")
        },
        getSearchGoods(conText,payload){
            conText.commit("getSearchGoods",payload)
        },
        getSearchGoodsPage(conText,payload){
            conText.commit("getSearchGoodsPage",payload)
        },
        // 选择，单选分类
        selectClassify(conText,payload){
            if(conText.rootState.goods.classifyList.length>0){
                for(let i=0;i<conText.rootState.goods.classifyList.length;i++){
                    if(conText.rootState.goods.classifyList[i].checked){
                        conText.rootState.goods.classifyList[i].checked=conText.rootState.goods.classifyList[payload.index].checked;
                        break;
                    }
                }
                conText.rootState.goods.classifyList[payload.index].checked=!conText.rootState.goods.classifyList[payload.index].checked;
                // 为了避免点击数据与页面不匹配的问题，使用vue.set
                Vue.set(conText.rootState.goods.classifyList,payload.index,conText.rootState.goods.classifyList[payload.index]);
            }
            conText.state.cid=conText.rootState.goods.classifyList[payload.index].checked?conText.rootState.goods.classifyList[payload.index].cid:"";
        },
        getAttrs(conText,payload){
            conText.commit("getAttrs",payload)
        },
        reserAttrs(conText,payload){
            console.log(conText);
            if(conText.rootState.goods.classifyList.length>0){
                for(let i=0;i<conText.rootState.goods.classifyList.length;i++){
                    if(conText.rootState.goods.classifyList.checked){
                        conText.rootState.goods.classifyList.checked=false;
                        break
                    }
                }
                conText.state.cid="";

            }
            conText.commit("reserAttrs")
        }
    }
};
export default modules