export const homeOwnershipOptions = [
  { value: "", label: "\u200b" },
  { value: "OWNER_FULLY_PAID", label: "Owned (Fully Paid)" },
  { value: "OWNER_MORTGAGED", label: "Owned (Mortgaged)" },
  { value: "RENTED", label: "Rented" },
  { value: "PARENTS", label: "Parents" },
  { value: "EMPLOYERS", label: "Employer's" },
  { value: "OTHERS", label: "Others" },
];

export const privatePropertyOwnershipOptions = [
  { value: false, label: "No" },
  { value: true, label: "Yes" },
];

export const sexOptions = [
  { value: "", label: "\u200b" },
  { value: "M", label: "MALE" },
  { value: "F", label: "FEMALE" },
  { value: "U", label: "UNKNOWN" },
];

export const residentialStatusOptions = [
  { value: "", label: "\u200b" },
  { value: "A", label: "Foreigner" },
  { value: "C", label: "Citizen" },
  { value: "P", label: "PR" },
];

export const maritalStatusOptions = [
  { value: "", label: "\u200b" },
  { value: "1", label: "SINGLE" },
  { value: "2", label: "MARRIED" },
  { value: "3", label: "WIDOWED" },
  { value: "5", label: "DIVORCED" },
];

export const highestEducationLevelOptions = [
  { value: "", label: "\u200b" },
  {
    value: "0",
    label: "NO FORMAL QUALIFICATION / PRE-PRIMARY / LOWER PRIMARY",
  },
  { value: "1", label: "PRIMARY" },
  { value: "2", label: "LOWER SECONDARY" },
  { value: "3", label: "SECONDARY" },
  { value: "4", label: "POST-SECONDARY (NON-TERTIARY): GENERAL & VOCATION" },
  { value: "5", label: "POLYTECHNIC DIPLOMA" },
  { value: "6", label: "PROFESSIONAL QUALIFICATION AND OTHER DIPLOMA" },
  { value: "7", label: "BACHELOR'S OR EQUIVALENT" },
  {
    value: "8",
    label:
      "POSTGRADUATE DIPLOMA / CERTIFICATE (EXCLUDING MASTER'S AND DOCTORATE)",
  },
  { value: "9", label: "MASTER'S AND DOCTORATE OR EQUIVALENT" },
  {
    value: "N",
    label:
      "MODULAR CERTIFICATION (NON-AWARD COURSES / NON-FULL QUALIFICATIONS)",
  },
];

export const typeOfHousingOptions = [
  { value: "", label: "\u200b" },
  { value: "121", label: "DETACHED HOUSE" },
  { value: "122", label: "SEMI-DETACHED HOUSE" },
  { value: "123", label: "TERRACE HOUSE" },
  { value: "131", label: "CONDOMINIUM" },
  { value: "132", label: "EXECUTIVE CONDOMINIUM" },
  { value: "139", label: "APARTMENT" },
];

export const typeOfHDBOptions = [
  { value: "", label: "\u200b" },
  { value: "111", label: "1-ROOM FLAT (HDB)" },
  { value: "112", label: "2-ROOM FLAT (HDB)" },
  { value: "113", label: "3-ROOM FLAT (HDB)" },
  { value: "114", label: "4-ROOM FLAT (HDB)" },
  { value: "115", label: "5-ROOM FLAT (HDB)" },
  { value: "116", label: "EXECUTIVE FLAT (HDB)" },
  { value: "118", label: "STUDIO APARTMENT (HDB)" },
];

