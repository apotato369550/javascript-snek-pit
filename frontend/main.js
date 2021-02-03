const BACKGROUND_COLOR = "grey";
const SNAKE_COLOR = "white";
const FOOD_COLOR = "red";

const socket = io("http://localhost:3000");

socket.on("initialize", handleInitialize);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownGame", handleUnknownGame);
socket.on("tooManyPlayers", handleTooManyPlayers);

const gameScreen = document.getElementById("game-screen");
const initialScreen = document.getElementById("initial-screen");
const newGameButton = document.getElementById("new-game-button");
const joinGameButton = document.getElementById("join-game-button");
const gameCodeInput = document.getElementById("game-code-input");
const gameCodeDisplay = document.getElementById("game-code-display");

newGameButton.addEventListener("click", newGame);
joinGameButton.addEventListener("click", joinGame);

function newGame(){
    socket.emit("newGame");
    initialize();
}

function joinGame(){
    const code = gameCodeInput.value;
    socket.emit("joinGame", code);
    initialize();
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let playerNumber;
let gameActive = false;

function initialize(data){
    console.log("initializing")

    initialScreen.style.display = "none";
    gameScreen.style.display = "block";

    canvas.width = canvas.height = 600;

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener("keydown", keydown);
    gameActive = true;
}

function keydown(event){
    console.log(event.keyCode);
    socket.emit("keydown", event.keyCode)
}

function paintGame(state){
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    context.fillStyle = FOOD_COLOR;
    context.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, SNAKE_COLOR);
    paintPlayer(state.players[1], size, "orange");
}

function paintPlayer(playerState, size, color){
    const snake = playerState.snake;
    
    context.fillStyle = color;
    for(let cell of snake){
        context.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

function handleInitialize(number){
    playerNumber = number;
}

function handleGameState(gameState){
    if(!gameActive){ return; }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data){
    if(!gameActive){ return; }
    data = JSON.parse(data);

    if(data.winner === playerNumber){
        alert("You win!");
    } else if(data.winner === 3){
        alert("It's a tie");
    } else {
        alert("You lose!");
    }
    gameActive = false;
    reset();
}

function handleGameCode(gameCode){
    gameCodeDisplay.innerHTML = "Your Game Code is: " + gameCode;
}

function handleUnknownGame(){
    reset();
    alert("Unknown game code");
}

function handleTooManyPlayers(){
    reset();
    alert("This game is already in progress");
}

function reset(){
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "";
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
}
// Run me using "npx live-server"