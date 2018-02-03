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
	var leaderboardAllTime = firebase.database().ref('leaderboard/alltime');
	leaderboardAllTime.orderByChild("score").once('value').then(function(snapshot){
		console.log("All Time Leaders:")
		for (var i in snapshot.val()){
			console.log(i + ": "+snapshot.val()[i]["score"])
		}
	})
	var leaderboardToday = firebase.database().ref('leaderboard/'+dateStr).orderByChild("score").limitToLast(10);
	leaderboardToday.once('value').then(function(snapshot){
		console.log("Today's Leaders:")
		for (i in snapshot.val()){
			console.log(i+": "+snapshot.val()[i]["score"])
		}
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
	database.ref('leaderboard/'+dateStr).once('value').then(function(snapshot){
		console.log("Leaders for "+date+":")
		for (i in snapshot.val()){
			console.log(i+": "+snapshot.val()[i]["score"])}
	})
}
leaderboardPush("Sam",100)
leaderboardPull();
leaderboardHistoryPull("180131")