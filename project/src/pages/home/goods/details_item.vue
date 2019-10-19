<template>
<div class="itemPage">
    <div>
        <!--轮播图-->
        <div class="swiper-main">
            <div ref="swiper-container" class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in detailsList.images" :key="index"><img :src="item"/></div>

                </div>
                <div ref="swiper-pagination" class="swiper-pagination"></div>
            </div>
        </div>

        <!--商品信息，标题价格等-->
        <div class="item-tit">{{detailsList.title}}</div>
        <div class="item-Price">￥{{detailsList.price}}</div>
        <div class="sale-main"><span>快递：{{detailsList.freight}}元</span><span>月销量{{detailsList.sales}}件</span></div>
    </div>

    <div class="gray">

    </div>
    <!--评价-->
    <div class="item-pingjia">
        <div class="pingjia-tit">商品评价({{pageInfo.total}})</div>
        <div class="ping-con-wrap" v-for="(item,index) in reviewsList" :key="index" v-show="reviewsList.length>0">
            <span class="ping-img"><img :src="item.head"/></span>
            <span class="pin-name">{{item.nickname}}</span>
            <div class="ping-con">{{item.content}}</div>
            <div class="ping-time">{{item.times}}</div>
        </div>
        <div class="more-ping" @click="$router.replace('/goods/details/review?gid='+gid)" v-show="reviewsList.length>0">查看更多评价</div>
        <div v-show="reviewsList.length<=0" class="no-review">没有相关评价！</div>
    </div>
    <div class="item-bottom">
        <div class="bottom-l">收藏</div>
        <div class="bottom-r" @click="isShow=true">加购物车</div>
    </div>
    <!--选项卡-->
    <div class="mask" v-show="isShow" @click="isShow?isShow=false:isShow=true"></div>
    <div ref="panel-wrap" :class="isShow?'panel-wrap panelUp':'panel-wrap panelDown'" >
        <div  class="panel-x-wrap">
            <div class="panel-x" @click="isMove?isShow=false:isShow=true"></div>
            <div class="x-line"></div>
        </div>
        <div class="panel-tit" ref="panel-tit">
            <div ref="tit-img" class="tit-img"><img :src="detailsList.images&&detailsList.images[0]"/></div>
            <div class="tit-wrap">
                <div class="tit-tit">{{detailsList.title}}</div>
                <div class="tit-price">
                    <div class="tit-red">￥{{detailsList.price}}元</div>
                    <div class="tit-bianma">商品编码：{{gid}}</div>
                </div>
            </div>
        </div>

        <div class="colors-wrap" v-for="(item,index) in size" :key="index">
            <div class="colors-tit">{{item.title}}</div>
            <div class="colors">
                <span :class="{choose:item2.choose}" v-for="(item2,index2) in item.values" :key="index2" @click="getChoose({index:index,index2:index2})">{{item2.value}}</span>
            </div>
        </div>

        <div class="buy-num-wrap">
            <div class="buy-num">购买数量</div>
            <div class="count">
                <div class="add" @click="inpValue>1?--inpValue:inpValue=1">-</div>
                <input type="tel" class="conut-inp" @keyup="changeValue($event)" :value="inpValue" >
                <div class="sub" @click="inpValue>=100?inpValue=99:++inpValue">+</div>
            </div>
        </div>
        <div class="agree" @click="joinCart()">确定</div>
    </div>

</div>
</template>

