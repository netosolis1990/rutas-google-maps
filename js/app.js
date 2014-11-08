var map,mar,marf;
var lat,lon;
//varibales para los servicios de rutas de google mpas
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
$(document).ready(function() {
    alert("Arrastra los marcadores para pintar la ruta");
    directionsDisplay = new google.maps.DirectionsRenderer();
    //cargamos el mapa
    map = cargarMapa(map,lat = 19.431924,lon = -99.133441);
    //cargamos los marcadores al mapa
    mar = cargarMarcador(mar,map,19.431924,-99.133441,true,'marker.png');
    marf = cargarMarcador(marf,map,19.431924,-99.133441,true,'marker2.png');
    //asignamos el mapa a la variable de visualizacion de rutas
    directionsDisplay.setMap(map);

    //agregamos evento para que al terminar de arrastrar los marcadores se marque la ruta
    google.maps.event.addListener(mar, 'dragend', function() {
        start = new google.maps.LatLng(mar.position.k,mar.position.B);
        end = new google.maps.LatLng(marf.position.k,marf.position.B);
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
            }
          });
    });
    google.maps.event.addListener(marf, 'dragend', function() {
        //inicializamos el punto de partida y de llegada con las posicicones de los marcadores
        start = new google.maps.LatLng(mar.position.k,mar.position.B);
        end = new google.maps.LatLng(marf.position.k,marf.position.B);
        //hacemos una peticion al servicio de rutas
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(result, status) {
            //si la peticion fue exitosa pintamos la ruta
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
            }
          });
    });
    //llamar la funcion de geolocalizacion
    gps();
});

//funcion para cargar el mapa
function cargarMapa(map,lat,lon){
    if(map == undefined){
        var mapOptions = {
            center: new google.maps.LatLng(lat, lon),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scrollwheel: true,
            panControl:false,
            streetViewControl:false
        };
        map = new google.maps.Map(document.getElementById('map'),mapOptions);
    }
    else{
        centrarMapa(map,lat,lon);
    }
    return map;
}

//funcion que centra el mapa
function centrarMapa(map,lat,lon){
    map.panTo(new google.maps.LatLng(lat, lon));
}

//funcion para poner un marcador
function cargarMarcador(marker,map,lat,lon,dr,im){
    if(marker == undefined){
       var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        draggable:dr,
        icon: im,
    });
       marker.setMap(map);
   }
   else{
    console.log('entro');
    marker.setPosition(new google.maps.LatLng(lat, lon));
   }
    centrarMapa(map,lat,lon);
   return marker;
}


//funcion de geolocalizacion
function gps(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(pos){
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            mar = cargarMarcador(mar,map,lat,lon,true,'marker.png');
            marf = cargarMarcador(marf,map,lat,lon,true,'marker2.png');
        }, function(err){
            lat = 19.431924;
            lon = -99.133441;
            mar = cargarMarcador(mar,map,lat,lon,true,'marker.png');
            marf = cargarMarcador(marf,map,lat,lon,true,'marker2.png');
            alert("Error Al Localizar");
        }, {enableHighAccuracy:true, timeout: 10000,maximumAge: 500});
    }
    else
    {
        lat = 19.431924;
        lon = -99.133441;
        mar = cargarMarcador(mar,map,lat,lon,true,'marker.png');
        marf = cargarMarcador(marf,map,lat,lon,true,'marker2.png');
        alert("Error Al Localizar");
    }
}



