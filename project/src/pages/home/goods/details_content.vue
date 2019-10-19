<template>
    <div class="page">
        <div class='content' v-html="detailsList.bodys">
        </div>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    export default {
        computed:{
            ...mapState({
                detailsList:state=>state.goods.detailsList
            })
        },
        methods:{
            ...mapActions({
                getDetail:"goods/getDetail"
            })
        },
        created(){
            this.getDetail({gid:this.$route.query.gid})
        }
    }
</script>

<style scoped>
    .page{margin-top:0.2rem;}
    .content{width:90%;margin:0 auto;font-size:0.32rem;line-height:0.5rem;}
</style>