<script>
    import Vue from 'vue'
    import {mapActions,mapState,mapMutations} from 'vuex';
    import TweenMax from '../../../assets/js/libs/TweenMax.js'
    import {Toast} from 'cube-ui'
    Vue.use(Toast);
    export default {
        name: "detail_item",
        data(){
            return{
                isShow:false,
                inpValue:1,
                gid:this.$route.query.gid,
                isMove:true
            }
        },
        computed:{
            ...mapState({
                detailsList:state=>state.goods.detailsList,
                size:state=>state.goods.size,
                reviewsList:state=>state.reviews.reviewsList,
                pageInfo:state=>state.reviews.pageInfo
            })
        },
        created() {
            this.getDetail({gid:this.gid,success:()=>{
                this.$nextTick(() => {
                    new Swiper(this.$refs['swiper-container'], {
                        autoplay: 3000,//可选选项，自动滑动
                        pagination: this.$refs['swiper-pagination'],
                        paginationClickable: true,
                        autoplayDisableOnInteraction: false
                    })
                });
            }});
            this.getSize({gid:this.gid});
            this.getViews({gid:this.gid})
        },
        methods:{
            changeValue(e){
                this.inpValue=e.target.value;
                this.inpValue=this.inpValue.replace(/[^\d]/g,'');//吧所有非数值的都替换成空
                if(this.inpValue==''||this.inpValue==0){
                    this.inpValue=1;
                }
            },
            ...mapActions({
                getDetail:"goods/getDetail",
                getSize:"goods/getSize",
                getChoose:"goods/getChoose",
                getViews:"reviews/getViews",
            }),
            ...mapMutations({
                addCart:"cart/addCart"
            }),
            joinCart() {
                if (this.size.length > 0) {
                    let isActive = false;
                    for (let i = 0; i < this.size.length; i++) {
                        isActive = false;
                        for (let j = 0; j < this.size[i].values.length; j++) {
                            if (this.size[i].values[j].choose) {
                                isActive = true;  //如果没有选择项，就不能添加，提示请选择
                                break;
                            }
                        }
                        if (!isActive) { //循环了所偶的如果都为false的话就提示请选择
                            this.$createToast({
                                txt: '请选择' + this.size[i].title,
                                type: "txt"
                            }).show();
                            break;
                        }
                    }
                    if (isActive) {
                        this.submitData();
                    }
                }
            },
            submitData(){
                if(this.isMove){
                    this.isMove=false
                    let titImg=this.$refs["tit-img"],goodsInfo=this.$refs['panel-tit'];
                    let cloneImg=titImg.cloneNode(true);
                    let minCar=document.getElementById("min-car");
                    let minCarTop=window.innerHeight-this.$refs['panel-wrap'].offsetHeight;
                    cloneImg.style.cssText="width:0.4rem;height:0.4rem;position:absolute;z-index:10;left:0.2rem;top:0.2rem;";
                    goodsInfo.appendChild(cloneImg);
                    TweenMax.to(cloneImg,1, {bezier:[{x:cloneImg.offsetLeft, y:-130},{x:minCar.offsetLeft, y:-minCarTop}],onComplete:()=>{
                            //动画执行完成
                            cloneImg.remove();
                            this.isMove=true;
                            //动画执行完，添加商品到购物车，创建购物车相关的数据
                            let attrs=[],params=[];
                            if(this.size.length>0){
                                for(let i=0;i<this.size.length;i++){
                                    if(this.size[i].values.length>0){
                                        params=[];//每次清空，这样颜色和尺码就分开存储了
                                        for(let j=0;j<this.size[i].values.length;j++){

                                            if(this.size[i].values[j].choose){
                                                params.push({paramid:this.size[i].values[j].vid,title:this.size[i].values[j].value})
                                            }
                                        }
                                    }
                                    attrs.push({attrid:this.size[i].attrid,title:this.size[i].title,param:params})
                                }
                            }

                            let cartData={
                                gid:this.gid,
                                title:this.detailsList.title,
                                amount:this.inpValue,
                                price:this.detailsList.price,
                                img:this.detailsList.images[0],
                                checked:true,
                                freight:this.detailsList.freight,
                                attrs:attrs
                            };
                            this.addCart({cartData:cartData})
                        }});
                    TweenMax.to(cloneImg,0.2,{rotation:360,repeat:-1})
                }

            }
        },

    }
</script>

