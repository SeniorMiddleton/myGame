let heroImg = document.querySelector("#hero-img");
let block = document.querySelector("#block");
let canvas = document.querySelector(".canvas");
let fullScreen = document.querySelector("#fullScreen");
let jumpBlock = document.querySelector("#jump-block");
let hitBlock = document.querySelector("#hit-block");
let blockStyles = window.getComputedStyle(block);
let backgroundCanvas = window.document.querySelector("#background-canvas");

let info = document.querySelector("#info");
let tileArray = [];
let maxLives = 6;
let lives = 6;
let heartArray = [];

let moveImg = 0;
let moveBlock = 0;
let direction = "right";
let hit = false;
let jump = false;
let fall = false;
let x = 0;

let heroX = Math.floor(
  (Number.parseInt(blockStyles.getPropertyValue("left")) + 32) / 32
);
let heroY = Math.floor(
  Number.parseInt(blockStyles.getPropertyValue("bottom")) / 32
);
let jumpRight = Number.parseInt(blockStyles.getPropertyValue("bottom"));
console.log(heroX, heroY);
let jumpDown = Number.parseInt(block.style.bottom - 40);

let halfWidth = window.screen.width / 2;
jumpBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;
hitBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;

// FUNCTION
jumpBlock.onclick = () => {
  jump = true;
};

hitBlock.onclick = () => {
  hit = true;
};

heroImg.onclick = () => {
  e.preventDefault();
};

const myPosition = () => {
  heroX = Math.ceil(
    (Number.parseInt(blockStyles.getPropertyValue("left")) + 32) / 32
  );
  heroY = Math.ceil(
    Number.parseInt(blockStyles.getPropertyValue("bottom")) / 32
  );
  // info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
};

const checkFalling = () => {
  myPosition();
  let isFalling = true;
  for (let i = 0; i < tileArray.length; i++) {
    if (tileArray[i][0] === heroX && tileArray[i][1] + 1 === heroY) {
      isFalling = false;
    }
  }
  if (isFalling) {
    // info.innerText = info.innerText + ", Falling";
    fall = true;
  } else {
    // info.innerText = info.innerText + ",not Falling";
    fall = false;
  }
};

const fallHandler = () => {
  heroImg.style.top = "-96px";
  block.style.bottom = `${Number.parseInt(block.style.bottom) - 32}px`;
  checkFalling();
};

const moveRight = () => {
  checkFalling();
  moveImg = moveImg + 1;
  moveBlock = moveBlock + 1;
  if (moveImg > 5) {
    moveImg = 1;
  }
  heroImg.style.transform = "scale(-1,1)";
  heroImg.style.top = "-192px";
  heroImg.style.left = `-${moveImg * 96}px`;
  block.style.left = `${moveBlock * 20}px`;
  myPosition();
};

const moveLeft = () => {
  checkFalling();
  moveImg = moveImg + 1;
  moveBlock = moveBlock - 1;
  if (moveImg > 5) {
    moveImg = 1;
  }
  heroImg.style.transform = "scale(1,1)";
  heroImg.style.top = "-192px";
  heroImg.style.left = `-${moveImg * 96}px`;
  block.style.left = `${moveBlock * 20}px`;
  myPosition();
};
// EVENT

fullScreen.onclick = () => {
  if (window.document.fullscreen) {
    fullScreen.src = "fullscreen.png";
    window.document.exitFullscreen();
  } else {
    fullScreen.src = "cancel.png";
    canvas.requestFullscreen();
  }
};

const standHadler = () => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (moveImg > 4) {
        moveImg = 1;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (moveImg > 3) {
        moveImg = 0;
      }
      break;
    }
    default:
      break;
  }
  moveImg = moveImg + 1;

  heroImg.style.left = `-${moveImg * 96}px`;
  heroImg.style.top = "0px";
  checkFalling();
};

const hitHandler = () => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (moveImg > 4) {
        moveImg = 1;
        hit = false;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (moveImg > 3) {
        moveImg = 0;
        hit = false;
      }
      break;
    }
    default:
      break;
  }
  moveImg = moveImg + 1;

  heroImg.style.left = `-${moveImg * 96}px`;
  heroImg.style.top = "-288px";
};

