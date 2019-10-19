<template>
    <div class="login-wrap">
        <HeaderComponent title="会员登录"></HeaderComponent>

        <div class="login-inp"><input type="text" placeholder="手机号" v-model="cellphone"/></div>
        <div class="login-inp pass">
            <input :type="isOpen?'text':'password'" placeholder="密码" v-model="password"/>

            <!--开关滑动-->
            <cube-switch v-model="isOpen"></cube-switch>

        </div>
        <button type="button" class="loginBn" @click="doLogin()">登录</button>
        <div class="login-bottom"><span><img src="../../../assets/images/home/index/forget.png"/> 忘记密码</span><span @click="$router.push('/reg')"><img
                src="../../../assets/images/home/index/reg.png" /> 快速注册</span></div>
    </div>
</template>

<script>
    import HeaderComponent from '../../../components/header';
    import {mapState,mapActions} from 'vuex'
    import Vue from 'vue'
    import {Switch,Toast} from 'cube-ui';
    Vue.use(Switch);
    Vue.use(Toast);
    export default {
        name: "login",
        data(){
            return{
                isOpen:false,
                cellphone:"",
                password:""
            }
        },
        components:{
            HeaderComponent
        },
        methods:{
            ...mapActions({
                getLogin:"user/getLogin"
            }),
            doLogin(){
                console.log("111");
                if(this.cellphone.match(/^\s*$/)){
                    this.$createToast({
                        txt:"请输入手机号",
                        type:"txt"
                    }).show();
                    return;
                }
                if(!this.cellphone.match(/^1[0-9][0-9]\d{8}$/)){
                    this.$createToast({
                        txt:"请输入正确的手机号",
                        type:"txt"
                    }).show();
                    return;
                }

                if(this.password.match(/^1\s*$/)){
                    this.$createToast({
                        txt:"请输入密码",
                        type:"txt"
                    }).show();
                    return;
                };
                this.getLogin({cellphone:this.cellphone,password:this.password,success:(res)=>{
                        if(res.code==200){
                            if(this.$route.query.from=="reg"){
                                this.$router.go(-3)
                            }else{
                                this.$router.go(-1)
                            }
                        }else{
                            this.$createToast({
                                txt:res.data,
                                type:"txt"
                            }).show();
                        }

                    }})
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
    width:100%;
    height: 100%;
    background-color: #ffffff;
    overflow:hidden;
}
    .login-title{
    width:100%;
    height: 1.02rem;
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #efefef;
    margin-bottom:0.3rem
}
    .login-back{
    width:0.8rem;
    height: 0.8rem;
    background:url(../../../assets/images/home/goods/back.png);
    background-size: 100%;
    margin-top:0.1rem
}
    .login-text{
    width:80%;
    height: 100%;
    text-align: center;
    line-height: 1rem;
    color:#323232
}
    .login-inp{
    width:90%;
    height:1rem ;
    margin:0 auto;
    border-radius: 0.04rem;
    border:0.02rem solid #efefef;
    margin-bottom:0.2rem;
    outline: none;
}
    .login-inp input{
    width:80%;
    height: 99%;
    text-indent: 0.2rem;
    padding:0;
    background-color:transparent;
}
    .pass {
        display: flex;
        justify-content: flex-start;
    }
    .isShowPass{
        width:0.96rem;
        height:0.56rem;
        border-radius:0.5rem;
        border:0.01rem solid #efefef;
        overflow: hidden;
        background-color: pink;
        margin-top: 0.2rem;
    }
    .openDwon{
        width:0.56rem;
        height: 0.56rem;
        background-color: aqua;
        border-radius: 50%;
    }
    .loginBn{
        width:90%;
        height: 0.8rem;
        border:none;
        background-color: red;
        color:#ffffff;
        font-size: 0.4rem;
        display: block;
        margin:0 auto;
    }
    .login-bottom{
        width:100%;
        display: flex;
        justify-content:space-between;
        box-sizing: border-box;
        padding:0.4rem;
        font-size:0.28rem;
        overflow: hidden;
    }
    .login-bottom img{
        display: inline-block;
        width:0.32rem;
        vertical-align:top;
    }

</style>
