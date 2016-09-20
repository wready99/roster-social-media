var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    review_id               : String
  , user                    : Object
  , rating                  : Number
  , text                    : String
  , time_created            : Date
});

// Return a GooglePlace model based upon the defined schema
module.exports = YelpBusinessReview = mongoose.model('YelpBusinessReview', schema);