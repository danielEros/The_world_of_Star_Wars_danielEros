function main(){
    var currentPlanetTableURL = 'http://swapi.co/api/planets/?page=1';
    var wrapperDiv = document.getElementById('button-wrapper');
    var userName = wrapperDiv.dataset['userName'];
    showPlanetTable(currentPlanetTableURL, userName);
    createPlanetStatistcsModal();
}

$(document).ready(main);