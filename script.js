// Your OpenWeatherMap API key
const API_KEY = '856c03841756c5b6fdbf57a73bc1e3d6';

const weatherDiv = document.getElementById('weather');
const locationDiv = document.getElementById('location');
const errorDiv = document.getElementById('error');

function getLocation() {
    // Using Dhaka's coordinates as a test
    const latitude = 23.7104;
    const longitude = 90.4074;
    
    locationDiv.textContent = `Location: Dhaka`;
    fetchWeather(latitude, longitude);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorDiv.textContent = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorDiv.textContent = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorDiv.textContent = 'The request to get user location timed out.';
            break;
        default:
            errorDiv.textContent = 'An unknown error occurred.';
            break;
    }
}

async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message) {
                throw new Error(errorData.message);
            }
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        errorDiv.textContent = 'Error: ' + error.message;
        console.error('API Error:', error);
    }
}

async function fetchWeatherByCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        errorDiv.textContent = 'Please enter a city name.';
        return;
    }

    // Format city name to be URL-safe
    const formattedCity = encodeURIComponent(city);

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message) {
                throw new Error(errorData.message);
            }
            throw new Error('City not found or API error');
        }
        
        const data = await response.json();
        locationDiv.textContent = `Location: ${data.name}`;
        updateWeatherDisplay(data);
        errorDiv.textContent = '';
    } catch (error) {
        errorDiv.textContent = 'Error: ' + error.message;
        console.error('API Error:', error);
    }
}

function updateWeatherDisplay(data) {
    document.getElementById('temp').textContent = data.main.temp.toFixed(1);
    document.getElementById('feels_like').textContent = data.main.feels_like.toFixed(1);
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('wind').textContent = data.wind.speed.toFixed(1);
    document.getElementById('pressure').textContent = data.main.pressure;
    document.getElementById('visibility').textContent = data.visibility;
    document.getElementById('clouds').textContent = data.clouds.all;
}

// Start the process
getLocation();
