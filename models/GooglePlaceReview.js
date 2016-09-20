var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    aspects                 : Object
  , author_name             : String
  , author_url              : String
  , language                : String
  , profile_photo_url       : String
  , rating                  : Number
  , text                    : String
  , time                    : Number
});

// Return a GooglePlace model based upon the defined schema
module.exports = GooglePlaceReview = mongoose.model('GooglePlaceReview', schema);