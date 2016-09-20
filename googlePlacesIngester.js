var mongoose = require('mongoose'),
  schedule = require('node-schedule'),
  config = require('./config'),
  google = require('googleapis'),
  GooglePlaces = require('./config/googleplaces'),
  GooglePlaceDetailsParser = require('./utils/googlePlaceDetailsParser');

// Setup native promises
mongoose.Promise = global.Promise;

// Connect to our mongo database
var db = mongoose.connect('mongodb://localhost/pollyspiescafe');

let job = schedule.scheduleJob('0 */4 * * *', () => {
  for (var googlePlaceId of GooglePlaces.placeIds) {
    //console.log("googlePlaceId = " +googlePlaceId);
    GooglePlaceDetailsParser(config.google.api_key, googlePlaceId);
  }
});

//db.disconnect();