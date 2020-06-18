
var zwsid = " ";

var geocoder;
var map;
var ticks = [];
var data = [];

function initialize () {
    var coordinates = {lat: 32.75, lng: -97.13};
    geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    var latlng = new google.maps.LatLng(32.75, -97.13);
    var mapOptions = {
      zoom: 17,
      center: coordinates
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        var location = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
    Onmapclick(map, event.latLng);    
  });
}

function Onmapclick(map, location) {   
    var marker;
    var request = new XMLHttpRequest();
    mapclear(null);
    geocoder = new google.maps.Geocoder();
    
    var coordinates1 = {lat: location.lat(), lng: location.lng()};
    
    geocoder.geocode({'location': coordinates1}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(17);
        var address = results[0].formatted_address;
        var newaddr=address.split(',');
        var address1 = encodeURI(newaddr[0]);
        var c=newaddr[1].trim();
        var city1 = encodeURI(c);
        var state1 =encodeURI( newaddr[2].slice(1,3));
        var zipcode1 = encodeURI(newaddr[2].slice(4));    


        request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+" "+"+"+" "+"+"+" ");
        request.withCredentials = "true";
        
        request.onreadystatechange = function(){
            try{
            if (request.readyState == 4) {
                var xml = request.responseXML.documentElement;
                var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
                data.push(address+ " : " +value+"<br>");
				
                document.getElementById("output").innerHTML = data;
                setmarker(map,location,address,value);
 
                if (value==""){
                    alert("zestimate not available, please select some house")
                }            
              }
            }catch(e){
                alert("zestimate Value undefined")
            }
            }
            request.send(null);
        } 
    
      else {
        window.alert('No results found');
        }
    }
     else {
      window.alert('failed status: ' + status);
    }
  }); 
    
    
}

	  
function sendRequest () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4) {
        mapclear(null);
        var xml = request.responseXML.documentElement;
        var address = document.getElementById('address').value;
        var newaddr=address.split(',');
        var address2 = encodeURI(newaddr[0]);
        var c1=newaddr[1].trim();
        var city = encodeURI(c1);
        var state =encodeURI( newaddr[2].slice(1,3));
        var zipcode = encodeURI(newaddr[2].slice(4));

        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
        data.push(address+ " : " +value +"<br>");
        document.getElementById("output").innerHTML = data;   
        
        
        geocoder.geocode( { 'address': address}, function(results, status) 
        {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            map.setZoom(17);
            setmarker(map,results[0].geometry.location,address,value);
        
        
        } else {
        alert('Geocode failed status: ' + status);
      }
    });
    }
}

    var address = document.getElementById("address").value;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+" "+"+"+" "+"+"+" ");
    request.withCredentials = "true";
    request.send(null);
}

function clearadd() {
        document.getElementById("address").value="";
      }

function mapclear(map) {
        for (var i = 0; i < ticks.length; i++) {
          ticks[i].setMap(map);
        }
      }

function setmarker(map,loc,add,val)
{

    var marker = new google.maps.Marker({
            map: map,
            position: loc
            });
        ticks.push(marker);
        var overlay = new google.maps.InfoWindow;   
        overlay.setContent(add+ " : " +val);
        overlay.open(map, marker);
}