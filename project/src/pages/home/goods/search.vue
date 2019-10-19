<template>
<div class='page'>
        <div class='search-top'>
            <div class='search-header'>
                <div class='back' @click="$router.go(-1)"></div>
                <div class='search-wrap' @click="isShow=true">
                    <div class='search-icon'></div>
                    <div class='search-text'>{{kwords?kwords:"请输入商品名称"}}</div>
                </div>
                <div class='screen-btn' @click="isScreen=true">筛选</div>
            </div>
            <div class='order-main'>
                <div :class='{"order-item":true, active:ispriceOrder}' @click="ispriceOrder=!ispriceOrder,isSaleOrder=false">
                    <div class="order-text">综合</div>
                    <div class='order-icon'></div>
                    <ul class='order-menu hide' v-show="ispriceOrder">
                        <li :class='{active:item.active}' v-for="(item,index) in priceOrderList" :key="index" @click="setOrderPrice(index)">{{item.title}}</li>
                    </ul>
                </div>
            <div :class='{"order-item":true,active:isSaleOrder}'>
                <div class="order-text" @click="saleOrder()"> 销量</div>
            </div>
    </div>
    </div>
    <!--搜索商品结果-->
    <div class='goods-main'>
        <!--商品列表-->
        <div class='goods-list' v-for="(item,index) in goods" :key="index" @click="$router.push('/goods/details?gid='+item.gid)">
            <div class='image'><img  :src="item.image" /></div>
            <div class='goods-content'>
                <div class='goods-title'>{{item.title}}</div>
                <div class='price'>¥{{item.price}}</div>
                <div class='sales'>销量<span>{{item.sales}}</span>件</div>
            </div>
        </div>
        <div class="no-data" v-show="goods.length<=0">没有相关商品！</div>
    </div>
    <!--点击筛选时遮挡的面板    -->
    <div ref="mask" class='mask' v-show="isScreen" @click="isScreen=false"></div>
    <!--筛选选项卡    -->
    <div ref="screen" :class='isScreen?"screen move":"screen unmove"'>
        <div>
            <div class='attr-wrap' >
                <div class='attr-title-wrap'@click="isClassifyMenu=!isClassifyMenu">
                    <div class='attr-name'>分类</div>
                    <div :class='{"attr-icon":true,up:!isClassifyMenu}'></div>
                </div>
                <!--分类数据-->
                <div class='item-wrap' v-show="isClassifyMenu">
                    <div :class='{item:true, active:item.checked}' v-for="(item,index) in classifyList" :key="index" @click="selectClassify({index:index})">{{item.title}}</div>
                </div>
            </div>
            <div style='width:100%;height:1px;backgroundColor:#EFEFEF'></div>
            <div class='attr-wrap'>
                <div class='attr-title-wrap' @click="priceList.isShow=!priceList.isShow">
                    <div class='attr-name'>价格区间</div>
                    <div class='price-wrap'>
                        <div class='price-input'><input type="tel" placeholder="最低价" :value="minPrice" @click.stop @keyup="setMinPrice({minPrice:$event.target.value})"/></div>
                        <div class='price-line'></div>
                        <div class='price-input'><input type="tel" placeholder="最高价" :value="maxPrice"  @click.stop @keyup="setMaxPrice({maxPrice:$event.target.value})"/></div>
                    </div>
                    <div :class='{"attr-icon":true, up:!priceList.isShow}' ></div>
                </div>
                <div class='item-wrap' v-show="priceList.isShow">
                    <div :class='{item:true,active:item.checked}' v-for="(item,index) in priceList.data" :key="index" @click="selectPrice({index:index})">{{item.priceMin}}-{{item.priceMax}}</div>
                </div>
            </div>
            <div style='width:100%;height:0.3rem;backgroundColor:#EFEFEF'></div>
            <div>
                <!--尺寸规格-->
                <div class='attr-wrap' v-for="(item,index) in attrs" :key="index">
                    <div class='attr-title-wrap' @click="showAttr({index:index})">
                        <div class='attr-name'>{{item.title}}</div>
                        <div :class='{"attr-icon":true, up:!item.isShow}'></div>
                    </div>
                    <div class='item-wrap' v-show="item.isShow">
                        <div :class='{item:true, active:item2.checked}' v-for="(item2,index2) in item.param" @click="selectParam({index:index,index2:index2})">{{item2.title}}</div>
                    </div>
                </div>

                <div style='width:100%;height:1px;backgroundColor:#EFEFEF'></div>
            </div>
            <div>


                <div style='width:100%;height:1px;backgroundColor:#EFEFEF'></div>
            </div>
            <div style='width:100%;height:1.2rem'></div>
        </div>
        <div class='handel-wrap'>
        <div class='item'>共<span>{{goodsTotal}}</span>件</div>
        <div class='item reset' @click="reserAttrs()">全部重置</div>
        <div class='item sure' @click="sureSearch()">确定</div>
    </div>

    </div>

    <SearchComponent :isShow="isShow" @onClose="isShow=false" :isLocal="true"></SearchComponent>
