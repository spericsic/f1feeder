const FlagHelperList = [
    {   
        alpha_2_code: "GB",
        en_short_name: "UK",
        nationality: "British",
    },
    {   
        alpha_2_code: "US",
        en_short_name: "USA",
        nationality: "United States",
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
    
    const flagsHelperData = FlagHelperList.filter(flag => 
        flag.en_short_name.toLocaleLowerCase() === value.toLocaleLowerCase() ||
        flag.nationality.toLowerCase() === value.toLocaleLowerCase());

    return flagsHelperData.length === 1 ? flagsHelperData.alpha_2_code : value;
}
