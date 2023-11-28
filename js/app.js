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
}

var myGameArea = {
    gameStateRunning: true,
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
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
        clearInterval(this.interval);
    },
    gameResume: function () {
        this.interval = setInterval(updateGameArea, 20);
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
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
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
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    removeObjects();
    redrawObjects();
    myScore.text = "SCORE:" + myGameArea.frameNo;
    myScore.update();
    myLife.text = "LIFE:" + playerLife;
    myLife.update();
    myGamePiece.newPos();
    myGamePiece.update();
}


function removeObjects() {
    var myObstaclesClean = [];
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myObstacles[i].removeObject) {
            //console.log("object should be removed");
        } else {
            myObstaclesClean.push(myObstacles[i]);
        }

    }
    myObstacles = myObstaclesClean;
}

function redrawObjects() {
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

/* User event */
addEventListener("keydown", (event) => {
    //console.log("Keydown: " + event.key);
    switch (event.key) {
        case "w":
            moveup();
            break;
        case "ArrowUp":
            moveup();
            break;
        case "a":
            moveleft();
            break;
        case "ArrowLeft":
            moveleft();
            break;
        case "d":
            moveright();
            break;
        case "ArrowRight":
            moveright();
            break;
        case "s":
            movedown();
            break;
        case "ArrowDown":
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
    myGamePiece.speedX = -1;
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
    
}
