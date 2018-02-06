
var debugOptions = {
    allowDebugUser: true,
};
var twoteConfig = {
    hostPingTimeout: 10, // seconds
    userPingTimeout: 10, // seconds
    hostPremptivePing: 8, // seconds
};


/** Utility class to be used by host to read from twitter. */
function TwitterReader() {
    // Not much to do here...
}
{

    /** URL of the twitter API proxy */
    TwitterReader.prototype.proxyUrl = "://snarfblam.com/twote/";

    /** Returns a promise that resolves when the specified tweets are retrieved. */
    TwitterReader.prototype.fetchTweets = function fetchTweets(username, tweetCount) {
        var self = this;

        var config = {
            user: username,
            count: tweetCount,
            crossDomain: true,
            dataType: 'jsonp',
        }

        var isHttps = (location.protocol === 'https:');
        var ajaxUrl = (isHttps ? "https" : "http") + this.proxyUrl;

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
    this.profileImage = responseItem.user.profile_image_url_https;

    (responseItem.media || []).forEach(function (media) {
        this.media.push({
            url: media.url,
            type: media.type,
            displayUrl: media.display_url,
        });
    }, this);
}

/** Provides utility methods to treat objects as dictionaries (aka maps) */
var Dic = {
    /** Enumerates all of the object's own enumerable properties. Accepts a callback function(key, value) */
    forEach: function (obj, callback, _this) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                callback.call(_this || this, key, obj[key]); // inherit this function's context if _this is not specified, e.g. window, of if user does Map.forEach.call(someObj, callback, this)
            }
        }
    },

    /** Enumerates all of the object's own enumerable properties. Accepts a callback function(key) */
    forEachKey: function (obj, callback, _this) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                callback.call(_this || this, key); // inherit this function's context if _this is not specified, e.g. window, of if user does Map.forEach.call(someObj, callback, this)
            }
        }
    },

    /** Enumerates all of the object's own enumerable properties. Accepts a callback function(value) */
    forEachValue: function (obj, callback, _this) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                callback.call(_this || this, obj[key]); // inherit this function's context if _this is not specified, e.g. window, of if user does Map.forEach.call(someObj, callback, this)
            }
        }
    },

    /** Gets all of the object's own enumerable properties */
    getKeys: function (obj) {
        return Object.keys(obj);
    },

    /** Gets all values of the object's properties */
    getValues: function (obj) {
        var result = [];
        Dic.forEachValue(function (v) { result.push(v) });
        return result;
    },

    /** Removes the specified property from the object */
    remove: function (obj, key) {
        return delete obj[key];
    }
}
/** Performs OAuth operation 
 *  @constructor */
function OAuthUtility() {
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.user = null;
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
                self.signInWithRedirect();
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
    OAuthUtility.prototype.signInWithRedirect = function () {
        firebase.auth().signInWithRedirect(this.provider);
    }
}

/** Implements Client<->database and server<->database communication 
 *  @constructor */
