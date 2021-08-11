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

// // const crmEmailsProspects = (fileStream) => {
//     return hubspotClient.crm.imports.coreApi.create(fileStream, JSON.stringify(importRequestProspects));
// }

// TODO put this in there crmEmailsProspects 

module.exports = { crmImport, crmEmailsImport}