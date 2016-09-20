var   GooglePlaceReview = require('../models/GooglePlaceReview')
    , GooglePlace = require('../models/GooglePlace')
    , co = require('co')
    , request = require('co-request');

module.exports = function(apiKey, googlePlaceId) {

  co(function*() {

    let url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + googlePlaceId +'&key=' +apiKey;

    console.log("url=" +url);

    let result = yield request(url);
    let response = JSON.parse(result.body);

    if (response.status === "OK") {

      let gpResult = response.result;

      // Look for existing GooglePlace entry saved in DB
      let googlePlaceEntry;
      try {
        googlePlaceEntry = yield GooglePlace.findOne({ place_id: googlePlaceId }).populate('reviews').exec();
      } catch (e) {
        console.log("Error finding google place entry: " +e);
      }

      // Add new google place entry if one doesn't already exist
      if (googlePlaceEntry == undefined) {       
        googlePlaceEntry = new GooglePlace({
          place_id: gpResult.place_id,
          name: gpResult.name,
          address_components: gpResult.address_components,
          formatted_address: gpResult.formatted_address,
          formatted_phone_number: gpResult.formatted_phone_number,
          geometry: gpResult.geometry,
          icon: gpResult.icon,
          id: gpResult.id,
          intl_phone_number: gpResult.intl_phone_number,
          opening_hours: gpResult.opening_hours,
          permanently_closed: gpResult.permanently_closed,
          price_level: gpResult.price_level,
          rating: gpResult.rating,
          rating_history: [ { rating: gpResult.rating, date: Date.now() } ],
          reviews: [],
          scope: gpResult.scope,
          types: gpResult.types,
          url: gpResult.url,
          utc_offset: gpResult.utc_offset,
          vicinity: gpResult.vicinity,
          website: gpResult.website 
        });
      }

      // Look for duplicate reviews
      var reviewsToSave = [];
      for (var review of gpResult.reviews) {

        var isDuplicate = false;
        for (var oldReview of googlePlaceEntry.reviews) {
          if (oldReview.author_name === review.author_name && oldReview.time === review.time) {
            isDuplicate = true;
            break;
          }
        }

        // Add any reviews which aren't duplicates
        if (!isDuplicate) {
          var gpReview = new GooglePlaceReview({
            aspects: review.aspects,
            author_name: review.author_name,
            author_url: review.author_url,
            language: review.language,
            profile_photo_url: review.profile_photo_url,
            rating: review.rating,
            text: review.text,
            time: review.time  
          });
          reviewsToSave.push(gpReview);
        }

      }

      if (reviewsToSave.length > 0) {
          var savedReviews;
          try {
            savedReviews = yield GooglePlaceReview.insertMany(reviewsToSave);
          } catch (e) {
            console.log("Insert Many error: " +e);
          }
          googlePlaceEntry.reviews.push(...reviewsToSave); // spread operator for array concatenation                  
      }

      // Add rating history entry if needed
      if (googlePlaceEntry.rating !== gpResult.rating) {
        gpResult.rating_history.push({ rating: gpResult.rating, date: Date.now() });
        googlePlaceEntry.rating = gpResult.rating;
      }

      try {
        yield googlePlaceEntry.save();
      } catch (e) {
        console.log("Error Saving: " +e); 
      }              

    } else {
      console.log("ERROR for GooglePlaceId [" +googlePlaceId +"]: " +response.status);
    }
  }).catch(onerror);
   
  function onerror(err) {
    // log any uncaught errors 
    // co will not throw any errors you do not handle!!! 
    // HANDLE ALL YOUR ERRORS!!! 
    console.error(err.stack);
  }

};
