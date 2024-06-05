const FlagHelperList = [
    {   
        alpha_2_code: "GB",
        en_short_name: "UK",
        nationality: "British",
    },
    {   
        alpha_2_code: "US",
        en_short_name: "USA",
        nationality: "AMERICAN",
    },
    {
        alpha_2_code: "NL",
        en_short_name: "Dutch",
        nationality: "Netherlandic",
    },
    {
        alpha_2_code: "AE",
        en_short_name: "UAE",
        nationality: "Emirian",
    },
    {
        alpha_2_code: "KR",
        en_short_name: "Korea",
        nationality: "Korean",
    },
]

export function getAlphaCode(flags, value) {
    const flagsData = flags.filter(flag => 
        flag.en_short_name.toLowerCase() === value.toLowerCase() 
        || flag.nationality.toLowerCase() === value.toLowerCase()
    );

    if (flagsData.length === 1) return flagsData[0].alpha_2_code;
    else {
        const flagsHelperData = FlagHelperList.filter(flag => 
            flag.en_short_name.toLowerCase() === value.toLowerCase() ||
            flag.nationality.toLowerCase() === value.toLowerCase());

        return flagsHelperData.length === 1 ? flagsHelperData[0].alpha_2_code : value;
    }
}

export function setSearchData(value, table) {
    const search = value.toLowerCase();
    const filteredData = table.filter((el) => {
        if (search === '') {
            return el;
        }
        else {
            if (el.Driver){ 
                return el.Driver.givenName.toLowerCase().includes(search)
                    || el.Driver.familyName.toLowerCase().includes(search)
                    || el.Constructors[0].name.toLowerCase().includes(search)
            }else if(el.Constructor) {
                return el.Constructor.name.toLowerCase().includes(search)
            }else if(el.Circuit) {
                return el.Results[0].Driver.familyName.toLowerCase().includes(search)
                    || el.Circuit.circuitName.toLowerCase().includes(search)
                    || el.Circuit.Location.country.toLowerCase().includes(search)
            }
        }  
    })
    return filteredData;
}

export function getCellBackgroundColor(value) {
    let colorClass
    switch(value) {
        case '1':
            colorClass = "#ffe66aab";
            break;
        case '2':
            colorClass = "#e5e5edab";
            break;
        case '3':
            colorClass = "#ff9657ab";
            break;
        case '4':
            colorClass = "#8cea97ab";
            break;
        case '5':
            colorClass = "#cbecf7ab";
            break;
        default:
            colorClass = "#ffc0cbab";
    };
    return colorClass;
}

export function goToExternalLink(value) {
    window.open(value, "_blank");
}