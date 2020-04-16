$(document).ready(function() {


//Populate the data set with ajax API calls
var APIKey = "bafd4e5c784edb86b2b6568e8299bfff";
var city = "Reston";
var state = "Virginia";
var code = 840;
// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "," + state + code + "&appid=" + APIKey;

var forecastArray = [];


$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

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
        if( forecastArray.length < 5 ){
          forecastArray.push(params[i]);
        }
      }
    }
  }
getForecastForEachDay(response.list)
console.log(forecastArray)
// }); old end of ajax





// //a for loop to select the day that is to be forcasted in the 5 day forcast
for (var i = 1; i < 5; i++){
    var daySelected = $("#day" + [i]);
    console.log(daySelected);
    daySelected.text("");
    var newDivHeader = $("<h5>").text(forecastArray[i].dt_txt.split(" ")[0]);
    daySelected.append(newDivHeader);
    var newDivTemp = $("<div>").text("Temp: " + forecastArray[i].main.temp);
    daySelected.append(newDivTemp);
    // var newDivWeather= $("<div>").text("Weather: " + forecastArray[i].weather[0].main);
    // daySelected.append(newDivWeather);

    //Adding in the weather icon
    var newIconCode = forecastArray[i].weather[0].icon;
    console.log(newIconCode)
    var IconURL = "http://openweathermap.org/img/w/" + newIconCode + ".png"
    var newIcon = $("<div>")
    newIcon.html("<img src=" + IconURL + ">");
    daySelected.append(newIcon)

    var newDivHumidity = $("<div>").text("Humidity: " + forecastArray[i].main.humidity + " %");
    daySelected.append(newDivHumidity);
    var newDivWind = $("<div>").text("Windspeed: " + forecastArray[i].wind.speed + " MPH");
    daySelected.append(newDivWind);
    //  daySelected.children().text(forecastArray[i].main.temp)
// //another for loop to select the lines of text in that forcast
//     //loops through the data array to give the selectedDay in the 5 day forcast its proper data
//     for (j = 1; j < 5; j++){
//         daySelected.children[j].text(data[i].date) //Assigsn the first child of day selected to the data value of the ith day
    };


  }); //End of Ajax






});