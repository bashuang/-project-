<template>
    <div>
        <!--购物车头部-->
        <HeaderComponent title="购物车"></HeaderComponent>
        <!--购物车内容信息-->
        <div class="content-wrap" v-for="(item,index) in cartData" :key="index">
            <div class="checkbox">
                <div :class="{'checkbox-img':true,checked:item.checked}" @click="selectItem(index)"></div>
            </div>
            <div class="car-content">
                <div class="con-img">
                    <img :src="item.img"/>
                    <div class="del-car" @click="delItem(index)">删除</div>
                </div>
                <div class="car-con">
                    <div class="con-tit">{{item.title}}</div>
                    <div class="car-size">
                        <span  v-for="(item2,index2) in item.attrs" :key="index2">{{item2.title}}:<span v-for="(item3,index3) in item2.param" :key="index3">{{item3.title}}</span>&emsp;</span>
                    </div>
                    <div class="cart-num">
                        <div class="car-price">￥{{item.price}}</div>
                        <div class="count">
                            <div class="add" @click="item.amount>1?decAmount({index:index}):1">-</div>
                            <input class="conut-inp" :value="item.amount" @input="changeAmount({index:index,amount:$event.target.value})">
                            <div class="sub" @click="item.amount<100?incAmount({index:index}):99">+</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--底部结算-->
        <div class='orderend-wrap'>
            <div class='select-area'>
                <div class='select-wrap' @click="setSelect()">
                    <div :class="{'select-btn':true ,checked:allCheck}"></div>
                    <div class='select-text'>全选</div>
                </div>
                <div class='total'>运费：<span>¥{{freight}}</span>&nbsp;&nbsp;合计：<span>{{total}}</span></div>
            </div>
            <div :class="{'orderend-btn':true, disable:!getPayItem}">去结算</div>
        </div>
    </div>
</template>

<script>
    import HeaderComponent from '../../../components/header';
    import {mapMutations,mapState,mapGetters} from 'vuex'
    export default {
        name: "cart",
        data(){
            return{
                amount:1,
                allCheck:true
            }
        },
        components:{
            HeaderComponent
        },
        computed:{
            ...mapState({
                cartData:state=>state.cart.cartData
            }),
            ...mapGetters({
                total:"cart/total",
                freight:"cart/freight",
                getPayItem:"cart/getPayItem"
            })
        },
        methods:{
            ...mapMutations({
                changCheck:"cart/changCheck",
                changChecked:"cart/changChecked",
                delGoods:"cart/delGoods",
                changeAmount:"cart/changeAmount",
                incAmount:"cart/incAmount",
                decAmount:"cart/decAmount"
            }),
            // 选择单个商品
            selectItem(index){
                this.changCheck({index:index})
                if(this.cartData.length>0){
                    this.checkAll();
                }
            },
            // 检查是否全选
            checkAll(){
                let isAllItem=true;
                if(this.cartData.length>0){
                    for(let key in this.cartData){
                        if(!this.cartData[key].checked){
                            isAllItem=false;
                            break;
                        }
                    }
                }else{
                    isAllItem=false
                }
                console.log(this.cartData.length)
                this.allCheck=isAllItem;
            },
            // 全选反选
            setSelect(){
                this.allCheck=!this.allCheck;
                this.changChecked({allCheck:this.allCheck}) //全选框点击时获取上面选择状态，需要vuex
            },
            // 删除购物车商品
            delItem(index){
                console.log(index)
                this.delGoods(index);
                if(this.cartData.length<=0){
                    this.allCheck=false
                }
            }
        },
        created(){
            this.checkAll();
        },
        mounted(){
            document.title=this.$route.meta.title
        }
    }
</script>

<style scoped>
.content-wrap{width:100%;height: 2rem;border-bottom:0.02rem solid #EFEFEF;display: flex;}
    .checkbox{width:12%;height: 100%;}
    .checkbox-img{width:0.32rem;height: 0.32rem;border-radius: 50%;margin:80% auto;border:0.02rem solid #B5B5B5;box-sizing: border-box}
    .checked{background: url(../../../assets/images/home/cart/checkmark.png) no-repeat center;background-size: 100% 100%;border:none}

    .car-content{width:83%;height: 100%;display: flex;justify-content: flex-start}
    .con-img{width:1.2rem;height: 1.2rem;margin:0.2rem}
    .con-img img{display: inline-block;width:100%;height: 100%}
    .del-car{width:100%;text-align: center;line-height: 0.5rem;font-size:0.24rem;color: #B5B5B5}

    .car-con{flex: 1;margin-top:0.1rem;}
    .con-tit{width:100%;line-height: 0.35rem;font-size:0.24rem;color:#323232}
    .car-size{width:100%;height: 0.6rem;line-height: 0.4rem;font-size:0.24rem;color:#323232}

    .cart-num{width:100%;display: flex;justify-content: space-between}
    .car-price{font-size:0.24rem;color:red;}

    .count{width:1.8rem;height: 0.4rem;border: 0.02rem solid #999;display: flex;justify-content:flex-start;margin-right: 0.1rem;align-items: center;border-radius: 0.04rem}
    .count .add{width:30%;height: 0.3rem;border-right: 0.02rem solid #000;text-align: center;line-height: 0.3rem;font-size:0.32rem}
    .count .sub{width:30%;height: 0.3rem;border-left: 0.02rem solid #000;text-align: center;line-height: 0.3rem;font-size:0.32rem}
    .count .conut-inp{width:39%;height: 0.3rem;border:none;text-align: center;font-size:0.28rem;line-height: 0.3rem}

    /*底部结算*/
.orderend-wrap{width:100%;height:1rem;background: #FFFFFF;position: fixed;z-index: 10;left:0;bottom:1.2rem;border-top: 1px solid #EFEFEF;display: flex;display:-webkit-flex;}
.orderend-wrap .select-area{width:auto;height:100%;flex:3;-webkit-flex:3;display:flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;align-items: center;-webkit-align-items: center;}
.orderend-wrap .select-area .select-wrap{width:auto;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
.orderend-wrap .select-area .select-wrap .select-text{font-size:0.24rem;}
.orderend-wrap .select-area .select-wrap .select-btn{width:0.4rem;height:0.4rem;border:#EFEFEF solid 1px;border-radius: 100%;margin-left:0.2rem;margin-right:0.1rem;}
.orderend-wrap .select-area .select-wrap .select-btn.active{background-image:url("../../../assets/images/home/cart/checkmark.png");background-size:100%;background-repeat: no-repeat;background-position: center;border:#FFFFFF solid 1px;}
.orderend-wrap .orderend-btn{width:auto;height:100%;flex:1;-webkit-flex:1;background:#CC0004;font-size:0.32rem;color:#FFFFFF;text-align: center;line-height:1rem;}
.orderend-wrap .orderend-btn.disable{background:#BFBFBF;}
.orderend-wrap .total{font-size:0.24rem;margin-right:0.2rem;}
.orderend-wrap .total span{color:#CC0004}
</style>
