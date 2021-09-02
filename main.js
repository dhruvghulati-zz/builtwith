require('dotenv').config();

const { listService } = require("./builtWith");
const { searchPeople, enrichPeople } = require("./apollo");
const { jsonToCsv } = require("./util");
const { crmImport, crmEmailsImport, createCompanies, searchCompaniesNotEnriched } = require("./hubspot")

const fs = require('fs');
const axios = require('axios').default;
const { create } = require('domain');

const OUT_FILE = process.env.OUT_FILE
const OUT_FILE_EMAILS = process.env.OUT_EMAILS

if (process.argv[2] == undefined) {
    console.log(new Error("BuiltWith \"TECH\" parameter is not provided"));
    return;
}

console.log("Process Started")
console.log("Triggering builtWith service")
if (false)
    listService([], process.argv[3])
        .then(t => {

            //convert json data into CSV
            var importsCsv = jsonToCsv(t);
            console.debug("convert builtwith json data to csv")

            //create writer to write string into file
            var writeStream = fs.createWriteStream(OUT_FILE);
            //write csv into file
            writeStream.write(importsCsv, process.env.FILE_ENCODING);
            //event: when write operation finishes do the import operation
            writeStream.on('finish', () => {
                //read the written file
                var stream = fs.createReadStream(OUT_FILE);

                //import the contacts and company data into system
                console.log("importing csv data into hubspot crm")
                crmImport(stream)
                    .then(p => console.log(p.body))
                    .catch(e => console.log(e))
            });
            //close the write stream
            writeStream.end();

            //create emails JSON
            // var emails = t.flatMap(x => x.emails.split(";"))
            //     .filter(x => x !== '')
            //     .map(p => { return { email: p } });
            var emails = t.map(x => {
                return { emails: x.emails.split(";").filter(t => t !== ''), telephones: x.telephones }
            }).map(p => p.emails.map(q => { return { email: q, telephones: p.telephones } })).flat();

            //convert emails json to csv
            console.debug("convert email json data to csv")
            var importsEmailsCsv = jsonToCsv(emails);

            //create write stream
            var writeStreamEmails = fs.createWriteStream(OUT_FILE_EMAILS);
            //start write operation
            writeStreamEmails.write(importsEmailsCsv, process.env.FILE_ENCODING);
            //when write operation finishes start the import operation
            writeStreamEmails.on('finish', () => {
                var stream = fs.createReadStream(OUT_FILE_EMAILS);

                //import the emails into contacts
                console.log("importing email csv into hubspot crm")
                crmEmailsImport(stream)
                    .then(p =>
                        console.log(p.body))
                    .catch(e => console.log(e))
            });
            //close the write stream
            writeStreamEmails.end();
        }).catch(e => console.error(e));

console.log("Triggering Apollo contacts search service")

if (false)
searchPeople("unilever.com", ["Manager", "Director"]).then((res) => {
    const requestData = res.data.people
        .filter(r => r.country === 'United States')
        .map(r => {
            return {
                id: r.id,
                firstName: r.first_name,
                lastName: r.last_name
            }
        }).slice(0, 50);
    console.log(requestData);
    console.log(requestData.length + " US contacts found")

    const requestTaskList = requestData.map(r => enrichPeople(r));

    axios.all(requestTaskList).then((arr) => {
        //TODO Need to associate the domain URL to a company ID in Hubspot
        //which should exist after this point since you added it
        //TODO then with company ID, need to create an ID for the contact
        //TODO then associate the contact ID with the company IDhttps://developers.hubspot.com/docs/api/crm/associations
        for (var o in arr) {
            enrichPeople(o);
        }
    })
})



searchCompaniesNotEnriched().then(r => console.log(JSON.stringify(r.body)))
.catch(err => console.error(err.response.body))