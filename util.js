const dateformat = require("dateformat");

const jsonToCsv = (items) => {
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    return csv;
}

const utcSecondsToDate = (utcSeconds) => {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    return dateformat(d, 'dd/mm/yyyy')
}

module.exports = { jsonToCsv, utcSecondsToDate }