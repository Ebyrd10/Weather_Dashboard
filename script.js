//Data Set of dates and variables waiting to be assigned
var data = [
    {date: "", temp: 0, humidity: 0, windSpeed: 0, uvIndex: 0}, //Current Date, i = 0
    {date: "", temp: 0, humidity: 0, windSpeed: 0, uvIndex: 0}, //the first day of the 5 day forcast, i =1
    {date: "", temp: 0, humidity: 0, windSpeed: 0, uvIndex: 0},
    {date: "", temp: 0, humidity: 0, windSpeed: 0, uvIndex: 0},
    {date: "", temp: 0, humidity: 0, windSpeed: 0, uvIndex: 0},
    {date: "", temp: 0, humidity: 0, windSpeed: 0, uvIndex: 0}
];

//Populate the data set with ajax API calls
var APIKey = "bafd4e5c784edb86b2b6568e8299bfff";
var city = "Reston";
var state = "Virginia";
var code = 840;
// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "," + state + code + "&appid=" + APIKey;

var forecastArray = [ ];


$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

//Gary's Function for populating forecastArray with useful data
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
});

console.log(Array.isArray(forecastArray));
console.log(forecastArray)
console.log(forecastArray.length)
console.log(forecastArray.keys)
console.log(Object.keys(forecastArray).length)


//   console.log(forecastArray)
//   console.log("data Array: " + data)
// console.log(forecastArray[1])
  //move values from forecastArray to data[]
//   moveData = function(){
//   for(var i=0; i < 5; i++){
    // // data[i].date = forecastArray.dt_txt.split(" ")[0];
    // data[i].temp = forecastArray[i].main.temp;
    // data[i].humidity = forecastArray[i].main.humidity;
    // data[i].windSpeed = forecastArray[i].main.wind.speed;
//     // // data[i].uvIndex = forecastArray[i].main.wind.speed;
    
//   }
// }
// moveData();

// //a for loop to select the day that is to be forcasted in the 5 day forcast
// for (var i = 1; i <= 5; i++){
//     var daySelected = $("#day" + [i]);
//     console.log(daySelected)
// //another for loop to select the lines of text in that forcast
//     //loops through the data array to give the selectedDay in the 5 day forcast its proper data
//     for (j = 1; j < 5; j++){
//         daySelected.children[j].text(data[i].date) //Assigsn the first child of day selected to the data value of the ith day
//     };


// }