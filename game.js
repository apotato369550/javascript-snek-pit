const { GRID_SIZE } = require("./constants.js");

// export updateVelocity function here
module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
    initializeGame,
}

function initializeGame(){
    const state = createGameState();
    randomFood(state);
    return state;
}

function createGameState(){
    return {
        players: [
            {position: {
                x: 3,
                y: 10,
            },
            velocity: {
                x: 1, 
                y: 0,
            },
            snake: [
                {x: 1, y: 10},
                {x: 2, y: 10},
                {x: 3, y: 10},
            ]},
            {position: {
                x: 18,
                y: 10,
            },
            velocity: {
                x: -1, 
                y: 0,
            },
            snake: [
                {x: 20, y: 10},
                {x: 19, y: 10},
                {x: 18, y: 10},
            ]}
        ],
        food: {
            x: 7,
            y: 7,
        },
        gridSize: GRID_SIZE,
    }
}

function gameLoop(state){
    if(!state){
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];


    // this was accidentaly set to increase player 1's velocity
    // YES IT FUCKING WORKS LET'S GOOOO


    // This code below makes it so that the snake goes on the other side of the canvas
    // when they reach the edge

    if(playerOne.position.x > state.gridSize){
        playerOne.position.x = -1;
    } else if(playerOne.position.x < 0){
        playerOne.position.x = state.gridSize;
    } else if(playerOne.position.y > state.gridSize){
        playerOne.position.y = -1;
    } else if(playerOne.position.y < 0){
        playerOne.position.y = state.gridSize;
    }
    
    if(playerTwo.position.x > state.gridSize){
        playerTwo.position.x = -1;
    } else if(playerTwo.position.x < 0){
        playerTwo.position.x = state.gridSize;
    } else if(playerTwo.position.y > state.gridSize){
        playerTwo.position.y = -1;
    } else if(playerTwo.position.y < 0){
        playerTwo.position.y = state.gridSize;
    }


    // work on this shit

    // if either one eats food
    if(state.food.x == playerOne.position.x && state.food.y == playerOne.position.y){
        playerOne.position.x += playerOne.velocity.x;
        playerOne.position.y += playerOne.velocity.y;
        playerOne.snake.push({...playerOne.position});
        randomFood(state);
    }

    if(state.food.x == playerTwo.position.x && state.food.y == playerTwo.position.y){
        playerTwo.position.x += playerTwo.velocity.x;
        playerTwo.position.y += playerTwo.velocity.y;
        playerTwo.snake.push({...playerTwo.position});
        randomFood(state);
    }

    // incriment position based on 
    playerOne.position.x += playerOne.velocity.x;
    playerOne.position.y += playerOne.velocity.y;

    playerTwo.position.x += playerTwo.velocity.x;
    playerTwo.position.y += playerTwo.velocity.y;

    // if they butt heads, it's a tie
    if((playerOne.position.y == playerTwo.position.y && (playerOne.position.x + 1 == playerTwo.position.x || playerOne.position.x - 1 == playerTwo.position.x)) ||
    (playerOne.position.x == playerTwo.position.x && (playerTwo.position.y + 1 == playerTwo.position.y || playerTwo.position.y - 1 == playerTwo.position.y))){
        console.log("Player One Postion: " + playerOne.position.x + " " + playerOne.position.y);
        console.log("Player One Velocity: " + playerOne.velocity.x + " " + playerOne.velocity.y);
        console.log("Player Two Postion: " + playerTwo.position.x + " " + playerTwo.position.y);
        console.log("Player Two Velocity: " + playerTwo.velocity.x + " " + playerTwo.velocity.y);
        return 3;
    }


    // if they collide with themselves or another player
    if(playerOne.velocity.x || playerOne.velocity.y){
        for(let cell of playerOne.snake){
            if(cell.x == playerOne.position.x && cell.y == playerOne.position.y){
                console.log("player 1 hit itself");
                return 2;
            } 
        }

        for(let cell of playerTwo.snake){
            if(cell.x == playerOne.position.x && cell.y == playerOne.position.y){
                console.log("player 1 hit player 2");
                console.log("player 1: " + playerOne.position.x + " " + playerOne.position.y);
                console.log("player 2: " + playerTwo.position.x + " " + playerTwo.position.y);
                return 2;
            }
        }
        playerOne.snake.push({...playerOne.position});
        playerOne.snake.shift();
    }
    
    // there is something wrong with this over hereVVV
    if(playerTwo.velocity.x || playerTwo.velocity.y){
        for(let cell of playerTwo.snake){
            if(cell.x == playerTwo.position.x && cell.y == playerTwo.position.y){
                console.log("player 2 hit itself");
                return 1;
            }
        }

        for(let cell of playerOne.snake){
            if(cell.x == playerTwo.position.x && cell.y == playerTwo.position.y){
                console.log("player 2 hit player 1");
                return 1;
            }
        }

        playerTwo.snake.push({...playerTwo.position});
        playerTwo.snake.shift();
    }


    return false;
}

function randomFood(state){
    console.log(state.food);
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }

    for(let cell of state.players[0].snake){
        if(cell.x == food.x && cell.y == food.y){
            return randomFood(state);
        }
    }

    for(let cell of state.players[1].snake){
        if(cell.x == food.x && cell.y == food.y){
            return randomFood(state);
        }
    }

    // used == instead of =
    // stupid me :(
    state.food = food;
    console.log(state.food);
}

function getUpdatedVelocity(keyCode){
    switch (keyCode){
        case 37: {
            return {x: -1, y: 0};
        }
        case 38: {
            return {x: 0, y: -1};
        }
        case 39: {
            return {x: 1, y: 0};
        }
        case 40: {
            return {x: 0, y: 1};
        }
    }
}