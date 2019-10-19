<template>
<div class="classPage">
<div class="head">
    <div class="back" @click="goBack()"></div>
    <div class="searchBox">
        <input type="text" class="searchinp" placeholder="请输入宝贝名称">
    </div>
</div>

<div class="goods-class">
    <div ref="scrollClass" class="goods-menu">
        <div>
            <div ref="menu" :class="{menu:true,active:item.toRed}" v-for="(item,index) in classifyList" :key="index" @click="goPage('/goods/classify/item?cid='+item.cid,index)">{{item.title}}</div>

        </div>
    </div>
    <div class="class-item">
        <router-view></router-view>
    </div>
</div>
    <SearchComponent :isShow="isShow" @onClose="classIsShow=false"></SearchComponent>


</div>
</template>

<script>
    import SearchComponent from '../../../components/search';
    import IScroll from '../../../assets/js/libs/iscroll.js'
    import {mapState,mapActions} from 'vuex'
    export default {
        name: "classify",
        data(){
            return{
                isShow:false
            }
        },
        computed:{
            ...mapState({
                classifyList:state=>state.goods.classifyList
            })
        },
        components:{
            SearchComponent
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            },
            goPage(url,index){
                this.$router.replace(url);
                this.getRed({index:index});
                this.goScroll(index)
            },
            goScroll(index){
                let itemHeight=this.$refs['menu'][0].offsetHeight*index;
                let wrapHeight=this.$refs['scrollClass'].offsetHeight;
                let bottomHeight=this.$refs['scrollClass'].scrollHeight-itemHeight+this.$refs['menu'][0].offsetHeight;
                if(itemHeight>wrapHeight/3&&bottomHeight>=wrapHeight){
                    this.myScroll.scrollTo(0,-itemHeight,1000,IScroll.utils.ease.elastic);
                }
            },
            ...mapActions({
                getClassify:"goods/getClassify",
                getRed:"goods/getRed"
            })
        },
        created(){
            this.cid=this.$route.query.cid?this.$route.query.cid:"";
            this.getClassify({success:()=>{
                    this.$nextTick(()=>{
                        this.myScroll.refresh();//重新刷新这个方法
                    });
                    if(this.classifyList.length>0){
                        let index;
                        for(let i=0;i<this.classifyList.length;i++){
                            if(this.classifyList[i].cid==this.cid){
                                index=i;
                                break;
                            }
                        }
                        if(index){
                            this.getRed({index:index})
                        }
                    }
                }});

        },
        mounted(){
            document.title=this.$route.meta.title;
            this.$refs['scrollClass'].addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            this.myScroll= new IScroll(this.$refs['scrollClass'], {
                scrollX : false,
                scrollY : true,
                preventDefault : false  //也是禁用父元素默认事件，与上面相同，但是ios或安卓上回出现兼容性的问题，用原始的dom方法
            });
        }

    }
</script>

<style scoped>
    .classPage{width:100%;height: 100vh;background-color: #ffffff}
    .head{width:100%;height: 1rem;display: flex;border-bottom: 1px solid #EFEFEF;}

    .searchBox{width:73%;height:100%;line-height:1rem}
    .searchinp{width:100%;height:70%;border:0.02rem solid #B2B2B2;outline: none;border-radius: 0.1rem;font-size:0.32rem;text-indent:0.3rem}

    .goods-class{width:100%;height: 92.4vh;background-color:#ffffff;display: flex}
    .goods-menu{width:25%;height: 100%;overflow: hidden;position:relative;z-index:1;/*滑动必须有固定的高和相对定位，并且z-index必须写*/}
    .menu{width:100%;height: 0.8rem;text-align: center;line-height: 0.8rem;border-bottom: 1px solid #EFEFEF;overflow: hidden;font-size:0.28rem}
    .active{color:red}

    .class-item{width:75%;height: 100%;background-color: #EFEFEF}
</style>