const jumpHandler = () => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (moveImg > 4) {
        moveImg = 1;
        jump = false;
        block.style.bottom = `${jumpRight + 160}px`;

        moveBlock = moveBlock + 10;
        block.style.left = `${moveBlock * 20}px`;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (moveImg > 3) {
        moveImg = 0;
        jump = false;
        block.style.bottom = `${jumpRight + 160}px`;
        moveBlock = moveBlock - 10;
        block.style.left = `${moveBlock * 20}px`;
      }
      break;
    }
    default:
      break;
  }
  moveImg = moveImg + 1;

  heroImg.style.left = `-${moveImg * 96}px`;
  heroImg.style.top = "-96px";
};

let onTouchStart = (e) => {
  // e.preventDefault();
  clearInterval(timer);
  x = e.type === "mousedown" ? e.screenX : e.touches[0].screenX;

  timer = setInterval(() => {
    if (x > halfWidth) {
      direction = "right";
      moveRight();
    } else {
      direction = "left";
      moveLeft();
    }
  }, 130);
};
let onTouchEnd = (e) => {
  // e.preventDefault();
  clearInterval(timer);
  lifeCycle();
};

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;

window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;

let timer = null;
const lifeCycle = () => {
  timer = setInterval(() => {
    if (jump) {
      jumpHandler();
    } else if (hit) {
      hitHandler();
    } else if (fall) {
      fallHandler();
    } else {
      standHadler();
    }
  }, 120);
};

const createTile = (x, y = 1) => {
  let tile = document.createElement("img");
  tile.src = "assets/1 Tiles/Tile_02.png";
  tile.style.position = "absolute";
  tile.style.left = `${x * 32}px`;
  tile.style.bottom = `${y * 32}px`;
  backgroundCanvas.appendChild(tile);

  tileArray.push([x, y]);
};

const createTilesPlatform = (startX, startY, length) => {
  for (let i = 0; i < length; i++) {
    createTile(startX + i, startY);
  }
};

const addTiles = (i) => {
  createTile(i);
  let tileBottom = document.createElement("img");
  tileBottom.src = "assets/1 Tiles/Tile_04.png";
  tileBottom.style.position = "absolute";
  tileBottom.style.left = `${i * 32}px`;
  tileBottom.style.bottom = 0;

  backgroundCanvas.appendChild(tileBottom);
};

class Enemy {
  ATTACK = "attack";
  DEATH = "death";
  HURT = "hurt";
  IDLE = "idle";
  WALK = "walk";

