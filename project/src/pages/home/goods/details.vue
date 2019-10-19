<template>
    <div class="item-page">
        <div class="main-head">
            <div class="back" @click="goBack()"></div>
            <div class="head-wrap">
                <div :class="{'head-name':true,action:itemAction}" @click="goPage('/goods/details?gid='+gid)">商品</div>
                <div :class="{'head-name':true,action:contentAction}" @click="goPage('/goods/details/content?gid='+gid)">详情</div>
                <div :class="{'head-name':true,action:reviewAction}" @click="goPage('/goods/details/review?gid='+gid)">评价</div>
            </div>
            <div id="min-car" class="min-car" @click="$router.push('/cart')">
                <span></span>
            </div>
        </div>
        <!--子组件-->
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: "detail",
        data(){
            return{
                itemAction:true,
                contentAction:false,
                reviewAction:false,
                gid:this.$route.query.gid?this.$route.query.gid:""
            }
        },
        methods:{
            goBack(){
                this.$router.go(-1)
            },
            goPage(url){
                this.$router.replace(url);
            },
            changeBorder(url){
                switch (url){
                    case "/goods/details/item":
                        this.itemAction=true;
                        this.contentAction=false;
                        this.reviewAction=false;
                        break;
                    case "/goods/details/content":
                        this.itemAction=false;
                        this.contentAction=true;
                        this.reviewAction=false;
                        break;
                    case "/goods/details/review":
                        this.itemAction=false;
                        this.contentAction=false;
                        this.reviewAction=true;
                        break;
                    default:
                        this.itemAction=true;
                        this.contentAction=false;
                        this.reviewAction=false;
                }
            },
        },
        created(){
            this.changeBorder(this.$route.path);
        },
        beforeRouteUpdate(to,from,next){
            this.changeBorder(to.path);
            next()
        }
    }
</script>

<style scoped>
    .item-page{width:100%;height: 100%;display: flex;flex-direction: column-reverse;}
    .main-head{width:100%;height: 1rem;display: flex;position:fixed;left:0;top:0;z-index:2;background-color: #ffffff;border-bottom: 0.04rem solid transparent}
    .head-wrap{width:70%;height: 100%;}
    .head-name{float: left;margin:0 0.35rem;height: 100%;text-align: center;line-height:300%;font-size: 0.36rem;color: #323232;width:1rem}
    .action{border-bottom:0.04rem solid orangered}
    .main-content{width:100%;margin-top:1rem;flex:1}
</style>