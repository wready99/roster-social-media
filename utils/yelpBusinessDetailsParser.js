var   YelpBusinessReview = require('../models/YelpBusinessReview')
    , YelpBusiness = require('../models/YelpBusiness')
    , co = require('co');

module.exports = function(yelp, yelpBusinessId) {

  co(function*() {

    // Call API for info
    let yelpBusiness;
    try {
      yelpBusiness = yield yelp.business(yelpBusinessId);
    } catch (e) {
      console.error("Error retrieving yelp API info" +e);
    }

    // Look for existing yelpBusiness entry saved in DB
    let yelpBusinessEntry;
    try {
      yelpBusinessEntry = yield YelpBusiness.findOne({ business_id: yelpBusinessId }).populate('reviews').exec();
    } catch (e) {
      console.log("Error finding yelp business entry: " +e);
    }

    // Add new yelp business entry if one doesn't already exist
    if (yelpBusinessEntry == undefined) {       
      yelpBusinessEntry = new YelpBusiness({
        business_id: yelpBusiness.id,
        name: yelpBusiness.name,
        categories: yelpBusiness.categories,
        deals: yelpBusiness.deals,
        formatted_phone_number: yelpBusiness.display_phone,
        gift_certificates: yelpBusiness.gift_certificates,
        image_url: yelpBusiness.image_url,
        id: yelpBusiness.id,
        is_claimed: yelpBusiness.is_claimed,
        is_closed: yelpBusiness.is_closed,
        location: yelpBusiness.location,
        menu_date_updated: yelpBusiness.menu_date_updated,
        menu_provider: yelpBusiness.menu_provider,
        mobile_url: yelpBusiness.mobile_url,
        rating: yelpBusiness.rating,
        rating_history: [ { rating: yelpBusiness.rating, date: Date.now() } ],
        review_count: yelpBusiness.review_count,
        review_count_history: [ { review_count: yelpBusiness.review_count, date: Date.now() } ],
        reviews: [],
        snippet_img_url: yelpBusiness.snippet_img_url,
        snippet_text: yelpBusiness.snippet_text,
        url: yelpBusiness.url
      });
    }

    // Look for duplicate reviews
    var reviewsToSave = [];
    for (var review of yelpBusiness.reviews) {

      var isDuplicate = false;
      for (var oldReview of yelpBusinessEntry.reviews) {
        if (oldReview.review_id === review.id) {
          isDuplicate = true;
          break;
        }
      }

      // Add any reviews which aren't duplicates
      if (!isDuplicate) {
        var ybReview = new YelpBusinessReview({
          review_id: review.id,
          user: review.user,
          rating: review.rating,
          text: review.excerpt,
          time_created: review.time_created  
        });
        reviewsToSave.push(ybReview);
      }

    }

    if (reviewsToSave.length > 0) {
        var savedReviews;
        try {
          savedReviews = yield YelpBusinessReview.insertMany(reviewsToSave);
        } catch (e) {
          console.log("Insert Many error: " +e);
        }
        yelpBusinessEntry.reviews.push(...reviewsToSave); // spread operator for array concatenation                  
    }

    // Add rating history entry if needed
    if (yelpBusinessEntry.rating !== yelpBusiness.rating) {
      yelpBusinessEntry.rating_history.push({ rating: yelpBusiness.rating, date: Date.now() });
      yelpBusinessEntry.rating = yelpBusiness.rating;
    }

    // Add review count history entry if needed
    if (yelpBusinessEntry.review_count !== yelpBusiness.review_count) {
      yelpBusinessEntry.review_count_history.push({ review_count: yelpBusiness.review_count, date: Date.now() });
      yelpBusinessEntry.review_count = yelpBusiness.review_count;
    }

    try {
      yield yelpBusinessEntry.save();
    } catch (e) {
      console.log("Error Saving: " +e); 
    }              


  }).catch(onerror);
   
  function onerror(err) {
    // log any uncaught errors 
    // co will not throw any errors you do not handle!!! 
    // HANDLE ALL YOUR ERRORS!!! 
    console.error(err.stack);
  }

};
