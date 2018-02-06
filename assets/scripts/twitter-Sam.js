var tweeters = ["realDonaldTrump", "BarackObama", "Beyonce", "TaylorSwift13", "TheEllenShow", "Oprah", "KingJames", "TBrady14", "KyrieIrving", "Pontifex", "ElonMusk"]

function twitterResFix(url){
	return url.slice(0,-11)+url.slice(-4)
}
function initTwitter(){

}
function getNextQuestion(){

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
var ops = getOptions()
var index = Math.floor(Math.random()*10);
console.log(index);
getTweet(ops[Math.floor(Math.random()*4)],10).then(function(data){
	console.log(data[index])
	user = getUserData(data[index]);
	return user
	}).then(function(user){
		$("#twitterQuote").text(user.text)
	})
function setter(user,i){
	$("#profilepic"+i).attr("src",twitterResFix(user.avatar));
	$("#answer-name-"+i).text(user.name);
	$("#answer-handle-"+i).text("@"+user.username);
}
dispOptions(ops)