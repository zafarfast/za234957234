
var cityName; //stores city name entered by the user
var weatherDetail; //stores the data object returned by the API
var lat; //lattitude
var lon; //longitude
var searchHistory = {arrayOfPreviousSearches: []}; //stores user search history

// getWeatherData() function runs when user clicks on the search button. It fetches the data from API and displays it on the page
function getWeatherData() {
    //read the user input text and store it in CityName
    cityName = document.getElementById('search-box').value;

    //Format city name to Capitalization
    var slice = cityName.slice(1);
    cityName = cityName.charAt(0).toUpperCase() + slice.toLowerCase();

    //place the city name into the API endpoint URL and store it to coordinateRequestUrl variable
    var coordinateRequestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=5716c3001ebc17b2b097de37762da425";

    //send GET request to Openweather API to get lattitude and logitudes of the city
    fetch(coordinateRequestUrl)

        .then((response) => {
            //checks if the API returns a valid response
            if (response.status === 200) { return response.json() }
            else {
                console.log("Error has occured")
            }
        })
        .then((data) => {
            //check if the object returned by the API is empty which means that no city is found 
            if (data.length === 0) {
                document.getElementById('error-message').textContent = "City name is not valid, please check spellings";
                //this set-timeout function cleats the above message after 3 seconds
                setTimeout(() => {
                    document.getElementById('error-message').textContent = "";
                }, 3000);
                return
            }

            //stores the lattitudes and longitudes in the global variables
            lat = data[0].lat;
            lon = data[0].lon;

            //place the lat and lon values in the API endpoint URL
            var weatherRequestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=5716c3001ebc17b2b097de37762da425";
            //return weatherRequestUrl variable to the next .then
            return weatherRequestUrl;
        })
        .then((weatherRequestUrl) => {
            //fetch Today's weather data
            fetch(weatherRequestUrl).then((response) => { return response.json() })
                .then((data) => {
                    weatherDetail = data;
                    return weatherDetail
                })
                .then((weatherDetail) => {
                    document.getElementById('city-name').textContent = cityName;

                    //If the user search is not aleady in the array then add the search in the array and display it below 
                    //search bar and apply event listner
                    if (!searchHistory.arrayOfPreviousSearches.includes(cityName)) {
                        document.getElementById('search-box').value = cityName;
                        var previousSearchesItem = document.createElement('li');
                        previousSearchesItem.textContent = cityName;
                        document.getElementById('previous-searches').appendChild(previousSearchesItem);
                        document.getElementById('previous-searches').lastChild.addEventListener("click", applyEventListner);
                        searchHistory.arrayOfPreviousSearches.push(cityName);
                        localStorage.setItem('search-history', JSON.stringify(searchHistory));
                    }


                    // function applyEventListner(event) {
                    //     document.getElementById('search-box').value = event.target.textContent;
                    //     getWeatherData();

                    // }

                    //Display weather data to Today's weather section

                    document.getElementById('today-current-temp').textContent = Math.floor((weatherDetail.main.temp * 9) / 5 - 459.67) + "°F"
                    document.getElementById('feels-like-temp').textContent = "Feels like " + Math.floor((weatherDetail.main.feels_like * 9) / 5 - 459.67) + "°F"
                    document.getElementById('today-humidity').textContent = "Humidity: " + weatherDetail.main.humidity + "%";
                    document.getElementById('today-wind-speed').textContent = "Wind Speed: " + Math.floor(weatherDetail.wind.speed) + "MPH";
                    document.getElementById('weather-icon').setAttribute('src', "https://openweathermap.org/img/wn/" + weatherDetail.weather[0].icon + ".png")
                    document.getElementsByClassName('display-weather')[0].classList.add('display-weather-animate');
                    document.getElementsByClassName('display-weather')[0].style.display = "block";
                    window.scrollTo(0, 110); //Scrolls the window down 110px to show the current weather.


                    //Get 5-Days forecast data from the API

                    var fiveDayForcastEndpoint = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=7a4ddea3ff36d70ae3dcef03be233bf4"
                    fetch(fiveDayForcastEndpoint).then((response) => { return response.json() }).then((data) => {

                        //Display forecast data to the 5-Days forecast section

                        //Spliting the text date and re-arranging it to match the required date format and displaying it
                        document.getElementById('forecastDay1').textContent = data.list[0].dt_txt.split(" ")[0].split("-")[2] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[1] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[0]
                        document.getElementById('weather-icon1').setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png")
                        //Weather forecast data sends data in 3 hours intervals for each day. We have been asked to select temp value of any interval of the day.
                        document.getElementById('day1-temp').textContent = "Temp: " + Math.floor((data.list[0].main.temp * 9) / 5 - 459.67) + "°F"
                        document.getElementById('day1-humidity').textContent = "Humidity: " + data.list[0].main.humidity + "%";
                        document.getElementById('day1-wind-speed').textContent = "Wind Speed: " + Math.floor(data.list[0].wind.speed) + "MPH";

                        document.getElementById('forecastDay2').textContent = data.list[8].dt_txt.split(" ")[0].split("-")[2] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[1] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[0]
                        document.getElementById('weather-icon2').setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[8].weather[0].icon + ".png")
                        document.getElementById('day2-temp').textContent = "Temp: " + Math.floor((data.list[8].main.temp * 9) / 5 - 459.67) + "°F"
                        document.getElementById('day2-humidity').textContent = "Humidity: " + data.list[8].main.humidity + "%";
                        document.getElementById('day2-wind-speed').textContent = "Wind Speed: " + Math.floor(data.list[8].wind.speed) + "MPH";

                        document.getElementById('forecastDay3').textContent = data.list[16].dt_txt.split(" ")[0].split("-")[2] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[1] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[0]
                        document.getElementById('weather-icon3').setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[16].weather[0].icon + ".png")
                        document.getElementById('day3-temp').textContent = "Temp: " + Math.floor((data.list[16].main.temp * 9) / 5 - 459.67) + "°F"
                        document.getElementById('day3-humidity').textContent = "Humidity: " + data.list[16].main.humidity + "%";
                        document.getElementById('day3-wind-speed').textContent = "Wind Speed: " + Math.floor(data.list[16].wind.speed) + "MPH";

                        document.getElementById('forecastDay4').textContent = data.list[24].dt_txt.split(" ")[0].split("-")[2] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[1] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[0]
                        document.getElementById('weather-icon4').setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[32].weather[0].icon + ".png")
                        document.getElementById('day4-temp').textContent = "Temp: " + Math.floor((data.list[24].main.temp * 9) / 5 - 459.67) + "°F"
                        document.getElementById('day4-humidity').textContent = "Humidity: " + data.list[24].main.humidity + "%";
                        document.getElementById('day4-wind-speed').textContent = "Wind Speed: " + Math.floor(data.list[24].wind.speed) + "MPH";

                        document.getElementById('forecastDay5').textContent = data.list[32].dt_txt.split(" ")[0].split("-")[2] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[1] +"/"+ data.list[0].dt_txt.split(" ")[0].split("-")[0]
                        document.getElementById('weather-icon5').setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[39].weather[0].icon + ".png")
                        document.getElementById('day5-temp').textContent = "Temp: " + Math.floor((data.list[32].main.temp * 9) / 5 - 459.67) + "°F"
                        document.getElementById('day5-humidity').textContent = "Humidity: " + data.list[32].main.humidity + "%";
                        document.getElementById('day5-wind-speed').textContent = "Wind Speed: " + Math.floor(data.list[32].wind.speed) + "MPH";
                    })


                })

        })


}

// Code starts here. The two event listeners below waits for the user to click on the search button
function populateSearchHistory()
{
    if (localStorage.getItem('search-history') != null) //checks if the loacal storage is empty or not
    {
    searchHistory = JSON.parse(localStorage.getItem('search-history'))
    for(i=0; i<searchHistory.arrayOfPreviousSearches.length; i++)
    {
    var previousSearchesItem = document.createElement('li');
    previousSearchesItem.textContent = searchHistory.arrayOfPreviousSearches[i];
    document.getElementById('previous-searches').appendChild(previousSearchesItem);
    document.getElementById('previous-searches').lastChild.addEventListener("click", applyEventListner);
    }
    }

}

function applyEventListner(event) {
    document.getElementById('search-box').value = event.target.textContent;
    getWeatherData();

}


document.getElementById('search-button').addEventListener("click", getWeatherData);
document.getElementById('search-box').addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeatherData()
    }
});

//populateSearchHistory() looks for previous searches in the local storage on page load and populates it on the search section
populateSearchHistory();