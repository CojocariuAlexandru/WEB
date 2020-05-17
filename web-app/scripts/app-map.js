var markersArray = [];

function mapPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);

    let el = document.querySelector(".mapDiv");
    map = new google.maps.Map(el, {
        center: {
            lat: 30,
            lng: 0
        },
        scrollwheel: false,
        zoom: 2,
        styles: getMapNightModeStyle()
    });

    httpGET(URL_MICROSERVICE_ATTACKS + "/api/attacks", (result) => {
        parsed = JSON.parse(result.res);
        displayAttacksOnMap(parsed);
    }, (error) => {
        console.log(error);
    });

    generate(regions, ".regionForm", "Region of the attack", "allRegions",  `<input list='allRegions' id='allRegionsInput' onchange=populate('allRegionsInput','.countryForm') >`);
    generate(emptyObject, ".countryForm", 'Country', 'allCountries', `<input list='allCountries' id='allCountriesInput'>`);
    generate(emptyObject, '.cityForm',  'City', 'allCities', `<input list='allCities' id='allCitiesInput'>`);
}

function centerMapOnCountry(countryName) {
    let coordinates = getCountryCoordinates(countryName);
    if (coordinates) {
        let centerMap = new google.maps.LatLng(coordinates.lat, coordinates.lon);
        map.panTo(centerMap);
        map.setZoom(5);
    }
}

function centerMapOnRegion(regionName) {
    let coordinatesZoom = getRegionCoordinatesAndZoom(regionName);
    if (coordinatesZoom) {
        let centerMap = new google.maps.LatLng(coordinatesZoom.lat, coordinatesZoom.lon);
        map.panTo(centerMap);
        map.setZoom(coordinatesZoom.zoom);
    }
}

function getMapCoordinates() {
    console.log(map.getZoom());
    console.log(map.getCenter().lat());
    console.log(map.getCenter().lng());
}

function sendMapVisualizationRequest() {
    let filters = mapPageGetFilterObject();

    httpPOST(URL_MICROSERVICE_ATTACKS + '/api/attacks/map', JSON.stringify(filters), (result) => {
        parsed = JSON.parse(result.res);
        removeAttacksFromMap();
        mapPageScrollUp();

        setTimeout(() => {
            if (filters['country'] != ''){
                centerMapOnCountry(filters['country']);
            } else if (filters['region'] != ''){
                centerMapOnRegion(filters['region']);
            }
            
            displayAttacksOnMap(parsed);
        }, 1000);
    }, (err) => {
        console.log(err);
    });
}

function removeAttacksFromMap() {
    while(markersArray.length) { 
        markersArray.pop().setMap(null);
    }
}

// https://stackoverflow.com/questions/1544739/google-maps-api-v3-how-to-remove-all-markers
function displayAttacksOnMap(attacks) {
    for (let i = 0; i < attacks.length; ++i) {
        let pos = {
            lat: parseInt(attacks[i].latitude),
            lng: parseInt(attacks[i].longitude)
        };

        markersArray.push(new google.maps.Marker({
            position: pos,
            map: map,
            title: attacks[i].country
        }));
    }
}

function mapPageGetFilterObject() {
    let dateStartInput = document.querySelector('#dateInputStart');
    let dateFinalInput = document.querySelector('#dateInputFinal');

    let regionFormInput      = document.querySelector('#allRegionsInput');
    let countryFormInput     = document.querySelector('#allCountriesInput');
    let cityFormInput        = document.querySelector('#allCitiesInput');

    return {
        dateStart:       `${dateStartInput.value}`,
        dateFinal:       `${dateFinalInput.value}`,
        region:          `${regionFormInput.value}`,
        country:         `${countryFormInput.value}`,
        city:            `${cityFormInput.value}`
    };
}

function mapPageScrollUp() {
    let mapPageTitle = document.querySelector('.mapVisualizationHeader');
    if (mapPageTitle) {
        mapPageTitle.scrollIntoView({behavior: "smooth"});
    }
}

