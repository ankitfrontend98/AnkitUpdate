export function formatMoney(amount, locale = 'en-US', currency = 'USD') {
    return Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
}