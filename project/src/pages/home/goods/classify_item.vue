<template>
    <div ref="item-warp" class="item-warp">
        <div v-show="rightGoodsList.length>0">
            <div v-for="(item,index) in rightGoodsList" :key="index">
                <div class="item-title">{{item.title}}</div>
                <div class="item-up">

                    <div class="item" v-for="(item2,index2) in item.goods" :key="index2" @click="$router.push('/goods/details?gid='+(item2.gid))">
                        <img  src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image"/>
                        <div class="item-tit">{{item2.title}}</div>
                    </div>
                </div>
            </div>
            <br/>
        </div>
        <div class="no-data" v-show="rightGoodsList.length<=0">没有相关商品！</div>
    </div>
</template>

<script>
    import IScroll from '../../../assets/js/libs/iscroll.js'
    import {lazyImg} from '../../../assets/js/utils';
    import {mapState,mapActions} from 'vuex'
    export default {
        name: "item",
        computed:{
            ...mapState({
                rightGoodsList:state=>state.goods.rightGoodsList
            })
        },
        methods:{
            ...mapActions({
                getGoodsR:"goods/getGoodsR"
            })
        },
        created(){
            this.cid=this.$route.query.cid?this.$route.query.cid:"";
            this.getGoodsR({cid:this.cid,success:()=>{
                    this.$nextTick(()=>{
                        this.myScroll.refresh();
                        lazyImg()
                    })
                }})
        },
        mounted(){
            this.$refs['item-warp'].addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            this.myScroll= new IScroll(this.$refs['item-warp'], {
                scrollX : false,
                scrollY : true,
                preventDefault : false  //也是禁用父元素默认事件，与上面相同，但是ios或安卓上回出现兼容性的问题，用原始的dom方法
            });
            this.myScroll.on("scrollEnd",()=>{  //解决懒加载之后，下面的图片不加载的问题
                lazyImg();
            })
        },
        beforeRouteUpdate(to,from,next){
            this.cid=to.query.cid;
            this.getGoodsR({cid:this.cid,success:()=>{
                    this.$nextTick(()=>{
                        this.myScroll.refresh();
                        lazyImg()
                    })
                }});
            next()
        }
    }
</script>

<style scoped>
    .item-warp{width:100%;height:100%;overflow: hidden;position:relative;z-index:1}
    .item-up{width:93%;height: auto;margin-left:3%;overflow: hidden;background-color: #ffffff}
    .item-title{height:0.7rem;line-height:0.7rem;font-size:0.32rem;padding-left:5%;}
    .item{width:30%;height: 30%;float: left;margin-right: 0.11rem}
    .item img{display:block;width:1.2rem;height:1.1rem;margin:0.15rem auto 0.05rem}
    .item-tit{width:90%;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;margin:0 auto;font-size:0.24rem;height: 0.5rem;line-height: 0.5rem}
</style>