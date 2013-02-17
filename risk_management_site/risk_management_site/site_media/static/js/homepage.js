var markers = new Array();

$(document).ready(function() {

    // Creating a LatLng object containing the coordinate for the center of the map
    var centerOfMap = new google.maps.LatLng(45.5482177902010008, 15.9109497070309995);

    // Creating an object literal containing the properties we want to pass to the map
    var options = {
	zoom: 9, // This number can be set to define the initial zoom level of the map
	center: centerOfMap,
        disableDoubleClickZoom: true,
	mapTypeId: google.maps.MapTypeId.ROADMAP // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    };
    // Calling the constructor, thereby initializing the map
    var map = new google.maps.Map(document.getElementById('googleMap'), options);

    $.ajax({
        url: "http://127.0.0.1:8000/getCarsLocations",
        dataType: 'json',
        success: function(data) {
            $.each(data, function(){
                // Define Marker properties
                var market_picture = new google.maps.MarkerImage(this.picture,
		                                                 // This marker is 129 pixels wide by 42 pixels tall.
		                                                 new google.maps.Size(129, 42),
		                                                 // The origin for this image is 0,0.
		                                                 new google.maps.Point(0,0),
		                                                 // The anchor for this image is the base of the flagpole at 18,42.
		                                                 new google.maps.Point(18, 42)
	                                                        );
                var marker = new google.maps.Marker({
	            position: new google.maps.LatLng(this.lon, this.lat),
	            map: map,
                    title: this.type,
	            icon: market_picture
	        });

                var id = this.id;

                markers[id] = marker;

                var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h2 id="firsdadadstHeading" class="firstHeading">Uluru</h2>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335 km (208 mi) '+
    'south west of the nearest large town, Alice Springs; 450 km '+
    '(280 mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'http://en.wikipedia.org/w/index.php?title=Uluru</a> (last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';


                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                infowindow.setPosition(new google.maps.LatLng(1, 1));

                google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(map, this);
     	        });
            });

            worker();

            google.maps.event.addListener(map, 'dblclick', function(event){
                placeMarker(event.latLng, map);
                calculateDistance(event.latLng, markers[37].position);
            });
        }
    });
});

/*
 * Periodic UPDATE position of markers
 */
function worker() {
    $.ajax({
        url: 'http://127.0.0.1:8000/getLastLocationUpdate',
        success: function(data) {
            var json = jQuery.parseJSON( data );
            var marker = markers[json.id];
            changeMarkerPosition(marker, json.lat, json.lon);
        },
        complete: function() {
            setTimeout(worker, 5000);
        }
    });
}

/*
 * Change position of marker to specified latitude and longitude
 */
function changeMarkerPosition(marker, lat, lng) {
    marker.setPosition(new google.maps.LatLng(parseFloat(lat), parseFloat(lng)));
}

/*
 * Calculate distance between specific location (origin) and markers on the map
 */
function calculateDistance(origin) {

    var destinations = []

    for(var i in markers) {
        destinations.push(markers[i].position);
    }

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        }, callback);

    function callback(response, status) {
        console.log(response);
    }

}

function rad(x) {
    return x * Math.PI / 180;
}

function find_closest_marker( event, map ) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    for( i=0;i<markers.length; i++ ) {
        var mlat = markers[i].position.lat();
        var mlng = markers[i].position.lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }

    alert(markers[closest].title);
}


function placeMarker(location, map) {

    var disaster_picture = new google.maps.MarkerImage("site_media/static/img/fire.png",
		                                       // This marker is 129 pixels wide by 42 pixels tall.
		                                       new google.maps.Size(129, 42),
		                                       // The origin for this image is 0,0.
		                                       new google.maps.Point(0,0),
		                                       // The anchor for this image is the base of the flagpole at 18,42.
		                                       new google.maps.Point(18, 42)
	                                              );

    var clickedLocation = new google.maps.LatLng(location);
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: disaster_picture
    });
}