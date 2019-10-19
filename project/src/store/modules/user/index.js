import {getLoginData,getUserInfoData,safeOutLogin,checkVcodeData,existCellphoneData,regData,safeUserData,uploadHeadData,updateUserData} from '../../../api/user/index.js'
let modules={
    namespaced:true,
    state:{
        uid:localStorage["uid"]?localStorage["uid"]:"",
        nickname:localStorage['nickname']?localStorage['nickname']:"",
        authToken:localStorage["authToken"]?localStorage["authToken"]:"",
        isLogin:localStorage['isLogin']?Boolean(localStorage['isLogin']):false,
        userInfo:{},
        vcode:""
    },
    mutations:{
        getLogin(state,payload){
            getLoginData(payload.cellphone,payload.password).then(res=>{
                if(res.code==200){
                    state.uid=res.data.uid;
                    state.nickname=res.data.nickname;
                    state.authToken=res.data.auth_token;
                    state.isLogin=true;
                    localStorage["uid"]=res.data.uid;
                    localStorage['nickname']=res.data.nickname;
                    localStorage["authToken"]=res.data.auth_token;
                    localStorage['isLogin']=true;
                }
                if(payload && payload.success){ //如果登录了，就让页面跳转-1，登录是否成功在vuex里判断，但是跳转要在vue里跳转，所以回调函数就可以用到了，这边判断，执行那边的函数，那边的函数进行跳转
                    payload.success(res);
                }
            })
        },
        // 获取会员信息
        getUserInfo(state,payload){
            getUserInfoData(payload.uid).then(res=>{
                if(res.code==200){
                    state.userInfo=res.data;
                    if(payload && payload.success){
                        payload.success(res.data);
                    }
                }
            })
        },
        // 退出会员
        storeOutLogin(state){
            safeOutLogin(state.uid).then(res=>{
                    state.uid="";
                    state.nickname="";
                    state.authToken="";
                    state.isLogin=false;
                    state.userInfo={};
                    localStorage.removeItem("uid");
                    localStorage.removeItem("nickname");
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("isLogin");
            })
        },
        // 注册会员
        regUser(state,payload){
            regData(payload).then(res=>{
                if(payload&&payload.success){
                    payload.success(res);
                }
            })
        },
        // 单点登录
        safeUser(state,payload){
            safeUserData(payload.uid,payload.authToken).then(res=>{
                if(payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 上传头像
        uploadHead(state,payload){
            uploadHeadData(payload.headfile).then(res=>{
                if(payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 保存/修改会员信息
        updateUser(state,payload){
            updateUserData(payload).then(res=>{
                if(payload && payload.success){
                    payload.success();
                }
            })
        }
    },
    actions:{
        getLogin(conText,payload){
            conText.commit("getLogin",payload)
        },
        getUserInfo(conText,payload){
            conText.commit("getUserInfo",payload);
        },
        storeOutLogin(conText){
            conText.commit("storeOutLogin")
        },
        // 检测图文验证码,验证码值用于检测，不需要提交修改数据，所以直接执行一步函数promise
        checkVcode(conText,payload){
            return checkVcodeData(payload.vcode)
        },
        // 检测手机号是否注册过会员
        existCellphone(state,payload){
            return existCellphoneData(payload.cellphone)
        },
        regUser(conText,payload){
            return conText.commit("regUser",payload)
        },
        safeUser(conText,payload){
            return conText.commit("safeUser",payload)
        },
        uploadHead(conText,payload){
            return conText.commit("uploadHead",payload)
        },
        updateUser(conText,payload){
            return conText.commit("updateUser",payload)
        },
    }
};
export default modules