const importRequest = require("./hubspot_import.json")
const importRequestEmails = require("./hubspot_import_emails.json")

const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ apiKey: process.env.HUBSPOT_API_KEY });

const crmImport = (fileStream) => {
    return hubspotClient.crm.imports.coreApi.create(fileStream, JSON.stringify(importRequest));
}

const crmEmailsImport = (fileStream) => {
    return hubspotClient.crm.imports.coreApi.create(fileStream, JSON.stringify(importRequestEmails));
}

module.exports = { crmImport, crmEmailsImport }