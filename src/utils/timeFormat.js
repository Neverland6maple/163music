import padStart from "./padStart";
export default (dt)=>{
    +dt;
    let afterFormat = Math.round(dt/1000);
    const m = parseInt(afterFormat / 60);
    const s = afterFormat % 60;
    return `${padStart(m)}:${padStart(s)}`;
};