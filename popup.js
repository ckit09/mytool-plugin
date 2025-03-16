function getWeather() {
    // Hardcoded latitude and longitude for HK
    const lat = 22.3193;
    const lon = 114.1694;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => response.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const code = data.current_weather.weathercode; // Note: You may want to map weather codes to descriptions
            const weatherDiv = document.querySelector('#current-weather')
            weatherDiv.innerHTML = `Temperature: ${temp}°C<br>Condition Code: ${code}`;
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Call the function directly without geolocation
getWeather();