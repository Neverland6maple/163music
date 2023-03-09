export default (time)=>{
    const minReg = /.*\:/;
    const secondReg = /:.*\./;
    const msReg = /\./;

    const min = parseInt(time.match(minReg)[0]);
    let second = parseInt(time.match(secondReg)[0].slice(1,3));
    const ms = parseInt(time.slice(time.match(msReg).index + 1));
    if(min != 0){
        second += min * 60; 
    }
    return parseFloat(second + '.' + ms);
}