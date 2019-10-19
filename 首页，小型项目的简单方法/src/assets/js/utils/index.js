import echo from '../libs/echo.js';
console.log(echo);
export function lazyImg() {
    echo.init({
        offset : 100,//可是区域多少像素可以被加载
        throttle : 0 //设置图片延迟加载的时间
    });
}
