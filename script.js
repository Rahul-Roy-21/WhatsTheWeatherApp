const Results = document.querySelector("#weatherUpdates");
const notificationBar = document.querySelector("#notification");
const Logo = document.querySelector(".welcomeImg");
const searchInput = document.querySelector(".search input");
const submitButton = document.querySelector(".search button");

const cityName = document.querySelector("#city");
const weatherIcon = document.querySelector(".weather-icon img");
const tempElement = document.querySelector(".temp-value span");
const weatherPhrase = document.querySelector(".weather-description");

const linkAccuWeather = document.querySelector(".details a");

const todayWeather = document.querySelectorAll(".il1");
const todayTemp = document.querySelector(".ir1");

const tomorrowWeather = document.querySelectorAll(".il2");
const tomorrowTemp = document.querySelector(".ir2");

const dayaftertomorrowWeather = document.querySelectorAll(".il3");
const dayaftertomorrowTemp = document.querySelector(".ir3");

const NextDaysElement = document.querySelector(".btn");
const progressBar = document.querySelector(".progress-bar");
const sunRiseElement = document.querySelector(".rise");
const sunSetElement = document.querySelector(".set");

const realFeel = document.querySelector(".realfeel");
const humidityElement = document.querySelector(".humidity");
const cloudsElement = document.querySelector(".cloud");
const pressure = document.querySelector(".pressure");
const windSpeed = document.querySelector(".wind");
const AQIElement = document.querySelector(".aqiElement");

// Accuweather API key
const key = "uXM70077fLmjghIS4IlSBdCk3lm3Qxc3";

// API Fetch Storage
const weather = {};
var localTime = "";

hideResults();

submitButton.addEventListener("click", function () {
    var input = searchInput.value;
    if (input == "") {
        displayNotificationBar("No City Entered !!", "danger");
        hideResults();
    }
    else {
        getWeather(input);
    }
});

function getWeather(input) {
    const locationApi = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${input}`;

    fetch(locationApi)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            if (!data[0]) {
                displayNotificationBar("No Such City Exists !!", "danger");
                hideResults();
            }
            else {
                weather.city = `${data[0]["EnglishName"]}, ${data[0]["Country"]["EnglishName"]}`;
                getWeatherwithKey(data[0]["Key"]);
            }
        })
        .catch((error) => {
            console.error('My Error:', error);
        });

}

function getWeatherwithKey(locationKey) {
    const currentconditionsApi = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${key}&details=true`;

    fetch(currentconditionsApi)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {

            localTime = data[0]["LocalObservationDateTime"];
            weather.weatherText = data[0]["WeatherText"];

            weather.weatherIcon = data[0]["WeatherIcon"];
            weather.temp = Math.ceil(data[0]["Temperature"]["Metric"]["Value"]);
            weather.realfeeltemp = Math.ceil(data[0]["RealFeelTemperature"]["Metric"]["Value"]);
            weather.humidity = Math.floor(data[0]["RelativeHumidity"]);
            weather.wind = data[0]["Wind"]["Speed"]["Metric"]["Value"];

            weather.cloudcover = data[0]["CloudCover"];
            weather.pressure = data[0]["Pressure"]["Metric"]["Value"];
            weather.pressuretendency = data[0]["PressureTendency"]["LocalizedText"];
            weather.currentForecastLink = data[0]["Link"];
            weather.UVIndex = `${data[0]["UVIndex"]} (${data[0]["UVIndexText"]})`;
            displayWeather1();
        });

    const next5days = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${key}&details=true`;

    fetch(next5days)
        .then(function (response) {
            let datanext = response.json();
            return datanext;
        })
        .then(function (datanext) {

            weather.next5daysweather = datanext["DailyForecasts"][0]["Link"];
            weather.sunrise = datanext["DailyForecasts"][0]["Sun"]["Rise"];
            weather.sunset = datanext["DailyForecasts"][0]["Sun"]["Set"];

            weather.icon0 = datanext["DailyForecasts"][0]["Day"]["Icon"];
            weather.minTemp0 = Math.ceil(celsius(datanext["DailyForecasts"][0]["Temperature"]["Minimum"]["Value"]));
            weather.maxTemp0 = Math.ceil(celsius(datanext["DailyForecasts"][0]["Temperature"]["Maximum"]["Value"]));
            weather.iconPhrase0 = datanext["DailyForecasts"][0]["Day"]["IconPhrase"];

            weather.icon1 = datanext["DailyForecasts"][1]["Day"]["Icon"];
            weather.minTemp1 = Math.ceil(celsius(datanext["DailyForecasts"][1]["Temperature"]["Minimum"]["Value"]));
            weather.maxTemp1 = Math.ceil(celsius(datanext["DailyForecasts"][1]["Temperature"]["Maximum"]["Value"]));
            weather.iconPhrase1 = datanext["DailyForecasts"][1]["Day"]["IconPhrase"];

            weather.icon2 = datanext["DailyForecasts"][2]["Day"]["Icon"];
            weather.minTemp2 = Math.ceil(celsius(datanext["DailyForecasts"][2]["Temperature"]["Minimum"]["Value"]));
            weather.maxTemp2 = Math.ceil(celsius(datanext["DailyForecasts"][2]["Temperature"]["Maximum"]["Value"]));
            weather.iconPhrase2 = datanext["DailyForecasts"][2]["Day"]["IconPhrase"];
            displayWeather2();

        });

    const aqi = `http://dataservice.accuweather.com/indices/v1/daily/1day/${locationKey}/-10?apikey=${key}&details=true`;

    fetch(aqi)
        .then(function (response) {
            let dataaqi = response.json();
            return dataaqi;
        })
        .then(function (dataaqi) {
            weather.aqiCat = dataaqi[0]["Category"];
            weather.aqiText = dataaqi[0]["Text"];
            console.log("AQI:" + dataaqi[0]["Category"]);
            displayWeather3();
        });
}

