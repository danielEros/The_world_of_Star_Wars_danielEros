function main(){
    var currentPlanetTableURL = 'http://swapi.co/api/planets/?page=1';
    showPlanetTable(currentPlanetTableURL);
}

$(document).ready(main);