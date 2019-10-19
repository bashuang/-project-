<template>
    <div class="head-wrap">
        <div class="back" @click="$router.go(-1)"></div>
        <div class="title">{{title}}</div>
        <div class="rigth-btn" v-if="rightText?true:false" @click="rightClick()">{{rightText}}</div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props:{
            title:{
                type:String,
                default:""
            },
            rightText:{
                type:String,
                default:""
            }
        },
        mounted(){
            document.title=this.$route.meta.title;
        },
        methods:{
            rightClick(){
                this.$emit("rightClick");
            }
        }
    }
</script>

<style scoped>
.head-wrap{width:100%;height: 1rem;background-color: #ffffff;display: flex;border-bottom: 1px solid #efefef;}
.head-wrap .back{width:1rem;height: 1rem;background: url(../../assets/images/home/goods/back.png) no-repeat center;background-size: 80% 80%}
    .title{width:75%;height: 100%;font-size:0.36rem;text-align: center;line-height: 1rem;}
    .rigth-btn{width:auto;height:1rem;font-size:0.32rem;line-height: 1rem;}
</style>