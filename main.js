/**
 * Created by httpnick on 1/14/15.
 */
function Animate(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.totalTime = frameDuration * this.frames;
    this.elapsedTime = this.frameDuration * this.frames;
    this.loop = loop;
    this.reverse = reverse;
}

Animate.prototype.drawFrame = function(tick, ctx, x, y) {
    this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) this.elapsedTime = 0;
        }
        var frame = this.currentFrame();
        var xindex = 0;
        var yindex = 0;
        xindex = (frame % this.frames);
        ctx.drawImage(this.spriteSheet,
            (xindex * this.frameWidth) + this.startX,
            this.startY,
            this.frameWidth, this.frameHeight,
            x, y, this.frameWidth, this.frameHeight);
}

Animate.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animate.prototype.isDone = function() {
    return (this.elapsedTime >= this.totalTime);
}

function MasterChief(game, spritesheet) {
    this.animate = new Animate(spritesheet, 0, 0, 46, 70, 0.1, 1, true, false);
    this.moveAnimate = new Animate(spritesheet, 120, 0, 46, 70, 0.1, 3, true, false);
    this.shootAnimate = new Animate(spritesheet, 49, 0, 60, 70, 0.1, 1, true, false);
    this.crouchAnimate = new Animate(spritesheet, 100, 76, 46, 70, 0.1, 4, false, false);
    this.holdCrouchAnimate = new Animate(spritesheet, 238, 76, 46, 70, 0.1, 4, false, false);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
}

MasterChief.prototype.draw = function() {
    if (shooting) {
        this.shootAnimate.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (isMoving) {
        this.moveAnimate.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (crouching) {
        this.crouchAnimate.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        if (this.crouchAnimate.isDone()) {
            this.crouchAnimate.elapsedTime = 0;
            crouching = false;
            holdCrouch = true;
        }
    } else if (holdCrouch) {
      this.holdCrouchAnimate.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.animate.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

MasterChief.prototype.update = function() {
    if (isMoving) {
        this.x += direction;
    }
    if (shooting) {
        this.shoot();
    }
}

MasterChief.prototype.shoot = function() {
    gameEngine.addEntity(new Bullet(this.game, assets.getAsset("./img/bullet.png"), this.x + 50, this.y + 7));
}

function Bullet(game, spritesheet, x, y) {
    this.game = game;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.animate = new Animate(spritesheet, 0, 100, 30, 30, 0.1, 1, true, false);
    this.removeFromWorld = false;

}

Bullet.prototype.draw = function() {
    this.animate.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Bullet.prototype.update = function() {
    if (this.isOffScreen()) {
        this.removeFromWorld = true;
    }
    this.x += 10;
}

Bullet.prototype.isOffScreen = function() {
    if (this.x >= this.game.surfaceWidth || this.x < 0) {
        return true;
    }
}

function keyDownHandler(event) {

    var keyPressed = String.fromCharCode(event.keyCode);

    if (keyPressed == "D")
    {
        isMoving = true;
        direction = 2;
    } else if (keyPressed == "A") {
        isMoving = true;
        direction = -2;
    } else if (keyPressed == "S") {
        isMoving = false;
        direction = 0;
        crouching = true;
    } else if (keyPressed == "W") {
        shooting = true;
    }
}

function keyUpHandler(event) {

    var keyPressed = String.fromCharCode(event.keyCode);
    if (keyPressed == "D") {
        isMoving = false;
    } else if (keyPressed == "A") {
        isMoving = false;
    } else if (keyPressed == "S") {
        crouching = false;
        holdCrouch = false;
    }
}
var assets = new Assets();
var isMoving = false;
var direction;
var shooting;
var crouching;
var holdCrouch;

var gameEngine = new GameEngine();

assets.queueDownload("./img/MasterChief.png");
assets.queueDownload("./img/bullet.png");

assets.downloadAll(function() {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    document.addEventListener("keydown",keyDownHandler, false);
    document.addEventListener("keyup",keyUpHandler, false);
    /* This event listener worked on chrome, but not firefox.
    document.addEventListener("keypress", function(event){
        var keyPressed = String.fromCharCode(event.keyCode);
        if (keyPressed == "W") {
            shooting = true;
        }

    }, false); */
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new MasterChief(gameEngine, assets.getAsset("./img/MasterChief.png")));

    console.log("DONE!");
})