function displayWeather1() {
    hideNotificationBar();
    showResults();

    console.log(hourmin(localTime));
    cityName.innerHTML = weather.city + `<br><h6><i class="fas fa-clock"></i> ${hourmin(localTime)}</h6>`;
    weatherIcon.src = `https://www.accuweather.com/images/weathericons/${weather.weatherIcon}.svg`;
    tempElement.innerHTML = weather.temp;
    weatherPhrase.innerHTML = weather.weatherText;

    realFeel.innerHTML = `${weather.realfeeltemp}&deg;C`;
    humidityElement.innerHTML = `${weather.humidity}%`;
    cloudsElement.innerHTML = `${weather.cloudcover}%`;
    pressure.innerHTML = `${weather.pressure}mbar`;
    windSpeed.innerHTML = `${weather.wind} km/hr`;

    linkAccuWeather.href = weather.currentForecastLink;
}

function displayWeather2() {
    sunRiseElement.innerHTML = `Sunrise ${hourmin(weather.sunrise)}`;
    sunSetElement.innerHTML = `Sunset ${hourmin(weather.sunset)}`;
    setProgress(localTime, weather.sunrise, weather.sunset);
    NextDaysElement.setAttribute('href', weather.next5daysweather);

    todayWeather[0].querySelector("img").src = `https://www.accuweather.com/images/weathericons/${weather.icon0}.svg`;
    todayWeather[1].querySelector("span").innerHTML = `Today &#xb7; ${weather.iconPhrase0}`;
    todayTemp.innerHTML = `${weather.maxTemp0}&deg;/${weather.minTemp0}&deg`;

    tomorrowWeather[0].querySelector("img").src = `https://www.accuweather.com/images/weathericons/${weather.icon1}.svg`;
    tomorrowWeather[1].querySelector("span").innerHTML = `Tomorrow &#xb7; ${weather.iconPhrase1}`;
    tomorrowTemp.innerHTML = `${weather.maxTemp1}&deg;/${weather.minTemp1}&deg`;

    dayaftertomorrowWeather[0].querySelector("img").src = `https://www.accuweather.com/images/weathericons/${weather.icon2}.svg`;
    dayaftertomorrowWeather[1].querySelector("span").innerHTML = `${After2Days(localTime)} &#xb7; ${weather.iconPhrase2}`;
    dayaftertomorrowTemp.innerHTML = `${weather.maxTemp2}&deg;/${weather.minTemp2}&deg`;
}

function displayWeather3() {
    AQIElement.innerHTML = weather.aqiCat;
    AQIElement.setAttribute('title', weather.aqiText);
}


function hourmin(iso) {
    let hr = Number(iso.slice(11, 13));
    let min = iso.slice(14, 16);
    let abbr = 'AM';
    if (hr > 12) {
        hr = hr - 12;
        abbr = 'PM';
    }
    if (hr < 10) {
        hr = "0" + hr;
    }
    return (hr + ":" + min + abbr);
}

function setProgress(cur, rise, set) {
    console.log("Current:" + cur);
    console.log("Rise:" + rise);
    console.log("set:" + set);

    minutes_cur = Number(cur.slice(11, 13)) * 60 + Number(cur.slice(14, 16));
    minutes_rise = Number(rise.slice(11, 13)) * 60 + Number(rise.slice(14, 16));
    minutes_set = Number(set.slice(11, 13)) * 60 + Number(set.slice(14, 16));

    let progress = 0;
    if (minutes_cur < minutes_rise) {
        progress = 0;
    }
    else if (minutes_cur > minutes_set) {
        progress = 100;
    }
    else {
        progress = Math.floor(100 * (minutes_cur - minutes_rise) / (minutes_set - minutes_rise));
    }

    progressBar.setAttribute("aria-valuenow", progress.toString());
    progressBar.style.width = progress.toString() + "%";
    progressBar.innerHTML = progress.toString() + " %";
    console.log("Progress: " + progress);
}

function After2Days(Time) {
    const d = new Date(Time.slice(0, 4), Time.slice(5, 7), Time.slice(8, 9));
    let day = "";
    //console.log("DAY: "+d.getDay())
    switch (d.getDay()) {
        case 3: day = "Sun"; break;
        case 4: day = "Mon"; break;
        case 5: day = "Tue"; break;
        case 6: day = "Wed"; break;
        case 0: day = "Thurs"; break;
        case 1: day = "Fri"; break;
        case 2: day = "Sat"; break;
    }
    return day;
}

function displayNotificationBar(message, alert) {
    notificationBar.style.display = "block";
    notificationBar.innerHTML = message;
    notificationBar.className = '';
    notificationBar.classList.add('alert');
    notificationBar.classList.add(`alert-${alert}`);
}

function hideNotificationBar() {
    notificationBar.style.display = "none";
}

function showResults() {
    Results.style.display = "block";
    Logo.style.display = "none";
}

function hideResults() {
    Results.style.display = "none";
    Logo.style.display = "block";
}

function celsius(fah) {
    return ((fah - 32) * (5 / 9));
}