function DbCommunicator(autoAuth, autoconnect) {
    // inherits EventObject
    EventObject.call(this);

    var self = this;

    { // instance properties
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

        /** Raises events when a request is received. E.g. the 'playerGuessed'
         * message will raise the 'playerGuessed' event.
         */
        this.requests = new EventObject();
        /** Raises events when an event is received. E.g. the 'playerGuessed'
         * message will raise the 'playerGuessed' event.
         */
        this.events = new EventObject();
        /** Raises the 'received' message when a chat message is received */
        this.chatMessages = new EventObject();

        this.nodes = {
            leaderboard: this.database.ref("leaderboard"),
            activePlayers: this.database.ref("room/users-active"),
            allPlayers: this.database.ref("room/users-present"),
            chatMessages: this.database.ref("room/chat"),
            //currentRound: this.database.ref("currentRound"),
            requests: this.database.ref("room/current-round/requests"),
            events: this.database.ref("room/current-round/events"),
            host: this.database.ref("room/host"),
            ping: this.database.ref("room/ping"),
            pong: this.database.ref("room/pong"),
        };

        /** Most revent version of data sent from firebase */
        this.cached = {
            activePlayers: [],
            allPlayers: [],
            host: null,
        };

        /** Firebase user uid */
        this.userID = null;
        /** OAuth user data */
        this.user = null;
        this.auth = new OAuthUtility();
        /** Resolves when the communitcator has authenticated. */
        this.authPromise = null;
        /** Resolves when the communitcator has connected. */
        this.connectPromise = null;
        this.isHosting = false;
    }

    this.nodes.activePlayers.on("value", this.on_activePlayers_value.bind(this));
    this.nodes.allPlayers.on("value", this.on_allPlayers_value.bind(this));
    this.nodes.host.on("value", this.on_host_value.bind(this));
    this.nodes.requests.on("child_added", this.on_requests_childAdded.bind(this));
    this.nodes.events.on("child_added", this.on_events_childAdded.bind(this));
    this.nodes.chatMessages.on("child_added", this.on_chatMessages_childAdded.bind(this));
    this.nodes.ping.on("child_added", this.on_ping_childAdded.bind(this));
    this.nodes.pong.on("child_added", this.on_pong_childAdded.bind(this));

    this.host = new TwoteHost(self);
    this.client = new TwoteClient(self);

    if (autoAuth) {
        var auth_promise = this.auth.authenticate();

        this.authPromise = auth_promise
            .then(function (result) {
                if (self.auth.user) { //authenticated?
                    self.user = self.auth.user;
                    self.userID = self.auth.user.uid;
                } else {
                    //throw Error("Not authenticated.");
                    if (debugOptions.allowDebugUser && window.location.protocol == "file:") {
                        // local machine debugging
                        self.user = "testUser";
                        self.userID = "0xDEADBEEF_" + Math.floor(Math.random() * 1000);
                    } else {
                        self.auth.signInWithRedirect();
                        autoconnect = false;
                    }
                }
            }).catch(function (err) {
                console.warn("Authentication failed: ", err);
                //firebase.auth().signInWithRedirect(self.provider);
                if (debugOptions.allowDebugUser && window.location.protocol == "file:") {
                    // local machine debugging
                    self.user = "testUser";
                    self.userID = "0xDEADBEEF";
                } else {
                    self.auth.signInWithRedirect();
                    autoconnect = false;
                }
                // throw err;
            });
    }

    if (autoconnect) {
        this.connectPromise = this.authPromise.then(function () {
            self.joinRoom();
        });
    }

}
{  // DbCommunicator - general

    // Inherit EventObject
    DbCommunicator.prototype = Object.create(EventObject.prototype);
    DbCommunicator.prototype.constructor = DbCommunicator;

    DbCommunicator.prototype.joinRoom = function () {
        var self = this;
        if (!this.userID) throw Error("Attempted to join room when not authenticated.");

        this.client.joinRoom();

        this.nodes.host.once("value", function (snapshot) {
            var host = snapshot.val();
            if (!host) {
                self.host.joinRoom();
            }
        });
    }

    /** Asserts this player as the host of the room. Used when the previous host times out. */
    DbCommunicator.prototype.usurpRoom = function () {
        // There should probably be something involving a transaction here to avoid a race condition
        // between multiple clients.
        this.nodes.host.set(this.userID);
        this.sendPong();

        alert("We're taking over!");
        // todo: take over. sent event message that host timed out, wait a beat, and re-initialize the room, leaving all-users list intact
    }
}
{ // DbCommunicator - Send and receive from firebase
    DbCommunicator.prototype.sendRequest = function (message, args) {
        var request = { message: message };
        if (args) request.args = args;
        this.nodes.requests.push(request);
    }

    DbCommunicator.prototype.sendEvent = function (message, args) {
        var event = { message: message };
        if (args) event.args = args;
        this.nodes.events.push(event);
    }

    DbCommunicator.prototype.sendChatMessage = function (text) {
        var data = {
            UID: this.userID,
            message: text,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        }
        this.nodes.chatMessages.push(data);
    }

    DbCommunicator.prototype.sendPing = function (to) {
        this.nodes.ping.push({ from: this.userID, to: to });
    }

    DbCommunicator.prototype.sendPong = function () {
        this.nodes.pong.push({ from: this.userID });
    }


    DbCommunicator.prototype.on_requests_childAdded = function (childSnapshot) {
        var data = childSnapshot.val();
        var message = data.message;
        var args = data.args;
        this.requests.raise(message, args);
    }

    DbCommunicator.prototype.on_events_childAdded = function (childSnapshot) {
        var data = childSnapshot.val();
        var message = data.message;
        var args = data.args;
        this.events.raise(message, args);
    }

    DbCommunicator.prototype.on_chatMessages_childAdded = function (childSnapshot) {
        var data = childSnapshot.val();
        this.chatMessages.raise("received", data);
    }

    DbCommunicator.prototype.on_ping_childAdded = function (childSnapshot) {
        var data = childSnapshot.val();
        // todo: ping host
        this.client.handlePing(data);
        this.host.handlePong(data);
    }
    DbCommunicator.prototype.on_pong_childAdded = function (childSnapshot) {
        var data = childSnapshot.val();
        // todo: pong host
        this.client.handlePong(data);
        this.host.handlePong(data);
    }

    // DbCommunicator.prototype.on_pingMessages_childAdded = function (childSnapshot) {
    //     var data = childSnapshot.val();
    //     // todo: ping host
    //     this.client.handlePing(data);
    // }

    // DbCommunicator.prototype.on_pongMessages_childAdded = function (childSnapshot) {
    //     var data = childSnapshot.val();
    //     // todo: pong host
    //     this.client.handlePong(data);
    // }

    DbCommunicator.prototype.on_activePlayers_value = function (snapshot) {
        this.cached.activePlayers = snapshot.val() || {};
        this.raise("activePlayersChanged", this.cached.activePlayers);
    };

    DbCommunicator.prototype.on_allPlayers_value = function (snapshot) {
        this.cached.allPlayers = snapshot.val() || {};
        this.raise("playersChanged", this.cached.allPlayers);
    };

    DbCommunicator.prototype.on_host_value = function (snapshot) {
        this.cached.host = snapshot.val();
        this.raise("hostchanged", this.cached.host);

    };
}
{ // DBCommunicator - Ping

}

