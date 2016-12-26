const yargs = require('yargs');
const axios = require('axios');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.address);
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl)
  .then(response => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    }

    const API_KEY = 'ff59ba0a9f8db5c0c6a2c3f731b9aedc';
    const data = response.data.results[0];
    const { lat, lng } = data.geometry.location;
    const weatherUrl = `https://api.darksky.net/forecast/${API_KEY}/${lat},${lng}`;

    console.log(data.formatted_address);
    return axios.get(weatherUrl);
  })
  .then(response => {
    const { temperature, apparentTemperature } = response.data.currently;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
  })
  .catch(error => {
    if (error.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(error.message);
    }
  });
