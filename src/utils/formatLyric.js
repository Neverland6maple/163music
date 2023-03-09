import timeToMs from "./timeToMs";
export default (lyric)=>{
    if(!lyric) return {};
    const lineLyric = lyric.split(/\n/);
    const timeReg = /\d{2}:\d{2}.\d{2}/; 
    const lyricArr = [];
    for(let e of lineLyric){
        if(!e) continue;
        lyricArr.push({
            id:Math.random().toFixed(6) * 10 ** 6,
            lyricItem:e.split(']')[1],
            time:timeToMs(e.match(timeReg)[0]),
        }) 
    };
    return lyricArr;
}