function getMapNightModeStyle() {
    return [{
            elementType: 'geometry',
            stylers: [{
                color: '#242f3e'
            }]
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#242f3e'
            }]
        },
        {
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#746855'
            }]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{
                color: '#263c3f'
            }]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#6b9a76'
            }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                color: '#38414e'
            }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#212a37'
            }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#9ca5b3'
            }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{
                color: '#746855'
            }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#1f2835'
            }]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#f3d19c'
            }]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{
                color: '#2f3948'
            }]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{
                color: '#17263c'
            }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#515c6d'
            }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#17263c'
            }]
        }
    ];
}

function getRegionCoordinatesAndZoom(regionName) {
    let regionsDict = {
        "Australia & Oceania" : { lat: 22.5050, lon: 159.8989, zoom: 4 },
        "Central America & Caribbean" : { lat: 16.6453, lon: -75.3968, zoom: 5 },
        "Central Asia" : { lat: 45.7956, lon: 60.6894, zoom: 4 },
        "East Asia" : { lat: 36.0639, lon: 111.4026, zoom: 4 },
        "Eastern Europe" : { lat: 51.4342, lon: 30.5885, zoom: 4 },
        "Middle East & North Africa" : { lat: 30.6867, lon: 28.3370, zoom: 4 },
        "North America" : { lat: 53.3114, lon: -97.1123, zoom: 3},
        "South America" : { lat: -18.3691, lon: -63.0695, zoom: 3 },
        "South Asia" : { lat: 24.7444, lon: 77.8201, zoom: 4 },
        "Southeast Asia" : { lat: 9.5852, lon: 113.6910, zoom: 4 },
        "Sub-Saharan Africa" : { lat: 1.1346, lon: 20.3018, zoom: 3 },
        "Western Europe" : { lat: 49.1243, lon: 6.8085, zoom: 4 },
    };

    if (!(regionName in regionsDict)){
        return null;
    } else {
        return regionsDict[regionName];
    }
}

