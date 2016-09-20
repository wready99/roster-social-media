var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    twid       		 : String
  , author     		 : String
  , avatar     		 : String
  , body       		 : String
  , date       		 : Date
  , screenname 		 : String
  , source 	   		 : String
  , retweeted_status : Object
});

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);