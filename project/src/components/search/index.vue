<template>
    <div class='search-component' v-show="isShow">
        <div class='search-header'>
            <div class='close' @click="onClose"></div>
            <div class='search-wrap'>
                <div class='search-input-wrap'>
                    <input type="text" class='search' placeholder="请输入宝贝名称" v-model="kwords" />
                </div>
                <button type="button" class='search-btn' @click="goSearch('/goods/search?'+kwords)"></button>
            </div>
        </div>
        <div class='search-main'>
            <div class='search-title-wrap' v-if="historyKwords.length>0">
                <div class='search-title'>最近搜索</div>
                <!--删除最近搜索-->
                <div class='bin' @click="delHistoryKwords()"></div>
            </div>
            <div class='search-keywords-wrap'>
                <div class='keywords' v-for="(item,index) in historyKwords" :key="index" @click="goSearch('/goods/search?kwords='+item,item)">{{item}}</div>
            </div>
        </div>
        <div class='search-main'>
            <div class='search-title-wrap'>
                <div class='search-title'>热门搜索</div>
            </div>
            <div class='search-keywords-wrap'>
                <div class='keywords' v-for="(item,index) in hotKword" :key="index" @click="goSearch('/goods/search?kwords='+item.title,item.title)">{{item.title}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapMutations,mapState,mapActions} from 'vuex';
    import {Dialog} from 'cube-ui';
    Vue.use(Dialog);
    export default {
        name: "search-comp",
        data(){
            return{
                kwords:"",
                historyKwordArr:this.historyKwords?historyKwords:[]
            }
        },
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            isLocal:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            ...mapState({
                historyKwords:state=>state.search.historyKwords,
                hotKword:state=>state.search.hotKword
            })
        },
        created(){ //因为return返回是异步的，初始创建时创建数据，如果数据不与标签连用的话
            this.historyKwordArr=this.historyKwords?this.historyKwords:[];
            this.getHotKwords()
        },
        methods:{
            ...mapMutations({
                getHistoryData:"search/getHistoryData",
                clearHistory:"search/clearHistory"
            }),
            ...mapActions({
                getHotKwords:"search/getHotKwords"
            }),
            onClose(){
                this.$emit("onClose");
            },
            goSearch(url,kwords){ //点击搜索按钮
                this.$emit("onClose"); //在搜索页面点击搜索时，还需要执行父子传值，这样下面的replace跳转后，子组件的v-show才能有回传的isShow的值
                this.addHistoryKwords(kwords);
                if(this.isLocal){
                    this.$router.replace(url)
                }else{
                    this.$router.push(url);
                }

            },
            addHistoryKwords(kwords){  //添加关键词到历史记录
                let tmpKwords=kwords || this.kwords || "";
                if(this.historyKwordArr.length>0&&tmpKwords){
                    for(let i=0;i<this.historyKwordArr.length;i++){
                        if(this.historyKwordArr[i]===tmpKwords){
                            this.historyKwordArr.splice(i--,1);
                        }
                    }
                }
                if(tmpKwords){
                    this.historyKwordArr.unshift(tmpKwords)
                }

               this.getHistoryData({historyKwords:this.historyKwordArr})
            },
            // 删除历史搜索关键词
            delHistoryKwords(){
                this.$createDialog({
                    type: 'confirm',
                    content: '确认要删除吗？',
                    confirmBtn: {
                        text: '确定',
                        active: true,
                        disabled: false,
                        href: 'javascript:;'
                    },
                    cancelBtn: {
                        text: '取消',
                        active: false,
                        disabled: false,
                        href: 'javascript:;'
                    },
                    onConfirm: () => {
                        this.clearHistory();
                        this.historyKwordArr=[]
                    }
                }).show()
            }
        }

    }
</script>

<style scoped>
    .search-component{width:100%;height:100%;position: fixed;z-index:99;left:0px;top:0px;background-color:#ffffff;}
    .search-component .search-header{width:100%;height:1rem;border-bottom:#EFEFEF solid 1px;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .search-component .search-header .close{width:0.5rem;height: 0.5rem;background-image:url("../../assets/images/common/search_x.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-left:0.2rem;margin-right:0.2rem;}
    .search-component .search-header .search-wrap{width:78%;height:0.64rem;border:#B2B2B2 solid 1px;border-radius: 0.1rem;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .search-component .search-header .search-wrap .search-input-wrap{width:85%;height:100%;border-right: #B2B2B2 solid 1px;}
    .search-component .search-header .search-wrap .search{width:80%;height:93%;margin-left:0.2rem;font-size:0.28rem;}
    .search-component .search-header .search-wrap .search-btn{width:0.5rem;height:0.5rem;background-image:url("../../assets/images/common/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;background-color:#ffffff;border:0px none;outline: none;margin-left:0.15rem;}

    .search-component .search-main{width:100%;margin-top:0.2rem;}
    .search-component .search-main .search-title-wrap{width:auto;display:flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;padding-left:0.4rem;padding-right:0.4rem;}
    .search-component .search-main .search-title-wrap .search-title{width:auto;font-size:0.28rem;}
    .search-component .search-main .search-title-wrap .bin{width:0.4rem;height:0.4rem;background-image:url('../../assets/images/common/bin.png');background-size:100%;background-repeat: no-repeat;background-position: center;}
    .search-component .search-main .search-keywords-wrap{width:auto;display:flex;display:-webkit-flex;justify-content: flex-start;-webkit-justify-content: flex-start;padding-left:0.4rem;padding-right:0.4rem;margin-top:0.3rem;flex-wrap: wrap;-webkit-flex-wrap: wrap;}
    .search-component .search-main .search-keywords-wrap .keywords{width:26%;height:0.6rem;color:#717376;border:#EFEFEF solid 1px;border-radius: 0.64rem;font-size:0.28rem;text-align: center;overflow:hidden;line-height:0.6rem;margin-right:1.3%;margin-left:1.3%;margin-bottom:0.2rem;padding-left:0.1rem;padding-right:0.1rem;}

</style>
