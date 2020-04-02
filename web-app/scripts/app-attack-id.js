function attackIdPageBefore(route, id) {
    let found = false;
    let currentAttack;
    for (let i = 0; i < attacks.length; ++i) {
        if (attacks[i].id == id) {
            currentAttack = attacks[i];
            found = true;
        }
    }
    if (!found) {
        mainContent.innerHTML = 'Error';
        return null;
    }
    mainContent.innerHTML = this.templateCallback(route.template, currentAttack);
    return currentAttack;
}

function attackIdPageTemplate(templateName, attack) {
    let compiledTemplate = Handlebars.compile(loadPage(templateName));
    return compiledTemplate(attack);
}

function attackIdPageInit(attack) {
    let attackAttack = document.querySelector('#mapAttack');
    map = new google.maps.Map(attackAttack, {
        center: {
            lat: attack.countryLatitude,
            lng: attack.countryLongitude
        },
        zoom: 8
    });

    document.getElementById("ripple-loader-id").style.left = `calc(50% + 5px * ${latitude-countryLatitude})`;
    document.getElementById("ripple-loader-id").style.top = `calc(50% + 5px * ${longitude-countryLongitude})`;

    map.setOptions({
        draggable: false
    });
    let attackData = document.querySelector('#terroristsData');
    if (parseInt(attackData.innerHTML) > 99) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
    attackData = document.querySelector('#killsData');
    if (parseInt(attackData.innerHTML) > 9) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }

    attackData = document.querySelector('#woundedData');
    if (parseInt(attackData.innerHTML) > 50) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }

    attackData = document.querySelector('#succesfulAttack');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }

    attackData = document.querySelector('#knownAttackers');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
}
