const request = require('request');

const API_KEY = 'ff59ba0a9f8db5c0c6a2c3f731b9aedc';

exports.getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.darksky.net/forecast/${API_KEY}/${lat},${lng}`,
    json: true,
  }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to forecast server.');
    } else if (response.statusCode === 200) {
      const data = body.currently;
      callback(undefined, { 
        temperature: data.temperature,
        apparentTemperature: data.apparentTemperature 
      });
    } else {
      callback('Unable to fetch weather data.')
    }
  });
}