var twoteMessages =  {
    readyToBegin: "readyToBegin",
    roundStart: "roundStart",
    guessMade: "guessMade",
    roundOver: "roundOver",
    userLeft: "userLeft",
    chat: "chat",
    takeover: "takeover",
};

/** Implements game server logic. Only the host browser utilizes this class. 
 * @constructor */
function TwoteHost(dbcomm) {
    /** @type {DbCommunicator} */
    this.dbComm = dbcomm;
    this.connected = false;
    this.state = TwoteHost.states.waiting;

    this.pingList = []; // UserIDs
    this.userPingTime = 0;
    this.userPingNext = twoteConfig.userPingTimeout;
    this.preemtivePongTime = twoteConfig.hostPremptivePing;

    this.dbComm.on({
        playersChanged: this.dbComm_playersChanged.bind(this),
    });

}
{
    TwoteHost.states = {
        waiting: "waiting",
    };

    /** Connects to the game as the host */
    TwoteHost.prototype.joinRoom = function () {
        // Heeeere's Johnny!
        this.dbComm.nodes.host.set(this.dbComm.userID);
        // Re-initialize the room.
        // .allPlayers is left intact. If they're not really here, they'll time out.
        this.dbComm.nodes.activePlayers.set(null);
        this.dbComm.nodes.events.set(null);
        this.dbComm.nodes.ping.set(null);
        this.dbComm.nodes.pong.set(null);

        this.state = TwoteHost.states.waiting;
        this.connected = true;
        this.pingAllUsers();

        setInterval(this.pingCheck.bind(this), 1000); // once per second
    }

    /** Pings all users and prepares for their responses */
    TwoteHost.prototype.pingAllUsers = function () {
        var pingList = this.pingList = [];
        this.userPingTime2 = 0;

        // List of all users we're waiting to hear back from
        Dic.forEachKey(this.dbComm.cached.allPlayers, function (key) {
            pingList.push(key);
        });

        this.dbComm.sendPing("all");
    }

    /** Periodic function that sends pings or processes timeouts when appropriate */
    TwoteHost.prototype.pingCheck = function () {
        // Periodically pong users without them pinging us, to reduce unnecessary pinging
        this.preemtivePongTime--;
        if (this.preemtivePongTime <= 0) {
            this.preemtivePongTime = twoteConfig.hostPremptivePing;
            this.dbComm.sendPong();
        }

        var limit = twoteConfig.userPingTimeout;

        if (this.userPingNext > 0) {
            // Waiting till it's time to ping again
            this.userPingNext--;
            if (this.userPingNext == 0) {
                this.pingAllUsers();
            }
        } else {
            // Waiting for pongs...
            this.userPingTime++;

            if (this.userPingTime >= limit) {
                // Time's up...
                pingList.forEach(function (pingedUser) {
                    this.kickTimedOutUser(pingedUser);
                });

                // All users that haven't been kicked have ponged.
                // Re-start ping process
                this.handleAllPlayersPonged();
            }
        }
    }

    TwoteHost.prototype.kickTimedOutUserhandlePing = function (userID) {
        var user = this.dbComm.cached.allPlayers[userID]  || {};
        var displayName = userID.displayName || "[display name not found]";

        // remove from active users and all users, send userLeft event
        this.dbComm.nodes.activePlayers.child(userID).set(null);
        this.dbComm.nodes.allPlayers.child(userID).set(null);

        this.dbComm.sendEvent(twoteMessages.userLeft, {
            user: userID,
            displayName: displayName,
            reason: "ping",
            wasHost: false,
        });
    }
    
    TwoteHost.prototype.handlePing = function (data) {
        // don't do anything... the client will respond to pings to this browser
    }
    TwoteHost.prototype.handlePong = function (data) {
        if (!this.connected) return;

        var userID = data.from;

        var index = this.pingList.indexOf(userID);
        if (index >= 0) {
            this.pingList.splice(index, 1);
        }

        if (this.pingList.length == 0) {
            this.handleAllPlayersPonged();
        }
    }

    TwoteHost.prototype.handleAllPlayersPonged = function () {
        this.userPingNext = twoteConfig.userPingTimeout;
        this.userPingTime = 0;

        if (this.state == TwoteHost.states.waiting) {
            this.beginRound();
        }
    }

    TwoteHost.prototype.dbComm_playersChanged = function () {
        // if a player left without ponging, don't want to wait forever
        if (this.pingList.length == 0) return;

        var allPlayers = Dic.getKeys(this.dbComm.cached.allPlayers);

        for (var i = this.pingList.length - 1; i >= 0; i--) {
            var playerStillHere = allPlayers.indexOf(this.pingList[i] >= 0);

            if (!playerStillHere) {
                this.pingList.splice(i, 1);
            }
        }

        if (this.pingList.length == 0) this.handleAllPlayersPonged();
    }

}

