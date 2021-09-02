const axios = require("axios").default;

const APOLLO_API_URL = process.env.APOLLO_API_URL;
const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

const searchPeople = (companyURL, titles) => {
    const data = {
        api_key: APOLLO_API_KEY,
        q_organization_domains: "apollo.io\n" + companyURL,
        page: 1,
        person_titles: titles
    };
    return axios.post(APOLLO_API_URL + "mixed_people/search", data);
};

const enrichPeople = (params) => {
    const data = {
        api_key: APOLLO_API_KEY,
        id: params.id,
        first_name: params.firstName,
        last_name: params.lastName,
    };
    return axios.post(APOLLO_API_URL + "people/match", data);
};

module.exports = { searchPeople, enrichPeople }