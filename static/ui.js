function showPlanetTable(planetTableURL){
    $.getJSON(planetTableURL, function(response){
        var resultPlanets = response['results'];
        buttons = "<button type='button' class='btn btn-primary'>Previous</button>";
        buttons += "<button type='button' class='btn btn-primary'>Next</button>";
        //remove border=1 from here
        var planetTableContent = "<table border='1'><thead><td>Name</td>";
        planetTableContent += "<td>Diameter</td>";
        planetTableContent += "<td>Climate</td>";
        planetTableContent += "<td>Terrain</td>";
        planetTableContent += "<td>Water</td>";
        planetTableContent += "<td>Population</td></thead><tbody>";
        for(let i=0; i<resultPlanets.length; i++){
            var planet = resultPlanets[i];
            planetTableContent += "<tr><td>" + planet['name'] + "</td>";
            planetTableContent += "<td>" + planet['diameter'] + "</td>";
            planetTableContent += "<td>" + planet['climate'] + "</td>";
            planetTableContent += "<td>" + planet['terrain'] + "</td>";
            planetTableContent += "<td>" + planet['surface_water'] + "</td>";
            planetTableContent += "<td>" + planet['population'] + "</td></tr>";
        }
        planetTableContent += "</tbody></table>";
        $('#button-wrapper').html(buttons);
        $('#table-wrapper').html(planetTableContent);
        $('.btn').on('click', function(){
            if($(this).text() === 'Next'){
                showPlanetTable(response['next']);
            } else if ($(this).text() === 'Previous'){
                showPlanetTable(response['previous']);
            }
        });
    });
}