</div>
</template>

<script>
    import SearchComponent from '../../../components/search';
    import {mapState,mapActions,mapMutations} from 'vuex';
    import IScroll from '../../../assets/js/libs/iscroll.js'
    import PullUp from '../../../assets/js/libs/uprefresh.js'
    export default {
        name: "search",
        data(){
            return{
                ispriceOrder:false, //综合
                isSaleOrder:false,  //销量
                isScreen:false,   //筛选选项卡
                kwords:this.$route.query.kwords?this.$route.query.kwords:"",
                isShow:false,
                priceOrderList:[
                    {title:"综合",active:false,otype:"all"},
                    {title:"从低到高",active:false,otype:"up"},
                    {title:"从高到低",active:false,otype:"down"}
                ],
                isClassifyMenu:true
            }
        },
        components:{
            SearchComponent
        },
        computed:{
            ...mapState({
                goods:state=>state.search.goods,
                classifyList:state=>state.goods.classifyList,
                cid:state=>state.search.cid,
                goodsTotal:state=>state.search.goodsTotal,
                priceList:state=>state.search.priceList,
                minPrice:state=>state.search.minPrice,
                maxPrice:state=>state.search.maxPrice,
                attrs:state=>state.search.attrs,
                params:state=>state.search.params
            })
        },
        methods:{
            ...mapActions({
                getSearchGoods:"search/getSearchGoods",
                getSearchGoodsPage:"search/getSearchGoodsPage",
                getClassify:"goods/getClassify",
                selectClassify:"search/selectClassify",
                getAttrs:"search/getAttrs",
                reserAttrs:"search/reserAttrs"
            }),
            ...mapMutations({
                selectPrice:"search/selectPrice",
                setMinPrice:"search/setMinPrice",
                setMaxPrice:"search/setMaxPrice",
                showAttr:"search/showAttr",
                selectParam:"search/selectParam",
                pushParams:"search/pushParams"
            }),
            saleOrder(){//按销量排序
                this.isSaleOrder=true;
                this.ispriceOrder=false;
                this.initSearchGoods({otype:"sale",page:1})
            },
            initSearchGoods(params){  //分页
                this.getSearchGoods({...params,success:(pageinfo)=>{
                    // 1、当前第几页，最大是几页，2、回调函数
                    this.pullUp.init({"curPage":1,"maxPage":pageinfo.pagenum,"offsetBottom":100},(curPage)=>{
                        this.getSearchGoodsPage({page:curPage})
                    })
                }})
            },
            // 排序
            setOrderPrice(index){
                for(let i=0;i<this.priceOrderList.length;i++){
                    if(this.priceOrderList[i].active){
                        this.priceOrderList[i].active=false;
                    }
                }
                this.priceOrderList[index].active=true;//点击文字变黄
                this.initSearchGoods({otype:this.priceOrderList[index].otype,page:1})
            },
            //点击确认搜索
            sureSearch(){
                this.isScreen=false;
                // 筛选后点击确定开始组数据
                this.pushParams();
                this.initSearchGoods({cid:this.cid,page:1,price1:this.minPrice,price2:this.maxPrice,param:this.params.length>0?this.params:""});
            }
        },
        created(){
            this.pullUp=new PullUp();
            this.getClassify({success:()=>{ //解决获取数据循环渲染之后无法滚动的问题，异步函数，如果nexttick不好用的话，就用settimeout（100-300）
                this.$nextTick(()=>{
                    this.myScroll.refresh()
                });
            }});//获取vuex中已经得到的分类数据
            // 获取商品属性
            this.getAttrs({kwords:this.kwords,success:()=>{
                    this.$nextTick(()=>{
                        this.myScroll.refresh()
                    });
                }});
            //设置参数对象的key，及默认值
            this.initSearchGoods({kwords:this.kwords,page:1,price1:"",price2:"",param:"",otype:"all",cid:""});

        },
        mounted(){
            this.$refs['screen'].addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            this.myScroll= new IScroll(this.$refs['screen'], {
                scrollX : false,
                scrollY : true,
                preventDefault : false  //也是禁用父元素默认事件，与上面相同，但是ios或安卓上回出现兼容性的问题，用原始的dom方法
            });
        },
        beforeRouteUpdate(to,from,next){
            // 当在搜索页面点击搜索时，地址关键词改变，页面没有跳转到相关页面
            this.kwords=this.$route.query.kwords;
            this.isShow=false;
            this.isSaleOrder=false;
            this.ispriceOrder=false;
            this.initSearchGoods({kwords:this.kwords,page:1,price1:"",price2:"",param:"",otype:"all",cid:""});
            next()
        },
        destroyed(){
            this.pullUp.uneventSrcoll();//ui库中给定的清除滚动条监听事件的方法，调用即可清除
        }

    }
