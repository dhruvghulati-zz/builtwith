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

```bash
    # TechName => Technology Name
    # Company-Limit => hard limit for builtwith
    # Apollo-Enrichment-Flag = 1 => Enrich with apollo
    # Apollo-Enrichment-Flag = 0 => Do not enrich with apollo
    node main.js <TechName> <Company-Limit> <Apollo-Enrichment-Flag>

    node main.js Piano 1000 1
```

**PS:** If you want to test apollo enrichment for small number of companies, you can comment out the below line

```javascript
    const apolloReqList = t.filter(f => f.website != null)
    //if you want to test apollo for small number of companies
        .splice(0, 5) //<-- this line enables testing for apollo
```