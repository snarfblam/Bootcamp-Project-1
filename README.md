# Who-Twote-It

*Who Twote It* is a single-page web game where multiple users can try to guess which famous personality posted a particular tweet. There is a leaderboard to track users and each tweet is accompanied with a relevant animation from Giphy.

*Who Twote It* uses Firebase to track users and leaderboards, and as a message relay service to allow multiple clients to interact. *Who Twote It* uses jQuery and the Materialize CSS framework.

[Live Demo](https://snarfblam.github.io/Who-Twote-It/)

## Message Relay Documentation

```How it works:
    DbCommunicator - The main thing. It connects to firebase and creates other objects.
        General flow: You create a DbCommunicator. It attempts to authenticate with OAuth
            - User will be continuiously redirected to login page until he's authenticated
            - DbCommunicator.authPromise will reject in this event
        Once authenticated, DbCommunicator will join the room as a client.
        If there is no host, or the host times out, DbCommunicator will also begin hosting.

pinging:
    pinging works by pushing an object to the "ping" node. When the recipient sees the
    child added to "ping", he responds by pushing to the "pong node". The host and clients
    ping eachother just to verify they are still connected.
    ping = {
        from: - sender's user ID
        to: - recipient's user ID, or "all" to ping all CLIENTS
    }
    pong = {
        from: - sender's ID (i.e. recpient of the original ping)
    }

TwoteHost states
    -"waiting" - ping each user and wait for them to pong. either they timeout and are kicked
                 or they pong and join the round.
    - (moreToCome)

DbCommunicator events
    -"playersChanged" - list of all players changed
    -"activePlayersChanged" - list of active players changed
    -"hostChanged" - host has changed

Database:
    room - node containing ephemeral room data.
        users-active - Users participating in current round. Value is {user: userID}
        users-present - key is userID, value is {displayName: string}
        chatMessages - 
        currentRound - houses current round's requests and events
            requests (client to server message)
            events (server to client message)
        host (string) - host userID
        ping (list of {from, to}) - ping from one user to another
        pong (list of {from}) - responses to pings

Messages (requests/events) sent between host and clients via firebase:
    Overall game flow:
        readyToBegin (event) - ready to start a round as soon as all clients respond to a ping
        roundStart (event) - A round has begun
        {   tweet: text of tweet
            option1:-option4: the four people that might have sent the tweet
        }
        guessMade (request->event) - A user has made a guessMade
        {   user: userID
            guess: user's guess (number 1 - 4)
        }
        roundOver (event) - All users have guessed and correct answer is revealed
        {   correctAnswer: number 1- 4
        }
    User events:
        userLeft (request) - user parting
        {   user: userID
            displayName: display name
        }
        userLeft (event) - host has removed a user (e.g. ping timeout)
        {   user: userID
            displayName: display name
            reason: "ping" (timeout), "part" (user closed page)
            wasHost: true/false - whether the user that left was the host. if it was the host, the host
                                  will have set the value of the "newHost" node to nominate a new host.
                                  the new host will reset the room.
        }
    Other events:
        chat (request->event) - user sent a chat message
        takeover (event) - if the host does not respond to a ping for too long, this message is sent.
        {}                 it's a warning that the room is going to be reset with a new host. Clients will
                           be given a moment to display a message to the user that the host pinged out.
                           This event is sent directly from the client taking over. To avoid race conditions
                           (multiple clients trying to take over at same time), the client will attempt to sent
                           the "newHost" node from null to the user's ID transactionally.
                           ```
