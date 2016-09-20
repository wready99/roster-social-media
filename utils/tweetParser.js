var Tweet = require('../models/Tweet');

module.exports = function(tweet) {

  // Check to see if tweet already exists
	Tweet.count({ twid: tweet['id_str']}, (err,count) => {

    // If no error and tweet doesn't already exist
    if (!err && count === 0) {

      // Construct a new tweet object
      var tweetEntry = new Tweet({
        twid: tweet['id_str'],
        author: tweet['user']['name'],
        avatar: tweet['user']['profile_image_url'],
        body: tweet['text'],
        date: tweet['created_at'],
        screenname: tweet['user']['screen_name'],
        source: tweet['source'],
        retweeted_status: tweet['retweeted_status']
      });  

      // Save to db
      tweetEntry.save(saveErr => { 
        if (saveErr) console.log(saveErr) 
      });

    }

  });

};
