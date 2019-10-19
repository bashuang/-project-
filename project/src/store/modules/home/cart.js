import Vue from 'vue'
let modules={
    namespaced:true,
    state:{
        cartData:localStorage['cartData']?JSON.parse(localStorage['cartData']):[]
    },
    mutations:{  //因为不从后台接口读取数据，不需要做异步处理，直接同步操作即可
        // 添加商品到购物车
        addCart(state,payload){
            let isSame=false;
            if(state.cartData.length>0){
                for(let i=0;i<state.cartData.length;i++){//如果穿过来gid与数据中心的gid相同，并且规格也相同，直接增加数量
                    if(state.cartData[i].gid==payload.cartData.gid && JSON.stringify(state.cartData[i].attrs)==JSON.stringify(payload.cartData.attrs)){
                        isSame=true;
                        state.cartData[i].amount=parseInt(state.cartData[i].amount)+parseInt(payload.cartData.amount);
                        break
                    }
                }
            }
            if(!isSame){ //如果没有相同的直接添加商品项
                state.cartData.push(payload.cartData)
            }
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        // 选择商品
        changCheck(state,payload){
            Vue.set(state.cartData,payload.index,state.cartData[payload.index]);
            state.cartData[payload.index].checked=!state.cartData[payload.index].checked;
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        // 全选框获取选择状态
        changChecked(state,payload){
            if(state.cartData.length>0){
                for(let key in state.cartData){
                    state.cartData[key].checked=payload.allCheck;
                }
                localStorage['cartData']=JSON.stringify(state.cartData);
            }
        },
        delGoods(state,payload){
            state.cartData.splice(payload,1);
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        changeAmount(state,payload){
            state.cartData[payload.index].amount=payload.amount.replace(/[^\d]/g,'');
            Vue.set(state.cartData,payload.index,state.cartData[payload.index]);
            state.cartData[payload.index].amount=state.cartData[payload.index].amount=='' || state.cartData[payload.index].amount==0?1:state.cartData[payload.index].amount;
        },
        // 增加数量
        incAmount(state,payload){
            state.cartData[payload.index].amount=parseInt(state.cartData[payload.index].amount)+1;
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        decAmount(state,payload){
            state.cartData[payload.index].amount=parseInt(state.cartData[payload.index].amount)-1;
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
    },
    getters:{
        // 商品总价
        total(state){
            let total=0;
            if(state.cartData.length>0){
                for(let key in state.cartData){
                    if(state.cartData[key].checked){
                        total+=parseFloat(state.cartData[key].price)*parseInt(state.cartData[key].amount);//总价等于价格乘以数量
                    }
                }
            }
            return parseFloat(total.toFixed(2))
        },
        // 运费，几个运费之间去最高者
        freight(state){
            let freight=[],max=0;
            if(state.cartData.length>0){
                for(let key in state.cartData){
                    if (state.cartData[key].checked) {
                        freight.push(state.cartData[key].freight);
                    }
                }
                if(freight.length>0){
                    max=Math.max.apply(null,freight)
                }
            }
            return max
        },
        // 判断购物车里是否有商品，或者是有没有选中弄的商品
        getPayItem(state){
            let isPay=false;
            if(state.cartData.length>0){
                for(let key in state.cartData){
                    if(state.cartData[key].checked){
                        isPay=true
                    }
                }
            }
            return isPay;
        },

    }
};
export default modules