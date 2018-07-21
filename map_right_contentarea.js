
/*  
    Diese Klasse beinhaltet den JavaScript-Code zum
    Initialisieren der Leaflet Karte
*/


var mapObject;
var accessToken = 'pk.eyJ1IjoiZWxrcm9rZXR0byIsImEiOiJjamplZ2NqODQybG4wM3F0ZTU0N2s4azdxIn0.VL6YIZWFhnan5AWzxgIFpw';

function initMap(mapId)
{
    mapObject = L.map(mapId, {
        center: [51.1, 10, 45],
        maxZoom: 48,
        minZoom: 3,
        zoom: 4
    });


    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Copyright-Hinweise...',
        MinZoom: 2,
        id: 'mapbox.streets',
        accessToken: accessToken
    }).addTo(mapObject);
    
}