var myGamePiece;
var myObstacles = [];
var myScore;
var playerLife = 0;

function startGame() {
    playerLife = 1;
    myGamePiece = new component(30, 30, "red", 10, 120);
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
        clearInterval(this.interval);
    },
    gameResume: function () {
        this.interval = setInterval(updateGameArea, 20);
    },
    gameRestart: function() {
        // ToDO refactor this
        myObstacles = [];
        myGameArea.clear();
        startGame();
         
    },
    gameOver: function () {
        myGameOver = new component("40px", "Consolas", "red", 150, 150, "text");
        myGameOver.text = "Game Over";
        myGameOver.update();
    }
}

function component(width, height, color, x, y, type, removeObject = false) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.removeObject = removeObject;
    this.update = function () {
        ctx = myGameArea.context;
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

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            if (playerLife > 0) {
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

    if(intervalSpawnBoss()){
        myGameBoss = new component(20, 20, "blue", myGameArea.canvas.width + 40, myGameArea.canvas.height / 2, "boss");
        myObstacles.push(myGameBoss);
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

function createObstacles(){
    var height, gap, minHeight, maxHeight, minGap, maxGap;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 70;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(10, height, "green", myGameArea.canvas.width, 0));
    myObstacles.push(new component(10, myGameArea.canvas.width - height - gap, "green", myGameArea.canvas.width, height + gap));
}

function removeObstacles() {
    var myObstaclesClean = [];
    for (i = 0; i < myObstacles.length; i += 1) {
        if (!myObstacles[i].removeObject) {
            myObstaclesClean.push(myObstacles[i]);
        }
        // Out of boundaries 
    }
    myObstacles = myObstaclesClean;
}

function redrawObstacles() {
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();

        if(myObstacles[i].type == "boss"){
            myObstacles[i].speedY = -1;
        }
    }
}

function bossMove(){
    // get only boss
    // check boss pos
    // move only boss
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function intervalSpawnBoss(){
    if(myGameArea.frameNo % 5000 == 0) {return true;}
    return false;
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
    //console.log("Keyup: " + event.key);
    clearmove();
});



/* Movement */
function moveup() {
    if (myGamePiece.y <= 0) {
        myGamePiece.y = 1;
    } else {
        myGamePiece.speedY = -1;
    }
    //console.log(myGamePiece.y);
}

function movedown() {
    if (myGamePiece.y + 30 >= myGameArea.canvas.height) {
        myGamePiece.y = myGameArea.canvas.height - 30;
    } else {
        myGamePiece.speedY = 1;
    }
}

function moveleft() {
    if(myGamePiece.x <= 0){
        myGamePiece.x = 1;
    }else{
        myGamePiece.speedX = -1;
    }
}

function moveright() {
    myGamePiece.speedX = 1;
}

function clearmove() {
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

