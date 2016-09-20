var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    business_id             : String
  , name                    : String
  , categories              : Object
  , deals                   : Object
  , formatted_phone_number  : String
  , gift_certificates       : Object
  , image_url               : String
  , is_claimed              : Boolean
  , is_closed               : Boolean
  , location                : Object
  , menu_date_updated       : Date
  , menu_provider           : String
  , mobile_url              : String
  , rating                  : Number
  , rating_history          : Object
  , review_count            : Number
  , review_count_history    : Object
  , reviews                 : [{ type: mongoose.Schema.Types.ObjectId, ref: 'YelpBusinessReview' }]
  , snippet_image_url       : String
  , snippet_text            : String
  , url                     : String
});

// Return a GooglePlace model based upon the defined schema
module.exports = YelpBusiness = mongoose.model('YelpBusiness', schema);