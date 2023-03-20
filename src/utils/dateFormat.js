import padStart from "./padStart";
export default (date,cn)=>{
    const obj = new Date(date);
    const h = obj.getFullYear();
    const m = obj.getMonth()+1;
    const d = obj.getDate();
    if(cn){
        return `${h}年${padStart(m)}月${padStart(d)}日`
    }
    return `${h}-${padStart(m)}-${padStart(d)}`
}