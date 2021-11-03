# builtwith
Script to import builtwith lists into Hubspot

Open to either Python or NodeJS.

1. Extract all companies and contacts from BuiltWith in my account
2. Import those companies and contacts into Hubspot
3. Any fields that don't map to Hubspot fields, create a new field within the Group "BuiltWith"

Key API docs for exporting data for import.

https://api.builtwith.com/lists-api
https://github.com/zcaceres/builtwith-api
https://www.npmjs.com/package/builtwith-api

API docs for importing data into Hubspot
https://developers.hubspot.com/docs/api/crm/imports


# Running the program

Ensure you run `npm install` first and have node installed via `brew install node`.

Then, in your CLI, you can run the following command: `node main.js <TechName> <Company-Limit> <Apollo-Enrichment-Flag>` with the following definitions:

```bash
    # TechName => Technology Name, i.e. from builtwith, getting companies who use this technology in their stack
    # Company-Limit => hard limit for number of builtwith companies to add from a given list
    # Apollo-Enrichment-Flag = 1 => Enrich with apollo and get all the right emails of people who work in those companies
    # Apollo-Enrichment-Flag = 0 => Do not enrich with apollo, and thus don't spend any API calls
```

For example, `node main.js Piano 1000 1`.

**PS:** If you want to test apollo enrichment for all companies where apollo has contacts, you can comment out the below line

```javascript
    const apolloReqList = t.filter(f => f.website != null)
    //if you want to test apollo for small number of companies
        .splice(0, 5) //<-- this line enables testing for apollo
```
Note, some imports may fail with 429 errors, due to rate limits from either Hubspot's API, Builtwith or Apollo.

NB: Contacts are imported even if there are no emails for them into Hubspot, this should be fixed
