var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    place_id                : String
  , name                    : String
  , address_components      : Object
  , formatted_address       : String
  , formatted_phone_number  : String
  , geometry                : Object
  , icon                    : String
  , id                      : String
  , intl_phone_number       : String
  , opening_hours           : Object
  , permanently_closed      : Boolean
  , price_level             : Object
  , rating                  : Number
  , rating_history          : Object
  , reviews                 : [{ type: mongoose.Schema.Types.ObjectId, ref: 'GooglePlaceReview' }]
  , scope                   : String
  , types                   : [String]
  , url                     : String
  , utc_offset              : Number
  , vicinity                : String
  , website                 : String
});

// Return a GooglePlace model based upon the defined schema
module.exports = GooglePlace = mongoose.model('GooglePlace', schema);