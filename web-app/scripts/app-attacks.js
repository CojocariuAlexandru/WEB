function attacksPageInit(node) {
    mainContent.innerHTML = '';

    httpGET("http://localhost:8001/api/attacks?preview=true", (response) => {
        let attacks = JSON.parse(response.res);

        let compiledTemplate = Handlebars.compile(loadPage(node.template));
        mainContent.innerHTML = compiledTemplate(attacks);

        initMaps(attacks);
    }, (error) => {

    });
}

function initMaps(attacks) {
    let cards = document.querySelector('.attacks-page-cards').children;

    let attacksCount = attacks.length;
    let childrenCount = cards.length;
    let count = Math.min(attacksCount, childrenCount);

    for (let i = 0; i < count; ++i) {
        let pos = {
            lat: parseInt(attacks[i]['latitude']),
            lng: parseInt(attacks[i]['longitude'])
        };

        let map = new google.maps.Map(cards[i].children[0], {
            center: pos,
            scrollwheel: false,
            draggable: false,
            disableDefaultUI: true,
            zoom: 7,
            styles: getMapNightModeStyle()
        });

        new google.maps.Marker({
            position: pos,
            map: map
        });
    }
}

function searchAttack() {
    let attackInput = document.querySelector('#searchAttackButton');
    navigateRoot('/attacks/' + attackInput.value);
}

function toggleSearchButton() {
    let search = document.querySelector('#search-wrapper');
    if (search.className.includes("open")) {
        search.className = "search";
    } else {
        search.className = "search open";
        search.children[0].focus();
    }
}
