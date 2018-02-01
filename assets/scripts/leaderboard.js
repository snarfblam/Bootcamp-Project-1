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
function leaderboardPull(){
	console.log(moment().startOf('day').format("YYMMDD"));
	var leaderboardAllTime = firebase.database().ref('leaderboards/alltime');
	leaderboardAllTime.on('value',function(snapshot){
		console.log(snapshot.val())
	})
	var leaderboardAllTime = firebase.database().ref('leaderboards/');
	leaderboardAllTime.on('value',function(snapshot){
		console.log(snapshot.val())
	})
}
leaderboardPull();