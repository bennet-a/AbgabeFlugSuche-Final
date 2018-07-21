/*
*   Dieses File entält die Logik zur Flugsuche. Darin enthalten
*   sind die User-Interaktionen, Erzeugung grafischer Elemente,
*   sowie der Aufruf der API
 */

//Nachfolgend globalen Parameter

var params = {
    from: 1,
    to: 2,
};

//Nachfolgend die Funktionen

function setParams()
{
    var dropDown1 = document.getElementById('DropDownFrom');
    var dropDown2 = document.getElementById('DropDownTo');

    var valueDropDown1 = dropDown1.options[dropDown1.selectedIndex].value;
    var valueDropDown2 = dropDown2.options[dropDown2.selectedIndex].value;
    console.log(valueDropDown1);
    console.log(valueDropDown2);

    params.from = valueDropDown1;
    params.to = valueDropDown2;

    console.log(params);
}

function showOverlay()
{
    var element = document.getElementById('waitOverlayWrapper');
    element.style.display="block";
}

function hideOverlay()
{
    var element = document.getElementById('waitOverlayWrapper');
    element.style.display ="none";
}

function updateFromFeld ()
{
    var userInput = document.getElementById('DropDownFrom');
    var valueUserInput = userInput[userInput.selectedIndex].value;

    searchForm = document.forms['EingabefelderFormSuche'];
    searchForm.elements['ValueFieldFrom'].value = valueUserInput;
}

function updateToFeld ()
{
    var userInput = document.getElementById('DropDownTo');
    var valueUserInput = userInput[userInput.selectedIndex].value;

    searchForm = document.forms['EingabefelderFormSuche'];
    searchForm.elements['ValueFieldTo'].value = valueUserInput;
}


//Hauptmethode der Anwendung

function triggerFlugSuche()
{
    setParams();
    showOverlay();

    function FlightSearchAPI()
    {
        this.endpoint = 'http://flights.eliashenrich.de/api.php';

        this.requestAPI = function (action, data, callback)
        {
            var url = this.endpoint + '?action=' + action;
            var keys = Object.keys(data);

            for (var i = 0; i < keys.length; i++)
            {
                var paramName = keys[i];
                var paramValue = data[keys[i]];

                url += "&" + paramName + "=" + paramValue;
            }

            var request = new XMLHttpRequest();

            request.onreadystatechange = function ()
            {
                console.log("Status hat sich geändert", this.readyState);
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        console.log("Anfrage erfolgreich");
                        console.log(this.responseText);
                        callback(this.responseText);
                        hideOverlay();
                    }
                }
            };

            //request.open - Das true stellt eine asynchrone Anfrage ein
            request.open('GET', url, true);
            request.send();

        }
    }

    var flightSearch = new FlightSearchAPI();
    flightSearch.requestAPI('/route/find', params, successCallback)

    function addListItem(airportFrom, airportTo, departure, arrival)
    {
        var listItem = document.getElementById('ResultDummy');

        //Elemente werden kopiert und neu eingefügt
        var newListItem = listItem.cloneNode(true);
        newListItem.setAttribute('id', '');
        newListItem.classList.remove('hidden');

        newListItem.getElementsByClassName('airportFrom')[0].innerText = airportFrom;
        newListItem.getElementsByClassName('airportTo')[0].innerText = airportTo;
        newListItem.getElementsByClassName('Abflug')[0].innerHTML = departure;
        newListItem.getElementsByClassName('Ankunft')[0].innerHTML = arrival;

        document.getElementById('FlightSearchResult').appendChild(newListItem);
    }

    function successCallback(data)
    {
        var response = JSON.parse(data);

        for (var i = 0; i < response.length; i++)
        {
            var flug = response[i];
            console.log("Flug " + i, flug);

            for (var j = 0; j < flug.length; j++) 
            {
                var leg = flug[j];
                console.log("Leg: " + j, flug);

                var airportFrom = leg.airportFrom.CityName;
                var airportTo = leg.airportTo.CityName;
                var departure=leg.schedule[0].ScheduledDepartureTime;
                var arrival=leg.schedule[0].ScheduledArrivalTime;

                addListItem(airportFrom, airportTo, departure, arrival);
            }
        }
    }
}