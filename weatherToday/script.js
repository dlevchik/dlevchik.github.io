// --------------------------------------------------------------

//                         WTF man you
//                   don't supposed to be here

// --------------------------------------------------------------

const logging = false; 
let metric = '℃';
const rounding = true;

const status = document.getElementById('status');
const header = document.querySelector('header');
const headerSearch = header.querySelector('.search');
const headerResults = header.querySelector('.searchResults');
const bigScreenSearch = document.querySelector('.bigScreen .search');
const bigScreenResults = bigScreenSearch.querySelector('.resultsContainer');
const coronavirus = document.getElementById("coronavirus");
const weather = document.getElementById('weather');
const userLang = navigator.language || navigator.userLanguage; //not used
let map;
let historyArray;
const weekDays = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

const monthDays = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'    
];

initAllListeners();

function initAllListeners(){
    document.addEventListener('scroll', () => {
        if (pageYOffset > 1){
            header.classList.add('open');
        } else{
            header.classList.remove('open');
        }
    });

    initSearches();
    initGeolocations();

    document.querySelector('header .menu').addEventListener('click', () => {
        header.classList.toggle('menuOpen');
    });

    document.getElementById('mapInit').addEventListener('click',()=>{
        initMap();
    });
}

function initSearches(){
    const headerInput = headerSearch.querySelector('input');
    const bigScreenInput = bigScreenSearch.querySelector('input');

    headerInput.addEventListener('focus', ()=>{
        headerSearch.classList.add('bigSearch');
        headerResults.style.top = headerSearch.offsetHeight + 'px';
        headerResults.classList.remove('hidden');
    });

    headerInput.addEventListener('input', () => {
        autoComplete(headerInput.value)
        .then(response => {
            log(response);

            headerResults.querySelector('.results').innerHTML = "";
            for (let i = 0; i < 4; i++) {
                let item = response[i];
                if(!item) break;

                headerResults.querySelector('.results').insertAdjacentHTML("beforeend", `<a href="#weather" class="searchResultItem"><p><span class="town">${item.localizedName}</span>, <span class="country">${item.country.localizedName}</span></p></a>`)
            }
        })
        .catch(err => console.error(err));
    });

    headerSearch.addEventListener('submit', (event) =>{
        event.preventDefault();
        alert(event.target);
        searchAndDisplayByName(headerInput.value);
    });

    function hideBigSearch(){
        headerSearch.classList.remove('bigSearch');
        headerResults.classList.add('hidden');
    }

    document.addEventListener('click', (event) =>{
        if(!event.target.closest('header')){
            hideBigSearch();
            header.classList.remove('menuOpen');
        }

        if(event.target.closest('.searchResultItem')){
            event.preventDefault();
            searchAndDisplayByName(event.target.closest('.searchResultItem').querySelector('.town').textContent);
        }
    });

    document.addEventListener('scroll', ()=>{
        if (pageYOffset <= 1){
            headerInput.blur();
            hideBigSearch();
        }
    });

    bigScreenInput.addEventListener('focus', ()=>{
        bigScreenResults.style.top = bigScreenInput.offsetHeight - 5 + 'px';
        bigScreenResults.classList.remove('hidden');
    });

    bigScreenInput.addEventListener('input', () => {
        autoComplete(bigScreenInput.value)
        .then(response => {
            log(response);

            bigScreenResults.querySelector('.results').innerHTML = "";
            for (let i = 0; i < 4; i++) {
                let item = response[i];
                if(!item) break;

                bigScreenResults.querySelector('.results').insertAdjacentHTML("beforeend", `<li><a href="#weather" class="searchResultItem"><span class="town">${item.localizedName}</span>, <span class="country">${item.country.localizedName}</span></a></li>`)
            }
        })
        .catch(err => console.error(err));

    });

    bigScreenSearch.addEventListener('submit', (event) =>{
        event.preventDefault();
        searchAndDisplayByName(bigScreenInput.value);
    });

    document.addEventListener('click', (event) =>{
        if(!event.target.closest('.search')){
            bigScreenResults.classList.add('hidden');
        }
    });
}

