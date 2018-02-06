var tweeters = ["realDonaldTrump", "BarackObama", "Beyonce", "TaylorSwift13", "TheEllenShow", "Oprah", "KingJames", "TBrady14", "KyrieIrving", "Pontifex", "ElonMusk"]

function initTwitter(){

}
function getNextQuestion(){

}

function getTweet(user){
	var tweeter = new TwitterReader();
    return tweeter.fetchTweets(user, 1)
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
		$("#profilepic0").attr("src",user.avatar)
		$("#answer-name-0").text(user.name)
		$("#answer-handle-0").text(user.username)
	})
	getTweet(ops[1]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		$("#profilepic1").attr("src",user.avatar)
		$("#answer-name-1").text(user.name)
		$("#answer-handle-1").text(user.username)
	})
	getTweet(ops[2]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		$("#profilepic2").attr("src",user.avatar)
		$("#answer-name-2").text(user.name)
		$("#answer-handle-2").text(user.username)
	})
	getTweet(ops[3]).then(function(data){
		user = getUserData(data[0]);
		return user
	}).then(function(user){
		$("#profilepic3").attr("src",user.avatar)
		$("#answer-name-3").text(user.name)
		$("#answer-handle-3").text(user.username)
	})
}
var ops = getOptions()
var index = Math.floor(Math.random()*10);
console.log(index);
getTweet(ops[Math.floor(Math.random()*4)],10).then(function(data){
	console.log(data)
	user = getUserData(data[index]);
	return user
	}).then(function(user){
		$("#twitterQuote").text(user.text)
	})
dispOptions(ops)