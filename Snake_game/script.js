class Game {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
  }

  update() {
    //updates all sprites
    for (var i = 0; i < this.sprites.length; i += 1) {
      this.sprites[i].update();
    }
  }

  draw() {
    //clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //draws the canvas
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 7;
    this.ctx.strokeStyle = "#d0de0df1";
    this.ctx.fillStyle = "#272727";
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = "undefined";
    //draws all sprites.
    for (var i = 0; i < this.sprites.length; i += 1) {
      this.sprites[i].draw(this.ctx);
    }
  }

  addSprite(newSprite) {
    this.sprites.push(newSprite);
  }
}

class Sprite {
  update() {}
  draw(ctx) {}
}
//create a new Game instance.
var myGame = new Game();

//Grid info variables
const nodeWidth = 25;
const nodeHeight = 25;
const counterGridWidth = myGame.canvas.width / nodeWidth;
const counterGridHeight = myGame.canvas.height / nodeHeight;
//movement variables
var dx = -1;
var dy = 0;
//Score
var score = 0;

function randNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//==========================- Class Node -===========================//
class Node extends Sprite {
  constructor(posX, posY) {
    super();
    this.Xindex = posX;
    this.Yindex = posY;
    this.posX = posX * nodeWidth;
    this.posY = posY * nodeHeight;
    this.isSnake = false;
    this.isPallet = false;
  }
  draw(pctx) {
    if (this.isPallet) {
      drawPallet(this.Xindex, this.Yindex, pctx);
    }
  }

  getXIndex() {
    return this.Xindex;
  }
  getYIndex() {
    return this.Yindex;
  }
  getPosX() {
    return this.posX;
  }
  getPosY() {
    return this.posY;
  }
  setIsSnake(value) {
    if (value == true) this.isSnake = true;
    else this.isSnake = false;
  }
  getIsSnake() {
    return this.isSnake;
  }
  setIsPallet(value) {
    if (value) this.isPallet = true;
    else this.isPallet = false;
  }
  getIsPallet() {
    return this.isPallet;
  }
}

arrayOfNodes = [[]];
for (var i = 0; i < counterGridWidth; i++) {
  arrayOfNodes[i] = [];
  for (var j = 0; j < counterGridHeight; j++) {
    arrayOfNodes[i][j] = new Node(i, j);
    myGame.addSprite(arrayOfNodes[i][j]);
  }
}

//function to generate random Pallets
function generateRandPallet() {
  var palletX = randNum(0, counterGridWidth);
  var palletY = randNum(0, counterGridHeight);
  arrayOfNodes[palletX][palletY].setIsPallet(true);
}
//==========================- Class Snake -===========================//
class Snake extends Sprite {
  constructor() {
    super();
    this.body = [
      { x: 16, y: 16 },
      { x: 17, y: 16 },
      { x: 18, y: 16 },
    ];
    this.direction = "Left";
    this.newDirection = "idle";
    this.itterator = 0;
  }

  has_game_ended() {
    for (let i = 4; i < this.body.length; i++) {
      if (
        this.body[i].x === this.body[0].x &&
        this.body[i].y === this.body[0].y
      )
        return true;
    }
    const hitLeftWall = this.body[0].x < 0;
    const hitRightWall = this.body[0].x > counterGridWidth - 1;
    const hitToptWall = this.body[0].y < 0;
    const hitBottomWall = this.body[0].y > counterGridHeight - 1;
    //returns true one of them is true.
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
  }

  eat() {
    const head = { x: this.body[0].x + dx, y: this.body[0].y + dy };
    this.body.unshift(head);
  }

  move() {
    this.itterator++;
    if (this.itterator == 6) {
      var head = { x: this.body[0].x + dx, y: this.body[0].y + dy };
      this.body.unshift(head);
      this.body.pop();
      this.itterator = 0;
    }
  }

  update() {
    if (!this.has_game_ended()) {
      this.move();
      var head = { x: this.body[0].x, y: this.body[0].y };
      if (arrayOfNodes[head.x][head.y].getIsPallet()) {
        arrayOfNodes[head.x][head.y].setIsPallet(false);
        this.eat();
        score += 10;
        console.log("score: "+score);
        generateRandPallet();
      }
    }
    else
      console.log("Game over!")
  }

  draw(pctx) {
    for (let i = 0; i < this.body.length; i++) {
      drawSnakeBody(this.body[i].x, this.body[i].y, pctx);
    }
  }
}

//create and add snake to sprites.
var mySnake = new Snake();
myGame.addSprite(mySnake);

//generate first random pallet
generateRandPallet();

//event listener
var event = document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37 && mySnake.direction != "Right") {
    console.log("Left");
    mySnake.direction = "Left";
    dx = -1;
    dy = 0;
  } else if (e.keyCode == 38 && mySnake.direction != "Down") {
    console.log("Up");
    mySnake.direction = "Up";
    dx = 0;
    dy = -1;
  } else if (e.keyCode == 39 && mySnake.direction != "Left") {
    console.log("Right");
    mySnake.direction = "Right";
    dx = 1;
    dy = 0;
  } else if (e.keyCode == 40 && mySnake.direction != "Up") {
    console.log("Down");
    mySnake.direction = "Down";
    dx = 0;
    dy = 1;
  } else {
    console.log("Not an arrow key");
  }
});

//animation
function animate() {
  myGame.update();
  myGame.draw();
  requestAnimFrame(animate);
}

//requesting animationFrames from all possible web_engines
var requestAnimFrame = (function (callback) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

animate();

//============================- Draw Functions -============================//

function drawSnakeBody(i, j, pctx) {
  pctx.beginPath();
  pctx.rect(
    arrayOfNodes[i][j].posX,
    arrayOfNodes[i][j].posY,
    nodeWidth,
    nodeHeight
  );
  pctx.lineWidth = 0.5;
  pctx.strokeStyle = "#000000";
  pctx.fillStyle = "GREEN";
  pctx.fill();
  pctx.stroke();
  pctx.fillStyle = "undefined";
}

function drawPallet(i, j, pctx) {
  pctx.beginPath();
  pctx.rect(
    arrayOfNodes[i][j].posX,
    arrayOfNodes[i][j].posY,
    nodeWidth,
    nodeHeight
  );
  pctx.lineWidth = 2;
  pctx.strokeStyle = "#000000";
  pctx.fillStyle = "#f2fd1d";
  pctx.fill();
  pctx.stroke();
  pctx.fillStyle = "undefined";
}
