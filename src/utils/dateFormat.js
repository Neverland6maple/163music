import padStart from "./padStart";
export default (date,cn)=>{
    const obj = new Date(date);
    const y = obj.getFullYear();
    const m = obj.getMonth()+1;
    const d = obj.getDate();
    if(cn){
        const hour = obj.getHours();
        const min = obj.getMinutes();
        return `${y}年${padStart(m)}月${padStart(d)}日 ${padStart(hour)}:${padStart(min)}`
    }
    return `${y}-${padStart(m)}-${padStart(d)}`
}