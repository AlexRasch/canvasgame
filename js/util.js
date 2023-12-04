function GetRandomInt(iMin, iMax){
    var iMin = Math.ceil(iMin);
    var iMax = Math.floor(iMax);
    return Math.floor(Math.random() * (iMax - iMin) + iMin);
}


export { GetRandomInt };