let attacksPageInput;
let previewAttacks = null;

function attacksPageInit(node) {
    mainContent.innerHTML = '';

    if (previewAttacks == null) {
        httpGET(URL_MICROSERVICE_ATTACKS + "/api/attacks?preview=true", (response) => {
            previewAttacks = JSON.parse(response.res);
            displayPreviewAttacks(node, previewAttacks);
        }, (error) => {
            console.log(error);
        });
    } else {
        displayPreviewAttacks(node, previewAttacks);
    }
}

function displayPreviewAttacks(node, attacks) {
    let compiledTemplate = Handlebars.compile(loadPage(node.template));
    mainContent.innerHTML = compiledTemplate(attacks);

    initAttacksPageEvents();
    // initMaps(attacks);
}

function initAttacksPageEvents() {
    attacksPageInput = document.querySelector('#attacks-search-button');

    attacksPageInput.addEventListener('keyup', (e) => {
        if (e.code === 'Enter') {
            if (attacksPageInput.value) {
                navigateToAttackPage(attacksPageInput.value);
            }
        }
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
            zoom: 7
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
        if (attacksPageInput.value) {
            navigateToAttackPage(attacksPageInput.value);
        } else {
            search.className = "search";
        }
    } else {
        search.className = "search open";
        search.children[0].focus();
    }
}

function navigateToAttackPage(attackId) {
    navigateRoot("/attacks/" + attackId);
}
