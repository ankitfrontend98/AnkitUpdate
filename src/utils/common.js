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


/**
 * Converts a YYYYMMDDHHMMSS string to a normal timestamp
 * @param {string} datetimeString - The datetime string in YYYYMMDDHHMMSS format
 * @returns {string} - The formatted timestamp as YYYY-MM-DD HH:mm:ss
 */
export function convertToTimestamp(datetimeString) {
  if (!datetimeString || datetimeString.length !== 14) {
    throw new Error("Invalid datetime string format. Must be in YYYYMMDDHHMMSS format.");
  }

  const year = datetimeString.slice(0, 4);
  const month = datetimeString.slice(4, 6) - 1; // Months are 0-based in JavaScript
  const day = datetimeString.slice(6, 8);
  const hour = datetimeString.slice(8, 10);
  const minute = datetimeString.slice(10, 12);
  const second = datetimeString.slice(12, 14);

  const date = new Date(year, month, day, hour, minute, second);
  console.log(date)

  // Format the date using Moment.js
  return date;
}
