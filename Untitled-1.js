
fetch("https://api.hubspot.com/graphql/crm?portalId=6364338&clienttimeout=180000&hs_static_app=crm-index-ui&hs_static_app_version=2.641", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-hs-referer": "https://app.hubspot.com/contacts/6364338/objects/0-2/views/all/list",
        "x-hubspot-csrf-hubspotapi": "J04RKuavhX97kpeMhLD0CQ",
        "x-hubspot-static-app-info": "crm-index-ui@2.641",
        "cookie": "hubspotapi-prefs=0; hs_c2l=GNPP3AQiGQAQstEngOoO4He4DaGDt8LiU0jrjFy2c8s; hubspotutk=7859730f821b96d81c676e52a41ab35a; __hssrc=1; _gcl_au=1.1.836703407.1626883741; _ga=GA1.2.883068251.1626883741; IR_gbd=hubspot.com; _fbp=fb.1.1626883741119.763353449; _hjid=b458d63c-d88a-42ae-abd0-e38eadc140ba; _rdt_uuid=1626962919089.e586207e-4e13-4cc7-b9cd-ec8f0695ba61; __cfruid=e4f2f4c4431e1425910d41674429ffd0d79199b5-1627987364; _conv_r=s%3Awww.google.com*m%3Aorganic*t%3A*c%3A; cf_clearance=0DKWCduip9UoE1NbD4B4NVkOz8VMP2oQHj191qkTO2A-1630439832-0-150; hubspotapi-csrf=J04RKuavhX97kpeMhLD0CQ; csrf.app=J04RKuavhX97kpeMhLD0CQ; _gid=GA1.2.2040266728.1630440233; _hjAbsoluteSessionInProgress=0; __hstc=20629287.7859730f821b96d81c676e52a41ab35a.1626723879159.1630442879090.1630445715145.26; IR_PI=f65656c3-ea3d-11eb-bade-43ec22251f67%7C1630532126613; IR_12893=1630447073186%7C0%7C1630447073186%7C%7C; _conv_v=vi%3A1*sc%3A17*cs%3A1630442877*fs%3A1625829728*pv%3A39*seg%3A%7B10031564.1%7D*exp%3A%7B%7D*ps%3A1630440232; _conv_s=si%3A17*sh%3A1630442877319-0.14760572922905268*pv%3A10; __hssc=20629287.9.1630445715145; hubspotapi=AAccUfvW6zI18GhpmtmE5nBJ1qI_SAmUkiNpKEn5cnGuW-duzFDWjSRZxeV_89BRpigt-dYlED4FU2LEvhRFY4V6d_d2wuDUwNXeg09IrauwCUycXeyCuXjzyRALcueLulJYykWMjV4VnNFGMWtuj5QlytZezhbyOXwUCIN97H192uXjU_Ke8WAq9BkJOhbH2prToV6Rz4yyswBbrfDrjI3CMAq71ptOYPKh3uQ6FLUidXiV221DsxC--85yeHO5sv4LOv4iVkdQLuaNorgk8lszy1fw5xfswu56dx8LAuAG1iztskCNMHAOtgHXBhCYxqzQHUlTFURqnqFI0DZ-79eNhUV6giAS7KiVsX5RBcTj5liNSN9OkO7exJSA03Ld8QmJZJiSNx9p1I48Tako2ngFMtgaJ6vr4HkTrZPVS_2ZBIdXNeKRZ07Eh3IC8Y8XDtrHwEqXLVQn7DO59w8Wnla2Ow8m0I8Q4SGWnYxObm3ZZea3VpkQOySr6uwRWCT8a4tObdeLqAni"
    },
    "referrer": "https://api.hubspot.com/cors-preflight-iframe/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"operationName\":\"CrmIndexSearchQuery\",\"variables\":{\"count\":100,\"filterGroups\":[{\"filters\":[{\"operator\":\"NOT_HAS_PROPERTY\",\"property\":\"contacts_enriched\"}]}],\"objectTypeId\":\"0-2\",\"offset\":0,\"properties\":[\"city\",\"contacts_enriched\",\"country\",\"createdate\",\"domain\",\"hs_all_accessible_team_ids\",\"hs_all_owner_ids\",\"hs_all_team_ids\",\"hs_pipeline\",\"hubspot_owner_id\",\"hubspot_team_id\",\"industry\",\"lifecyclestage\",\"name\",\"notes_last_updated\",\"phone\",\"website\"],\"sorts\":[{\"property\":\"createdate\",\"order\":\"DESC\"},{\"property\":\"hs_object_id\",\"order\":\"DESC\"}]},\"query\":\"query CrmIndexSearchQuery($filterGroups: [FilterGroup!]!, $sorts: [Sort!], $query: String, $objectTypeId: String!, $properties: [String!]!, $count: Int, $offset: Int) {\\n  crmObjectsSearch(filterGroups: $filterGroups, sorts: $sorts, query: $query, type: $objectTypeId, count: $count, offset: $offset) {\\n    total\\n    offset\\n    results {\\n      ...CrmObjectFragment\\n      __typename\\n    }\\n    validationErrors {\\n      __typename\\n      ... on GenericValidationError {\\n        message\\n        __typename\\n      }\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment CrmObjectFragment on CrmObject {\\n  id\\n  objectId: id\\n  properties(names: $properties) {\\n    name\\n    value\\n    __typename\\n  }\\n  userPermissions {\\n    currentUserCanEdit\\n    currentUserCanDelete\\n    __typename\\n  }\\n  __typename\\n}\\n\"}",
    "method": "POST",
    "mode": "cors"
});
