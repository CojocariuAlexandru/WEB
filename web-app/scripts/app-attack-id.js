function attackIdPageBefore(node, id) {
    mainContent.innerHTML = '';

    httpGET(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + id, (res) => {
        let attack = JSON.parse(res.res);
        let currentAttack = attack[0];
        prepareAttack(currentAttack);

        mainContent.innerHTML = attackIdPageTemplate(node.template, currentAttack);
        attackIdPageInit(currentAttack);
    }, (err) => {
        mainContent.innerHTML = '<div class="attackDetailText2">  <p> Page not found! </p> </div>'
    })
}

function navigateToUpdate() {
    let currentURL = window.location.href; //get current URL
    let currentAttackID = currentURL.split("/"); //get current attack ID - currentAttackID[5]
    let urlToAttack;
    urlToAttack = '/attacks-update/';
    urlToAttack = urlToAttack + currentAttackID[5];
    navigateRoot(urlToAttack);
}

function prepareAttack(currentAttack) {
    if (currentAttack["terrCount"] == "-99" || currentAttack["terrCount"] == "-1") {
        currentAttack["terrCount"] = "Unknown";
    }
    if (currentAttack["woundedCount"] == "-99" || currentAttack["woundedCount"] == "-1") {
        currentAttack["woundedCount"] = "Unknown";
    }
    if (currentAttack["killsCount"] == "-99" || currentAttack["killsCount"] == "-1") {
        currentAttack["killsCount"] = "Unknown";
    }
    if (currentAttack["success"] == "1") {
        currentAttack["success"] = "YES";
    } else {
        currentAttack["success"] = "NO";
    }
    if (currentAttack["suicide"] == "1") {
        currentAttack["suicide"] = "YES";
    } else {
        currentAttack["suicide"] = "NO";
    }
    if (currentAttack["extended"] == "1") {
        currentAttack["extended"] = "YES";
    } else {
        currentAttack["extended"] = "NO";
    }
}

function attackIdPageTemplate(templateName, attack) {
    let compiledTemplate = Handlebars.compile(loadPage(templateName));
    attack.admin = getDecodedUserToken().admin;
    return compiledTemplate(attack);
}

function attackIdPageInit(attack) {
    let attackAttack = document.querySelector('#mapAttack');
    map = new google.maps.Map(attackAttack, {
        center: {
            lat: parseFloat(attack["latitude"]),
            lng: parseFloat(attack["longitude"])
        },
        zoom: 8
    });

    document.getElementById("ripple-loader-id").style.left = `calc(50% - 32px)`;
    document.getElementById("ripple-loader-id").style.top = `calc(50% - 32px)`;

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

    attackData = document.querySelector('#suicide');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
    attackData = document.querySelector('#extended');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
}


function areYouSure() {
    let result = confirm("Are you sure?");
    if (result == true) {
        let currentURL = window.location.href; //get current URL
        let currentAttackID = currentURL.split("/"); //get current attack ID - currentAttackID[5]

        httpDELETE(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + currentAttackID[5], (result) => {
            navigateRoot('');
        }, (error) => {
            //ALERT
            console.log(error);
        });
    }
}
