import config from '../../assets/js/conf/config.js';
import {request} from '../../assets/js/libs/request.js';

//获取评价信息
export function getViewsData(gid,page=1){
    return request(config.baseApi+"/home/reviews/index?gid="+gid+"&page="+page+"&token="+config.token);
}
