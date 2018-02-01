/** Utility class to be used by host to read from twitter. */
function TwitterReader() {

}

/** URL of the twitter API proxy */
TwitterReader.prototype.proxyUrl = "http://snarfblam.com/twote/";

/** Returns a promise that resolves when the specified tweets are retrieved. */
TwitterReader.prototype.fetchTweets = function fetchTweets(username, tweetCount) {
    var self = this;

    var config = {
        user: username,
        count: tweetCount,
        crossDomain: true,
        dataType: 'jsonp',
      }
    var ajaxUrl = this.proxyUrl;
    ajaxUrl += "?" + $.param(config);
    
    return $.ajax( {
        url: ajaxUrl,
        type: "GET",
    }).then(function(response){
        var responseObj = JSON.parse(response);
        var result = [];
        responseObj.forEach(function(item) {
            var resultItem = new TweetData(item);
            result.push(resultItem);
        });

        return result;
    });
}

/** Class to encapsulate relevant tweet data, created from a twitter API response. */
function TweetData(responseItem) {
    this.username = responseItem.user.screen_name;
    this.name = responseItem.user.name;
    this.text = responseItem.full_text || responseItem.text;
    this.truncated = responseItem.truncated;
    this.createdAt = responseItem.created_at;
    this.favoriteCount = responseItem.favorite_count;
    this.retweetCount = responseItem.retweet_count;
    this.media = [];

    (responseItem.media || []).forEach(function(media){
        this.media.push({
            url: media.url,
            type: media.type,
            displayUrl: media.display_url,
        });
    }, this);
}

// Test code
$(document).ready(function() {
    var tweeter = new TwitterReader();
    tweeter.fetchTweets("realDonaldTrump", 10)
    .then(function(tweets){
        console.log(tweets);
    }).catch(function(error){
        console.log(error); 
    });

    //document.write(JSON.stringify())
});
