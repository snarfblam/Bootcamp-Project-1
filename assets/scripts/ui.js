
  function roundBegin() {
            var q = getCurrentQuestion();
            $("#twitterQuote").text(q.question);
            $("#profilepic0").attr("src" , q.option1.avatar);
            $("#profilepic1").attr("src" , q.option2.avatar);
            $("#profilepic2").attr("src" , q.option3.avatar);
            $("#profilepic3").attr("src" , q.option4.avatar);
            $("#answer-name-0").attr("src" , q.option1.name);
            $("#answer-name-1").attr("src" , q.option2.name);
            $("#answer-name-2").attr("src" , q.option3.name);
            $("#answer-name-3").attr("src" , q.option4.name);
            $("#answer-handle-0").attr("src" , q.option1.username);
            $("#answer-handle-1").attr("src" , q.option2.username);
            $("#answer-handle-2").attr("src" , q.option3.username);
            $("#answer-handle-3").attr("src" , q.option4.username);

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