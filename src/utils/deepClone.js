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
                res[k] = fn(obj[k])
            }
            return res;
        }
    }else{
        return obj;
    }
}
// console.log(fn([1,2,[3,[4,5,{a:[1,[,3,4]],b:'a',c:{a:2}}]]]));
export default fn;