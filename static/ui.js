function showPlanetTable(planetTableURL, userName){
    $.getJSON(planetTableURL, function(response){
        var resultPlanets = response['results'];
        buttons = "<button type='button' class='btn btn-primary navbutton'>Previous</button>";
        buttons += " <button type='button' class='btn btn-primary navbutton'>Next page</button><br><br>";
        var planetTableContent = "<table class='table table-bordered'><thead><th>Name</th>";
        planetTableContent += "<th>Diameter</th>";
        planetTableContent += "<th>Climate</th>";
        planetTableContent += "<th>Terrain</th>";
        planetTableContent += "<th>Water</th>";
        planetTableContent += "<th>Population</th>";
        planetTableContent += "<th>Residents</th>";
        if (userName !== ''){
            planetTableContent += "<th>Vote on planet</th>";
        }
        planetTableContent += "</thead><tbody>";
        var residentsModals = '';
        var planetIDArray = [];
        var planetNameArray = [];
        for(let i=0; i<resultPlanets.length; i++){
            var planet = resultPlanets[i];
            var planetURL = planet['url'];
            planetURL = planetURL.substring(0, planetURL.length-1);
            var planetID = planetURL.substring(planetURL.lastIndexOf('/') + 1);
            var planetName = planet['name'];
            planetIDArray.push(planetID);
            planetNameArray.push(planetName);
            var diameterToPrint = Number(planet['diameter']).toLocaleString() + ' km';
            if (planet['diameter'] === 'unknown'){
                diameterToPrint = 'unknown';
            }
            var surfaceWaterToPrint = planet['surface_water'] + ' %';
            if (planet['surface_water'] === 'unknown'){
                surfaceWaterToPrint = 'unknown';
            }
            var populationToPrint = Number(planet['population']).toLocaleString() + ' people';
             if (planet['population'] === 'unknown'){
                populationToPrint = 'unknown';
            }
            var residentsButtonToPrint;
            if (planet['residents'].length > 0){
                residentsButtonToPrint = "<button type='button' class='btn btn-default btn-xs' data-toggle='modal' data-target='#residentModal" + i + "'>";
                residentsButtonToPrint += planet['residents'].length + ' people';
                residentsButtonToPrint += "</button>";
                residentsModals += getResidentModalHTML('residentModal' + i, planet['residents'], planet['name']);
            } else {
                residentsButtonToPrint = 'No known residents';
            }
            var voteButtonToPrint;
            voteButtonToPrint = "<button id=b" + planetID + " type='button' class='btn btn-primary btn-xs'>Vote</button>"
            planetTableContent += "<tr><td>" + planetName + "</td>";
            planetTableContent += "<td>" + diameterToPrint + "</td>";
            planetTableContent += "<td>" + planet['climate'] + "</td>";
            planetTableContent += "<td>" + planet['terrain'] + "</td>";
            planetTableContent += "<td>" + surfaceWaterToPrint + "</td>";
            planetTableContent += "<td>" + populationToPrint + "</td>";
            planetTableContent += "<td>" + residentsButtonToPrint + "</td>";
            if (userName !== ''){
                planetTableContent += "<td id=p" + planetID + ">" + voteButtonToPrint + "</td>";
            }
            planetTableContent += "</tr>";
        }
        planetTableContent += "</tbody></table>";
        $('#button-wrapper').html(buttons);
        $('#table-wrapper').html(planetTableContent);
        $('#table-wrapper').append(residentsModals);
        $('.navbutton').on('click', function(){
            if($(this).text() === 'Next page'){
                showPlanetTable(response['next'].replace("http", "https"), userName);
            } else if ($(this).text() === 'Previous'){
                showPlanetTable(response['previous'].replace("http", "https"), userName);
            }
        });
        // had to separate into different loop because of asynchronity
        for (let i=0; i<planetIDArray.length; i++) {    
            // only if someone is logged in
            if (userName != ''){
                // check if the user already voted on the planet
                $.get('/search_db_if_voted', {userName: userName, planetID: planetIDArray[i]}, function(response){
                    if (response.result === 'voted'){
                        $('#b' + response.planet_id).remove();
                        $('#p' + response.planet_id).append("<p>You already voted</p>");
                    }
                });
                // handle vote clicks = put vote into db AND inform the user
                $('#b' + planetIDArray[i]).on('click', function(){
                    $.post('/register_vote_in_db', {userName: userName, planetID: planetIDArray[i], planetName: planetNameArray[i]}, function(response){
                        $('#b' + response.planet_id).remove();
                        $('#p' + response.planet_id).append("<p id='success'>Thanks for voting!</p>");
                    });
                });
            }
        }
    });
}