/** Implements client logic. All browsers utilize this calss.
 * @constructor */
function TwoteClient(dbcomm) {
    /** @type {DbCommunicator} */
    this.dbComm = dbcomm;
    this.connected = false;
    this.hostPingTime = 0;
    this.hostPingNext = twoteConfig.hostPingTimeout;

}
{
    TwoteClient.prototype.joinRoom = function () {
        this.dbComm.nodes.allPlayers.child(this.dbComm.userID).set({ displayName: this.dbComm.user });
        this.connected = true;

        this.pingInterval = setInterval(this.pingCheck.bind(this), 1000); // once a second
    }

    /** Responds to a ping if necessary */
    TwoteClient.prototype.handlePing = function (data) {
        if (!this.connected) return;

        var toMe = (data.to == this.dbComm.userID) || (data.to == "all");
        if (toMe) {
            this.dbComm.sendPong();
        }
    }

    /** Accepts notifications of ping responses. */
    TwoteClient.prototype.handlePong = function (data) {
        if (!this.connected) return;

        if (data.from == this.dbComm.cached.host) {
            this.hostPingTime = 0;
            this.hostPingNext = twoteConfig.hostPingTimeout;
        }
    }

    /** Implements periodical player time-out logic */
    TwoteClient.prototype.pingCheck = function (data) {
        if (!this.dbComm.host.connected) { // host can't time out of we're the host
            var limit = twoteConfig.hostPingTimeout;

            if (this.hostPingNext > 0) {
                // count down delay between pings
                this.hostPingNext--;
                if (this.hostPingNext == 0) {
                    this.hostPingTime = 0;
                    this.dbComm.sendPing(this.dbComm.cached.host);
                }
            } else {
                this.hostPingTime++;
                console.log(this.hostPingTime);

                if (this.hostPingTime >= limit) {
                    this.hostPingTime = 0; // don't keep usurping. you onnly need to usurp once.
                    this.dbComm.usurpRoom();
                }
            }
        }
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
        self.handlers.forEach(function (handler) {
            var handlerFunc = handler[eventName];
            if (handlerFunc) {
                handlerFunc.call(self.handlerContext || self, args);
            }
        });
    };

    /** Associates an event handler with this event source */
    EventObject.prototype.on = function (handlerCollection_or_name, handler_if_name) {
        var handler = handlerCollection_or_name;
        // in the case of .on("event", handler), we turn it into on({event: handler});
        if (typeof handlerCollection_or_name == "string") {
            var handler = {};
            handler[handlerCollection_or_name] = handler_if_name;
        }

        this.handlers.push(handler);
    };
}

