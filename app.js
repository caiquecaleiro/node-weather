const yargs = require('yargs');

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

geocode.geocodeAddress(argv.address, (error, results) => {
  if (error) {
    console.log(error);
  } else {
    console.log(results.address);
    const { latitude, longitude } = results;
    weather.getWeather(latitude, longitude, (error, weatherData) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`It's currently ${weatherData.temperature}. It feels like ${weatherData.apparentTemperature}.`);
      }
    });
  }
});