export const nationalityOptions = [
  { value: "", label: "\u200b" },
  { value: "SG", label: "SINGAPORE CITIZEN" },
  // { value: "--", label: "--------" },
  { value: "AD", label: "ANDORRAN" },
  { value: "AE", label: "UNITED ARAB EMIRATES" },
  { value: "AF", label: "AFGHAN" },
  { value: "AG", label: "ANTIGUAN" },
  { value: "AL", label: "ALBANIAN" },
  { value: "AM", label: "ARMENIAN" },
  { value: "AO", label: "ANGOLAN" },
  { value: "AR", label: "ARGENTINIAN" },
  { value: "AT", label: "AUSTRIAN" },
  { value: "AU", label: "AUSTRALIAN" },
  { value: "AZ", label: "AZERBAIJANI" },
  { value: "BA", label: "BOSNIAN" },
  { value: "BB", label: "BARBADOS" },
  { value: "BD", label: "BANGLADESHI" },
  { value: "BE", label: "BELGIAN" },
  { value: "BF", label: "BURKINABE" },
  { value: "BG", label: "BULGARIAN" },
  { value: "BH", label: "BAHRAINI" },
  { value: "BI", label: "BURUNDIAN" },
  { value: "BJ", label: "BENINESE" },
  { value: "BL", label: "BELARUSSIAN" },
  { value: "BN", label: "BRUNEIAN" },
  { value: "BO", label: "BOLIVIAN" },
  { value: "BR", label: "BRAZILIAN" },
  { value: "BS", label: "BAHAMIAN" },
  { value: "BT", label: "BHUTANESE" },
  { value: "BU", label: "MYANMAR" },
  { value: "BW", label: "BOTSWANA" },
  { value: "BZ", label: "BELIZEAN" },
  { value: "CA", label: "CANADIAN" },
  { value: "CB", label: "CROATIAN" },
  { value: "CD", label: "DEMOCRATIC REPUBLIC OF THE CONGO" },
  { value: "CF", label: "CENTRAL AFRICAN REPUBLIC" },
  { value: "CG", label: "CONGOLESE" },
  { value: "CH", label: "SWISS" },
  { value: "CI", label: "IVORY COAST" },
  { value: "CL", label: "CHILEAN" },
  { value: "CM", label: "CAMEROONIAN" },
  { value: "CN", label: "CHINESE" },
  { value: "CO", label: "COLOMBIAN" },
  { value: "CR", label: "COSTA RICAN" },
  { value: "CU", label: "CUBAN" },
  { value: "CV", label: "CAPE VERDEAN" },
  { value: "CY", label: "CYPRIOT" },
  { value: "CZ", label: "CZECH" },
  { value: "DG", label: "GERMAN" },
  { value: "DJ", label: "DJIBOUTIAN" },
  { value: "DK", label: "DANISH" },
  { value: "DM", label: "DOMINICAN" },
  { value: "DO", label: "DOMINICAN (REPUBLIC)" },
  { value: "DZ", label: "ALGERIAN" },
  { value: "EC", label: "ECUADORIAN" },
  { value: "EG", label: "EGYPTIAN" },
  { value: "EN", label: "ESTONIAN" },
  { value: "ER", label: "ERITREAN" },
  { value: "ES", label: "SPANISH" },
  { value: "ET", label: "ETHIOPIAN" },
  { value: "FI", label: "FINNISH" },
  { value: "FJ", label: "FIJIAN" },
  { value: "FR", label: "FRENCH" },
  { value: "GA", label: "GABON" },
  { value: "GB", label: "BRITISH" },
  { value: "GC", label: "BRITISH OVERSEAS TERRITORIES CITIZEN" },
  { value: "GD", label: "GRENADIAN" },
  { value: "GE", label: "BRITISH OVERSEAS CITIZEN" },
  { value: "GG", label: "BRITISH NATIONAL OVERSEAS" },
  { value: "GH", label: "GHANAIAN" },
  { value: "GJ", label: "BRITISH PROTECTED PERSON" },
  { value: "GM", label: "GAMBIAN" },
  { value: "GN", label: "GUINEAN" },
  { value: "GO", label: "GEORGIAN" },
  { value: "GQ", label: "EQUATORIAL GUINEA" },
  { value: "GR", label: "GREEK" },
  { value: "GT", label: "GUATEMALAN" },
  { value: "GW", label: "GUINEAN (BISSAU)" },
  { value: "GY", label: "GUYANESE" },
  { value: "HK", label: "HONG KONG" },
  { value: "HN", label: "HONDURAN" },
  { value: "HT", label: "HAITIAN" },
  { value: "HU", label: "HUNGARIAN" },
  { value: "ID", label: "INDONESIAN" },
  { value: "IE", label: "IRISH" },
  { value: "IL", label: "ISRAELI" },
  { value: "IN", label: "INDIAN" },
  { value: "IQ", label: "IRAQI" },
  { value: "IR", label: "IRANIAN" },
  { value: "IS", label: "ICELANDER" },
  { value: "IT", label: "ITALIAN" },
  { value: "JM", label: "JAMAICAN" },
  { value: "JO", label: "JORDANIAN" },
  { value: "JP", label: "JAPANESE" },
  { value: "KA", label: "CAMBODIAN" },
  { value: "KE", label: "KENYAN" },
  { value: "KI", label: "KIRIBATI" },
  { value: "KM", label: "COMORAN" },
  { value: "KP", label: "KOREAN, NORTH" },
  { value: "KR", label: "KOREAN, SOUTH" },
  { value: "KW", label: "KUWAITI" },
  { value: "KY", label: "KYRGYZSTAN" },
  { value: "KZ", label: "KAZAKHSTANI" },
  { value: "LA", label: "LAOTIAN" },
  { value: "LB", label: "LEBANESE" },
  { value: "LC", label: "ST. LUCIA" },
  { value: "LH", label: "LITHUANIAN" },
  { value: "LI", label: "LIECHTENSTEINER" },
  { value: "LK", label: "SRI LANKAN" },
  { value: "LR", label: "LIBERIAN" },
  { value: "LS", label: "LESOTHO" },
  { value: "LU", label: "LUXEMBOURGER" },
  { value: "LV", label: "LATVIAN" },
  { value: "LY", label: "LIBYAN" },
  { value: "MA", label: "MOROCCAN" },
  { value: "MB", label: "MACEDONIAN" },
  { value: "MC", label: "MONACAN" },
  { value: "MD", label: "MOLDAVIAN" },
  { value: "MF", label: "MICRONESIAN" },
  { value: "MG", label: "MADAGASY" },
  { value: "MH", label: "MARSHALLESE" },
  { value: "MJ", label: "MONTENEGRIN" },
  { value: "ML", label: "MALIAN" },
  { value: "MN", label: "MONGOLIAN" },
  { value: "MO", label: "MACAO" },
  { value: "MR", label: "MAURITANEAN" },
  { value: "MT", label: "MALTESE" },
  { value: "MU", label: "MAURITIAN" },
  { value: "MV", label: "MALDIVIAN" },
  { value: "MW", label: "MALAWIAN" },
  { value: "MX", label: "MEXICAN" },
  { value: "MY", label: "MALAYSIAN" },
  { value: "MZ", label: "MOZAMBICAN" },
  { value: "NA", label: "NAMIBIAN" },
  { value: "NE", label: "NIGER" },
  { value: "NG", label: "NIGERIAN" },
  { value: "NI", label: "NICARAGUAN" },
  { value: "NO", label: "NORWEGIAN" },
  { value: "NP", label: "NEPALESE" },
  { value: "NR", label: "NAURUAN" },
  { value: "NT", label: "NETHERLANDS" },
  { value: "NZ", label: "NEW ZEALANDER" },
  { value: "OM", label: "OMANI" },
  { value: "PA", label: "PANAMANIAN" },
  { value: "PE", label: "PERUVIAN" },
  { value: "PG", label: "PAPUA NEW GUINEAN" },
  { value: "PH", label: "FILIPINO" },
  { value: "PK", label: "PAKISTANI" },
  { value: "PL", label: "POLISH" },
  { value: "PN", label: "PALESTINIAN" },
  { value: "PT", label: "PORTUGUESE" },
  { value: "PW", label: "PALAUAN" },
  { value: "PY", label: "PARAGUAYAN" },
  { value: "QA", label: "QATARI" },
  { value: "RF", label: "RUSSIAN" },
  { value: "RO", label: "ROMANIAN" },
  { value: "RS", label: "SERBIAN" },
  { value: "RW", label: "RWANDAN" },
  { value: "SA", label: "SAUDI ARABIAN" },
  { value: "SB", label: "SOLOMON ISLANDER" },
  { value: "SC", label: "SEYCHELLOIS" },
  { value: "SD", label: "SUDANESE" },
  { value: "SE", label: "SWEDISH" },
  { value: "SI", label: "SLOVENIAN" },
  { value: "SK", label: "SLOVAK" },
  { value: "SL", label: "SIERRA LEONE" },
  { value: "SM", label: "SAMMARINESE" },
  { value: "SN", label: "SENEGALESE" },
  { value: "SO", label: "SOMALI" },
  { value: "SR", label: "SURINAMER" },
  { value: "SS", label: "STATELESS" },
  { value: "ST", label: "SAO TOMEAN" },
  { value: "SV", label: "SALVADORAN" },
  { value: "SW", label: "KITTIAN & NEVISIAN" },
  { value: "SY", label: "SYRIAN" },
  { value: "SZ", label: "SWAZI" },
  { value: "TD", label: "CHADIAN" },
  { value: "TG", label: "TOGOLESE" },
  { value: "TH", label: "THAI" },
  { value: "TI", label: "TAJIKISTANI" },
  { value: "TM", label: "TURKMEN" },
  { value: "TN", label: "TUNISIAN" },
  { value: "TO", label: "TONGAN" },
  { value: "TP", label: "EAST TIMORESE" },
  { value: "TR", label: "TURK" },
  { value: "TT", label: "TRINIDADIAN & TOBAGONIAN" },
  { value: "TV", label: "TUVALU" },
  { value: "TW", label: "TAIWANESE" },
  { value: "TZ", label: "TANZANIAN" },
  { value: "UG", label: "UGANDAN" },
  { value: "UK", label: "BRITISH SUBJECT" },
  { value: "UN", label: "UNKNOWN" },
  { value: "UR", label: "UKRAINIAN" },
  { value: "US", label: "AMERICAN" },
  { value: "UY", label: "URUGUAYAN" },
  { value: "UZ", label: "UZBEKISTAN" },
  { value: "VA", label: "VATICAN CITY STATE (HOLY SEE)" },
  { value: "VC", label: "ST. VINCENTIAN" },
  { value: "VE", label: "VENEZUELAN" },
  { value: "VN", label: "VIETNAMESE" },
  { value: "VU", label: "NI-VANUATU" },
  { value: "WS", label: "SAMOAN" },
  { value: "XB", label: "REFUGEE (XXB)" },
  { value: "XC", label: "REFUGEE (OTHER THAN XXB)" },
  { value: "YM", label: "YEMENI" },
  { value: "ZA", label: "SOUTH AFRICAN" },
  { value: "ZM", label: "ZAMBIAN" },
  { value: "ZW", label: "ZIMBABWEAN" },
];

