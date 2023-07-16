1. run "npm i"
2. "npm start" or " node server.js"
3. to create a user and a game run:

    curl --location --request POST 'http://localhost:3000/start' \
    --header 'Content-Type: application/json' \
    --data-raw '{  
        "user": "u6"
    }'

    a.don't forget the username in body: { "user": "u6"}.

    b.The response will be: 
    {
        "message": "userId : 64b451aeaa408dd6fb7d4607, gameId: 64b451aeaa408dd6fb7d4608. Send 'gameId' in body when you roll"
    }
    c. copy the gameId to use it when you roll

4. to roll run:
    curl --location --request POST 'http://localhost:3000/roll' \
    --header 'Content-Type: application/json' \
    --data-raw '{  
    "gameId": "64b45133a2ea7822eed36ae4"
    }'

    a. don't forget the gameId in body: {"gameId": "64b45133a2ea7822eed36ae4"}
    b. roll till you get the message "the game is over"




OPEN QUESTIONS:

1. i think there is a mistyping in the assignment table in the mail - the score in 2nd frame should 14, not 9.
2. i didn't get 300 in a game where all the frames where strikes. 
    From the assignment: "A strike is when the player knocks down all 10 pins on his first try.  The bonus for that frame is the value of the next two balls rolled. (Frame no. 5)".

    When a strike is followed by another strike, does it mean the user used 2 bonus rools or just one?

