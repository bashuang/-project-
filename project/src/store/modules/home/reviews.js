import {getViewsData} from '../../../api/home/reviews.js'

let modules={
    namespaced:true,
    state:{
        reviewsList:[],
        pageInfo:{}
    },
    mutations:{
        getViews(state,payload){
            getViewsData(payload.gid).then(res=>{
                if(res.code==200){
                    state.reviewsList=res.data;
                    state.pageInfo=res.pageinfo
                }else{
                    state.reviewsList=[];
                    state.pageInfo={pagesize:0,pagenum:1,page:1,total:0}
                }
                if(payload&&payload.success){
                    payload.success()
                }
            })
        },
        getViewsPage(state,payload){
            getViewsData(payload.gid,payload.page).then(res=>{
                if(res.code==200){
                    state.reviewsList.push(...res.data);
                }
            })
        }
    },
    actions:{
        getViews(conText,payload){
            conText.commit("getViews",payload)
        },
        getViewsPage(conText,payload){
            conText.commit("getViewsPage",payload)
        }
    }
};
export default modules;