export const raceOptions = [
  { value: "", label: "\u200b" },
  { value: "CN", label: "CHINESE" },
  { value: "MY", label: "MALAY" },
  { value: "IN", label: "INDIAN" },
  // { value: "--", label: "--------" },
  { value: "AB", label: "ANGLO BURMESE" },
  { value: "AC", label: "ANGLO CHINESE" },
  { value: "AD", label: "AMERINDIAN" },
  { value: "AF", label: "AFRICAN" },
  { value: "AG", label: "AFGHAN" },
  { value: "AH", label: "ANGLO THAI" },
  { value: "AI", label: "ANGLO INDIAN" },
  { value: "AJ", label: "ACHEHNESE" },
  { value: "AL", label: "ALBANIAN" },
  { value: "AM", label: "ARMENIAN" },
  { value: "AN", label: "ANNAMITE" },
  { value: "AO", label: "AMBONESE" },
  { value: "AP", label: "ANGLO FILIPINO" },
  { value: "AR", label: "ARAB" },
  { value: "AS", label: "ASSAMI" },
  { value: "AT", label: "AUSTRIAN" },
  { value: "AU", label: "AUSTRALIAN" },
  { value: "AX", label: "ANGLO SAXON" },
  { value: "AY", label: "ARYAN" },
  { value: "AZ", label: "AZERI" },
  { value: "BA", label: "BATAK" },
  { value: "BB", label: "BULGARIAN" },
  { value: "BC", label: "BUTONESE" },
  { value: "BD", label: "BANGLADESHI" },
  { value: "BE", label: "BELGIAN" },
  { value: "BF", label: "BAJAU" },
  { value: "BG", label: "BUGIS" },
  { value: "BH", label: "BURGHER" },
  { value: "BI", label: "BENGALI" },
  { value: "BJ", label: "BANJARESE" },
  { value: "BK", label: "BAMAR" },
  { value: "BL", label: "BANGALA" },
  { value: "BM", label: "BALINESE" },
  { value: "BN", label: "BHUTANESE" },
  { value: "BO", label: "BANTEN" },
  { value: "BQ", label: "BASQUE" },
  { value: "BR", label: "BRAHMIN" },
  { value: "BS", label: "BISAYA" },
  { value: "BT", label: "BRITISH" },
  { value: "BU", label: "BURMESE" },
  { value: "BV", label: "BOSNIAK" },
  { value: "BW", label: "BETAWI" },
  { value: "BY", label: "BOYANESE" },
  { value: "BZ", label: "BRAZILIAN" },
  { value: "CA", label: "CAUCASIAN" },
  { value: "CB", label: "CANADIAN" },
  { value: "CC", label: "CAPE COLOURED" },
  { value: "CD", label: "CAMBODIAN" },
  { value: "CE", label: "CEYLONESE" },
  { value: "CF", label: "CORNISH" },
  { value: "CG", label: "CREOLE" },
  { value: "CH", label: "SWISS" },
  { value: "CI", label: "CROAT" },
  { value: "CJ", label: "CHAMORRO" },
  { value: "CM", label: "CEYLON MOOR" },
  // { value: 'CN', label: 'CHINESE' },
  { value: "CO", label: "COCOS" },
  { value: "CR", label: "CARIBBEAN" },
  { value: "CS", label: "CZECHOSLOVAK" },
  { value: "CZ", label: "CZECH" },
  { value: "DA", label: "DANE" },
  { value: "DB", label: "DUTCH BURGHER" },
  { value: "DH", label: "BIDAYUH" },
  { value: "DS", label: "DUSUN" },
  { value: "DU", label: "DUTCH" },
  { value: "DY", label: "DAYAK" },
  { value: "EL", label: "ENGLISH" },
  { value: "ER", label: "EUROPEAN" },
  { value: "ES", label: "SPANISH" },
  { value: "ET", label: "ETHIOPIAN" },
  { value: "EU", label: "EURASIAN" },
  { value: "EY", label: "EGYPTIAN" },
  { value: "FI", label: "FINN" },
  { value: "FJ", label: "FIJIAN" },
  { value: "FM", label: "FLEMISH" },
  { value: "FR", label: "FRENCH" },
  { value: "GA", label: "GOAN" },
  { value: "GE", label: "GUJARATI" },
  { value: "GH", label: "GHANAIAN" },
  { value: "GK", label: "GURKHA" },
  { value: "GM", label: "GERMAN" },
  { value: "GO", label: "GOANESE" },
  { value: "GR", label: "GREEK" },
  { value: "HA", label: "HAITIAN" },
  { value: "HI", label: "HISPANIC" },
  { value: "HO", label: "HOLLANDER" },
  { value: "HT", label: "HINDUSTANI" },
  { value: "HU", label: "HUNGARIAN" },
  { value: "HW", label: "HAWAIIAN" },
  { value: "IA", label: "IRANIAN" },
  { value: "IB", label: "IBAN" },
  { value: "ID", label: "INDONESIAN" },
  { value: "IK", label: "ISOKO" },
  { value: "IL", label: "ISRAELI" },
  // { value: 'IN', label: 'INDIAN' },
  { value: "IQ", label: "IRAQI" },
  { value: "IR", label: "IRISH" },
  { value: "IS", label: "ICELANDER" },
  { value: "IT", label: "ITALIAN" },
  { value: "IU", label: "INUIT" },
  { value: "JA", label: "JAVANESE" },
  { value: "JK", label: "JAKUN" },
  { value: "JM", label: "JAMAICAN" },
  { value: "JO", label: "JORDANIAN" },
  { value: "JP", label: "JAPANESE" },
  { value: "JW", label: "JEW" },
  { value: "KA", label: "KACHIN" },
  { value: "KB", label: "KHASI" },
  { value: "KC", label: "KAYAH" },
  { value: "KD", label: "KAYIN" },
  { value: "KE", label: "KENYAN" },
  { value: "KF", label: "KINH" },
  { value: "KG", label: "KYRGYZ" },
  { value: "KH", label: "KHMER" },
  { value: "KI", label: "KENYAH" },
  { value: "KK", label: "KAZAKH" },
  { value: "KL", label: "KELABIT" },
  { value: "KM", label: "KAMPUCHEAN" },
  { value: "KN", label: "KAREN" },
  { value: "KR", label: "KOREAN" },
  { value: "KY", label: "KAYAN" },
  { value: "KZ", label: "KADAZAN" },
  { value: "LA", label: "LAO" },
  { value: "LB", label: "LEBANESE" },
  { value: "LI", label: "LITHUANIAN" },
  { value: "LK", label: "SRI LANKAN" },
  { value: "LT", label: "LATIN" },
  { value: "LV", label: "LATVIAN" },
  { value: "LX", label: "LUXEMBOURGER" },
  { value: "LY", label: "LIBYAN" },
  { value: "MA", label: "MADURESE" },
  { value: "MB", label: "MALABARI" },
  { value: "MC", label: "MAGYARS" },
  { value: "MD", label: "MOLDAVIAN" },
  { value: "ME", label: "MINANGKABAU" },
  { value: "MF", label: "MANX" },
  { value: "MG", label: "MALAGASY" },
  { value: "MH", label: "MAHRATTA" },
  { value: "MI", label: "MAORI" },
  { value: "MJ", label: "MURUT" },
  { value: "MK", label: "MAKASARESE" },
  { value: "ML", label: "MALDIVIAN" },
  { value: "MM", label: "MALAYALEE" },
  { value: "MN", label: "MELANESIAN" },
  { value: "MO", label: "MONGOLIAN" },
  { value: "MP", label: "MANIPURI" },
  { value: "MQ", label: "MESTIZO" },
  { value: "MR", label: "MARATHI" },
  { value: "MS", label: "METIS" },
  { value: "MT", label: "MALTESE" },
  { value: "MU", label: "MAURITIAN" },
  { value: "MV", label: "MON" },
  { value: "MW", label: "MOROCCAN" },
  { value: "MX", label: "MEXICAN" },
  // { value: 'MY', label: 'MALAY' },
  { value: "MZ", label: "MELANAU" },
  { value: "NA", label: "NAGA" },
  { value: "NG", label: "NEGRO" },
  { value: "NI", label: "NIGERIAN" },
  { value: "NL", label: "NETHERLANDER" },
  { value: "NO", label: "NORWEGIAN" },
  { value: "NP", label: "NEPALESE" },
  { value: "NR", label: "NAURUAN" },
  { value: "NW", label: "NEWAR" },
  { value: "NZ", label: "NEW ZEALANDER" },
  { value: "PA", label: "PENAN" },
  { value: "PB", label: "PALESTINE" },
  { value: "PC", label: "POLISH" },
  { value: "PE", label: "PERSIAN" },
  { value: "PH", label: "FILIPINO" },
  { value: "PJ", label: "PUNJABI" },
  { value: "PK", label: "PAKISTANI" },
  { value: "PL", label: "POLE" },
  { value: "PN", label: "PATHAN" },
  { value: "PO", label: "PORTUGUESE" },
  { value: "PR", label: "PERUVIAN" },
  { value: "PS", label: "PARSEE" },
  { value: "PY", label: "POLYNESIAN" },
  { value: "RJ", label: "RAJPUT" },
  { value: "RK", label: "RAKHINE" },
  { value: "RO", label: "ROMANIAN" },
  { value: "RU", label: "RUSSIAN" },
  { value: "SA", label: "SINO KADAZAN" },
  { value: "SB", label: "SAMMARINESE" },
  { value: "SC", label: "SCOT" },
  { value: "SD", label: "SINDHI" },
  { value: "SE", label: "SWEDE" },
  { value: "SF", label: "SERBIA/MONTENGERIN" },
  { value: "SG", label: "SAMOAN" },
  { value: "SH", label: "SHAN" },
  { value: "SI", label: "SINHALESE" },
  { value: "SJ", label: "SINO JAPANESE" },
  { value: "SK", label: "SIKH" },
  { value: "SL", label: "SLOVAK" },
  { value: "SM", label: "SUMATRAN" },
  { value: "SN", label: "SINO INDIAN" },
  { value: "SO", label: "SOMALI" },
  { value: "SQ", label: "SLAVIC" },
  { value: "SR", label: "SERANI" },
  { value: "SS", label: "SUNDANESE" },
  { value: "SU", label: "SUDANESE" },
  { value: "SW", label: "SWEDISH" },
  { value: "SY", label: "SEYCHELLOIS" },
  { value: "TE", label: "TELUGU" },
  { value: "TH", label: "THAI" },
  { value: "TI", label: "TIBETAN" },
  { value: "TJ", label: "TAJIK" },
  { value: "TM", label: "TAMIL" },
  { value: "TN", label: "TURKMEN" },
  { value: "TO", label: "TONGAN" },
  { value: "TP", label: "TIMOR" },
  { value: "TR", label: "TURK" },
  { value: "UN", label: "UNKNOWN" },
  { value: "UR", label: "UKRAINIAN" },
  { value: "US", label: "AMERICAN" },
  { value: "UY", label: "UYGHUR" },
  { value: "UZ", label: "UZBEK" },
  { value: "VE", label: "VENEZUELAN" },
  { value: "VN", label: "VIETNAMESE" },
  { value: "WE", label: "WELSH" },
  { value: "XD", label: "OTHER INDONESIAN" },
  { value: "XE", label: "OTHER EURASIAN" },
  { value: "XI", label: "OTHER INDIAN" },
  { value: "XX", label: "OTHERS" },
  { value: "YU", label: "YUGOSLAV" },
  { value: "ZW", label: "ZIMBABWEAN" },
];

