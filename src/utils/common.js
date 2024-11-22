export function getMean(array) {
    const length = array.length;
    return array.reduce((a, b) => a + b) / length;
};

export function getStandardDeviation(array) {
    const length = array.length;
    const mean = getMean(array);
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / length);
};

export function formatNumber(amount) {
    return amount > 1 ? amount.toFixed(5) : amount;
};

