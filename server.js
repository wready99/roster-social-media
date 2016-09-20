var mongoose = require('mongoose'),
  Twitter = require('twitter'),
  config = require('./config'),
  TweetParser = require('./utils/tweetParser'),
  google = require('googleapis'),
  GooglePlaces = require('./config/googleplaces'),
  GooglePlaceDetailsParser = require('./utils/googlePlaceDetailsParser');

// Setup native promises
mongoose.Promise = global.Promise;

// Connect to our mongo database
var db = mongoose.connect('mongodb://localhost/pollyspiescafe');

/*
var twitterClient = new Twitter(config.twitter);
 
twitterClient.get('statuses/user_timeline', {screen_name: 'Pollyspiescafe'}, (error, tweets, response) => {
  if (!error) {
    for (var tweet of tweets) {
      TweetParser(tweet);
    }
  }
});

twitterClient.stream('statuses/filter', {track: "Polly's,Pollys Pies,pollyspies"}, stream => {
  stream.on('data', data => {
    console.log(data);
    if (data['user'] !== undefined) {
      TweetParser(data);
    }
  });
 
  stream.on('error', error => {
    throw error;
  });
});
*/

/*
for (var googlePlaceId of GooglePlaces.placeIds) {
  console.log("googlePlaceId = " +googlePlaceId);
  GooglePlaceDetailsParser(config.google.api_key, googlePlaceId);
}
*/

GooglePlaceDetailsParser(config.google.api_key, 'ChIJOalKR8Qg3YARFVhPWJ6JbM4');

//db.disconnect();