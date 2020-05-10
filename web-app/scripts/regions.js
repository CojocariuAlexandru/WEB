var attacksTypes = {
  "Hostage Taking (Kidnapping)": [],
  "Assassination": [],
  "Bombing/Explosion": [],
  "Facility/Infrastructure Attack": [],
  "Armed Assault": [],
  "Hijacking": [],
  "Unknown": [],
  "Unarmed Assault": [],
  "Hostage Taking (Barricade Incident)": []
};

var propExtent = {
  " Minor Damage": [],
  "Major Damage": [],
  "Catastrophic damages": [],
  "Unknown damages": []
};

var emptyObject = {};


var weaponSubtypes = {
  'Biological': [""],
  'Chemical': ["", "Explosive", "Poisoning"],
  'Explosives': ["", "Dynamite/TNT", "Grenade", "Landmine", "Letter Bomb", "Other Explosive Type", "Pipe Bomb", "Pressure Trigger", "Projectile (rockets, mortars, RPGs, etc.)", "Remote Trigger", "Sticky Bomb", "Suicide (carried bodily by human being)", "Time Fuse", "Unknown Explosive Type", "Unknown Gun Type", "Vehicle"],
  'Fake Weapons': [""],
  'Firearms': ["", "Automatic or Semi-Automatic Rifle", "Handgun", "Other Gun Type"]
};

var targetSubtypes = {
  'Abortion Related': ["Clinics", "Personnel"],
  'Airports & Aircraft': ["", "Aircraft (not at an airport)", "Airline Officer/Personnel", "Airport"],
  'Business': ["", "Bank/Commerce", "Construction", "Entertainment/Cultural/Stadium/Casino", "Farm/Ranch", "Gas/Oil/Electric", "Hotel/Resort", "Industrial/Textiles/Factory", "Legal Services", "Medical/Pharmaceutical", "Mining", "Multinational Corporation", "Oil Tanker", "Private Security Company/Firm", "Restaurant/Bar/Café", "Retail/Grocery/Bakery"],
  'Educational Institution': ["", "Other Personnel", "School/University/Educational Building", "Teacher/Professor/Instructor"],
  'Food or Water Supply': ["Food Supply", "Water Supply"],
  'Government (Diplomatic)': ["", "Diplomatic Personnel (outside of embassy, consulat...", "Embassy/Consulate", "International Organization (peacekeeper, aid agenc..."],
  'Government (General)': ["", "Election-related", "Government Building/Facility/Office", "Government Personnel (excluding police, military)", "Head of State", "Intelligence", "Judge/Attorney/Court", "Medical/Pharmaceutical", "Named Civilian", "Politician or Political Party Movement/Meeting/Ral...", "Private Security Company/Firm", "Royalty"],
  'Journalists & Media': ["", "Newspaper Journalist/Staff/Facility", "Other (including online news agencies)", "Radio Journalist/Staff/Facility", "Television Journalist/Staff/Facility"],
  'Maritime': ["", "Civilian Maritime", "Commercial Maritime", "Oil Tanker", "Port"],
  'Military': ["", "Alleged Informant", "Military Aircraft", "Military Barracks/Base/Headquarters/Checkpost", "Military Checkpoint", "Military Maritime", "Military Personnel (soldiers, troops, officers, fo...", "Military Recruiting Station/Academy", "Military Transportation/Vehicle (excluding convoys...", "Military Unit/Patrol/Convoy", "Military Weaponry", "NATO", "Non-combatant Personnel", "Paramilitary"],
  'NGO': ["", "Domestic NGO", "International NGO"],
  'Other': ["", "Ambulance", "Demilitarized Zone (including Green Zone)", "Fire Fighter/Truck"],
  'Police': ["", "Alleged Informant", "Police Building (headquarters, station, school)", "Police Checkpoint", "Police Patrol (including vehicles and convoys)", "Police Security Forces/Officers", "Prison/Jail"],
  'Private Citizens & Property': ["", "Alleged Informant", "Farmer", "House/Apartment/Residence", "Labor Union Related", "Laborer (General)/Occupation Identified", "Marketplace/Plaza/Square", "Memorial/Cemetery/Monument", "Museum/Cultural Center/Cultural House", "Named Civilian", "Political Party Member/Rally", "Procession/Gathering (funeral, wedding, birthday, ...", "Protester", "Public Area (garden, parking lot, garage, beach, p...", "Race/Ethnicity Identified", "Refugee (including Camps/IDP/Asylum Seekers)", "Religion Identified", "Student", "Unnamed Civilian/Unspecified", "Vehicles/Transportation", "Village/City/Town/Suburb"],
  'Religious Figures/Institutions': ["", "Affiliated Institution", "Place of Worship", "Religious Figure"],
  'Telecommunication': ["", "Internet Infrastructure", "Multiple Telecommunication Targets", "Radio", "Telephone/Telegraph", "Television"],
  'Terrorists/Non-State Militia': ["", "Alleged Informant", "Non-State Militia", "Terrorist"],
  'Tourists': ["Named Civilian", "Other Facility", "Tour Bus/Van", "Tourism Travel Agency", "Tourist"],
  'Transportation': ["", "Bridge/Car Tunnel", "Bus (excluding tourists)", "Bus Station/Stop", "Highway/Road/Toll/Traffic Signal", "Subway", "Taxi/Rickshaw", "Train/Train Tracks/Trolley"],
  'Unknown': [""],
  'Utilities': ["", "Electricity", "Gas", "Oil"],
  'Violent Political Party': ["", "Party Office/Facility", "Party Official/Candidate/Other Personnel", "Rally"]
};

