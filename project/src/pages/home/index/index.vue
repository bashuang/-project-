<template>
    <div class="app">
<!--头部-->
        <div :class="{header:true,headRed:isHeadRed}"  v-show="!isShow">
            <span class="classify" @click="goPage('./goods/classify')"><img src="../../../assets/images/common/class.png"/></span>
            <div class="search-warp" @click="toSearch()">
                <div class="fdj"></div>
                <div class="search-box"> 输入喜欢的宝贝名称</div>
            </div>
            <span class="login" @click="$router.push('/login')" v-if="!isLogin">登录</span>
            <span class="go-ucenter" @click="$router.push('/ucenter')" v-if="isLogin"></span>
        </div>


<!--轮播图-->
        <div class="swiper-main">
            <div ref="swiper-container" class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in slides" :key="index"><img :src="item.image"></div>
                </div>
                <div ref="swiper-pagination" class="swiper-pagination"></div>
            </div>
        </div>
 <!--分类导航       -->
        <div class="main-class-wrap">
            <div class="main-class" v-for="(item,index) in navList" :key="index" @click="$router.push('/goods/classify/item?cid='+item.cid)">
                <div class="main-class-img"><img :src="item.image"></div>
                <div class="main-class-title">{{item.title}}</div>
            </div>
        </div>

<!--分类详细信息        -->
    <div class="content-wrap">
    <template v-for="(item,index) in goods">
        <!--女装-->
        <div class="content" :key="index" v-if="(index+1)%2==1">
            <div :class="'content-title'+index">—— {{item.title}} ——</div>
            <div class="content-up">
                <div class="content-up-l">
                    <div @click="goPage('/goods/details?gid='+(item.items && item.items[0].gid))">
                        <div class="up-l-tit" >{{item.items&&item.items[0].title}}</div>
                        <div class="tit-sale">精品打折<div :class="'sale-price'+index">{{item.items&&item.items[0].price}}</div></div>
                        <div class="up-l-img">
                            <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item.items&&item.items[0].image"/>
                        </div>
                    </div>

                </div>

                <div class="content-up-r">
                    <div class="up-r" v-for="(item2,index2) in item.items.slice(1,3)" :key="index2" @click="goPage('/goods/details?gid='+(item2.gid))">
                        <div>
                            <div class="up-r-tit">{{item2.title}}</div>
                            <div class="up-r-sale">品质精挑</div>
                        </div>
                        <div class="up-r-img"><img :src="item2.image"/></div>
                    </div>

                </div>
            </div>
            <!--内容下面-->
            <div class="content-down">
                <div class="down-con" v-for="(item2,index2) in item.items.slice(3,7)" :key="index2" @click="goPage('/goods/details?gid='+item2.gid)">
                    <div class="down-con-tit">{{item2.title}}</div>
                    <div class="down-con-img"><img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image"/></div>
                    <div class="down-con-price">￥{{item2.price}}</div>
                    <div class="down-price-old">￥{{item2.price*1.5}}</div>
                </div>

            </div>
        </div>
    <!--男装-->
        <div class="content" :key="index" v-else>
            <div :class="'content-title'+index">—— {{item.title}} ——</div>
            <div class="content-up">
                <div class="content-up-l" v-for="(item2,index2) in item.items.slice(0,2)" @click="goPage('/goods/details?gid='+(item2.gid))">
                    <div class="up-l-tit">{{item2.title}}</div>
                    <div class="tit-sale2">精品打折</div>
                    <div class="up-l-img2"><img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image"/></div>
                </div>

            </div>
            <!--内容下面-->
            <div class="content-down">
                <div class="down-con" v-for="(item2,index2) in item.items.slice(2)" @click="goPage('/goods/details?gid='+item2.gid)">
                    <div class="down-con-tit">{{item2.title}}</div>
                    <div class="down-con-img"><img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image"/></div>
                    <div class="down-con-price">￥{{item2.price}}</div>
                    <div class="down-price-old">￥{{item2.price*2}}</div>
                </div>
            </div>
        </div>
    </template>

    </div>
    <!--猜你喜欢-->
    <div class="ulike-wrap">
        <div class="ulike-tit">
            <div class="ulike-line"></div>
            <div class="tuijian">为你推荐</div>
            <div class="ulike-line"></div>
        </div>
        <div class="ulike-con-wrap">
            <div class="ulick-con" v-for="(item,index) in ulikeGoods" :key="index" @click="goPage('/goods/details?gid='+(item.items && item.items[0].gid))">
                <div class="ulike-img"><img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item.image"/></div>
                <div class="ulick-tit">{{item.title}}</div>
                <div class="ulick-price">￥{{item.price}}</div>
            </div>
        </div>
    </div>
    <SearchComponent :isShow="isShow" @onClose="isShow=false"></SearchComponent>
</div>
</template>

