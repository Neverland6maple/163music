export default (fn,time)=>{
    let now = new Date;
    return (...args)=>{
        const newTime = new Date;
        if(newTime - now >= time){
            now = newTime;
            return fn.apply(this,args);
        }
    }
}