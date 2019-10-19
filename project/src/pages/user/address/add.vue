<template>
    <div class="page">
        <HeaderComponent title="添加收货地址"></HeaderComponent>
        <div class='main'>
            <ul>
                <li>收货人</li>
                <li><input type="text" placeholder="收货人姓名"  v-model="name"/></li>
            </ul>
            <ul>
                <li>联系方式</li>
                <li><input type="text" placeholder="联系人手机号"   v-model="cellphone"/></li>
            </ul>
            <ul @click="showAddressPicker()">
                <li>所在地区</li>
                <li>
                    <input type="text" placeholder="请选择收货地址" class='area' readonly :value="showArea"/>
                </li>
            </ul>
            <ul>
                <li>详细地址</li>
                <li><input type="text" placeholder="街道详细地址"  v-model="address"/></li>
            </ul>
            <ul>
                <li>设置为默认地址</li>
                <li><input type="checkbox" checked v-model="isdefault"/></li>
            </ul>
            <button type="button" class='submit-save' @click="submitAdd()">保存</button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import HeaderComponent from '../../../components/header';
    import {mapActions,mapState} from 'vuex';
    import {safeUser} from '../../../assets/js/utils/index.js'; //单点登录
    import { provinceList, cityList, areaList } from '../../../assets/data/cube-data/area.js'
    import {CascadePicker,Toast} from 'cube-ui';
    Vue.use(CascadePicker);
    Vue.use(Toast);

    const addressData = provinceList;
    addressData.forEach(province => {
        province.children = cityList[province.value];
        province.children.forEach(city => {
            city.children = areaList[city.value]
        })
    });

    export default {
        components:{
            HeaderComponent
        },
        data(){
            return{
                showArea:"",
                province:"",
                city:"",
                area:"",
                name:"",
                cellphone:"",
                address:"",
                isdefault:""
            }
        },
        computed:{
            ...mapState({
                uid:state=>state.user.uid,
            })
        },
        methods:{
            ...mapActions({
                addAddress:"userAddress/addAddress"
            }),
            // 点击添加地址事件
            submitAdd(){
                if(this.name.match(/^\s*$/)){
                    this.$createToast({
                        txt:"请输入联系人",
                        type:"txt"
                    }).show();
                    return;
                }else if(this.cellphone.match(/^\s*$/)){
                    this.$createToast({
                        txt:"请输入联系方式",
                        type:"txt"
                    }).show();
                    return;
                }else if(this.address.match(/^\s*$/)){
                    this.$createToast({
                        txt:"请输入详细地址",
                        type:"txt"
                    }).show();
                    return;
                }
                this.addAddress({uid:this.uid,name:this.name,cellphone:this.cellphone,province:this.province,city:this.city,area:this.area,isdefault:this.isdefault?'1':'0',address:this.address,success:(res)=>{
                    if(res.code==200){
                        this.$router.go(-1)
                    }else{
                        this.$createToast({
                            txt:res.data,
                            type:"txt"
                        }).show();
                        return;
                    }
                }})

            },
            // cube-ui：展示地址选项
            showAddressPicker() {
                this.addressPicker.show()
            },
            // cube-ui：选择省市区执行的事件
            selectHandle(selectedVal, selectedIndex, selectedText){ //标号、索引、省市区
                this.showArea=selectedText[0]+" "+selectedText[1]+" "+selectedText[2];
                this.province=selectedText[0];
                this.city=selectedText[1];
                this.area=selectedText[2];
            }
        },
        created(){
            safeUser(this)
        },
        mounted () {
            this.addressPicker = this.$createCascadePicker({
                title: '选择所在地区',
                data: addressData,
                onSelect: this.selectHandle,
            })
        },
    }
</script>

<style scoped>

    .page{width:100%;height:100vh;overflow:hidden;background-color:#FFFFFF;}
    .main{width:100%;margin-top:0.2rem;}
    .main ul{width:100%;height:1.02rem;border-bottom: #EFEFEF 1px solid;display: flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .main ul li{font-size:0.32rem;margin-left:0.3rem;}
    .main ul li:nth-child(2){width:62%;height:100%;}
    .main ul li input[type='text']{width:100%;height:100%;font-size:0.32rem;}
    .main ul li .area{font-size:0.28rem!important;}
    .main ul li input[type='checkbox']{width:0.4rem;height:0.4rem;margin-top:0.3rem;}
    .main .submit-save{width:85%;height:0.8rem;background-color:#FCB40A;border-radius: 4px;margin:0 auto;display:block;border:0 none;outline:none;font-size:0.32rem;color:#FFFFFF;margin-top:0.4rem;}
</style>