function getResidentModalHTML(modalID, residentLinkArray, planetName) {
    var residentModalHTML = createModalTable(modalID, planetName);
    for(let i=0; i<residentLinkArray.length; i++){
        $.getJSON(residentLinkArray[i].replace("http", "https"), function(response){
            var residentDataRow = '';
            var heightToPrint = Number(response['height'])/100 + ' m';
            if (response['height'] === 'unknown'){
                heightToPrint = 'unknown';
            }
            var massToPrint = response['mass'] + ' kg';
            if (response['mass'] === 'unknown'){
                massToPrint = 'unknown';
            }
            residentDataRow += '<tr class="child"><td>' + response['name'] + '</td>';
            residentDataRow += '<td>' + heightToPrint + '</td>';
            residentDataRow += '<td>' + massToPrint + '</td>';
            residentDataRow += '<td>' + response['skin_color'] + '</td>';
            residentDataRow += '<td>' + response['hair_color'] + '</td>';
            residentDataRow += '<td>' + response['eye_color'] + '</td>';
            residentDataRow += '<td>' + response['birth_year'] + '</td>';
            residentDataRow += '<td>' + response['gender'] + '</td></tr>';
            $('#t' + modalID + ' tbody').append(residentDataRow);
        });
    }
    return residentModalHTML;
}

function createModalTable(modalID, planetName){
    residentModalHTML = '<div class="modal fade" id="' + modalID + '" role="dialog">';
    residentModalHTML +=    '<div class="modal-dialog modal-lg">';
    residentModalHTML +=         '<div class="modal-content">';
    residentModalHTML +=             '<div class="modal-header">';
    residentModalHTML +=                 '<button type="button" class="close" data-dismiss="modal">&times;</button>';
    residentModalHTML +=                 '<h4 class="modal-title">Residents of ' + planetName + '</h4>';
    residentModalHTML +=             '</div>';
    residentModalHTML +=             '<div class="modal-body">';
    residentModalHTML +=                "<table class='table table-bordered' id=t" + modalID + "><thead><th>Name</th>";
    residentModalHTML +=                    "<th>Height</th>";
    residentModalHTML +=                    "<th>Mass</th>";
    residentModalHTML +=                    "<th>Skin color</th>";
    residentModalHTML +=                    "<th>Hair color</th>";
    residentModalHTML +=                    "<th>Eye color</th>";
    residentModalHTML +=                    "<th>Birth year</th>";
    residentModalHTML +=                    "<th>Gender</th></thead><tbody>";
    residentModalHTML +=                "</tbody></table>";
    residentModalHTML +=             '</div>';
    residentModalHTML +=             '<div class="modal-footer">';
    residentModalHTML +=                 '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    residentModalHTML +=             '</div>';
    residentModalHTML +=         '</div>';
    residentModalHTML +=     '</div>';
    residentModalHTML += '</div>';
    return residentModalHTML;
}

function createPlanetStatistcsModal(){
    planetStatistcsTable = createPlanetStatistcsTable();
    $('section').append(planetStatistcsTable);
    $.get('/get_planet_statistics', function(response){
        var planetStatisticsRows = '';
        for (let i=0; i<response.length; i++) {
            planetStatisticsRows += '<tr class="child"><td>' + response[i][0] + '</td>';
            planetStatisticsRows += '<td>' + response[i][1] + '</td></tr>'
        }
        $('#tplanet_statistics_modal tbody').append(planetStatisticsRows);
    }); 
}

function createPlanetStatistcsTable(){
    planetStatisticsModalHTML = '<div class="modal fade" id="planet_statistics_modal" role="dialog">';
    planetStatisticsModalHTML +=    '<div class="modal-dialog modal-lg">';
    planetStatisticsModalHTML +=         '<div class="modal-content">';
    planetStatisticsModalHTML +=             '<div class="modal-header">';
    planetStatisticsModalHTML +=                 '<button type="button" class="close" data-dismiss="modal">&times;</button>';
    planetStatisticsModalHTML +=                 '<h4 class="modal-title">Planet statistics</h4>';
    planetStatisticsModalHTML +=             '</div>';
    planetStatisticsModalHTML +=             '<div class="modal-body">';
    planetStatisticsModalHTML +=                "<table class='table table-bordered' id=tplanet_statistics_modal><thead>";
    planetStatisticsModalHTML +=                    "<th>Planet</th>";
    planetStatisticsModalHTML +=                    "<th>Votes</th></thead><tbody>";
    planetStatisticsModalHTML +=                "</tbody></table>";
    planetStatisticsModalHTML +=             '</div>';
    planetStatisticsModalHTML +=             '<div class="modal-footer">';
    planetStatisticsModalHTML +=                 '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    planetStatisticsModalHTML +=             '</div>';
    planetStatisticsModalHTML +=         '</div>';
    planetStatisticsModalHTML +=     '</div>';
    planetStatisticsModalHTML += '</div>';
    return planetStatisticsModalHTML;
}

function removeCurrentStatisticsModal(){
    $('#planet_statistics_modal').remove();
}