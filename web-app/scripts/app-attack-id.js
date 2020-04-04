function attackIdPageBefore(node, id) {
    mainContent.innerHTML = '';

    let xmlhttp = new XMLHttpRequest();
    let apiPath = "http://localhost:8001/api/attacks/" + id;
    xmlhttp.open("GET", apiPath);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let attack = JSON.parse(xmlhttp.responseText);
            let currentAttack = attack[0];
            mainContent.innerHTML = attackIdPageTemplate(node.template, currentAttack);
            attackIdPageInit(currentAttack);
        } else if (this.readyState == 4 && this.status == 404) {
            mainContent.innerHTML = '<div class="attackDetailText2">  <p> Page not found! </p> </div>'
        }
    }
    return null;
}

function attackIdPageTemplate(templateName, attack) {
    let compiledTemplate = Handlebars.compile(loadPage(templateName));
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

    attackData = document.querySelector('#knownAttackers');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
}
