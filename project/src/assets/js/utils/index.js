import echo from '../libs/echo.js';
export function lazyImg() {
    echo.init({
        offset : 100,//可是区域多少像素可以被加载
        throttle : 0 //设置图片延迟加载的时间
    });
}
// 单点登录
export function safeUser(_this) { //vuex里面的this都改成_this
    _this.$store.dispatch("user/safeUser",{uid:_this.$store.state.user.uid,authToken:_this.$store.state.user.authToken,success:(res)=>{
        if(res.code!==200){
            _this.$router.replace("/login");
            _this.$store.dispatch("user/storeOutLogin")
        }
    }})
}