export const countryOfBirthOptions = [
  { value: "", label: "\u200b" },
  { value: "SG", label: "SINGAPORE" },
  // { value: "--", label: "--------" },
  { value: "AB", label: "ARUBA" },
  { value: "AD", label: "ANDORRA" },
  { value: "AE", label: "UNITED ARAB EMIRATES" },
  { value: "AF", label: "AFGHANISTAN" },
  { value: "AG", label: "ANTIGUA" },
  { value: "AI", label: "ANGUILLA" },
  { value: "AL", label: "ALBANIA" },
  { value: "AM", label: "ARMENIA" },
  { value: "AN", label: "NETHERLANDS ANTILILLES" },
  { value: "AO", label: "ANGOLA" },
  { value: "AR", label: "ARGENTINA" },
  { value: "AS", label: "AMERICAN SAMOA" },
  { value: "AT", label: "AUSTRIA" },
  { value: "AU", label: "AUSTRALIA" },
  { value: "AZ", label: "AZERBAIJAN" },
  { value: "BA", label: "BOSNIA-HERZEGOVINA" },
  { value: "BB", label: "BARBADOS" },
  { value: "BD", label: "BANGLADESH" },
  { value: "BE", label: "BELGIUM" },
  { value: "BF", label: "BURKINA FASO" },
  { value: "BG", label: "BULGARIA" },
  { value: "BH", label: "BAHRAIN" },
  { value: "BI", label: "BURUNDI" },
  { value: "BJ", label: "BENIN" },
  { value: "BL", label: "BELARUS" },
  { value: "BM", label: "BERMUDA" },
  { value: "BN", label: "BRUNEI" },
  { value: "BO", label: "BOLIVIA" },
  { value: "BQ", label: "BRITISH ANTARCTIC TERRITORY" },
  { value: "BR", label: "BRAZIL" },
  { value: "BS", label: "BAHAMAS" },
  { value: "BT", label: "BHUTAN" },
  { value: "BU", label: "MYANMAR" },
  { value: "BW", label: "BOTSWANA" },
  { value: "BZ", label: "BELIZE" },
  { value: "CA", label: "CANADA" },
  { value: "CB", label: "CROATIA" },
  { value: "CC", label: "COCOS KEELING ISLAND" },
  { value: "CD", label: "CHANNEL ISLANDS" },
  { value: "CF", label: "CENTRAL AFRICAN REPUBLIC" },
  { value: "CG", label: "CONGO" },
  { value: "CH", label: "SWITZERLAND" },
  { value: "CI", label: "IVORY COAST" },
  { value: "CK", label: "COOK ISLANDS" },
  { value: "CL", label: "CHILE" },
  { value: "CM", label: "CAMEROON" },
  { value: "CN", label: "CHINA" },
  { value: "CO", label: "COLOMBIA" },
  { value: "CR", label: "COSTA RICA" },
  { value: "CT", label: "CANTON & ENDERBURY ISLANDS" },
  { value: "CU", label: "CUBA" },
  { value: "CV", label: "CAPE VERDE" },
  { value: "CX", label: "CHRISTMAS ISLAND" },
  { value: "CY", label: "CYPRUS" },
  { value: "CZ", label: "CZECH REPUBLIC" },
  { value: "DG", label: "GERMANY" },
  { value: "DJ", label: "DJIBOUTI" },
  { value: "DK", label: "DENMARK" },
  { value: "DM", label: "DOMINICA" },
  { value: "DO", label: "DOMINICAN REPUBLIC" },
  { value: "DZ", label: "ALGERIA" },
  { value: "EC", label: "ECUADOR" },
  { value: "EG", label: "EGYPT" },
  { value: "EH", label: "WESTERN SAHARA" },
  { value: "EN", label: "ESTONIA" },
  { value: "ER", label: "ERITREA" },
  { value: "ES", label: "SPAIN" },
  { value: "ET", label: "ETHIOPIA" },
  { value: "FI", label: "FINLAND" },
  { value: "FJ", label: "FIJI" },
  { value: "FK", label: "FALKLAND ISLANDS" },
  { value: "FO", label: "FAEROE ISLANDS" },
  { value: "FQ", label: "FRENCH SOUTHERN & ANTARCTIC TERRITORIES" },
  { value: "FR", label: "FRANCE" },
  { value: "GA", label: "GABON" },
  { value: "GB", label: "UNITED KINGDOM" },
  { value: "GD", label: "GRENADA" },
  { value: "GF", label: "FRENCH GUIANA" },
  { value: "GH", label: "GHANA" },
  { value: "GI", label: "GIBRALTAR" },
  { value: "GK", label: "GUERNSEY" },
  { value: "GL", label: "GREENLAND" },
  { value: "GM", label: "GAMBIA" },
  { value: "GN", label: "GUINEA" },
  { value: "GO", label: "GEORGIA" },
  { value: "GP", label: "GUADELOUPE" },
  { value: "GQ", label: "EQUATORIAL GUINEA" },
  { value: "GR", label: "GREECE" },
  { value: "GT", label: "GUATEMALA" },
  { value: "GU", label: "GUAM" },
  { value: "GW", label: "GUINEA-BISSAU" },
  { value: "GY", label: "GUYANA" },
  { value: "GZ", label: "GAZA" },
  { value: "HK", label: "HONG KONG" },
  { value: "HM", label: "HEARD & MCDONALD ISLAND" },
  { value: "HN", label: "HONDURAS" },
  { value: "HS", label: "HONG KONG SAR" },
  { value: "HT", label: "HAITI" },
  { value: "HU", label: "HUNGARY" },
  { value: "HV", label: "UPPER VOLTA" },
  { value: "ID", label: "INDONESIA" },
  { value: "IE", label: "IRELAND" },
  { value: "IL", label: "ISRAEL" },
  { value: "IN", label: "INDIA" },
  { value: "IO", label: "BRITISH INDIAN OCEAN TERRITORY" },
  { value: "IQ", label: "IRAQ" },
  { value: "IR", label: "IRAN" },
  { value: "IS", label: "ICELAND" },
  { value: "IT", label: "ITALY" },
  { value: "JM", label: "JAMAICA" },
  { value: "JO", label: "JORDAN" },
  { value: "JP", label: "JAPAN" },
  { value: "JT", label: "JOHNSTON ISLAND" },
  { value: "KA", label: "CAMBODIA" },
  { value: "KE", label: "KENYA" },
  { value: "KG", label: "KIRGHIZIA" },
  { value: "KI", label: "KIRIBATI" },
  { value: "KM", label: "COMOROS" },
  { value: "KN", label: "ST. KITTS-NEVIS" },
  { value: "KP", label: "KOREA, NORTH" },
  { value: "KR", label: "KOREA, SOUTH" },
  { value: "KS", label: "KYRGYZSTAN" },
  { value: "KV", label: "KOSOVO" },
  { value: "KW", label: "KUWAIT" },
  { value: "KY", label: "CAYMAN ISLANDS" },
  { value: "KZ", label: "KAZAKHSTAN" },
  { value: "LA", label: "LAOS" },
  { value: "LB", label: "LEBANON" },
  { value: "LC", label: "ST. LUCIA" },
  { value: "LH", label: "LITHUANIA" },
  { value: "LI", label: "LIECHTENSTEIN" },
  { value: "LK", label: "SRI LANKA" },
  { value: "LR", label: "LIBERIA" },
  { value: "LS", label: "LESOTHO" },
  { value: "LU", label: "LUXEMBOURG" },
  { value: "LV", label: "LATVIA" },
  { value: "LY", label: "LIBYA" },
  { value: "MA", label: "MOROCCO" },
  { value: "MB", label: "MACEDONIA" },
  { value: "MC", label: "MONACO" },
  { value: "MD", label: "MOLDOVA" },
  { value: "ME", label: "MAYOTTE" },
  { value: "MF", label: "MACAU SAR" },
  { value: "MG", label: "MADAGASCAR" },
  { value: "MH", label: "MARSHALL ISLANDS" },
  { value: "MI", label: "MIDWAY ISLANDS" },
  { value: "MJ", label: "MONTENEGRO" },
  { value: "ML", label: "MALI" },
  { value: "MM", label: "ISLE OF MAN" },
  { value: "MN", label: "MONGOLIA" },
  { value: "MO", label: "MACAO" },
  { value: "MQ", label: "MARTINIQUE" },
  { value: "MR", label: "MAURITANIA" },
  { value: "MS", label: "MONTSERRAT" },
  { value: "MT", label: "MALTA" },
  { value: "MU", label: "MAURITIUS" },
  { value: "MV", label: "MALDIVES" },
  { value: "MW", label: "MALAWI" },
  { value: "MX", label: "MEXICO" },
  { value: "MY", label: "MALAYSIA" },
  { value: "MZ", label: "MOZAMBIQUE" },
  { value: "NA", label: "NAMIBIA" },
  { value: "NC", label: "NEW CALEDONIA" },
  { value: "NE", label: "NIGER" },
  { value: "NF", label: "NORFOLK ISLAND" },
  { value: "NG", label: "NIGERIA" },
  { value: "NI", label: "NICARAGUA" },
  { value: "NL", label: "NETHERLANDS" },
  { value: "NO", label: "NORWAY" },
  { value: "NP", label: "NEPAL" },
  { value: "NR", label: "NAURU" },
  { value: "NU", label: "NIUE ISLAND" },
  { value: "NZ", label: "NEW ZEALAND" },
  { value: "OM", label: "OMAN" },
  { value: "PA", label: "PANAMA" },
  { value: "PB", label: "PALESTINE" },
  { value: "PC", label: "PACIFIC ISLAND TRUST TERRITORY" },
  { value: "PE", label: "PERU" },
  { value: "PF", label: "FRENCH POLYNESIA" },
  { value: "PG", label: "PAPUA NEW GUINEA" },
  { value: "PH", label: "PHILIPPINES" },
  { value: "PK", label: "PAKISTAN" },
  { value: "PL", label: "POLAND" },
  { value: "PM", label: "ST. PIERRE & MIQUELON" },
  { value: "PN", label: "PITCAIRN ISLAND" },
  { value: "PR", label: "PUERTO RICO" },
  { value: "PT", label: "PORTUGAL" },
  { value: "PW", label: "PALAU" },
  { value: "PY", label: "PARAGUAY" },
  { value: "PZ", label: "PANAMA CANAL ZONE" },
  { value: "QA", label: "QATAR" },
  { value: "RE", label: "REUNION" },
  { value: "RF", label: "RUSSIA" },
  { value: "RO", label: "ROMANIA" },
  { value: "RS", label: "SERBIA" },
  { value: "RW", label: "RWANDA" },
  { value: "SA", label: "SAUDI ARABIA" },
  { value: "SB", label: "SOLOMON ISLANDS" },
  { value: "SC", label: "SEYCHELLES" },
  { value: "SD", label: "SUDAN" },
  { value: "SE", label: "SWEDEN" },
  { value: "SF", label: "SERBIA/MONTENEGRO" },
  // { value: 'SG', label: 'SINGAPORE' },
  { value: "SH", label: "ST. HELENA" },
  { value: "SI", label: "SLOVENIA" },
  { value: "SK", label: "SLOVAK REPUBLIC" },
  { value: "SL", label: "SIERRA LEONE" },
  { value: "SM", label: "SAN MARINO" },
  { value: "SN", label: "SENEGAL" },
  { value: "SO", label: "SOMALIA" },
  { value: "SR", label: "SURINAME" },
  { value: "ST", label: "SAO TOME & PRINCIPE" },
  { value: "SV", label: "EL SALVADOR" },
  { value: "SY", label: "SYRIA" },
  { value: "SZ", label: "SWAZILAND" },
  { value: "TC", label: "TURKS & CAICOS ISLANDS" },
  { value: "TD", label: "CHAD" },
  { value: "TE", label: "TIMOR" },
  { value: "TG", label: "TOGO" },
  { value: "TH", label: "THAILAND" },
  { value: "TI", label: "TAJIKISTAN" },
  { value: "TK", label: "TOKELAU ISLANDS" },
  { value: "TM", label: "TURKMENISTAN" },
  { value: "TN", label: "TUNISIA" },
  { value: "TO", label: "TONGA" },
  { value: "TP", label: "EAST TIMOR" },
  { value: "TR", label: "TURKEY" },
  { value: "TT", label: "TRINIDAD & TOBAGO" },
  { value: "TV", label: "TUVALU" },
  { value: "TW", label: "TAIWAN" },
  { value: "TZ", label: "TANZANIA" },
  { value: "UG", label: "UGANDA" },
  { value: "UN", label: "UNKNOWN" },
  { value: "UR", label: "UKRAINE" },
  { value: "US", label: "UNITED STATES" },
  { value: "UY", label: "URUGUAY" },
  { value: "UZ", label: "UZBEKISTAN" },
  { value: "VA", label: "VATICAN CITY STATE" },
  { value: "VC", label: "ST. VINCENT" },
  { value: "VE", label: "VENEZUELA" },
  { value: "VG", label: "BRITISH VIRGIN ISLANDS" },
  { value: "VI", label: "US VIRGIN ISLANDS" },
  { value: "VN", label: "VIETNAM" },
  { value: "VU", label: "VANUATU" },
  { value: "WF", label: "WALLIS AND FUTUNA" },
  { value: "WK", label: "WAKE ISLAND" },
  { value: "WM", label: "SAMOA" },
  { value: "XX", label: "OTHERS" },
  { value: "YM", label: "YEMEN" },
  { value: "YU", label: "YUGOSLAVIA" },
  { value: "ZA", label: "SOUTH AFRICA" },
  { value: "ZM", label: "ZAMBIA" },
  { value: "ZR", label: "ZAIRE" },
  { value: "ZW", label: "ZIMBABWE" },
];
