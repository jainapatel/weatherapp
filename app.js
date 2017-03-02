var temp;
var appid = "d931fe0e8c63f262fec82dc89549dda5";
var loc;
var icon;
var humidity;
var wind;
var direction;

function updatebyZip (zip){
  var url = "http://api.openweathermap.org/data/2.5/weather?" + "zip=" + zip + "&APPID=" + appid;
  sendRequest(url);
}

function updateByGeo(lat,lon){
  var url = "http://api.openweathermap.org/data/2.5/weather?" + "lat" + Math.round(lat) + "&lon" + Math.round(lon) + "&APPID=" + appid;
  sendRequest (url);
}

function sendRequest (url){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var data = JSON.parse(xmlhttp.responseText);
      var weather = {};
      weather.icon = data.weather[0].id;
      weather.humidity = data.main.humidity;
      weather.wind = data.wind.speed;
      weather.direction = degToDir(data.wind.deg);
      weather.loc = data.name;
      weather.temp = K2C(data.main.temp);
      update(weather);
    }
  };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

function degToDir (deg){
  var range = 360/16;
  var low = 360 - range/2;
  var high = (low + range)% 360;
  var angle = ["N","NE","NNE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  for (i in angle){
    if (deg >= low && deg < high)
      return angle[i];

    low = (low + range ) % 360;
    high = (high + range) % 360;
  }
  return "N";
}

function K2C(k) {
  return Math.round (k - 273.15);
}

function K2F(f){
  return Math.round (f*(9/5)-459.67);
}

function update(weather) {

  wind.innerHTML = weather.wind;
  direction.innerHTML = weather.direction;
  humidity.innerHTML = weather.humidity;
  loc.innerHTML = weather.loc;
  temp.innerHTML = weather.temp;
  icon.src ="src/img/" +weather.icon + ".png";

  }



window.onload = function () {
  temp = document.getElementById("temperature");
  loc = document.getElementById("location");
  icon = document.getElementById("icon");
  humidity = document.getElementById("humidity");
  wind = document.getElementById("wind");
  direction = document.getElementById("direction");

  if(!navigator.geolocation){
      var showPos = function (pos) {
        updateByGeo (pos.coords.latitude,pos.coords.longitude);
      }
    navigator.geolocation.getCurrentPosition (showPos);
  } else {
    var zip = window.prompt("What is your Postal Code?");
    updatebyZip(zip);
  }
}
