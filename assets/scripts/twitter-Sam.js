var tweeters = ["realDonaldTrump",
"BarackObama",
 "Beyonce", 
 "TaylorSwift13",
 "TheEllenShow",
 "Oprah", 
 "KingJames", 
 "KyrieIrving", 
 "Pontifex", 
 "ElonMusk", 
 "JeffBezos", 
 "StephenAtHome", 
 "ConanOBrien", 
 "BillNye", 
 "BillGates", 
 "katyperry",
 "neiltyson", 
 "HamillHimself"]

function twitterResFix(url){
	return url.slice(0,-11)+url.slice(-4)
}
function initTwitter(){

}


/** Returns a promise that resolves to {question, option1, option2, option3, option4, correctAnswer} 
 *  where each option is {name, username, avatar, text} */
function getNextQuestion(){
	var options = getOptions();
	var tweetPromises = [];
	var tweetResults = [];

	// For each option, get and store a promise that will update tweetResults
	for(var i = 0; i < options.length; i++){
		getTweetPromise(i);
	}

	// Once all the promises complete, we can return our question object
	return Promise.all(tweetPromises).then(function(){
		var correctUser = Math.floor(Math.random() * options.length);
		var tweetIndex = Math.floor(Math.random() * tweetResults[correctUser].length);

		return {
			question: tweetResults[correctUser][tweetIndex].text,
			option1: getUserData(tweetResults[0][0]), // get user data from first tweet of 0th user
			option2: getUserData(tweetResults[1][0]), // get user data from first tweet of 1st user
			option3: getUserData(tweetResults[2][0]), // get user data from first tweet of 2nd user
			option4: getUserData(tweetResults[3][0]), // get user data from first tweet of 3rd user
			correctAnswer: correctUser + 1, // correctUser = 0..3, correctAnswer = 1..4
		};
	});

	function getTweetPromise(index) {
		// Get our promise
		var promise = getTweet(options[index]);
		// Save it for later
		tweetPromises[index] = promise;

		// When it resolves, update our results array
		promise.then(function(tweets){
			tweetResults[index] = tweets;
		});
	}
}

function getTweet(user){
	var tweeter = new TwitterReader();
    return tweeter.fetchTweets(user, 10)
        .then(function (tweets) {
            return tweets
        }, function (error) {
            console.log(error);
        });
}

function getOptions(){
	var options=[];
	while (options.length<4){
		var poss = tweeters[Math.floor(Math.random()*tweeters.length)]
		if (options.indexOf(poss)==-1){
			options.push(poss)
		}
	}
	return options;
}

function getUserData(tweet){
	return {
		name:tweet.name,
		username:tweet.username,
		avatar:tweet.profileImage,
		text:tweet.text
	}
}
function dispOptions(ops){
	getTweet(ops[0]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		setter(user,0)
	})
	getTweet(ops[1]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		setter(user,1)
	})
	getTweet(ops[2]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		setter(user,2)
	})
	getTweet(ops[3]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		setter(user,3)
	})
}
// var ops = getOptions()
// var index = Math.floor(Math.random()*10);
// console.log(index);
// getTweet(ops[Math.floor(Math.random()*4)],10).then(function(data){
// 	console.log(data[index])
// 	user = getUserData(data[index]);
// 	return user
// 	}).then(function(user){
// 		$("#twitterQuote").html('"'+user.text+'"')
// 	})
// function setter(user,i){
// 	$("#profilepic"+i).attr("src",twitterResFix(user.avatar));
// 	$("#answer-name-"+i).text(user.name);
// 	$("#answer-handle-"+i).text("@"+user.username);
// }
// dispOptions(ops)

// function showPlayers(playersArray){
// 	var playerlist = $("#playerlist")
// 	for (var i=0;i<players.length;i++){
// 		playerlist.append("<li>").text(playersArray[i].name)
// 	}
// }