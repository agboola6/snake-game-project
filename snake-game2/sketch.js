// the snake is divided into small segments, which are drawn and edited on each 'draw' call
var lengthToBeginWith = 2;
var lengthOffset = lengthToBeginWith;

var direction = '';

var xStart = 0; //starting x coordinate for snake
var yStart = 250; //starting y coordinate for snake
var diff = 10;

var fruitPoint;
var snakePoints = [];
function Point(x, y) {
    this.x = x;
    this.y = y;
}

var canvas;
var scoreElem;
var pixelSize = 600;
var paused = false;
var gameOver = false;

var minFrameRate = 6;
var maxFrameRate = 25;
var frameRateValue;
var img;  // Declare variable 'img'.

//initial setup
function setup() {
    frameRateValue = minFrameRate;
    updateFrameRate(minFrameRate);

    fruitPoint = new Point(0, 0);

    for (var i = 0; i < lengthToBeginWith; i++) {
        snakePoints.push(new Point(xStart + (i * diff), yStart));
    }

    //load score
    scoreElem = createDiv('Score = ' + getScore());
    scoreElem.id = 'score';
    scoreElem.style('color', 'black');
    scoreElem.parent('playCanvas');

    //load canvas
    canvas = createCanvas(pixelSize, pixelSize);
    canvas.parent('playCanvas');

    img = loadImage("apple01.png");  // Load the image

    updateFruitCoordinates();
}

/** loop */
function draw() {
    background(0);

    checkForFruit();
    updateSnakeCoordinates();
    drawGrid();

    checkGameStatus();

    //show pause screen if paused
    if (paused) { pauseScreen(); }

    //show game Over screen if game is over
    if (gameOver) { gameOverScreen(); }

    checkKeyIsDown(); //listen for keydown
}

/** pause screen function */
function pauseScreen() {
    //background(50);
    // 25% opacity.
    fill(0, 0, 0, 63);
    rect(0, 0, pixelSize, pixelSize);

    noStroke();
    fill(255);
    textSize(pixelSize / diff);
    textAlign(CENTER); // Align the text in the center
    // and running the middle of the canvas
    text("paused! ❚❚", pixelSize / 2, pixelSize / 2);
    //console.log(w + ' ' + h);
}

/** the game over screen */
function gameOverScreen() {
    background(50);
    var myTextSize = pixelSize / diff;
    textSize(myTextSize);
    textAlign(CENTER); // Align the text in the center
    noStroke();
    fill(255);
    // and running the middle of the canvas
    text("GAME OVER!", pixelSize / 2, pixelSize / 2);
    text("Score = " + getScore(), pixelSize / 2, (pixelSize / 2) + myTextSize);
    //console.log(w + ' ' + h);
}

/** this function checks if the key is pressed continuously */
function checkKeyIsDown() {
    //if key is pressed continuously, increase framerate
    if (!paused && (
        (keyIsDown(RIGHT_ARROW) && direction === 'right')
        || (keyIsDown(UP_ARROW) && direction === 'up')
        || (keyIsDown(LEFT_ARROW) && direction === 'left')
        || (keyIsDown(DOWN_ARROW) && direction === 'down')
    )) {
        frameRateValue += 2;
        if (frameRateValue > maxFrameRate) {
            frameRateValue = maxFrameRate;//alow only a maximum frame rate
        }

        updateFrameRate(frameRateValue);
        //console.log(frameRateValue);
    }
}

/** function that updates the frame rate */
function updateFrameRate(currentRate) {
    frameRate(currentRate);
}

/** function that updates framerate */
function keyReleased() {
    frameRateValue = minFrameRate;
    updateFrameRate(frameRateValue);
}

/** draw grid */
function drawGrid() {
    stroke(255, 255, 255);//white
    strokeWeight(diff / 64);

    for (var i = diff; i < width; i += diff) {
        line(i, 0, i, height);
    }
    for (var j = diff; j < height; j += diff) {
        line(0, j, width, j);
    }
}