function getCountryCoordinates(countryName) {
    // https://developers.google.com/public-data/docs/canonical/countries_csv
    let countriesDict = { 
      "Andorra" : { lat : 42.5462, lon : 1.60155 },
      "United Arab Emirates" : { lat : 23.4241, lon : 53.8478 },
      "Afghanistan" : { lat : 33.9391, lon : 67.71 },
      "Antigua and Barbuda" : { lat : 17.0608, lon : -61.7964 },
      "Anguilla" : { lat : 18.2206, lon : -63.0686 },
      "Albania" : { lat : 41.1533, lon : 20.1683 },
      "Armenia" : { lat : 40.0691, lon : 45.0382 },
      "Netherlands Antilles" : { lat : 12.2261, lon : -69.0601 },
      "Angola" : { lat : -11.2027, lon : 17.8739 },
      "Antarctica" : { lat : -75.251, lon : -0.071389 },
      "Argentina" : { lat : -38.4161, lon : -63.6167 },
      "American Samoa" : { lat : -14.271, lon : -170.132 },
      "Austria" : { lat : 47.5162, lon : 14.5501 },
      "Australia" : { lat : -25.2744, lon : 133.775 },
      "Aruba" : { lat : 12.5211, lon : -69.9683 },
      "Azerbaijan" : { lat : 40.1431, lon : 47.5769 },
      "Bosnia and Herzegovina" : { lat : 43.9159, lon : 17.6791 },
      "Barbados" : { lat : 13.1939, lon : -59.5432 },
      "Bangladesh" : { lat : 23.685, lon : 90.3563 },
      "Belgium" : { lat : 50.5039, lon : 4.46994 },
      "Burkina Faso" : { lat : 12.2383, lon : -1.56159 },
      "Bulgaria" : { lat : 42.7339, lon : 25.4858 },
      "Bahrain" : { lat : 25.9304, lon : 50.6378 },
      "Burundi" : { lat : -3.37306, lon : 29.9189 },
      "Benin" : { lat : 9.30769, lon : 2.31583 },
      "Bermuda" : { lat : 32.3214, lon : -64.7574 },
      "Brunei" : { lat : 4.53528, lon : 114.728 },
      "Bolivia" : { lat : -16.2902, lon : -63.5887 },
      "Brazil" : { lat : -14.235, lon : -51.9253 },
      "Bahamas" : { lat : 25.0343, lon : -77.3963 },
      "Bhutan" : { lat : 27.5142, lon : 90.4336 },
      "Bouvet Island" : { lat : -54.4232, lon : 3.41319 },
      "Botswana" : { lat : -22.3285, lon : 24.6849 },
      "Belarus" : { lat : 53.7098, lon : 27.9534 },
      "Belize" : { lat : 17.1899, lon : -88.4976 },
      "Canada" : { lat : 56.1304, lon : -106.347 },
      "Cocos Islands" : { lat : -12.1642, lon : 96.871 },
      "Democratic Republic of the Congo" : { lat : -4.03833, lon : 21.7587 },
      "Central African Republic" : { lat : 6.61111, lon : 20.9394 },
      "Republic of the Congo" : { lat : -0.228021, lon : 15.8277 },
      "Switzerland" : { lat : 46.8182, lon : 8.22751 },
      "CÃ´te d'Ivoire" : { lat : 7.53999, lon : -5.54708 },
      "Cook Islands" : { lat : -21.2367, lon : -159.778 },
      "Chile" : { lat : -35.6751, lon : -71.543 },
      "Cameroon" : { lat : 7.36972, lon : 12.3547 },
      "China" : { lat : 35.8617, lon : 104.195 },
      "Colombia" : { lat : 4.57087, lon : -74.2973 },
      "Costa Rica" : { lat : 9.74892, lon : -83.7534 },
      "Cuba" : { lat : 21.5218, lon : -77.7812 },
      "Cape Verde" : { lat : 16.0021, lon : -24.0132 },
      "Christmas Island" : { lat : -10.4475, lon : 105.69 },
      "Cyprus" : { lat : 35.1264, lon : 33.4299 },
      "Czech Republic" : { lat : 49.8175, lon : 15.473 },
      "Germany" : { lat : 51.1657, lon : 10.4515 },
      "Djibouti" : { lat : 11.8251, lon : 42.5903 },
      "Denmark" : { lat : 56.2639, lon : 9.50178 },
      "Dominica" : { lat : 15.415, lon : -61.371 },
      "Dominican Republic" : { lat : 18.7357, lon : -70.1627 },
      "Algeria" : { lat : 28.0339, lon : 1.65963 },
      "Ecuador" : { lat : -1.83124, lon : -78.1834 },
      "Estonia" : { lat : 58.5953, lon : 25.0136 },
      "Egypt" : { lat : 26.8206, lon : 30.8025 },
      "Western Sahara" : { lat : 24.2155, lon : -12.8858 },
      "Eritrea" : { lat : 15.1794, lon : 39.7823 },
      "Spain" : { lat : 40.4637, lon : -3.74922 },
      "Ethiopia" : { lat : 9.145, lon : 40.4897 },
      "Finland" : { lat : 61.9241, lon : 25.7482 },
      "Fiji" : { lat : -16.5782, lon : 179.414 },
      "Falkland Islands" : { lat : -51.7963, lon : -59.5236 },
      "Micronesia" : { lat : 7.42555, lon : 150.551 },
      "Faroe Islands" : { lat : 61.8926, lon : -6.91181 },
      "France" : { lat : 46.2276, lon : 2.21375 },
      "Gabon" : { lat : -0.803689, lon : 11.6094 },
      "United Kingdom" : { lat : 55.3781, lon : -3.43597 },
      "Grenada" : { lat : 12.2628, lon : -61.6042 },
      "Georgia" : { lat : 42.3154, lon : 43.3569 },
      "French Guiana" : { lat : 3.93389, lon : -53.1258 },
      "Guernsey" : { lat : 49.4657, lon : -2.58528 },
      "Ghana" : { lat : 7.94653, lon : -1.02319 },
      "Gibraltar" : { lat : 36.1377, lon : -5.34537 },
      "Greenland" : { lat : 71.7069, lon : -42.6043 },
      "Gambia" : { lat : 13.4432, lon : -15.3101 },
      "Guinea" : { lat : 9.94559, lon : -9.69665 },
      "Guadeloupe" : { lat : 16.996, lon : -62.0676 },
      "Equatorial Guinea" : { lat : 1.6508, lon : 10.2679 },
      "Greece" : { lat : 39.0742, lon : 21.8243 },
      "South Georgia and the South Sandwich Islands" : { lat : -54.4296, lon : -36.5879 },
      "Guatemala" : { lat : 15.7835, lon : -90.2308 },
      "Guam" : { lat : 13.4443, lon : 144.794 },
      "Guinea-Bissau" : { lat : 11.8037, lon : -15.1804 },
      "Guyana" : { lat : 4.86042, lon : -58.9302 },
      "Gaza Strip" : { lat : 31.3547, lon : 34.3088 },
      "Hong Kong" : { lat : 22.3964, lon : 114.109 },
      "Heard Island and McDonald Islands" : { lat : -53.0818, lon : 73.5042 },
      "Honduras" : { lat : 15.2, lon : -86.2419 },
      "Croatia" : { lat : 45.1, lon : 15.2 },
      "Haiti" : { lat : 18.9712, lon : -72.2852 },
      "Hungary" : { lat : 47.1625, lon : 19.5033 },
      "Indonesia" : { lat : -0.789275, lon : 113.921 },
      "Ireland" : { lat : 53.4129, lon : -8.24389 },
      "Israel" : { lat : 31.0461, lon : 34.8516 },
      "Isle of Man" : { lat : 54.2361, lon : -4.54806 },
      "India" : { lat : 20.5937, lon : 78.9629 },
      "British Indian Ocean Territory" : { lat : -6.34319, lon : 71.8765 },
      "Iraq" : { lat : 33.2232, lon : 43.6793 },
      "Iran" : { lat : 32.4279, lon : 53.688 },
      "Iceland" : { lat : 64.9631, lon : -19.0208 },
      "Italy" : { lat : 41.8719, lon : 12.5674 },
      "Jersey" : { lat : 49.2144, lon : -2.13125 },
      "Jamaica" : { lat : 18.1096, lon : -77.2975 },
      "Jordan" : { lat : 30.5852, lon : 36.2384 },
      "Japan" : { lat : 36.2048, lon : 138.253 },
      "Kenya" : { lat : -0.023559, lon : 37.9062 },
      "Kyrgyzstan" : { lat : 41.2044, lon : 74.7661 },
      "Cambodia" : { lat : 12.5657, lon : 104.991 },
      "Kiribati" : { lat : -3.37042, lon : -168.734 },
      "Comoros" : { lat : -11.875, lon : 43.8722 },
      "Saint Kitts and Nevis" : { lat : 17.3578, lon : -62.783 },
      "North Korea" : { lat : 40.3399, lon : 127.51 },
      "South Korea" : { lat : 35.9078, lon : 127.767 },
      "Kuwait" : { lat : 29.3117, lon : 47.4818 },
      "Cayman Islands" : { lat : 19.5135, lon : -80.567 },
      "Kazakhstan" : { lat : 48.0196, lon : 66.9237 },
      "Laos" : { lat : 19.8563, lon : 102.495 },
      "Lebanon" : { lat : 33.8547, lon : 35.8623 },
      "Saint Lucia" : { lat : 13.9094, lon : -60.9789 },
      "Liechtenstein" : { lat : 47.166, lon : 9.55537 },
      "Sri Lanka" : { lat : 7.87305, lon : 80.7718 },
      "Liberia" : { lat : 6.42805, lon : -9.4295 },
      "Lesotho" : { lat : -29.61, lon : 28.2336 },
      "Lithuania" : { lat : 55.1694, lon : 23.8813 },
      "Luxembourg" : { lat : 49.8153, lon : 6.12958 },
      "Latvia" : { lat : 56.8796, lon : 24.6032 },
      "Libya" : { lat : 26.3351, lon : 17.2283 },
      "Morocco" : { lat : 31.7917, lon : -7.09262 },
      "Monaco" : { lat : 43.7503, lon : 7.41284 },
      "Moldova" : { lat : 47.4116, lon : 28.3699 },
      "Montenegro" : { lat : 42.7087, lon : 19.3744 },
      "Madagascar" : { lat : -18.7669, lon : 46.8691 },
      "Marshall Islands" : { lat : 7.13147, lon : 171.184 },
      "Macedonia [FYROM]" : { lat : 41.6086, lon : 21.7453 },
      "Mali" : { lat : 17.5707, lon : -3.99617 },
      "Myanmar [Burma]" : { lat : 21.914, lon : 95.9562 },
      "Mongolia" : { lat : 46.8625, lon : 103.847 },
      "Macau" : { lat : 22.1987, lon : 113.544 },
      "Northern Mariana Islands" : { lat : 17.3308, lon : 145.385 },
      "Martinique" : { lat : 14.6415, lon : -61.0242 },
      "Mauritania" : { lat : 21.0079, lon : -10.9408 },
      "Montserrat" : { lat : 16.7425, lon : -62.1874 },
      "Malta" : { lat : 35.9375, lon : 14.3754 },
      "Mauritius" : { lat : -20.3484, lon : 57.5522 },
      "Maldives" : { lat : 3.20278, lon : 73.2207 },
      "Malawi" : { lat : -13.2543, lon : 34.3015 },
      "Mexico" : { lat : 23.6345, lon : -102.553 },
      "Malaysia" : { lat : 4.21048, lon : 101.976 },
      "Mozambique" : { lat : -18.6657, lon : 35.5296 },
      "Namibia" : { lat : -22.9576, lon : 18.4904 },
      "New Caledonia" : { lat : -20.9043, lon : 165.618 },
      "Niger" : { lat : 17.6078, lon : 8.08167 },
      "Norfolk Island" : { lat : -29.0408, lon : 167.955 },
      "Nigeria" : { lat : 9.082, lon : 8.67528 },
      "Nicaragua" : { lat : 12.8654, lon : -85.2072 },
      "Netherlands" : { lat : 52.1326, lon : 5.29127 },
      "Norway" : { lat : 60.472, lon : 8.46895 },
      "Nepal" : { lat : 28.3949, lon : 84.124 },
      "Nauru" : { lat : -0.522778, lon : 166.932 },
      "Niue" : { lat : -19.0544, lon : -169.867 },
      "New Zealand" : { lat : -40.9006, lon : 174.886 },
      "Oman" : { lat : 21.5126, lon : 55.9233 },
      "Panama" : { lat : 8.53798, lon : -80.7821 },
      "Peru" : { lat : -9.18997, lon : -75.0152 },
      "French Polynesia" : { lat : -17.6797, lon : -149.407 },
      "Papua New Guinea" : { lat : -6.31499, lon : 143.956 },
      "Philippines" : { lat : 12.8797, lon : 121.774 },
      "Pakistan" : { lat : 30.3753, lon : 69.3451 },
      "Poland" : { lat : 51.9194, lon : 19.1451 },
      "Saint Pierre and Miquelon" : { lat : 46.9419, lon : -56.2711 },
      "Pitcairn Islands" : { lat : -24.7036, lon : -127.439 },
      "Puerto Rico" : { lat : 18.2208, lon : -66.5901 },
      "Palestinian Territories" : { lat : 31.9522, lon : 35.2332 },
      "Portugal" : { lat : 39.3999, lon : -8.22445 },
      "Paraguay" : { lat : -23.4425, lon : -58.4438 },
      "Qatar" : { lat : 25.3548, lon : 51.1839 },
      "RÃ©union" : { lat : -21.1151, lon : 55.5364 },
      "Romania" : { lat : 45.9432, lon : 24.9668 },
      "Serbia" : { lat : 44.0165, lon : 21.0059 },
      "Russia" : { lat : 61.524, lon : 105.319 },
      "Rwanda" : { lat : -1.94028, lon : 29.8739 },
      "Saudi Arabia" : { lat : 23.8859, lon : 45.0792 },
      "Solomon Islands" : { lat : -9.64571, lon : 160.156 },
      "Seychelles" : { lat : -4.67957, lon : 55.492 },
      "Sudan" : { lat : 12.8628, lon : 30.2176 },
      "Sweden" : { lat : 60.1282, lon : 18.6435 },
      "Singapore" : { lat : 1.35208, lon : 103.82 },
      "Saint Helena" : { lat : -24.1435, lon : -10.0307 },
      "Slovenia" : { lat : 46.1512, lon : 14.9955 },
      "Svalbard and Jan Mayen" : { lat : 77.5536, lon : 23.6703 },
      "Slovakia" : { lat : 48.669, lon : 19.699 },
      "Sierra Leone" : { lat : 8.46055, lon : -11.7799 },
      "San Marino" : { lat : 43.9424, lon : 12.4578 },
      "Senegal" : { lat : 14.4974, lon : -14.4524 },
      "Somalia" : { lat : 5.15215, lon : 46.1996 },
      "Suriname" : { lat : 3.91931, lon : -56.0278 },
      "SÃ£o TomÃ© and PrÃ­ncipe" : { lat : 0.18636, lon : 6.61308 },
      "El Salvador" : { lat : 13.7942, lon : -88.8965 },
      "Syria" : { lat : 34.8021, lon : 38.9968 },
      "Swaziland" : { lat : -26.5225, lon : 31.4659 },
      "Turks and Caicos Islands" : { lat : 21.694, lon : -71.7979 },
      "Chad" : { lat : 15.4542, lon : 18.7322 },
      "French Southern Territories" : { lat : -49.2804, lon : 69.3486 },
      "Togo" : { lat : 8.61954, lon : 0.824782 },
      "Thailand" : { lat : 15.87, lon : 100.993 },
      "Tajikistan" : { lat : 38.861, lon : 71.2761 },
      "Tokelau" : { lat : -8.96736, lon : -171.856 },
      "Timor-Leste" : { lat : -8.87422, lon : 125.728 },
      "Turkmenistan" : { lat : 38.9697, lon : 59.5563 },
      "Tunisia" : { lat : 33.8869, lon : 9.5375 },
      "Tonga" : { lat : -21.179, lon : -175.198 },
      "Turkey" : { lat : 38.9637, lon : 35.2433 },
      "Trinidad and Tobago" : { lat : 10.6918, lon : -61.2225 },
      "Tuvalu" : { lat : -7.10954, lon : 177.649 },
      "Taiwan" : { lat : 23.6978, lon : 120.961 },
      "Tanzania" : { lat : -6.36903, lon : 34.8888 },
      "Ukraine" : { lat : 48.3794, lon : 31.1656 },
      "Uganda" : { lat : 1.37333, lon : 32.2903 },
      "United States" : { lat : 37.0902, lon : -95.7129 },
      "Uruguay" : { lat : -32.5228, lon : -55.7658 },
      "Uzbekistan" : { lat : 41.3775, lon : 64.5853 },
      "Vatican City" : { lat : 41.9029, lon : 12.4534 },
      "Saint Vincent and the Grenadines" : { lat : 12.9843, lon : -61.2872 },
      "Venezuela" : { lat : 6.42375, lon : -66.5897 },
      "British Virgin Islands" : { lat : 18.4207, lon : -64.64 },
      "U.S. Virgin Islands" : { lat : 18.3358, lon : -64.8963 },
      "Vietnam" : { lat : 14.0583, lon : 108.277 },
      "Vanuatu" : { lat : -15.3767, lon : 166.959 },
      "Wallis and Futuna" : { lat : -13.7688, lon : -177.156 },
      "Samoa" : { lat : -13.759, lon : -172.105 },
      "Kosovo" : { lat : 42.6026, lon : 20.903 },
      "Yemen" : { lat : 15.5527, lon : 48.5164 },
      "Mayotte" : { lat : -12.8275, lon : 45.1662 },
      "South Africa" : { lat : -30.5595, lon : 22.9375 },
      "Zambia" : { lat : -13.1339, lon : 27.8493 },
      "Zimbabwe" : { lat : -19.0154, lon : 29.1549 }
      };

      if (!(countryName in countriesDict)){
        return null;
      } else {
        return countriesDict[countryName];
      }
  }
  