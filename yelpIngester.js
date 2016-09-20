var mongoose = require('mongoose'),
  schedule = require('node-schedule'),
  config = require('./config'),
  Yelp = require('yelp'),
  YelpBusinesses = require('./config/yelpbusinesses'),
  YelpBusinessDetailsParser = require('./utils/yelpBusinessDetailsParser');

// Setup native promises
mongoose.Promise = global.Promise;

// Connect to our mongo database
var db = mongoose.connect('mongodb://localhost/pollyspiescafe');

var yelp = new Yelp(config.yelp);

let job = schedule.scheduleJob('0 */4 * * *', () => {
  for (var yelpBusinessId of YelpBusinesses.businesses) {
    YelpBusinessDetailsParser(yelp, yelpBusinessId);
  }
});

//db.disconnect();