// Test code
$(document).ready(function () {
    var tweeter = new TwitterReader();
    tweeter.fetchTweets("realDonaldTrump", 10)
        .then(function (tweets) {
            console.log(tweets);
        }).catch(function (error) {
            console.log(error);
        });
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

    var comm = new DbCommunicator(true, true);
    comm.authPromise.then(function (result) {
        console.log(comm.user);
        //console.log(comm.)
        this.comm = comm;
    }).catch(function (error) {
        console.log(error);
    });

    //document.write(JSON.stringify())

    comm.requests.on({
        test: function (args) {
            console.log("REQUEST - ", args);
        }
    });
    comm.events.on({
        test2: function (args) {
            console.log("EVENT - ", args);
        }
    });
    comm.chatMessages.on("received", function (args) {
        console.log("CHAT - ", args);
    });
});

var tweeters = ["realDonaldTrump", "BarackObama", "Beyonce", "TaylorSwift13", "TheEllenShow", "Oprah", "KingJames", "TBrady14", "KyrieIrving", "Pontifex", "ElonMusk"]

function getTweeterData() {
    var reader = new TwitterReader();
    var user = tweeters[Math.floor(Math.random() * tweeters.length)]

    // fetchTweets returns a promise. You need to do something like:
    // reader.fetchTweets(user, 1)
    //     .then(function(response) {
    //          result = {...};
    //          console.log(result);
    //     });

    // var tweetObj = reader.fetchTweets(user, 1)[0];
    // return {
    //     name: tweetObj.name,
    //     profImg: tweetObj.profileImage,
    //     handle: tweetObj.username
    // }
}

console.log(getTweeterData())