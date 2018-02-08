// Initialize Firebase
var config = {
	apiKey: "AIzaSyBl7_O3pchKuUbj5TEBAcoOOpAlV-4RDRE",
	authDomain: "bcs-whosaidit.firebaseapp.com",
	databaseURL: "https://bcs-whosaidit.firebaseio.com",
	projectId: "bcs-whosaidit",
	storageBucket: "bcs-whosaidit.appspot.com",
	messagingSenderId: "736508559692"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

var database = firebase.database();
var dateStr = moment().startOf('day').format("YYMMDD");

//leaderboard functions

function leaderboardPull(){
	//grab sorted leaderboard from firebase
	var leaderboard = firebase.database().ref('leaderboard/alltime').orderByChild("wins").limitToLast(10);
	var leaderboardOut = leaderboard.once('value').then(function(snapshot){
		var i=0;
		var output=[];
		//step thru snapshot -- will need to store in an array
		snapshot.forEach(function(child){
			output[i] = {
				userID:child.key,
				userName:child.val()["username"],
				wins:child.val()["wins"],
				losses:child.val()["losses"]
			};
			i++;
		})
		return output;
	})
	console.log(leaderboardOut)
	return leaderboardOut;
}
function leaderboardDatePull(date){
	//grab sorted leaderboard from firebase
	var leaderboard = firebase.database().ref('leaderboard/'+date).orderByChild("wins").limitToLast(10);
	var leaderboardOut = leaderboard.once('value').then(function(snapshot){
		var i=0;
		var output=[];
		//step thru snapshot -- will need to store in an array
		snapshot.forEach(function(child){
			output[i] = {
				userID:child.key,
				userName:child.val()["username"],
				wins:child.val()["wins"],
				losses:child.val()["losses"]
			};
			i++;
		})
		return output;
	})
	console.log(leaderboardOut)
	return leaderboardOut;
}

function leaderboardPush(userID,wins,losses){
	database.ref('leaderboard/alltime/'+userID).set({
		wins:wins,
		losses:losses
	})
	database.ref('leaderboard/'+dateStr+"/"+userID).set({
		wins:wins,
		losses:losses
	})
	console.log(userID+": "+score)
}

function getLeaderboard(leaderboard){
	var alltime = $("#leaderboard-alltime");
	var today = $("#leaderboard-daily");
	for (var i=leaderboard.length-1;i>=0;i--){
		console.log(leaderboard[i])
		alltime.append("<li>").text(leaderboard[i].userName+": "+leaderboard[i].wins)
	}
}

function getUser(userID){
	var alltimeStats
	database.ref("leaderboard/alltime/"+userID).once("value").then(function(snapshot){
		var userAllTime = snapshot.val();
		userAllTime.userID = userID;
		return userAllTime;
	})
	console.log(userAllTime);
	return userAllTime
}
leaderboard=leaderboardPull();
getLeaderboard(leaderboard);