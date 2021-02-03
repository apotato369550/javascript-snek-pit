const io = require("socket.io")();
const { createGameState, gameLoop, getUpdatedVelocity, initializeGame } = require("./game");
const { makeID } = require("./utils.js");
const { FRAME_RATE } = require("./constants");

const state = {};
const clientRooms = {};

// here's the game plan, watch everything where he adds a new server and shiz
// do a side by side comparison.
// then run multiple tests

io.on("connection", client => {

    client.on("keydown", handleKeyPress);
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    function handleJoinGame(gameCode){
        const room = io.sockets.adapter.rooms[gameCode];

        // this still does not work for some particular reason
        let allUsers;
        if(room){
            allUsers = room.sockets;
        }

        let clients;
        if(allUsers){
            clients = Object.keys(allUsers).length;
        }
        
        if(clients == 0){
            client.emit("unknownGame");
            return;
        } else if(clients > 1){
            client.emit("tooManyPlayers");
            return;
        }

        clientRooms[client.id] = gameCode;
        
        client.join(gameCode);
        client.number = 2;
        client.emit("initialize", 2);
        
        // we stopped here
        startGameInterval(gameCode);
    }

    function handleNewGame(){
        // this didn't work before because i forgot to put fucking semicolons;
        let roomName = makeID(5);
        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);

        state[roomName] = initializeGame();

        // see if this works
        client.join(roomName);
        client.number = 1;
        client.emit("initialize", 1);
    }

    function handleKeyPress(keyCode){
        // work on the keypresses, then work on the collision logic
        const roomName = clientRooms[client.id];

        if(!roomName){
            return;
        }

        try{
            keyCode = parseInt(keyCode); 
        } catch (e){
            console.log(e);
            return;
        }


        // it was because i didn't use a fucking semicolon (or forgot to save mf why)
        const velocity = getUpdatedVelocity(keyCode);

        if(velocity){
            // correct client number, but it stil affects both
            // state[roomName].players[client.number - 1].velocity = velocity;


            let player = state[roomName].players[client.number - 1];
            if(player.velocity.x != -(velocity.x) || player.velocity.y != -(velocity.y)){
                state[roomName].players[client.number - 1].velocity = velocity;
            }
        }
    }
});


function startGameInterval(roomName){
    const intervalID = setInterval(() => {
        const winner = gameLoop(state[roomName]);

        if(!winner){
            emitGameState(roomName, state[roomName]);
        } else {
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state){
    io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner){
    io.sockets.in(roomName).emit("gameOver", JSON.stringify({winner}));
}

io.listen(3000);

// run me using "npx nodemon server.js"