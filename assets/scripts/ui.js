
  function roundBegin() {
            var q = getCurrentQuestion();
            $("#twitterQuote").text(q.question);
            $("#answer0").text(q.option1.name.username.avatar);
            $("#answer1").text(q.option2.name.username.avatar);
            $("#answer2").text(q.option3.name.username.avatar);
            $("#answer3").text(q.option4.name.username.avatar);
            var pDiv = $("#playerlist");
            pDiv.empty();
            var p = getActivePlayers();
            p.forEach(function (player) {
                var box = $("<p><span class='marker'></span> <span class='name'></span></p>");
                box.find(".name").text(player.displayName);
                box.attr("id", player.userID);
                pDiv.append(box);
            });
        }
        function userMadeGuess(userID, guess) {
            $("#" + userID).find(".marker").text(guess);
        }
        function roundEnd(answer) {
            var elem = $("#q" + answer);
            elem.text(elem.text() + " <--");
        }
        function userKicked(userID, reason) {
            $("#" + userID).find(".marker").text("[X]");
        }
        $(document).ready(function () {
            $(document.body).on("click", ".answer", function() {
             var guess = parseInt($(this).attr("data-answer-index"));
                userGuessed(guess);
            });
        });