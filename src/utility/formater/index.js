 export function numberWithCommas(x) {
    return x.toFixed(2).split('.')[0].length > 3 ? x.toFixed(2).substring(0,x.toFixed(2).split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toFixed(2).substring(x.toFixed(2).split('.')[0].length-3): x.toFixed(2);
}

export function ConverFirstLatterToCapital (str){
    return (str.charAt(0).toUpperCase() + str.slice(1))
}