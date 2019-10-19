<template>
    <div class="login-wrap">
        <div class="login-title">
            <div class="login-back" @click="$router.go(-1)"></div>
            <div class="login-text">登录</div>
        </div>

        <div class="login-inp"><input type="text" placeholder="手机号"/></div>
        <div class="login-inp pass">
            <input :type="this.isShowPass" placeholder="密码"/>
            <div class="isShowPass" @click="changInp()">
                <div class="openDwon"></div>
            </div>
        </div>
        <button type="button" class="loginBn">登录</button>
        <div class="login-bottom"><span><img src="../../../assets/images/home/index/forget.png"/> 忘记密码</span><span><img
                src="../../../assets/images/home/index/reg.png" /> 快速注册</span></div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return{
                isShowPass:"password",
                float:"left"
            }
        },
        methods:{
            changInp(){
                if(this.isShowPass=="text"){
                    this.isShowPass="password";
                }else{
                    this.isShowPass="text"
                }
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
