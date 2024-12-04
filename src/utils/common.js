export function getMean(array) {
    const length = array.length;
    return array.reduce((a, b) => a + b) / length;
}

export function getStandardDeviation(array) {
    const length = array.length;
    const mean = getMean(array);
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / length);
}

export function formatNumber(amount) {
  let auxAmount=String(amount).includes(".")?amount:Number.parseFloat(amount);
    return auxAmount > 1 ? auxAmount.toFixed(5) : auxAmount;
}


export function removeTrailingZeros(num) {
  return parseFloat(num.toString());
}

  export function formatDecimalNumber(val, point) {
    if (val.toString().includes('.')) {
        const decimalPart = val.toString().split('.')[1];
        if (decimalPart.length > Number(point)) {
            return Number(val.toFixed(Number(point)));
        }
    }
    return val;
}

