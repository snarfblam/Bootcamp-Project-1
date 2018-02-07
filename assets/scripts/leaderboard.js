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

//leaderboard functions

function leaderboardPull(){
	console.log(dateStr)
	//grab sorted leaderboard from firebas3
	var leaderboardAllTime = firebase.database().ref('leaderboard/alltime').orderByChild("score").limitToLast(10);
	leaderboardAllTime.once('value').then(function(snapshot){
	//step thru snapshot -- will need to store in an array
	snapshot.forEach(function(child){
		//the key here is presently a UID, will need it to be a username in the future
		console.log(child.key+": "+child.val()["wins"])
		})
	})
	var leaderboardToday = firebase.database().ref('leaderboard/'+dateStr).orderByChild("score").limitToLast(10);
	console.log("Today's Leaders:")
	leaderboardToday.once('value').then(function(snapshot){
	snapshot.forEach(function(child){
		console.log(child.key+": "+child.val()["score"])
		})
	})
}
function leaderboardPush(user,wins,losses){
	database.ref('leaderboard/alltime/'+user).set({
		wins:wins,
		losses:losses
	})
	database.ref('leaderboard/'+dateStr+"/"+user).set({
		wins:wins,
		losses:losses
	})
	console.log(user+": "+score)
}
function leaderboardHistoryPull(date){
	var leaderboardToday = firebase.database().ref('leaderboard/'+date).orderByChild("score").limitToLast(10);
	console.log("Leaders for "+date+":")
	leaderboardToday.once('value').then(function(snapshot){
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


function GrabAllTimeLeader(){
	var leaderboardAllTime = firebase.database().ref('leaderboard/alltime').orderByChild("score").limitToLast(10);
	console.log("Leader board update",leaderboardAllTime);
	leaderboardAllTime.once('value').then(function(snapshot){
		console.log("this is the snapshot fo All Time",snapshot.val())

	});
}
GrabAllTimeLeader()

function GrabDailyLeader(){
	var leaderboardDaily = firebase.database().ref('leaderboard/180203').orderByChild("score").limitToLast(10);
	console.log("Leader board update",leaderboardDaily);
	leaderboardDaily.once('value').then(function(snapshot){
		console.log("this is the snapshot for Daily",snapshot.val());

		var userobj= snapshot.val()
		var allOurUsersArray=[ ]
		for(var i in userobj){
console.log(userobj[i])
		};

		function compare(a,b) {
		  if (a.last_nom < b.last_nom)
		    return -1;
		  if (a.last_nom > b.last_nom)
		    return 1;
		  return 0;
		}

		allOurUsersArray.sort(compare);

	});
}
GrabDailyLeader()


// min = minimun scorer in the leaderboard 
// 	if (player1 > min){
// 		remove min from leadedboard add min to leaderboard
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player2 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player3 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player4 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player5 > min){
// 		remove min from mleadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player6 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player7 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player8 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player9 > min){
// 		remove min from leadedboard add min to leader board
// 	}
// 	min = minimun scorer in the leaderboard 
// 	if (player10 > min){
// 		remove min from leadedboard add min to leader board
// 	};

// 	