$(document).ready(function () {


  //Populate the data set with ajax API calls
  var APIKey = "bafd4e5c784edb86b2b6568e8299bfff";
  var city = "Reston";
  var state = "Virginia";
  var code = 840;
  // Here we are building the URL we need to query the database
  // var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + state + code + "&appid=" + APIKey;
  var queryURL = "";

  var forecastArray = [];
  var lat = "";
  var lon = "";
  var uvValue = "";
  var cityList = [];
  var lastCity = "";

  // //A function to check to see if there is a saved cityList in local storage, if there is it then recreates the search history buttons
  var init = function(){
    if (localStorage.getItem("storedCityList")){
      cityList = JSON.parse(localStorage.getItem("storedCityList"));
      console.log(cityList)
      //Gets the last looked up city if there is one saved in local storage
      if (localStorage.getItem("storedLastCity")) {
      city = localStorage.getItem("storedLastCity")};
      //Recreates the button list based on the city search history
      for (j = 0; j < cityList.length; j++) {
        var cityListDisplay = $("#cityListDisplay")
        var newBtn = $("<button>").text(cityList[j]);
        newBtn.on("click", function () {
          event.preventDefault();
          city = $(this).text();
          renderCityList();
          //Clears the previous city from the current weather box
          $("#todayWeather").text("");
          //Searchs and renders that data for the new city
          lookUp();
        })
        cityListDisplay.append(newBtn);
      }
  }
  };
  // //Running the function to grab any values from local storage
  init();

  //A function to save the current cityList to local storage
  var saveToLocalStorage = function() {
    var cityListStr = JSON.stringify(cityList);
    localStorage.setItem("storedCityList", cityListStr); 
  };

  //The main function that gets and renders data onto the page
  var lookUp = function () {
                // //If there is no city in the form field, then just use Reston

                // city = $("#city-input").val().trim();
                // if (!city) {
                //   city = "Reston"
                // }
    //Check for a saved last city to search for
    // if (localStorage.getItem("storedLastCity")) {
    //   city = JSON.parse(localStorage.getItem("storedLastCity"));
    // }
    //Reset the URL and the forecase Array to remove the old entries' data
    forecastArray = [];
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + state + code + "&appid=" + APIKey;
    // //Check for a saved last city to search for
    // if (localStorage.getItem("storedLastCity")) {
    //   city = localStorage.getItem("storedLastCity");
    // }

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      //Stores the longitude and latitude of the the city to get the UV index later
      lat = response.city.coord.lat
      lon = response.city.coord.lon
      // Gary's Function for populating forecastArray with useful data
      function getForecastForEachDay(params) {
        var currentDate = "";
        for (var i = 0; i < params.length; i++) {
          // We want to capture one weather object for each day in the list. Once we've captured that
          // object, we can ignore all other objects for the same day
          var dateOfListItem = params[i].dt_txt.split(" ")[0];
          if (dateOfListItem !== currentDate) {
            // We need to extract just the date part and ignore the time
            currentDate = dateOfListItem;
            // Push this weather object to the forecasts array
            if (forecastArray.length < 5) {
              forecastArray.push(params[i]);
            }
          }
        }
      }
      getForecastForEachDay(response.list)

      //5 Day forcast
      // //a for loop to select the day that is to be forcasted in the 5 day forcast
      for (var i = 0; i < forecastArray.length; i++) {
        var daySelected = $("#day" + [i]);
        daySelected.text("");
        var newDivHeader = $("<h5>").text(forecastArray[i].dt_txt.split(" ")[0]);
        daySelected.append(newDivHeader)

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
      };


      //Today's weather
      //The Header for Today
      var todayWeather = $("#todayWeather");
      var newTodayHeader = $("<h4>")
      //Adding in the weather icon
      var newIconCode = forecastArray[0].weather[0].icon;
      var IconURL = "http://openweathermap.org/img/w/" + newIconCode + ".png"
      newTodayHeader.html("<strong>" + city + "</strong>" + " " + "(" + forecastArray[0].dt_txt.split(" ")[0] + ")" + "<img src=" + IconURL + ">");
      todayWeather.append(newTodayHeader)
      //Adding in details about today's weather
      var newDivTemp = $("<div>").text("Temp: " + forecastArray[0].main.temp);
      todayWeather.append(newDivTemp);
      var newDivHumidity = $("<div>").text("Humidity: " + forecastArray[0].main.humidity + "%");
      todayWeather.append(newDivHumidity);
      var newDivWind = $("<div>").text("Windspeed: " + forecastArray[0].wind.speed + " MPH");
      todayWeather.append(newDivWind);


      var getUVindex = function () {
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
          url: uvURL,
          method: "GET"
        }).then(function (response) {
          uvValue = response.value;
          var todayWeather = $("#todayWeather");
          var newDivUV = $("<div>").html("UV Index: <span id='uvDisplay'>" + uvValue + "</span>" ) ;
          
          todayWeather.append(newDivUV);
        });
      };

      getUVindex();

    }); //End of Ajax
    //Saves the last looked up city so that we can save it to local storage and bring it up later
    console.log(city)
    lastCity = city;
    localStorage.setItem("storedLastCity", lastCity); 
  }; //end of the lookUp function

  lookUp();

  renderCityList = function () {
    $("button").remove();
    for (j = 0; j < cityList.length; j++) {
      var cityListDisplay = $("#cityListDisplay")
      var newBtn = $("<button>").text(cityList[j]);
      newBtn.on("click", function () {
        event.preventDefault();
        city = $(this).text();
        renderCityList();
        //Clears the previous city from the current weather box
        $("#todayWeather").text("");
        //Searchs and renders that data for the new city
        lookUp();
      })
      cityListDisplay.append(newBtn);
    }
    saveToLocalStorage();
  };

  $("#city-form").on("submit", function (event) {
    event.preventDefault();
    $("#todayWeather").text("");
    city = $("#city-input").val().trim();
    //if the city has been searched before, dont create a new button, but still allow the weather lookup request to go through
    if (cityList.includes(city)) {
      lookUp();
      return
    }
    else if (city === "") { return; }
    else {
      cityList.push(city);
    };
    renderCityList();
    // saveToLocalStorage();
    //Clears the previous city from the current weather box
    //If there is no city in the form field, then just use Reston
    city = $("#city-input").val().trim();
    if (!city) {
      city = "Reston"
    }
    //Searchs and renders that data for the new city
    lookUp();
  })

}); ///end of the "wait for everything to load in" script