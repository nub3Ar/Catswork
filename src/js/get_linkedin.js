// Source https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension

var url = document.URL

if (url.includes('linkedin')) {
    
    try{
        var name = document.getElementsByClassName("pv-top-card-section__name inline t-24 t-black t-normal").item(0).innerText.replace(/\s+/g, " ").trim();
    }
    catch(err) {
        var name = 'None'
    }

    try {
        var pos_company = document.getElementsByClassName("pv-top-card-section__headline mt1 t-18 t-black t-normal").item(0).innerText;
        if (pos_company.includes(' at ')) {
            pos_firm = pos_company.split(' at ')
        }
        else {
            pos_firm = pos_company.split(',')
        };
        var position = pos_firm[0]
        var company = pos_firm[1]
    }
    catch(err) {
        var position = 'None';
        var company = 'None';
    }

    try{
        var city = document.getElementsByClassName("pv-top-card-section__location t-16 t-black--light t-normal mt1 inline-block").item(0).innerText;
    }
    catch(err) {
        var city = 'None';
    }

    try {
        var education = document.getElementsByClassName("pv-entity__school-name t-16 t-black t-bold").item(0).innerText;
    }
    catch(err) {
        var education = 'None';
    }
    // constructs the array to autofill
    // [Name, firm, email, phone, industry, city, position, education, source, alt. contact, first contact date, scheduled, linkedin, notes]
    var info = [name, company, "None", "None",  "None", city, position, education, "LinkedIn",  "None", "None", "None", url, "None" ];
    JSON.stringify(info);
}

else {
false
}




