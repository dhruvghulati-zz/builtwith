require('dotenv').config();

const { listService } = require("./builtWith");
const { searchPeople, enrichPeople } = require("./apollo");
const { jsonToCsv } = require("./util");
const { crmImport, crmEmailsImport } = require("./hubspot")
const cliProgress = require('cli-progress');

const fs = require('fs');
const axios = require('axios').default;
const { exit } = require('process');

const OUT_FILE = process.env.OUT_FILE
const OUT_FILE_EMAILS = process.env.OUT_EMAILS

const APOLLO_COUNTRY_FILTER = process.env.APOLLO_COUNTRY_FILTER
const APOLLO_CONTACT_POSITIONS = process.env.APOLLO_CONTACT_POSITIONS.split(',')
const APOLLO_CONTACT_LIMIT = parseInt(process.env.APOLLO_CONTACT_LIMIT)

const apolloEnricher = async (domain) => {
    //search people on apollo
    const res = await searchPeople(domain, APOLLO_CONTACT_POSITIONS);

    const requestData = res.data.people
        //we only need results from specific countries 
        .filter(r => r.country === APOLLO_COUNTRY_FILTER)
        .map(r => {
            return {
                id: r.id,
                firstName: r.first_name,
                lastName: r.last_name
            }
        }).slice(0, APOLLO_CONTACT_LIMIT);
    // console.log(requestData);
    // console.log(requestData.length + " US contacts found")

    const requestTaskList = requestData.map(r => enrichPeople(r));

    const axiosResultList = await axios.all(requestTaskList);
    //TODO Need to associate the domain URL to a company ID in Hubspot
    //which should exist after this point since you added it
    //TODO then with company ID, need to create an ID for the contact
    //TODO then associate the contact ID with the company IDhttps://developers.hubspot.com/docs/api/crm/associations

    const enrichedCrmData = axiosResultList.map(res => {
        const person = res.data.person;
        return {
            email: person.email,
            telephones: person.organization.phone,
            firstname: person.first_name,
            lastname: person.last_name,
            from_apollo: true
        }
    })

    return enrichedCrmData;

}

if (process.argv[2] == undefined) {
    console.log(new Error("BuiltWith \"TECH\" parameter is not provided"));
    return;
}

if (process.argv[3] != undefined && isNaN(process.argv[3])) {
    console.log(new Error("Limit is not in correct format"))
    return;
}

console.log("Process Started")
console.log("Triggering builtWith service")

const main = async () => {
    const t = await listService([], process.argv[3]);

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

    //exract only emails
    var emails = t.map(x => {
        return { emails: x.emails.split(";").filter(t => t !== ''), telephones: x.telephones }
    }).map(p => p.emails.map(q => { return { email: q, telephones: p.telephones, firstname: null, lastname: null, from_apollo: false } })).flat();

    //add enriched apollo contacts
    if (process.argv[4] || 1 == 1) {
        const apolloBar = new cliProgress.SingleBar({ forceRedraw: true, stream: process.stdout }, cliProgress.Presets.shades_classic);
        const apolloReqList = t.filter(f => f.website != null)
            //if you want to test apollo for small number of companies
            .splice(0, 5)
        apolloBar.start(apolloReqList.length, 0)
        for (var item of apolloReqList) {
            //const item = apolloReqList[idx]
            try {
                //apollo enricher works here for domain
                var apolloRes = await apolloEnricher(item.website);
                //we push the enriched results to contacts array
                emails.push(...apolloRes)
            }
            catch (ex) {
                if (ex.response.status == 429) {
                    //if any error occurs on the apollo side, break the loop
                    console.error(ex.message)
                    apolloBar.stop()
                    break;
                }
                else
                    console.error(ex)
            }

            apolloBar.increment();
        }
        apolloBar.stop()
    }

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

    exit;
}


//apolloEnricher("unilever.com").then(r => console.log(r))

main().then()




// searchCompaniesNotEnriched().then(r => console.log(JSON.stringify(r.body)))
// .catch(err => console.error(err.response.body))