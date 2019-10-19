import config from '../../assets/js/conf/config.js';
import {request} from '../../assets/js/libs/request.js';

export function getClassifyData(){
    return request(config.baseApi+"/home/category/menu?token="+config.token);
}

//获取分类商品
export function getGoodsRData(cid){
    return request(config.baseApi+"/home/category/show?cid="+cid+"&token="+config.token)
}

//商品详情数据
export function getDetailData(gid){
    return request(config.baseApi+"/home/goods/info?gid="+gid+"&type=details&token="+config.token)
}

//商品规格
export function getSizeData(gid){
    return request(config.baseApi+"/home/goods/info?gid="+gid+"&type=spec&token="+config.token)
}
