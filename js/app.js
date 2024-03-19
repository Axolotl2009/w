async function getCountryInfo(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
    const data = await response.json();
    if (data.length > 0) {
        const country = data[0];
        const capital = country.capital;
        return capital;
    } else {
        throw new Error('Country not found');
    }
}

async function getWeatherAndCoordinates() {
    const countryName = document.getElementById('countryName').value;
    const apiKey ="b570bbef4b600c1a6adf6c83f58308aa";
    
    try {
        const capital = await getCountryInfo(countryName);
        
        // Fetch coordinates using OpenStreetMap Nominatim API
        const coordinatesResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(capital)}`);
        const coordinatesData = await coordinatesResponse.json();
        
        if (coordinatesData.length > 0) {
            const latitude = parseFloat(coordinatesData[0].lat);
            const longitude = parseFloat(coordinatesData[0].lon);
            
            // Fetch weather using OpenWeatherMap API
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
            const weatherData = await weatherResponse.json();
            
            const weatherDescription = weatherData.weather[0].description;
            const temperatureKelvin = weatherData.main.temp;
            
            // Display results
            document.getElementById('weatherResult').textContent = `Weather in ${capital}: ${weatherDescription}`;
            document.getElementById('temperatureResult').textContent = `Temperature: ${temperatureKelvin} Kelvin`;
            document.getElementById('coordinatesResult').textContent = `Coordinates: Latitude ${latitude}, Longitude ${longitude}`;
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorResult').textContent = 'Error: ' + error.message;
    }
}
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Set up Handlebars as the view engine
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

// Define a route to render your HTML with Handlebars
app.get('/', (req, res) => {
    res.render('index', {
        // Pass any data you want to the template here
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

