/** Utility class to be used by host to read from twitter. */
function TwitterReader() {
    // Not much to do here...
}
{

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

        return $.ajax({
            url: ajaxUrl,
            type: "GET",
        }).then(function (response) {
            var responseObj = JSON.parse(response);
            var result = [];
            responseObj.forEach(function (item) {
                var resultItem = new TweetData(item);
                result.push(resultItem);
            });

            return result;
        });
    }
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

    (responseItem.media || []).forEach(function (media) {
        this.media.push({
            url: media.url,
            type: media.type,
            displayUrl: media.display_url,
        });
    }, this);
}

function OAuthUtility() {
    this.provider = new firebase.auth.GoogleAuthProvider();
}
{
    /** Returns a promise that resolves when authentication succeeds or fails */
    OAuthUtility.prototype.authenticate = function authenticate() {
        var self = this;

        return firebase.auth().getRedirectResult().then(function (result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // ...
            } else {
                firebase.auth().signInWithRedirect(self.provider);

            }
            // The signed-in user info.
            self.user = result.user;
            self.credential = result.credental;
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    };
}

// Test code
$(document).ready(function () {
    // var tweeter = new TwitterReader();
    // tweeter.fetchTweets("realDonaldTrump", 10)
    //     .then(function (tweets) {
    //         console.log(tweets);
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyBl7_O3pchKuUbj5TEBAcoOOpAlV-4RDRE",
        authDomain: "bcs-whosaidit.firebaseapp.com",
        databaseURL: "https://bcs-whosaidit.firebaseio.com",
        projectId: "bcs-whosaidit",
        storageBucket: "bcs-whosaidit.appspot.com",
        messagingSenderId: "736508559692"
    };
    firebase.initializeApp(config);
    var auth = new OAuthUtility();
    auth.authenticate()
        .then(function () {
            $(document.body).append($("<img>").attr("src", "https://robohash.org/" + auth.user.displayName));
        });


    //document.write(JSON.stringify())
});
