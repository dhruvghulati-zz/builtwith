const importRequest = require("./hubspot_import.json")
const importRequestEmails = require("./hubspot_import_emails.json")
//const importRequestProspects = require("./hubspot_import_prospects.json")

const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ apiKey: process.env.HUBSPOT_API_KEY });

const crmImport = (fileStream) => {
    return hubspotClient.crm.imports.coreApi.create(fileStream, JSON.stringify(importRequest));
}

const crmEmailsImport = (fileStream) => {
    return hubspotClient.crm.imports.coreApi.create(fileStream, JSON.stringify(importRequestEmails));
}

const createCompanies = (companies) => {
    const batchInputSimplePublicObjectInput = {
        inputs: companies.map(t => {
            return {
                properties: t
            }
        })
    };
    console.log(batchInputSimplePublicObjectInput)
    return hubspotClient.crm.companies.batchApi.create(batchInputSimplePublicObjectInput)
}

const searchCompaniesNotEnriched = () => {
    const publicObjectSearchRequest = {
        filterGroups: [{
            "filters": [{"propertyName": "contacts_enriched", "operator": "NOT_HAS_PROPERTY" }] }],
        sorts: ["domain"], properties: ["id", 'domain'], limit: 100, after: 0
    };
    return hubspotClient.crm.companies.searchApi.doSearch(publicObjectSearchRequest)
}



// const createContact = (req) => {
//     return hubspotClient.crm.contacts.
// }

// const batchInputPublicAssociation = { inputs: [{ "from": { "id": "53628" }, "to": { "id": "12726" }, "type": "contact_to_company" }] };
// const fromObjectType = "fromObjectType";
// const toObjectType = "toObjectType";

// try {
//     const apiResponse = await hubspotClient.crm.associations.batchApi.create(fromObjectType, toObjectType, batchInputPublicAssociation);
//     console.log(JSON.stringify(apiResponse.body, null, 2));
// } catch (e) {
//     e.message === 'HTTP request failed'
//         ? console.error(JSON.stringify(e.response, null, 2))
//         : console.error(e)
// }

// // const crmEmailsProspects = (fileStream) => {
//     return hubspotClient.crm.imports.coreApi.create(fileStream, JSON.stringify(importRequestProspects));
// }

// TODO put this in there crmEmailsProspects 

module.exports = { crmImport, crmEmailsImport, createCompanies, searchCompaniesNotEnriched }