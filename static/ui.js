function showPlanetTable(planetTableURL){
    $.getJSON(planetTableURL, function(response){
        var resultPlanets = response['results'];
        buttons = "<button type='button' class='btn btn-primary'>Previous</button>";
        buttons += " <button type='button' class='btn btn-primary'>Next page</button><br><br>";
        var planetTableContent = "<table class='table table-bordered'><thead><th>Name</th>";
        planetTableContent += "<th>Diameter</th>";
        planetTableContent += "<th>Climate</th>";
        planetTableContent += "<th>Terrain</th>";
        planetTableContent += "<th>Water</th>";
        planetTableContent += "<th>Population</th></thead><tbody>";
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
            if($(this).text() === 'Next page'){
                showPlanetTable(response['next']);
            } else if ($(this).text() === 'Previous'){
                showPlanetTable(response['previous']);
            }
        });
    });
}