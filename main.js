require('dotenv').config();

const { listService } = require("./builtWith");
const { jsonToCsv } = require("./util");
const { crmImport, crmEmailsImport } = require("./hubspot")

const fs = require('fs');

const OUT_FILE = process.env.OUT_FILE
const OUT_FILE_EMAILS = process.env.OUT_EMAILS

if (process.argv[2] == undefined) {
    console.log(new Error("BuiltWith \"TECH\" parameter is not provided"));
    return;
}

console.log("Process Started")
console.log("Triggering builtWith service")
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

