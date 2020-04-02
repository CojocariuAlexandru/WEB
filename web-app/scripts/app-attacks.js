function attacksPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);
    
}

function searchAttack() {
    let attackInput = document.querySelector('#searchAttackButton');
    navigateRoot('/attacks/' + attackInput.value);
}
