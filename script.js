$(document).ready(function() {


//Populate the data set with ajax API calls
var APIKey = "bafd4e5c784edb86b2b6568e8299bfff";
var city = "Reston";
var state = "Virginia";
var code = 840;
// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "," + state + code + "&appid=" + APIKey;

var forecastArray = [];
var lat = "";
var lon = "";
var uvValue = "";

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    //Stores the longitude and latitude of the the city to get the UV index later
    lat = response.city.coord.lat
    lon = response.city.coord.lon
// Gary's Function for populating forecastArray with useful data
function getForecastForEachDay(params){
    var currentDate = "";
    for(var i=0; i<params.length; i++){
      // We want to capture one weather object for each day in the list. Once we've captured that
      // object, we can ignore all other objects for the same day
      var dateOfListItem = params[i].dt_txt.split(" ")[0];
      if( dateOfListItem !== currentDate ){
        // We need to extract just the date part and ignore the time
        currentDate = dateOfListItem;
        // Push this weather object to the forecasts array
        if( forecastArray.length <= 6 ){
          forecastArray.push(params[i]);
        }
      }
    }
  }
getForecastForEachDay(response.list)
console.log(forecastArray)
// }); old end of ajax




//5 Day forcast
// //a for loop to select the day that is to be forcasted in the 5 day forcast
for (var i = 1; i < forecastArray.length; i++){
    var daySelected = $("#day" + [i]);
    daySelected.text("");
    var newDivHeader = $("<h5>").text(forecastArray[i].dt_txt.split(" ")[0]);
    daySelected.append(newDivHeader);
    
    // var newDivWeather= $("<div>").text("Weather: " + forecastArray[i].weather[0].main);
    // daySelected.append(newDivWeather);

    //Adding in the weather icon
    var newIconCode = forecastArray[i].weather[0].icon;
    var IconURL = "http://openweathermap.org/img/w/" + newIconCode + ".png"
    var newIcon = $("<div>")
    newIcon.html("<img src=" + IconURL + ">");
    daySelected.append(newIcon)

    var newDivTemp = $("<div>").text("Temp: " + forecastArray[i].main.temp);
    daySelected.append(newDivTemp);
    var newDivHumidity = $("<div>").text("Humidity: " + forecastArray[i].main.humidity + "%");
    daySelected.append(newDivHumidity);
    // var newDivWind = $("<div>").text("Windspeed: " + forecastArray[i].wind.speed + " MPH");
    // daySelected.append(newDivWind);

    };
    

    //Today's weather
    //The Header for Today
    var todayWeather = $("#todayWeather");
    console.log(todayWeather)
    var newTodayHeader = $("<h4>")
    //Adding in the weather icon
    var newIconCode = forecastArray[0].weather[0].icon;
    var IconURL = "http://openweathermap.org/img/w/" + newIconCode + ".png"
    newTodayHeader.html("<strong>" + city + "</strong>" + " " + "("  + forecastArray[0].dt_txt.split(" ")[0] + ")" + "<img src=" + IconURL + ">");
    todayWeather.append(newTodayHeader)
    //Adding in details about today's weather
    var newDivTemp = $("<div>").text("Temp: " + forecastArray[0].main.temp);
    todayWeather.append(newDivTemp);
    var newDivHumidity = $("<div>").text("Humidity: " + forecastArray[0].main.humidity + "%");
    todayWeather.append(newDivHumidity);
    var newDivWind = $("<div>").text("Windspeed: " + forecastArray[0].wind.speed + " MPH");
    todayWeather.append(newDivWind);


  var getUVindex = function(){
    console.log(lat)
    console.log(lon)
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
    console.log(uvURL)
    $.ajax({
      url: uvURL,
      method: "GET"
    }).then(function(response) {
       uvValue = response.value;
       var todayWeather = $("#todayWeather");
       var newDivUV = $("<div>").text("UV Index: " + uvValue);
      todayWeather.append(newDivUV);
    }); 
  };

  getUVindex();

}); //End of Ajax



});