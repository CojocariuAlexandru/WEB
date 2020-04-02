function mapPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);

    let el = document.querySelector("#mapDiv");
    map = new google.maps.Map(el, {
        center: {
            lat: 30,
            lng: 0
        },
        zoom: 2,
        styles: getMapNightModeStyle()
    });

    httpGET("http://localhost:8001/api/attacks", (result) => {
        parsed = JSON.parse(result.res);

        for (let i = 0; i < parsed.length; ++i) {
            let pos = {
                lat: parseInt(parsed[i].latitude),
                lng: parseInt(parsed[i].longitude)
            };

            let marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: parsed[i].country
            });
        }
    }, (error) => {
        console.log(error);
    });

    generateRegions();
    generateCountries();

    mapPageAddEventListeners();
}

function mapPageAddEventListeners() {
    let countriesInput = document.querySelector('.countries-input');
    if (countriesInput) {
        countriesInput.addEventListener('change', mapPageCountrySelected)
    }
}

function mapPageCountrySelected(event) {
    let country = event.target.value;
    let coordinates = getCountryCoordinates(country);
    if (coordinates) {
        let centerMap = new google.maps.LatLng(coordinates.lat, coordinates.lon);
        map.panTo(centerMap);
        map.setZoom(5);
        mapPageScrollUp();
    }
}

function sendMapVisualizationRequest() {
    mapPageScrollUp();
}

function mapPageScrollUp() {
    let mapPageTitle = document.querySelector('.mapVisualizationHeader');
    if (mapPageTitle) {
        mapPageTitle.scrollIntoView();
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
