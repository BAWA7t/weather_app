crossApi = "QLFA8BL8WKYKAPA99QCFSDKJF";
GIPHY_KEY = "ymFvHJ2B0bWfOzlYWCTt9zwSytVDAysG&s";

//accessing dom elements in javascript file
const form = document.getElementById('weatherForm');
const input = document.getElementById('locationInput');
const locationName = document.getElementById('locationName');
const tempDisplay = document.getElementById('temperature');
const descDisplay = document.getElementById('description');
const weatherDisplay = document.getElementById('weatherDisplay');
const toggleBtn = document.getElementById('toggleUnit');
const weatherGif = document.getElementById('weatherGif');
const loading = document.getElementById('loading');

let currentTempC;
let isCelsius = true;

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const location = input.value.trim();
    if(!location) return;

    loading.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');

    try{
        const weatherData = await fetchWeather(location);
        displayWeather(weatherData);

        const gifUrl = await fetchGif(weatherData.conditions);
        weatherGif.src = gifUrl;

        setBackground(weatherData.conditions);
    }catch(error){

    alert('Could not fetch weather: ' + error.message);
    }

    toggleBtn.addEventListener('click', ()=> {
        isCelsius = !isCelsius
        updateTempDisplay();
    })
})

async function fetchWeather (location){
try{
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${crossApi}`;
;

    const response = await fetch(url);
    if(!response.ok){
        throw new Error('Location not found');
    }

    const data = await response.json();
    console.log (data);

    const today = data.days[0];

    return {
        location: data.resolvedAddress,
        tempC: data.days[0].temp,
        conditions: data.days[0].conditions
      };
}catch(error){
        console.log('Error in fetching:', error.message);

}
};

fetchWeather('Bawku').then((weatherData) => {
    console.log('Processed weather data:', weatherData);
});

function displayWeather(data){
    currentTempC = data.tempC;
    isCelsius = true;
    descDisplay.textContent = data.conditions;
    locationName.textContent = data.location;
    updateTempDisplay();
    weatherDisplay.classList.remove('hidden');
}

function updateTempDisplay() {
    const temp = isCelsius ? currentTempC : (currentTempC * 9/5 + 32);
    const unit = isCelsius ? '°C' : '°F';
    tempDisplay.textContent = `Temperature: ${temp.toFixed(1)} ${unit}`;
    toggleBtn.textContent = `Switch to ${isCelsius ? '°F' : '°C'}`;
}

async function fetchGif(query) {
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_KEY}&s=${query}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data.images.original.url;
}
  
function setBackground(condition) {
    if (condition.includes('Rain')) {
      document.body.style.backgroundColor = '#5f9ea0';
    } else if (condition.includes('Clear')) {
      document.body.style.backgroundColor = '#87ceeb';
    } else if (condition.includes('Snow')) {
      document.body.style.backgroundColor = '#f0f8ff';
    } else {
      document.body.style.backgroundColor = '#d3d3d3';
    }
} 
  