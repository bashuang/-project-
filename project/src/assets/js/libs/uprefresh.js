/*eslint-disable*/
//禁用eslint
(function (global,document,factory) {
    //这个判断支持模块化比如react和vue
    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = factory(global,document);
    } else if ( typeof define == 'function' && define.amd ) {
        define( function () { return factory(global,document); } );
    } else if(typeof global != "undefined") {
        global.UpRefresh = factory(global,document);
    }
})(window, document,function (global,document) {
    var UpRefresh=function(){
        this.fnScrollBottom=null;
        this.eventScroll();
    };
    UpRefresh.prototype={
        init:function(opts,callback){
            if(opts instanceof Object) {//第一个参数如果是函数的话
                this.opts = opts;
                this.iMaxPage=this.opts.maxPage;
                this.fnCallback=callback;
                this.iOffsetBottom=this.opts.offsetBottom;
                this.iCurPage=this.opts.curPage;
            }

        },
        // 监听scroll事件
        eventScroll:function(){
            var _this=this;
            _this.fnScrollBottom=_this.scrollBottom.bind(this);
            global.addEventListener("scroll",_this.fnScrollBottom,false);
        },
        // 卸载，预卸载scroll事件，多页面开发没有用，在单页面有用
        uneventSrcoll:function(){
            var _this=this;
            // 1、卸载的事件，2、方法、3、阻止冒泡
            global.removeEventListener("scroll",_this.fnScrollBottom,false);
        },
        // 检测滚动条
        scrollBottom:function(){
            var _this=this;
            var bScroll=true;
            return (function(){ //函数节流 高阶函数(函数中的返回函数)
                if(!bScroll){
                    return;
                }
                bScroll=false;
                var timer=null;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    //整个页面滚动条的高度
                    var iScrollHeight=document.documentElement.scrollHeight || document.body.scrollHeight;
                    //滚动到当前的距离
                    var iScrollTop=document.documentElement.scrollTop || document.body.scrollTop;
                    //整个窗体的高度
                    var iWinHeight=document.documentElement.clientHeight || document.body.clientHeight;
                    if(iScrollHeight-(iWinHeight+iScrollTop)<=_this.iOffsetBottom){
                        if(_this.iCurPage<_this.iMaxPage) {
                            _this.iCurPage++;
                            _this.fnCallback(_this.iCurPage);
                        }
                    }
                    bScroll=true;
                },300);//与布尔值一起，防止循环多次执行
            })()
        }
    };
    return UpRefresh;
});