function initGeolocations(){
    document.querySelectorAll('.geolocation').forEach(element => {
        element.addEventListener('click', () => {
            askGeolocation();
        });
    })
}

updateHistory();
function updateHistory(town){
    historyArray = JSON.parse(localStorage.getItem("historyArray"));
    if (!historyArray){
        localStorage.setItem("historyArray", JSON.stringify([]));
        historyArray = JSON.parse(localStorage.getItem("historyArray"));
    }

    if(town){
        historyArray.unshift(town.toLowerCase());

        historyArray = [...new Set(historyArray)];

        if(historyArray.length > 3){
            historyArray = historyArray.slice(0, 3);
        }

        localStorage.setItem("historyArray", JSON.stringify(historyArray));
    }

    if(historyArray.length > 0){
        displayHistory();
    }
    function displayHistory(){
        historyArray = JSON.parse(localStorage.getItem("historyArray"));
        
        let headerHistory = headerResults.querySelector('.historyResults');
        let bigScreenHistory = document.querySelector('.bigScreen .history');
        headerHistory.innerHTML = "";
        bigScreenHistory.innerHTML = "";

        historyArray.forEach(town => {
            fetch(`http://api.openweathermap.org/data/2.5/weather?units=metric&q=${town}&lang=ru&appid=d68a6e989f6d79ca60506d231c444f00`)
            .then(response => response.json())
            .then(result => {
                headerHistory.insertAdjacentHTML('beforeend', `<a href="#weather" class="searchResultItem">
                    <span class="town">${town}</span>
                    <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png" alt="${result.weather[0].main}">
                    <span class="temperature">${round(result.main.temp) + metric}</span>
                    </a>`);
                
                bigScreenHistory.insertAdjacentHTML('beforeend', `<a href="#weather" class="searchResultItem">
                    <span class="town">${town}</span>
                    <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png" alt="${result.weather[0].main}">
                    <span class="temperature">${round(result.main.temp) + metric}</span>
                    </a>`);
            })
            .catch(err => console.error(err));
        });
    }
}

