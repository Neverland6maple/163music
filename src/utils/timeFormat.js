import padStart from "./padStart";
export default (dt)=>{
    if(isNaN(dt)) throw Error('In timeFormat ,arg is not a number');
    +dt;
    let afterFormat = Math.round(dt/1000);
    const m = parseInt(afterFormat / 60);
    const s = afterFormat % 60;
    return `${padStart(m)}:${padStart(s)}`;
};