const fn = (obj)=>{
    if(obj instanceof Object){
        if(Array.isArray(obj)){
            const res = [];
            for(let i = 0;i<obj.length;i++){
                res[i] = fn(obj[i]);
            }
            return res;
        }else{
            const res = {};
            for(let k in obj){
                if(Object.prototype.hasOwnProperty.call(obj,k)){
                    res[k] = fn(obj[k])
                }
            }
            return res;
        }
    }else{
        return obj;
    }
}
export default fn;