</script>

<style scoped>
    .page{width:100%;height:auto;background-color:#FFFFFF;overflow:hidden;}
    .search-top{width:100%;position: fixed;z-index: 10;left:0px;top:0px;background-color:#FFFFFF;}
    .search-header{width:100%;height:0.8rem;border-bottom: 1px solid #EFEFEF;display: flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;align-items: center;-webkit-align-items: center}
    .search-header .back{width:0.8rem;height:0.8rem;background-image:url('../../../assets/images/home/goods/back.png');background-size:100%;background-repeat: no-repeat;background-position: center;}
    .search-header .search-wrap{width:75%;background:#EAEAEA;height:80%;border-radius: 0.1rem;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .search-header .search-wrap .search-icon{width:0.5rem;height:0.5rem;background-image:url("../../../assets/images/common/search.png");background-repeat: no-repeat;background-size: 100%;background-position: center;margin-left:0.1rem;margin-right:0.2rem;}
    .search-header .search-wrap .search-text{width:90%;height:auto;font-size:0.32rem;}
    .search-header .screen-btn{width:auto;height:auto;font-size:0.32rem;margin-right:0.1rem;}

    .search-top .order-main{width:100%;height:0.8rem;border-bottom: 1px solid #EFEFEF;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .search-top .order-main .order-item{width:auto;height:auto;display:flex;display:-webkit-flex;margin-left:0.4rem ;position: relative;z-index:1;}
    .search-top .order-main .order-item .order-text{font-size:0.32rem;}
    .search-top .order-main .order-item.active .order-text{color:#FDA208}
    .search-top .order-main .order-item .order-icon{width:0.35rem;height:0.35rem;background-image:url("../../../assets/images/home/goods/down.png");background-size:100%;background-position: center;background-repeat: no-repeat;margin-left:0.1rem;}
    .search-top .order-main .order-item.active .order-icon{background-image:url("../../../assets/images/home/goods/up.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    /*.search-top .order-main .order-item .order-icon.up{background-image:url("../../../../assets/images/home/goods/up.png");background-size:100%;background-position: center;background-repeat: no-repeat;}*/
    .search-top .order-main .order-item .order-menu{width:688%;height:auto;background-color:#FFFFFF;position: absolute;z-index:1;left:-35%;top:0.63rem;}
    .search-top .order-main .order-item .order-menu li{width:95%;height:0.8rem;border-bottom: 1px solid #EFEFEF;font-size:0.28rem;line-height:0.8rem;padding-left:0.4rem;}
    .search-top .order-main .order-item .order-menu li.active{color:#FDA208}

    .goods-main{width:100%;height:auto;margin-top:2rem;}
    .goods-main .goods-list{width:100%;height:2rem;display:flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;overflow:hidden;margin-bottom: 0.4rem;}
    .goods-main .goods-list .image{width:2rem;height:2rem;margin-left:0.1rem;overflow:hidden;text-align:center;}
    .goods-main .goods-list .image img{width:auto;height:auto;max-height: 100%;max-height:100%;}
    .goods-main .goods-list .goods-content{width:67%;height:98%;border-bottom:solid 1px #cccccc;}
    .goods-main .goods-list .goods-title{width:95%;height:0.8rem;font-size:0.28rem;overflow:hidden;}
    .goods-main .goods-list .price{font-size:0.32rem;color:#F93036;margin-top:0.1rem;}
    .goods-main .goods-list .sales{font-size:0.24rem;color:#969696;margin-top:0.1rem;}
    .goods-main .goods-list .sales span{color:#FDA208}

    .mask{width:100%;height:100%;position: fixed;z-index:99;left:0px;top:0px;background-color:rgba(0,0,0,0.3)}
    .screen{width:80%;height:100%;position: fixed;z-index:100;right:0px;top:0px;background-color:#FFFFFF;transform: translateX(100%);-webkit-transform:translateX(100%);overflow:hidden;}
    .screen.move{transition: transform 0.3s;-webkit-transition: transform 0.3s;transform: translateX(0%);-webkit-transform: translateX(0%)}
    .screen.unmove{transition: transform 0.3s;-webkit-transition: transform 0.3s;transform: translateX(100%);-webkit-transform: translateX(100%)}
    .screen .attr-wrap{width:100%;}
    .screen .attr-wrap .attr-title-wrap{width:94%;height:0.8rem;display:flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;align-items: center;-webkit-align-items:center;padding-left:0.2rem;padding-right:0.2rem;}
    .screen .attr-wrap .attr-title-wrap .attr-name{font-size:0.32rem;}
    .screen .attr-wrap .attr-title-wrap .attr-icon{width:0.4rem;height:0.4rem;background-image:url("../../../assets/images/home/goods/down.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .screen .attr-wrap .attr-title-wrap .attr-icon.up{background-image:url("../../../assets/images/home/goods/up.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .screen .attr-wrap .attr-title-wrap .price-wrap{width:auto;height:auto;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;margin-left:18%;}
    .screen .attr-wrap .attr-title-wrap .price-wrap .price-input{width:1rem;height:0.4rem;border:1px solid #EFEFEF}
    .screen .attr-wrap .attr-title-wrap .price-wrap .price-input input{width:100%;height:89%;font-size:0.28rem;}
    .screen .attr-wrap .attr-title-wrap .price-wrap .price-line{width:0.4rem;height:1px;background-color:#EFEFEF;margin-left:0.1rem;margin-right:0.1rem;}
    .screen .attr-wrap .item-wrap{width:100%;display:flex;display:-webkit-flex;flex-wrap: wrap;-webkit-flex-wrap:wrap;}
    .screen .attr-wrap .item-wrap .item{width:30%;height:0.64rem;background-color:#EFEFEF;text-align: center;line-height:0.64rem;overflow:hidden;font-size:0.28rem;border-radius: 0.1rem;margin-left:2%;margin-right:1%;margin-bottom: 0.2rem;}
    .screen .attr-wrap .item-wrap .item.active{color:#FFFFFF;background-color:#FDA208;}
    .screen .handel-wrap{width:100%;height:1rem;background-color:#FFFFFF;border-top:1px solid #EFEFEF;position:absolute;z-index:1;left:0px;bottom:0px;display:flex;display:-webkit-flex;}
    .screen .handel-wrap .item{width:auto;height:100%;font-size:0.28rem;text-align: center;line-height:1rem;flex:1;-webkit-flex:1}
    .screen .handel-wrap .item span{color:#FDA208}
    .screen .handel-wrap .item.reset{background-color:#EFEFEF}
    .screen .handel-wrap .item.sure{background-color:#FDA208;color: #FFFFFF}
</style>
