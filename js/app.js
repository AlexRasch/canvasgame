import { GetRandomInt } from './util.js';

var myGamePiece;
var myGameDifficult;
var myObstacles = [];
var myScore;
var myLife;
var playerLife = 0;

document.addEventListener("DOMContentLoaded", (event) => {
    startGame();
});


function startGame() {
    playerLife = 3;
    myGameDifficult = 1;
    myGamePiece = new component(30, 30, "green", 10, 120);
    myScore = new component("20px", "Consolas", "white", 350, 20, "text");
    myLife = new component("20px", "Consolas", "white", 250, 20, "text");
    myGameArea.start();
    //window.addEventListener('blur', myGameArea.gamePause);
    //window.addEventListener('focus', myGameArea.gamePause);
}

var myGameArea = {
    gameStateRunning: true,
    canvas: document.getElementById("myGameCanvas"),
    start: function () {
        this.gameStateRunning = true;
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d", { alpha: false });
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        myGameArea.gameOver();
    },
    gamePause: function () {
        console.log("Paused");
        var myGamePaus = new component("40px", "Consolas", "red", 150, 150, "text");
        myGamePaus.text = "Paused";
        myGamePaus.update();
        clearInterval(this.interval);
    },
    gameResume: function () {
        console.log("Resume");
        this.interval = setInterval(updateGameArea, 20);
    },
    gameRestart: function() {
        // ToDO refactor this
        myObstacles = [];
        myGameArea.clear();
        startGame();
         
    },
    gameOver: function () {
        var myGameOver = new component("40px", "Consolas", "red", 150, 150, "text");
        myGameOver.text = "Game Over";
        myGameOver.update();
    }
}

function component(width, height, color, x, y, type, removeObject = false) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.removeObject = removeObject;
    this.update = function () {
        const ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
// Todo add a array for powerups
function updateGameArea() {
    for (var i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            
            // Move this to a new function 
            if(myObstacles[i].type == "powerup"){
                console.log("Powerup collison");
                switch(myObstacles[i].color){
                    case "green":
                        playerLife += 1;
                        break;
                    case "blue":
                        myGamePiece.width = myGamePiece.width -1;
                        myGamePiece.height = myGamePiece.height -1;
                        break;
                    case "yellow":
                        myGameArea.frameNo += 2000; // Todo frameNo is equal to score kinda confusing
                        break;
                    case "purple": // increase gap
                        
                        break;
                    case "white":
                        myGamePiece.color = "white";
                        break;
                    default:
                        break;
                }
                myObstacles[i].removeObject = true;
                continue;
            }


            if (playerLife > 1) {
                playerLife -= 1;
                myObstacles[i].removeObject = true;
                continue;
            } else {
                myGameArea.stop();
            }
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    
    // Todo refactor this
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
            createObstacles();
    }

    if(intervalSpawnEvent()){
        createEvent();
    }

    if(intervalIncreaseDifficult()){
        if(myGameDifficult < 10){
            myGameDifficult += 1;
            console.log("Game difficult increase by 1"); 
        }
    }

    removeObstacles();
    redrawObstacles();

    myScore.text = "SCORE:" + myGameArea.frameNo;
    myScore.update();
    myLife.text = "LIFE:" + playerLife;
    myLife.update();
    
    myGamePiece.newPos();
    myGamePiece.update();
}


function createEvent(){
    var iEvent = GetRandomInt(0,6);
    console.log("Creating event: " + iEvent);
    var myEvent;
    switch (iEvent){
        case 0: // Life
            myEvent = new component(20, 20, "green", myGameArea.canvas.width + 40, myGameArea.canvas.height, "powerup");
            break;
        case 1: // Shrink (?)
            myEvent = new component(20, 20, "blue", myGameArea.canvas.width + 40, myGameArea.canvas.height, "powerup");
            break;
        case 2:
            myEvent = new component(20, 20, "yellow", myGameArea.canvas.width + 40, myGameArea.canvas.height, "powerup");
            break;
        case 3:
            myEvent = new component(20, 20, "purple", myGameArea.canvas.width + 40, myGameArea.canvas.height, "powerup");
            break;
        case 4:
            myEvent = new component(20, 20, "white", myGameArea.canvas.width + 40, myGameArea.canvas.height, "powerup");
            break;
        default:
            myEvent = new component(20, 20, "red", myGameArea.canvas.width + 40, myGameArea.canvas.height, "boss");
            break;
    }
    // Add event to array of obstacles
    myEvent.speedY = -1;
    myObstacles.push(myEvent);
}

function createObstacles(){
    var height, width, gap, minHeight, maxHeight, minGap, maxGap;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    width = 10 + myGameDifficult;
    minGap = 80;
    maxGap = 180;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap) - myGameDifficult; // Decrease gap based on player progress
    myObstacles.push(new component(width, height, "red", myGameArea.canvas.width, 0));
    myObstacles.push(new component(width, myGameArea.canvas.width - height - gap, "red", myGameArea.canvas.width, height + gap));
}

function removeObstacles() {
    var myObstaclesClean = [];
    for (var i = 0; i < myObstacles.length; i++) {
        if(myObstacles[i].x < 0){
            continue;
        }
        if (!myObstacles[i].removeObject) {
            myObstaclesClean.push(myObstacles[i]);
        }
    }
    myObstacles = myObstaclesClean;
}

function redrawObstacles() {
    for (var i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
        
        // Todo refactor this D:
        if(myObstacles[i].type == "boss" || myObstacles[i].type == "powerup"){
            if(myObstacles[i].y < 0){
                myObstacles[i].speedY = 1;
                myObstacles[i].newPos();
                myObstacles[i].update();
            }
                
        }
    }
}

function bossMove(){
    // get only boss
    // check boss pos
    // move only boss
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 == 0;
}

function intervalSpawnEvent(){
    return myGameArea.frameNo % 4000 == 0;
}

function intervalIncreaseDifficult(){
    return myGameArea.frameNo % 10000 == 0;
}

/* User event */
addEventListener("keydown", (event) => {
    //console.log("Keydown: " + event.key);
    switch (event.key.toLowerCase()) {
        case "w":
            moveup();
            break;
        case "arrowup":
            moveup();
            break;
        case "a":
            moveleft();
            break;
        case "arrowleft":
            moveleft();
            break;
        case "d":
            moveright();
            break;
        case "arrowright":
            moveright();
            break;
        case "s":
            movedown();
            break;
        case "arrowdown":
            movedown();
            break;
        // Game related
        case "r":
            restart();
            break;
        case "p":
            pause();
            break;
    }
});

addEventListener("keyup", (event) => {
    clearmove();
});



/* Movement */
function moveup() {
    if (myGamePiece.y <= 0) {
        myGamePiece.y = 1;
    } else {
        myGamePiece.speedY = -1;
    }
}

function movedown() {
    if (myGamePiece.y + 30 >= myGameArea.canvas.height) {
        myGamePiece.y = myGameArea.canvas.height - 30;
    } else {
        myGamePiece.speedY = 1;
    }
}

export function moveleft() {
    if(myGamePiece.x <= 0){
        myGamePiece.x = 1;
    }else{
        myGamePiece.speedX = -1;
    }
}

function moveright() {
    myGamePiece.speedX = 1;
}

export function clearmove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function pause() {
    if (myGameArea.gameStateRunning) {
        myGameArea.gamePause();
    } else {
        myGameArea.gameResume();
    }
    myGameArea.gameStateRunning = !myGameArea.gameStateRunning;
}

function restart() {
    myGameArea.gameRestart();
}