/*  The segments are updated based on the direction of the snake.
    All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
    gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
    and this results in the movement of the snake.

    The last segment is added based on the direction in which the snake is going,
    if it's going left or right, the last segment's x coordinate is increased by a
    predefined value 'diff' than its second to last segment. And if it's going up
    or down, the segment's y coordinate is affected.
*/
function updateSnakeCoordinates() {
    /** make sure there is a direction **/
    var xdirection = 0;
    var ydirection = 0;

    switch (direction) {
        case 'right':
            xdirection = diff;
            break;
        case 'up':
            ydirection = -diff;
            break;
        case 'left':
            xdirection = -diff;
            break;
        case 'down':
            ydirection = diff;
            break;
    }

    /** only change direction when necessary */
    if (xdirection !== 0 || ydirection !== 0) {
        snakePoints.shift();
        snakePoints.push(new Point(
            snakePoints[snakePoints.length - 1].x + xdirection,
            snakePoints[snakePoints.length - 1].y + ydirection
        ));
    }
    let colorToUse = 255;
    let colorDelta = floor(colorToUse / snakePoints.length);

    let n = 0;

    for (var i = snakePoints.length - 1; i >= 0; i-- , n++) {
        stroke(0, colorToUse, 0);

        strokeWeight(diff);
        point(snakePoints[i].x, snakePoints[i].y);
        if (i < snakePoints.length - 1) {
            line(snakePoints[i].x, snakePoints[i].y, snakePoints[i + 1].x, snakePoints[i + 1].y);
            //ellipse(points[i].x, points[i].y, diff, diff);
        }
        if (n % 2 == 1) {//reduce color delta alternatively
            colorToUse -= colorDelta;
        }
    }
}

/*  I always check the snake's head position xCor[xCor.length - 1] and
    yCor[yCor.length - 1] to see if it touches the game's boundaries
    or if the snake hits itself.
*/
function checkGameStatus() {
    var collison = checkSnakeCollision();

    if (snakePoints[snakePoints.length - 1].x > width || snakePoints[snakePoints.length - 1].x < 0 ||
        snakePoints[snakePoints.length - 1].y > height || snakePoints[snakePoints.length - 1].y < 0 || collison) {
        //scoreElem.html('Game ended! Your score was : ' + getScore() + ' ' + points.length + '/' + collison);
        scoreElem.html('Game ended! Your score was : ' + getScore());
        gameOver = true;
        noLoop();
    }
}

/*  If the snake hits itself, that means the snake head's (x,y) coordinate
    has to be the same as one of its own segment's (x,y) coordinate.
*/
function checkSnakeCollision() {
    var snakeHeadX = snakePoints[snakePoints.length - 1].x;
    var snakeHeadY = snakePoints[snakePoints.length - 1].y;
    for (var i = 0; i < snakePoints.length - 1; i++) {
        if (snakePoints[i].x === snakeHeadX && snakePoints[i].y === snakeHeadY) {
            return true;
        }
    }
    return false;
}

/* Set up the score = current snake length offset the starting length */
function getScore() {
    return snakePoints.length - lengthOffset;
}

/*  Whenever the snake consumes a fruit, I increment the number of segments,
    and just insert the tail segment again at the start of the array (basically
    I add the last segment again at the tail, thereby extending the tail)
*/
function checkForFruit() {
    //stroke(255);
    noFill();
    stroke(255, 0, 0);
    strokeWeight(diff);
    point(fruitPoint.x, fruitPoint.y);
    image(img, fruitPoint.x - (diff / 2), fruitPoint.y - (diff / 2), diff, diff);

    if (snakePoints[snakePoints.length - 1].x === fruitPoint.x &&
        snakePoints[snakePoints.length - 1].y === fruitPoint.y) {
        snakePoints.unshift(snakePoints[0]);//this will increase the snake length
        updateScore(); // update score
        updateFruitCoordinates(); //set new fruit coordinates
    }
}

/*  calculate the position of the fruit.
    The complex math logic is because I wanted the point to lie
    in between 100 and width-100, and be rounded off to the nearest
    number divisible by 10, since I move the snake in multiples of 10.
*/
function updateFruitCoordinates() {
    do {
        fruitPoint.x = floor(random(diff, (width - diff) / diff)) * diff;
        fruitPoint.y = floor(random(diff, (height - diff) / diff)) * diff;
    } while (partExists());
}

function partExists() {
    for (var i = 0; i < snakePoints.length; i++) {
        if (snakePoints[i].x === fruitPoint.x && snakePoints[i].y === fruitPoint.y) {
            return true;
        }
    }
    return false;
}

/** function that update the score */
function updateScore() {
    scoreElem.html('Score = ' + getScore());
}

/** handle keypressed */
function keyPressed() {//override function
    if (gameOver) { return; }

    if (key === ' ') {
        togglePause();
    }
    else if (!paused) {
        if (keyIsDown(LEFT_ARROW) && direction !== 'right') {
            direction = 'left';
        }
        else if (keyIsDown(DOWN_ARROW) && direction !== 'up') {
            direction = 'down';
        }
        else if (keyIsDown(RIGHT_ARROW) && direction !== 'left') {
            direction = 'right';
        }
        else if (keyIsDown(UP_ARROW) && direction !== 'down') {
            direction = 'up';
        }
    }
    //console.log(direction);
}

/** toggle when player pauses the game */
function togglePause() {
    paused = !paused;
    if (paused) { noLoop(); }
    else { loop(); }
}

document.querySelector('#btnGiveCommand').addEventListener('click', function () {
    //alert(2);
    //setup();
    document.location.reload(true); //try reloading the page
});