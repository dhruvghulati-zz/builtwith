const axios = require("axios");
const { utcSecondsToDate } = require("./util");

const CLEARBIT_API_URL = process.env.CLEARBIT_API_URL;
const CLEARBIT_API_KEY = process.env.CLEARBIT_API_KEY;
const CLEARBIT_TECH = process.argv[2]
const parameters = `KEY=${CLEARBIT_API_KEY}&META=yes&TECH=${CLEARBIT_TECH}`

const REQUEST_URI = `${CLEARBIT_API_URL}?${parameters}`

const listService = (result, limit, offset) => {
    var requestUrl = typeof offset != 'undefined' ? REQUEST_URI + '&OFFSET=' + offset : REQUEST_URI;

    if (offset == 'END' || (limit && result.length > limit)) {
        return Promise.resolve(result);
    }

    return axios.get(requestUrl).then((r) => {
        if (typeof r.data == 'string') {
            return Promise.reject(r.data)
        }
        if (r.data.error) {
            return Promise.reject(r.data.error)
        }

        var nextOffset = r.data.NextOffset;

        var res = r.data.Results.map(i => {
            return {
                website: i.D,
                first_indexed: utcSecondsToDate(i.FI),
                last_indexed: utcSecondsToDate(i.LI),
                first_detected: utcSecondsToDate(i.FD),
                last_detected: utcSecondsToDate(i.LD),
                monthly_spend_avg: i.S,
                page_rank: i.A,
                tranco: i.Q,
                majestic: i.M,
                umbrella: i.U,
                company_name: (i.META || {}).CompanyName || "",
                city: (i.META || {}).City || "",
                state: (i.META || {}).State || "",
                postcode: (i.META || {}).Postcode || "",
                country: (i.META || {}).Country || "",
                vertical: (i.META || {}).Vertical || "",
                telephones: ((i.META || {}).Telephones || []).join(';'),
                email: ((i.META || {}).Emails || []).shift(),
                emails: ((i.META || {}).Emails || []).join(';'),
                instagram: ((i.META || {}).Social || []).filter(t => t.includes("instagram.com")).pop() || "",
                facebook: ((i.META || {}).Social || []).filter(t => t.includes("facebook.com")).pop() || "",
                twitter: ((i.META || {}).Social || []).filter(t => t.includes("twitter.com")).pop() || "",
                youtube: ((i.META || {}).Social || []).filter(t => t.includes("youtube.com")).pop() || "",
                tech: CLEARBIT_TECH
                //domain: i.D
            }
        });
        result.push(...res);
        console.log("number of records processed:", result.length);

        return listService(result, limit, nextOffset);
    });
}

module.exports = {listService }