var regions = {
  'Australasia & Oceania': ["Australia", "Fiji", "French Polynesia", "New Caledonia", "New Hebrides", "New Zealand", "Papua New Guinea", "Solomon Islands", "Vanuatu", "Wallis and Futuna"],
  'Central America & Caribbean': ["Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador", "Grenada", "Guadeloupe", "Guatemala", "Haiti", "Honduras", "Jamaica", "Martinique", "Nicaragua", "Panama", "St. Kitts and Nevis", "St. Lucia", "Trinidad and Tobago"],
  'Central Asia': ["Armenia", "Azerbaijan", "Georgia", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Uzbekistan"],
  'East Asia': ["China", "Hong Kong", "Japan", "Macau", "North Korea", "South Korea", "Taiwan"],
  'Eastern Europe': ["Albania", "Belarus", "Bosnia-Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Czechoslovakia", "East Germany (GDR)", "Estonia", "Hungary", "Kosovo", "Latvia", "Lithuania", "Macedonia", "Moldova", "Montenegro", "Poland", "Romania", "Russia", "Serbia", "Serbia-Montenegro", "Slovak Republic", "Slovenia", "Soviet Union", "Ukraine", "Yugoslavia"],
  'Middle East & North Africa': ["Algeria", "Bahrain", "Egypt", "International", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon", "Libya", "Morocco", "North Yemen", "Qatar", "Saudi Arabia", "South Yemen", "Syria", "Tunisia", "Turkey", "United Arab Emirates", "West Bank and Gaza Strip", "Western Sahara", "Yemen"],
  'North America': ["Canada", "Mexico", "United States"],
  'South America': ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Falkland Islands", "French Guiana", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"],
  'South Asia': ["Afghanistan", "Bangladesh", "Bhutan", "India", "Maldives", "Mauritius", "Nepal", "Pakistan", "Sri Lanka"],
  'Southeast Asia': ["Brunei", "Cambodia", "East Timor", "Indonesia", "Laos", "Malaysia", "Myanmar", "Philippines", "Singapore", "South Vietnam", "Thailand", "Vietnam"],
  'Sub-Saharan Africa': ["Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Central African Republic", "Chad", "Comoros", "Democratic Republic of the Congo", "Djibouti", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Madagascar", "Malawi", "Mali", "Mauritania", "Mozambique", "Namibia", "Niger", "Nigeria", "People's Republic of the Congo", "Republic of the Congo", "Rhodesia", "Rwanda", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania", "Togo", "Uganda", "Zaire", "Zambia", "Zimbabwe"],
  'Western Europe': ["Andorra", "Austria", "Belgium", "Cyprus", "Denmark", "Finland", "France", "Germany", "Greece", "Iceland", "Ireland", "Italy", "Luxembourg", "Malta", "Netherlands", "Norway", "Portugal", "Spain", "Sweden", "Switzerland", "United Kingdom", "Vatican City", "West Germany (FRG)"]
};