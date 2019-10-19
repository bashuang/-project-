import {addAddressData,getAddressListData,getAddressInfoData,modAddressData,delAddressData} from '../../../api/user/address.js'
let modules={
    namespaced:true,
    state:{
        addressList:[]
    },
    mutations:{
        // 添加收货地址
        addAddress(state,payload){
            addAddressData(payload).then(res=>{
                console.log(res)
                if(res.code==200){
                    if(payload&&payload.success){
                        payload.success(res)
                    }
                }
            })
        },
        // 获取收货地址列表，显示在收货地址上
        getAddressList(state,payload){
            getAddressListData(payload.uid).then(res=>{
                if(res.code==200){
                   state.addressList=res.data
                }
            })
        },
        // 获取收货地址信息，将信息显示在修改地址的目录上
        getAddressInfo(state,payload){
            getAddressInfoData(payload.uid,payload.aid).then(res=>{
                if(res.code==200){
                    if(payload&&payload.success){
                        payload.success(res.data)
                    }
                }
            })
        },
        // 修改收货地址信息
        modAddress(state,payload){
            modAddressData(payload).then(res=>{
                if(res.code==200){
                    if(payload&&payload.success){
                        payload.success(res)
                    }
                }
            })
        },
        // 删除收货地址信息
        delAddress(state,payload){
            delAddressData(payload.uid,payload.aid).then(res=>{
                if(res.code==200){
                    if(payload&&payload.success){
                        payload.success(res)
                    }
                }
            })
        }

    },
    actions: {
        addAddress(conText, payload) {
            conText.commit("addAddress", payload)
        },
        getAddressList(conText, payload) {
            conText.commit("getAddressList", payload)
        },
        getAddressInfo(conText, payload) {
            conText.commit("getAddressInfo", payload)
        },
        modAddress(conText, payload) {
            conText.commit("modAddress", payload)
        },
        delAddress(conText, payload) {
            conText.commit("delAddress", payload)
        },
    }
};
export default modules