<script>
    import SearchComponent from '../../../components/search';
    import {mapActions,mapState} from 'vuex'
    import {lazyImg} from '../../../assets/js/utils';
    export default {
        name: "index",
        data(){
            return{
                isHeadRed:false,
                isShow:false
            }
        },
        components:{
            SearchComponent
        },
        computed:{
            ...mapState({
                slides:state=>state.index.slides,
                navList:state=>state.index.navList,
                goods:state=>state.index.goods,
                ulikeGoods:state=>state.index.ulikeGoods,
                isLogin:state=>state.user.isLogin
            })
        },
        methods:{
            ...mapActions({
                getSwiper:"index/getSwiper",
                getNav:"index/getNav",
                getGoods:"index/getGoods",
                getLikeGoods:"index/getLikeGoods"
            }),
            goPage(url){
                this.$router.push(url);
            },
            toSearch(){
                this.isShow=true
            },
            setScroll(){
                let scrollTop=document.body.scrollTop || document.documentElement.scrollTop;//前面是兼容谷歌IE，后面的是火狐
                if(scrollTop>100){
                    this.isHeadRed=true;
                }else{
                    this.isHeadRed=false;
                }
            }
        },
        created(){

        },
        mounted(){
            document.title=this.$route.meta.title;
            window.addEventListener("scroll",this.setScroll);
        },
        // destroyed(){  //离开的时候不能移除侦听，因为有keepAlive存在缓存，但是为了系统优化不能改为true，所以移除代码要写在接触keepAlive钩子函数中
        //     console.log("aaa")
        //     window.removeEventListener("scroll",this.setScroll);
        // },
        deactivated(){
            window.removeEventListener("scroll",this.setScroll);
        },
        activated(){
            this.getSwiper({success:()=>{
                    this.$nextTick(()=>{
                        new Swiper(this.$refs['swiper-container'], {
                            autoplay: 3000,//可选选项，自动滑动
                            pagination : this.$refs['swiper-pagination'],
                            paginationClickable :true,
                            autoplayDisableOnInteraction : false
                        })
                    });
                }});
            this.getNav({success:()=>{
                    this.$nextTick(()=>{
                        lazyImg()
                    })
                }});
            this.getGoods({success:()=>{
                    this.$nextTick(()=>{
                        lazyImg()
                    })
                }});
            this.getLikeGoods({success:()=>{
                    this.$nextTick(()=>{
                        lazyImg()
                    })
                }});
        }

    }
</script>

<style scoped>
    .app{
        width:100%;
        height: auto;
        background-color:#EFEFEF ;
    }
    /*导航*/
.header{width:100%;height:0.92rem ;background: linear-gradient(rgba(1, 1, 1, 0.2) 0%, rgba(255, 255, 255, 0) 100%);display:flex;justify-content: flex-start;padding-top:0.08rem;position:fixed;left: 0;top:0;
    z-index: 100;}
.headRed{
    background: linear-gradient(rgba(235,22,37,1) 0%, rgba(255, 255, 255, 0) 100%)
}
    /*导航-----分类*/
.classify img{width:0.6rem;height: 0.6rem;margin:0 0.2rem;}
    /*导航------搜索框*/
.search-warp{background-color:rgba(255,255,255,0.5);display: flex;justify-content: flex-start;width:65%;
    height:0.52rem;border-radius:0.1rem;margin-top:0.05rem}
