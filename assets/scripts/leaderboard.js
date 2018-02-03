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
var database = firebase.database();
var dateStr = moment().startOf('day').format("YYMMDD");
function leaderboardPull(){
	console.log(dateStr)
	var leaderboardAllTime = firebase.database().ref('leaderboard/alltime').orderByChild("score").limitToLast(10);
	leaderboardAllTime.on('value',function(snapshot){
	snapshot.forEach(function(child){
		console.log(child.key+": "+child.val()["score"])
		})
	})
	var leaderboardToday = firebase.database().ref('leaderboard/'+dateStr).orderByChild("score").limitToLast(10);
	console.log("Today's Leaders:")
	leaderboardToday.on('value',function(snapshot){
	snapshot.forEach(function(child){
		console.log(child.key+": "+child.val()["score"])
		})
	})
}
function leaderboardPush(user,score){
	database.ref('leaderboard/alltime/'+user).set({
		score:score
	})
	database.ref('leaderboard/'+dateStr+"/"+user).set({
		score:score
	})
	console.log(user+": "+score)
}
function leaderboardHistoryPull(date){
	var leaderboardToday = firebase.database().ref('leaderboard/'+date).orderByChild("score").limitToLast(10);
	console.log("Leaders for "+date+":")
	leaderboardToday.on('value',function(snapshot){
		if (snapshot.length>0){
			snapshot.forEach(function(child){
			console.log(child.key+": "+child.val()["score"])
		})}
		else {
			console.log("No data for "+date)
		}
	})
}
leaderboardPull();
leaderboardHistoryPull("180131")