  startX;
  state;
  animateWasChanged;
  posX;
  posY;
  img;
  block;
  blockSize;
  spritePos;
  spriteMaxPos;
  timer;
  sourcePath;
  dir;
  stop;
  constructor(x, y) {
    this.posX = x;
    this.startX = this.posX;
    this.posY = y;
    this.blockSize = 96;
    this.spritePos = 0;
    this.spriteMaxPos = 3;
    this.sourcePath = "enemies/1/";
    this.dir = 1;
    this.stop = false;

    this.state = this.IDLE;
    this.animateWasChanged = false;

    this.createImg();
    this.changeAnimate(this.WALK);
    this.lifeCycle();
  }
  createImg() {
    this.block = document.createElement("div");
    this.block.style.position = "absolute";
    this.block.style.left = `${this.posX * 32}px`;
    this.block.style.bottom = `${this.posY * 32}px`;
    this.block.style.width = `${this.blockSize}px`;
    this.block.style.height = `${this.blockSize}px`;
    this.block.style.overflow = "hidden";

    this.img = document.createElement("img");
    this.img.src = this.sourcePath + "Idle.png";
    this.img.style.position = "absolute";
    this.img.style.left = "0px";
    this.img.style.bottom = "0px";
    this.img.style.width = `${this.blockSize * 4}px`;
    this.img.style.height = `${this.blockSize}px`;
    this.block.appendChild(this.img);
    canvas.appendChild(this.block);
  }
  lifeCycle() {
    this.timer = setInterval(() => {
      if (this.animateWasChanged) {
        this.animateWasChanged = false;
        switch (this.state) {
          case this.ATTACK: {
            this.setAttack();
            break;
          }
          case this.DEATH: {
            this.setDeath();
            break;
          }
          case this.HURT: {
            this.setHurt();
            break;
          }
          case this.IDLE: {
            this.setIdle();
            break;
          }
          case this.WALK: {
            this.setWalk();
            break;
          }
          default:
            break;
        }
      }
      this.spritePos++;
      this.checkCollide();
      if (!this.stop) {
        this.move();
      } else {
        this.changeAnimate(this.ATTACK);
      }

      this.animate();
    }, 150);
  }
  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        lives--;
        updateHearts();
      }
    }
    this.img.style.left = `-${this.spritePos * this.blockSize}px`;
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.spriteMaxPos = 5;
    this.img.style.width = `${this.blockSize * 6}px`;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.spriteMaxPos = 5;
    this.img.style.width = `${this.blockSize * 6}px`;
  }
  setHurt() {
    this.img.src = this.sourcePath + "Hurt.png";
    this.spriteMaxPos = 1;
    this.img.style.width = `${this.blockSize * 2}px`;
  }
  setIdle() {
    this.img.src = this.sourcePath + "Idle.png";
    this.spriteMaxPos = 3;
    this.img.style.width = `${this.blockSize * 6}px`;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.spriteMaxPos = 5;
    this.img.style.width = `${this.blockSize * 6}px`;
  }
  changeAnimate(stateStr) {
    this.state = stateStr;
    this.animateWasChanged = true;
  }
  move() {
    if (this.posX > this.startX + 10) {
      this.dir = this.dir * -1;
      this.img.style.transform = "scale(-1,1)";
    } else if (this.posX <= this.startX) {
      this.dir = Math.abs(this.dir);
      this.img.style.transform = "scale(1,1)";
    }

    this.posX = this.posX + this.dir;
    this.block.style.left = `${this.posX * 32}px`;
  }
  checkCollide() {
    if (heroY === this.posY) {
      if (heroX === this.posX) {
        //attack left
        this.stop = true;
      } else if (heroX === this.posX + 2) {
        //attack right
        this.stop = true;
      } else {
        this.stop = false;
        this.changeAnimate(this.WALK);
      }
    } else {
      this.stop = false;
      this.changeAnimate(this.WALK);
    }
  }
}

class Heart {
  img;
  x;
  constructor(x, src) {
    this.x = x + 1;
    this.img = window.document.createElement("img");
    this.img.src = src;
    this.img.style.position = "absolute";
    this.img.style.left = `${this.x * 32}px`;
    this.img.style.top = `10px`;
    this.img.style.width = `32px`;
    this.img.style.height = `32px`;
    canvas.appendChild(this.img);
  }
}

class HeartEmpty extends Heart {
  constructor(x) {
    super(x, "heart.png");
  }
}

class HeartRed extends Heart {
  constructor(x) {
    super(x, "heart1.png");
  }
}

const addHearts = () => {
  for (let i = 0; i < maxLives; i++) {
    let heartRed = new HeartRed(i);
    let heartEmpty = new HeartEmpty(i);
    heartArray.push(heartRed);
  }
};

const updateHearts = () => {
  if (lives < 1) {
    lives = 1;
  }
  for (i = 0; i < lives; i++) {
    heartArray[i].img.style.display = "block";
  }
  for (i = lives; i < maxLives; i++) {
    heartArray[i].img.style.display = "none";
  }
};

const start = () => {
  lifeCycle();
  for (i = 0; i < 100; i++) {
    // if (i > 10 && i < 17) {
    //   continue;
    // }
    addTiles(i);
  }
  createTilesPlatform(10, 10, 10);
  createTilesPlatform(3, 5, 10);
  console.log(tileArray);

  let enemy = new Enemy(10, 2);

  addHearts();
  updateHearts();
};
start();
