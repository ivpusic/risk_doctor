var markers = new Array();
var nearestMarkers = new Array();
var polylines = new Array();

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
                var marker_picture = new google.maps.MarkerImage(this.picture);
                var marker = new google.maps.Marker({
	            position: new google.maps.LatLng(this.lon, this.lat),
	            map: map,
                    status: this.status,
                    title: this.type,
	            icon: marker_picture
	        });

                var id = this.id;

                markers[id] = marker;

                var contentString = '<div id="marker_window">'+
                  '<div id="siteNotice"><h3>' + this.type + '</h3>'
                + '<input type="hidden" class="car_id" value="' + this.id + '" />'
                + '<button class="btn btn-small add-polyline">Show car locations</button> '
                + '<button class="btn btn-small hide-polyline">Hide car locations</button></br>'+
                  '<button class="btn btn-small reserve-car">Reserve car</button></br>' +
                  '<b>Contact: </b>' + this.contact +
                  '</br><b>Number of drivers: </b>' + this.drivers +
                  '</br><b>Capacity of car: </b>' + this.capacity +
                  '</br><b>Status: </b><span class="status">' + this.status +
    '</span></div>';


                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(map, this);
     	        });
            });

            worker();

            google.maps.event.addListener(map, 'dblclick', function(event){
                placeMarker(event.latLng, map);
            });

            $("#googleMap").on("click", "#marker_window .reserve-car", function(data) {

                var id = $(this).parent().find(".car_id").val();
                var statusEl = $(this).parent().find(".status");
                $.ajax({
                    url: "http://127.0.0.1:8000/updateCarStatus/" + id + "?status=Busy",
                    type: "GET",
                    success: function(response) {
                        if(response == "OK") {
                            statusEl.html("Busy");
                            markers[id].status = "Busy";
                        }
                    }
                });

            });

            $("#googleMap").on("click", "#marker_window .add-polyline", function(data) {

                var id = $(this).parent().find(".car_id").val()

                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: "http://127.0.0.1:8000/getCarLocations/" + id,
                    success: function(data) {

                        var carLocationCoordinates = []

                        $.each(data, function() {
                            carLocationCoordinates.push(new google.maps.LatLng(this.lon, this.lat));
                        });

                        if(polylines[id] == undefined) {
                            var polyline = new google.maps.Polyline({
                                path: carLocationCoordinates,
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                            });

                            polyline.setMap(map);
                            polylines[id] = polyline;
                        }

                        else {
                            polylines[id].setPath(carLocationCoordinates);
                            polylines[id].setMap(map);
                        }
                    }
                });
            });

            $("#googleMap").on("click", "#marker_window .hide-polyline", function(data) {
                var id = $(this).parent().find(".car_id").val();
                polylines[id].setMap(null);
            });
        }
    });

    $("#body_container").on("click", "#show_cars", function() {
        for(var key in markers) {
            markers[key].setMap(map);
        }
        $(this).remove();
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
            changeMarkerPosition(marker, json.lon, json.lat);
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

function createOptionMenu() {

    return '<INPUT NAME="options" TYPE="CHECKBOX" VALUE="police">'+
      ' Police cars<br>'+
    '<INPUT NAME="options" TYPE="CHECKBOX" VALUE="ambulance">'+
      ' Ambulance cars</input></br>'+
    '<INPUT NAME="options" TYPE="CHECKBOX" VALUE="firefighters">'+
      ' Firefighters cars</input></br>'+
    '<INPUT NAME="options" TYPE="CHECKBOX" VALUE="forestservice">'+
      ' Forestservice cars</input></br>';
}


/*
 * Function for placing marker and binding events and markup for infowindow on marker
 */
function placeMarker(location, map) {

    var disaster_picture = new google.maps.MarkerImage("site_media/static/img/fire.png");

    var clickedLocation = new google.maps.LatLng(location);
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: disaster_picture,
        title: "security problem"
    });

    var contentString = '<div id="marker_window">'+
      '<div id="siteNotice"><h4>Finding closest vehicels</h4>'
    + '<label><b>Select vehicels to find: </b></label>'
    + createOptionMenu()
    + '<label><b>Select distance (leave empty for any): </b></label>'
    + '<input type="number" class="distance"/> (km)'
    + '<br/><button class="btn btn-small find_vehicels">Find vehicles</button> '
    + '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        position: new google.maps.LatLng(1, 1)
    });

    $("#googleMap").on("keydown", "input[type=number]", function(event) {
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
             (event.keyCode == 65 && event.ctrlKey === true) ||
             (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
        }
        else {
            if ( event.shiftKey|| (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) )
            {
                event.preventDefault();
            }
        }
    });

    $("#googleMap").on("click", ".find_vehicels", function() {

        var selectedVehicels = []

        $("input:checkbox[name=options]:checked").each(function(){
            selectedVehicels.push($(this).val());
        });

        var distance = $(this).parent().find(".distance").val()

        calculateDistance(location, selectedVehicels, distance);

    });

    google.maps.event.addListener(marker, 'click', function() {
	infowindow.open(map, this);
    });

}

/*
 * Calculate distance between specific location (origin) and markers on the map
 */
function calculateDistance(origin, selectedVehicels, distance) {

    var destinations = [];
    var tmpVehicels = [];

    for(var i in markers) {
        if($.inArray(markers[i].title, selectedVehicels) != -1) {
            destinations.unshift(markers[i].position);
            tmpVehicels.unshift(markers[i]);
        }
        else {
            markers[i].setMap(null);
        }
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

        var i = 0;
        if(status == google.maps.DistanceMatrixStatus.OK) {
            $.each(response.rows[0].elements, function(ind, obj) {
                if(!(obj.status == "OK" && (parseInt(obj.distance.text) <= parseInt(distance) || distance == "") && tmpVehicels[i].status == "Free")) {
                    tmpVehicels[i].setMap(null);
                }
                i++;
            });
        }
        var elem = $("#show_cars").html();
        if(elem == undefined || elem == null) {
            $("#body_container").append("<button id='show_cars' class='btn btn-primary .btn-large'>Show all cars</button>");
        }
    }
}