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
    /** Returns a promise that resolves when authentication succeeds or fails.
     *  Will perform a redirect to a google sign-in page if the user is not logged in.
     */
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

/** Implements Client<->database and server<->database communication 
 *  @constructor */
function DbCommunicator(autoAuth) {
    var config = {
        apiKey: "AIzaSyBl7_O3pchKuUbj5TEBAcoOOpAlV-4RDRE",
        authDomain: "bcs-whosaidit.firebaseapp.com",
        databaseURL: "https://bcs-whosaidit.firebaseio.com",
        projectId: "bcs-whosaidit",
        storageBucket: "bcs-whosaidit.appspot.com",
        messagingSenderId: "736508559692"
    };
    /** firebase.app.App object */ 
    this.app = firebase.initializeApp(config);
    this.database = firebase.database();

    this.nodes = {
        leaderboard: this.database.ref("leaderboard"),
        players: this.database.ref("players"),
        waitlist: this.database.ref("waitlist"),
        chatMessages: this.database.ref("chatMessages"),
        //currentRound: this.database.ref("currentRound"),
        requests: this.database.ref("currentRound/requests"),
        events: this.database.ref("currentRound/events"),
        host: this.database.ref("host"),
        ping: this.database.ref("ping"),
        pong: this.database.ref("pong"),
    };

    this.auth = new OAuthUtility();
    /** Resolves when the communitcator has authenticated */
    this.authPromise = null;
    if(autoAuth) {
        this.authPromise = this.auth.authenticate();
    }
}

/** Implements Client<->database and server<->database communication 
 *  @constructor */
function EventObject() {
    /** The 'this' object in event handlers. */
    this.handlerContext = null;

    this.handlers = [];
}
{
    /** Invokes all event handlers associated with the specified event */
    EventObject.prototype.raise = function (eventName, args) {
        var self = this;
        handlers.forEach(function(handler) {
            var handlerFunc = handler[eventName];
            if(handlerFunc) {
                handlerFunc.call(handlerContext || self, args);
            }
        });
    };

    /** Associates an event handler with this event source */
    EventObject.prototype.on = function(handlerCollection_or_name, handler_if_name) {
        // in the case of .on("event", handler), we turn it into on({event: handler});
        if(typeof handlerCollection_or_name == "string") {
            var newHandler = {};
            newHandler[handlerCollection_or_name] = handler_if_name;
        } 

        this.handlers.push(handlerCollection_or_name);
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

    // var config = {
    //     apiKey: "AIzaSyBl7_O3pchKuUbj5TEBAcoOOpAlV-4RDRE",
    //     authDomain: "bcs-whosaidit.firebaseapp.com",
    //     databaseURL: "https://bcs-whosaidit.firebaseio.com",
    //     projectId: "bcs-whosaidit",
    //     storageBucket: "bcs-whosaidit.appspot.com",
    //     messagingSenderId: "736508559692"
    // };
    // firebase.initializeApp(config);
    // var auth = new OAuthUtility();
    // auth.authenticate()
    //     .then(function () {
    //         $(document.body).append($("<img>").attr("src", "https://robohash.org/" + auth.user.displayName));
    //     });

    var comm = new DbCommunicator(true);

    //document.write(JSON.stringify())
});
