export default (fn,time)=>{
    let timer = null;
    return function(){
        timer && clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(this,arguments);
            timer = null;
        },time);
    }
}