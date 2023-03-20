export default (ar)=>{
    if(ar instanceof Array){
        const res = [];
        for(let i = 0;i<ar.length;i++){
            if(i > 0) res.push('/');
            res.push(ar[i]);
        }
        return res;
    }else if(ar instanceof Object){
        return [ar];
    }
}