function searchAndDisplayByName(query){
    addLoadingGif(coronavirus);
    addLoadingGif(weather);

    autoComplete(query)
    .then((response) => {
        log(response);

        getCoronavirusData(response[0].country.id)
            .then((coronavirusData) => {
                log(coronavirusData);
                displayCovidData(coronavirusData);
            })
            .catch(err => {
                console.error(err)
                coronavirus.querySelector('.loading').remove();
            });
        
        updateHistory(response[0].localizedName);
        getGeocode(response[0].localizedName)
            .then(geocode => {
                log(geocode);
        
                getWeatherData(geocode.results[0].geometry.lat, geocode.results[0].geometry.lng)
                    .then(weatherData => {
                        log(weatherData);
                        displayWeatherData(weatherData, (geocode.results[0].components.city || geocode.results[0].components.town || geocode.results[0].components.village)  + ', ' + geocode.results[0].components.country);

                        initMap(geocode.results[0].geometry.lat, geocode.results[0].geometry.lng);
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}
searchAndDisplayByName(historyArray[0] || 'Киев');

function autoComplete(query){
    return new Promise(function(resolve, reject){
        let autoCompleteUrl = new URL('https://www.accuweather.com/web-api/autocomplete?&language=ru');
        autoCompleteUrl.searchParams.set('query', query);

        fetch(autoCompleteUrl)
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function getCoronavirusData(countryCode){
    return new Promise(function(resolve, reject){
        let coronaApi = new URL("https://covid-19-data.p.rapidapi.com/country/code?format=json");
        coronaApi.searchParams.set("code", countryCode);

            fetch(coronaApi, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "90c80cb2b5mshfd3e71691daedf3p18b2f5jsn24007c9cbc99",
                    "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
                }
            })
                .then(response => response.json())
                .then(result => {
                    new Promise(function(resolve, reject){
                        setTimeout(() => {
                            fetch("https://covid-19-data.p.rapidapi.com/totals", {
                                "method": "GET",
                                "headers": {
                                    "x-rapidapi-key": "90c80cb2b5mshfd3e71691daedf3p18b2f5jsn24007c9cbc99",
                                    "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
                                }
                            })
                                .then(response => response.json())
                                .then(result => {
                                    resolve(result);
                                })
                        }, 1300)})
                            .then(res => {
                                result.push(res[0]);

                                resolve(result);
                            })
                            .catch(err => reject(err));
                })
        .catch(err => reject(err));
    });
}

function displayCovidData(coronavirusData){
    let country = coronavirus.querySelector('.country');
    let world = coronavirus.querySelector('.world');

    country.querySelector('.cases').textContent = prettyNumber(coronavirusData[0].confirmed);
    country.querySelector('.deaths').textContent = prettyNumber(coronavirusData[0].deaths);
    country.querySelector('.recovered').textContent = prettyNumber(coronavirusData[0].recovered);

    world.querySelector('.cases').textContent = prettyNumber(coronavirusData[1].confirmed);
    world.querySelector('.deaths').textContent = prettyNumber(coronavirusData[1].deaths);
    world.querySelector('.recovered').textContent = prettyNumber(coronavirusData[1].recovered);

    coronavirus.querySelector('.loading').remove();
}

function addLoadingGif(elem){
    elem.insertAdjacentHTML("afterbegin", '<div class="loading"><img src="img/loading.gif" alt=""></div>');
    return elem.querySelector('.loading');
}

function prettyNumber(num){
    let str = num.toString();
    return str.replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
}

function getGeocode(query){
    return new Promise(function(resolve, reject){
        let geocodeApi = new URL('https://api.opencagedata.com/geocode/v1/json?key=baecd25854f84e8eba35c7958bed5bb2');
        geocodeApi.searchParams.set('q', query);

        fetch(geocodeApi)
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function getWeatherData(latitude, longitude){
    return new Promise(function(resolve, reject){
        let weatherApi = new URL('https://api.openweathermap.org/data/2.5/onecall?units=metric&lang=ru&appid=d68a6e989f6d79ca60506d231c444f00');
        weatherApi.searchParams.set('lat', latitude);
        weatherApi.searchParams.set('lon', longitude);

        fetch(weatherApi)
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function displayWeatherData(weatherData, locationName){
    let current = weather.querySelector('.current');
    let wind = weather.querySelector('.wind');
    let tomorrow = weather.querySelector('.tomorrow');
    let hourly = weather.querySelector('.hourly');
    let weekly = weather.querySelector('.weekly'); 

    current.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@4x.png`);
    current.querySelector('img').setAttribute('alt', weatherData.current.weather[0].main);
    current.querySelector('.town').textContent = locationName;
    current.querySelector('.description').textContent = weatherData.current.weather[0].description;
    current.querySelector('.temperature').textContent = round(weatherData.current.temp) + metric;
    current.querySelector('.feels').textContent = round(weatherData.current.feels_like) + metric;
    current.querySelector('.highest').textContent = round(weatherData.daily[0].temp.max) + metric;
    current.querySelector('.lowest').textContent = round(weatherData.daily[0].temp.min) + metric;

    wind.querySelector('svg').style.transform = `rotate(${weatherData.current.wind_deg}deg)`;
    wind.querySelector('.windSpeed').textContent = round(weatherData.current.wind_speed);
    wind.querySelector('.clouds').textContent = weatherData.current.clouds;
    wind.querySelector('.humidity').textContent = weatherData.current.humidity;
    wind.querySelector('.pressure').textContent = weatherData.current.pressure;

    tomorrow.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${weatherData.daily[1].weather[0].icon}@4x.png`);
    tomorrow.querySelector('img').setAttribute('alt', weatherData.daily[1].weather[0].main);
    tomorrow.querySelector('.town').textContent = locationName;
    tomorrow.querySelector('.description').textContent = weatherData.daily[1].weather[0].description;
    tomorrow.querySelector('.temperature').textContent = round(weatherData.daily[1].temp.day) + metric;
    tomorrow.querySelector('.feels').textContent = round(weatherData.daily[1].feels_like.day) + metric;
    tomorrow.querySelector('.highest').textContent = round(weatherData.daily[1].temp.max) + metric;
    tomorrow.querySelector('.lowest').textContent = round(weatherData.daily[1].temp.min) + metric;

    let hourTemplate = document.getElementById('hourTemplate');

    hourly.innerHTML = "";
    hourly.appendChild(hourTemplate.cloneNode(true));

    weatherData.hourly.forEach(hour => {
        let element = hourTemplate.content.cloneNode(true);
        let date = new Date(hour.dt * 1000);

        element.querySelector('.hours').textContent = `${prettyDate(date.getHours())}:${prettyDate(date.getMinutes())}`;
        element.querySelector('.dayOfMonth').textContent = `${prettyDate(date.getDate())}.${prettyDate(date.getMonth() + 1)}`;
        element.querySelector('.compass').style.transform = `rotate(${hour.wind_deg - 90}deg)`;
        element.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${hour.weather[0].icon}@4x.png`);
        element.querySelector('img').setAttribute('alt', hour.weather[0].main);
        element.querySelector('.temperature').textContent = round(hour.temp) + metric;
        element.querySelector('.humidity').textContent = hour.humidity;

        hourly.appendChild(element);
    });

    let weeklyTemplate = document.getElementById('weeklyTemplate');

    weekly.innerHTML = "<tbody></tbody>";
    weekly.appendChild(weeklyTemplate.cloneNode(true));

    weatherData.daily.forEach(day => {
        let element = weeklyTemplate.content.cloneNode(true);
        let date = new Date(day.dt * 1000);

        element.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`);
        element.querySelector('img').setAttribute('alt', day.weather[0].main);
        element.querySelector('.dayOfWeek').textContent = weekDays[date.getDay()];
        element.querySelector('.dayOfMonth').textContent = `${monthDays[date.getMonth()]} ${prettyDate(date.getDate())}`;
        element.querySelector('.lowest').textContent = round(day.temp.min) + metric;
        element.querySelector('.highest').textContent = round(day.temp.max) + metric;

        weekly.querySelector('tbody').appendChild(element);
    });

    if(weather.querySelector('.loading')){
        weather.querySelector('.loading').remove();
    }
}

function prettyDate(num){
    return (num > 9) ? num : '0' + num;
}

function initMap(latitude = 51.505, longitude = -0.09){
    if(document.getElementById('mapInit')){
        document.getElementById('mapInit').remove();
    }

    if(map){
        map.setView([latitude, longitude], 5);
        return;
    }

    map = L.map('map',{
        center: [latitude, longitude],
        zoom: 5,
        minZoom: 2,
        maxZoom: 12,
    });
    
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={accessToken}',{
        // layer: 'temp_new',
        layer: 'clouds_new',
        accessToken: 'd68a6e989f6d79ca60506d231c444f00',
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
    }).addTo(map);
    
}

function askGeolocation(){
    if(!navigator.geolocation) {
        console.error('geolocation not avaiable');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }

    function error(err) {
        console.error(err);
    }

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        log(`${latitude},${longitude}`);

        searchAndDisplayByCoordinates(latitude, longitude);
    }
}

function searchAndDisplayByCoordinates(latitude, longitude){
    addLoadingGif(coronavirus);
    addLoadingGif(weather);

    getGeocode(`${latitude},${longitude}`)
    .then(geocode =>{
        log(geocode);

        getCoronavirusData(geocode.results[0].components.country_code)
            .then((coronavirusData) => {
                log(coronavirusData);
                displayCovidData(coronavirusData);
            })
            .catch(err => {
                console.error(err);
                coronavirus.querySelector('.loading').remove();
            });

        getWeatherData(latitude, longitude)
            .then(weatherData => {
                log(weatherData);
                updateHistory(geocode.results[0].components.city);
                displayWeatherData(weatherData, geocode.results[0].components.city + ', ' + geocode.results[0].components.country);

                initMap(latitude, longitude);
            })
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}

function log(...message){
    if(logging){
        console.log(...message);
    }
}

function round(num){
    return rounding ? Math.round(num) : num;
}