<style scoped>
    .itemPage{width:100%;height: 100%;left:0;top:0;}
    .swiper-main{width:100%;height:7.5rem;}
    .swiper-main .swiper-container{width:100%;height:100%}
    .swiper-main .swiper-container img{width:100%;height:100%;}

    .item-tit{width:90%;height: 0.8rem;margin:0.5rem auto 0;font-size:0.28rem}
    .item-Price{font-size:0.28rem;color:red;width:90%;margin:0.2rem auto}
    .sale-main{width:90%;display: flex;justify-content: space-between;margin:0 auto 0.3rem;font-size:0.24rem;color: #969696}

    .gray{background-color: #EFEFEF;width:100%;height: 1rem}

    .item-pingjia{width:100%;height: auto;padding:0.2rem;box-sizing: border-box;margin-bottom: 1.2rem}
    .pingjia-tit{width:100%;height: 0.6rem;line-height: 0.6rem}
    .ping-con-wrap{width:100%;height: 2rem;padding-top:0.2rem}
    .ping-img{display: inline-block;width:0.8rem;height: 0.8rem;border-radius: 50%;overflow: hidden;vertical-align: middle;margin-right: 0.2rem}
    .ping-img img{width:100%;height: 100%}
    .pin-name{display: inline-block;vertical-align: middle;font-size:0.32rem}
    .ping-con{width:100%;;font-size: 0.32rem;margin-top:0.2rem}
    .ping-time{font-size:0.28rem;color:#999;margin:0.2rem 0 0}
    .more-ping{width:3rem;height:0.6rem;border:0.02rem solid red;border-radius: 0.1rem;line-height: 0.6rem;text-align: center;margin:0.4rem auto;font-size:0.32rem}
    .no-review{width:100%;height: 1rem;line-height: 1rem;text-align: center}

    .item-bottom{width:100%;height:1.2rem;background-color: orangered;position: fixed;left:0;bottom:0;display: flex}
    .bottom-l{background-color: #FCB40A;text-align: center;line-height: 1.2rem;width:50%;font-size: 0.36rem;color:#ffffff}
    .bottom-r{background-color: #CC0004;text-align: center;line-height: 1.2rem;flex: 1;font-size: 0.36rem;color:#ffffff}

    /*内嵌加入购物车选项卡*/
    .mask{width:100%;height: 40%;background-color:rgba(0,0,0,0.3);position: fixed;left:0;top:0;z-index:30}
    .panel-wrap{width:100%;height: 60%;background-color: #EFEFEF;position: fixed;z-index:30;left:0;bottom:0;transition: transform 0.3s}
    .panelUp{transform: translateY(0%);-webkit-transform: translateY(0%);}
    .panelDown{transform: translateY(120%);-webkit-transform: translateY(120%);}

    .panel-x-wrap{width:0.5rem;height:6%;position:fixed;right: 0.2rem;top:-0.8rem;z-index:31}
    .panel-x{width:0.45rem;height: 0.45rem;border-radius: 50%;background-color: #ffffff;background: url("../../../assets/images/home/goods/x.png") no-repeat center;background-size: 100%;margin:0 auto}
    .x-line{width:0.02rem;height:0.6rem;background: #ffffff;margin:-0.06rem auto 0}
    .panel-tit{width:100%;height:1.3rem;background-color: #ffffff;display: flex;justify-content: flex-start;padding:0.2rem;box-sizing: border-box}
    .tit-wrap{width:90%;}
    .tit-img{width:0.8rem;height: 0.8rem;margin-right: 0.2rem}
    .tit-img img{display: block;width: 100%;height: 100%}
    .tit-tit{width:100%;height: 0.6rem;font-size:0.24rem;}
    .tit-price{;width:100%;display: flex;justify-content: space-between;margin:0.1rem 0;font-size:0.24rem;}
    .tit-red{color:red;}
    .tit-bianma{color:#999;}
    .colors-wrap{width:100%;background-color: #ffffff;height: auto;padding:0 0.2rem;box-sizing: border-box}
    .colors-tit{width:100%;height: 0.8rem;font-size:0.32rem;line-height: 0.8rem}
    .colors{width:100%;height:auto;}
    .colors span{display: inline-block;height: 0.7rem;line-height: 0.7rem;text-align: center;background-color: #EFEFEF;border-radius: 0.04rem;margin: 0.06rem;padding:0 0.2rem}
    .size-wrap{width:100%;background-color: #ffffff;height: auto;padding:0 0.2rem;box-sizing: border-box}
    .colors .choose{background-color:#FDA208;color:#ffffff}

    .buy-num-wrap{width:100%;background-color: #ffffff;display: flex;justify-content: space-between;padding:0.2rem;box-sizing: border-box}
    .count{width:2rem;height: 0.7rem;border: 0.02rem solid #999;display: flex;justify-content:flex-start;margin-right: 0.1rem;align-items: center;border-radius: 0.04rem}
    .count .add{width:30%;height: 0.5rem;border-right: 0.02rem solid #000;text-align: center;line-height: 0.5rem;font-size:0.4rem}
    .count .sub{width:30%;height: 0.5rem;border-left: 0.02rem solid #000;text-align: center;line-height: 0.5rem;font-size:0.4rem}
    .count .conut-inp{width:39%;height: 0.5rem;border:none;outline: none;text-align: center;font-size:0.32rem;line-height: 0.5rem}
    .buy-num{line-height: 0.7rem;font-size:0.32rem}
    .agree{width:100%;height: 0.8rem;background-color: #CF0005;;
        position:absolute;left:0;bottom:0;text-align: center;line-height: 0.8rem;color:#ffffff;font-size:0.32rem}
</style>