.search-warp .fdj{background: url(../../../assets/images/common/search.png) no-repeat center;background-size:70%;width:0.68rem;height:0.52rem}
.search-warp .search-box{width: 80%;height: 0.52rem;
    color:#ffffff;line-height:170%;font-size: 0.3rem}
    /*导航------登录*/
.login{width:1.36rem;height:0.8rem;text-align: center;line-height: 0.6rem;color:#ffffff}
.go-ucenter{margin-left:0.7rem;width:0.6rem;height: 0.6rem;background:url(../../../assets/images/home/index/my.png) no-repeat center;background-size: 100%}


    /*轮播图*/
    .swiper-main{width:100%;height:3.66rem;}
    .swiper-main .swiper-container{width:100%;height:100%}
    .swiper-main .swiper-container img{width:100%;height:100%;}

    /*分类导航*/
    .main-class-wrap{width:100%;height: auto;display: flex;justify-content: space-between;background-color: #ffffff;box-sizing: border-box;padding:0 0.2rem;margin:0.1rem 0 0.2rem}
    .main-class{width: 1.4rem;height:1.6rem;box-sizing: border-box;padding:0.15rem 0;}
    .main-class-img{width:0.8rem;height: 0.8rem;margin:0 auto 0.15rem;}
    .main-class-img img{width:100%;height: 100%}
    .main-class-title{font-size:0.28rem;text-align: center;color:#7b7f82;}

    /*主信息内容*/
    .content-wrap{width:100%;height:auto;}
    .content{width:100%;height:auto;background-color: #ffffff}
    .content-title0{text-align: center;border-bottom: solid #EFEFEF 1px;height: 0.62rem;line-height: 0.62rem;font-size:0.32rem;color:#f73b61}
    .content-title1{text-align: center;border-bottom: solid #EFEFEF 1px;height: 0.62rem;line-height: 0.62rem;font-size:0.32rem;color:orange}
    .content-title2{text-align: center;border-bottom: solid #EFEFEF 1px;height: 0.62rem;line-height: 0.62rem;font-size:0.32rem;color:#5FC600}

    .content-up{width:100%;height: auto;display: flex;}
    .content-up-l{width:49%;height: auto;padding:0.1rem 0.15rem;box-sizing: border-box;border-right:0.02rem solid #EFEFEF }
    .up-l-tit{font-size: 0.28rem;width:100%;word-break: break-all;overflow: hidden;white-space: nowrap;text-overflow: ellipsis}
    .tit-sale{height:0.3rem;font-size: 0.24rem;color:#cb385d;}
    .tit-sale2{font-size: 0.24rem;color:#cb385d;text-align: center}
    .sale-price0{
        width:0.8rem;
        height: 0.35rem;
        background-color: #F21D4F;
        border-radius: 0.25rem;
        color:#ffffff;
        font-size: 0.28rem;
        text-align: center;
        line-height: 0.35rem;
        float: right;
        margin:0 0.8rem 0.01rem 0;
    }
    .sale-price2{
        width:0.8rem;
        height: 0.35rem;
        background-color: #5FC600;
        border-radius: 0.25rem;
        color:#ffffff;
        font-size: 0.28rem;
        text-align: center;
        line-height: 0.35rem;
        float: right;
        margin:0 0.8rem 0.01rem 0;
    }
    .up-l-img{width:80%;height:1.8rem;margin:0.1rem auto;}
    .up-l-img2{width:60%;height:1.8rem;margin:0.1rem auto;}
    .up-l-img img{width:100%;height: 100%;}
    .up-l-img2 img{width:100%;height: 100%;}
    /*内容上右面*/
    .content-up-r{width: 50%;height: auto;}
    .up-r{width:100%;height: 1.22rem;box-sizing: border-box;display: flex;padding-left:0.2rem;border-bottom:0.02rem solid #EFEFEF}
    .up-r-tit{font-size: 0.28rem;width:1.88rem;margin-top:0.2rem;word-break: break-all;overflow: hidden;white-space: nowrap;text-overflow: ellipsis}
    .up-r-sale{font-size: 0.24rem;color:#7b7f82;}
    .up-r-img{width:1.22rem;height: 1.22rem;margin-bottom:0.1rem}
    .up-r-img img{
        display: block;
        width:1.2rem;height: 1.16rem
    }
    /*下面的内容*/
    .content-down{width:100%;height:auto;overflow: hidden;display: flex;margin-bottom:0.2rem}
    .down-con{width: 24.7%;height:3.1rem;text-align: center;font-size: 0.28rem;}
    .down-con-tit{font-weight: bold;margin-top:0.2rem;word-break: break-all;overflow: hidden;white-space: nowrap;width:94%}
    .down-con-img{width:1.52rem;height:1.48rem;margin:0.1rem auto 0.1rem}
    .down-con-img img{width:100%;height: 100%}
    .down-con-price{color:red;line-height: 0.4rem}
    .down-price-old{text-decoration: line-through;color:#7b7f82}
    /*男装————————————*/
    .title-orange{color:orange}
    /*电脑办公——————————*/
    .title-green{color:#5fc600}

    /*猜你喜欢——————————*/
    .ulike-wrap{width:100%;height: auto;margin-bottom: 1.2rem;}
    .ulike-tit{width:100%;height: 1rem;display: flex;justify-content: space-between}
    .ulike-line{width:35%;height:50%;border-bottom:0.02rem solid #D4D4D4}
    .tuijian{width:2.4rem;background: url(../../../assets/images/home/index/recom.png) no-repeat 0.2rem top;background-size: 0.4rem 0.4rem;margin-top:0.25rem;text-indent: 0.8rem;font-size:0.32rem}
    .ulike-con-wrap{width:100%;height: auto;background-color: #EFEFEF;clear: both;overflow: hidden}
    .ulick-con{width:47.3%;height: 4.4rem;background-color:#ffffff;float: left;margin:0 0.1rem 0.2rem}
    .ulike-img{width:2.8rem;height: 2.8rem;margin:0.1rem auto;}
    .ulike-img img{width:100%;height: 100%}
    .ulick-tit{width:95%;height:0.68rem;font-size:0.28rem;padding:0 0 0.1rem 0.1rem;overflow: hidden}
    .ulick-price{font-size: 0.28rem;color:red;text-indent: 0.2rem}
</style>

