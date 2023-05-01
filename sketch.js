// エンティティ関連の関数----------------

// 全エンティティ共通
function updatePosition(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
}

//プレイヤーエンティティ
function createPlayer() {
  return {
    x: 200,
    y: 300,
    vx: 0,
    vy: 0
  };
}

function applyGravity(entity) {
  entity.vy += 0.25;
}

function applyJump(entity) {
  entity.vy = -7;
}

function drawPlayer(entity) {
  noStroke();
  fill("#3cb371");
  image(img, entity.x - 20, entity.y - 20, 40, 40);
  // square(entity.x, entity.y, 40)
}

function playerIsAlive(entity) {
  return entity.y < 600;
}

function createBlock(y) {
  return {
    x: 900,
    y,
    vx: -2,
    vy: 0
  };
}

function drawBlock(entity) {
  noStroke();
  fill("#5f6caf")
  rect(entity.x, entity.y, 80, 400);
}

function blockIsAlive(entity) {
  return -100 < entity.x;
}


function createItem(y) {
  let images = [img3, img4, img5];
  ransuu = Math.floor(Math.random() * images.length)
  return {
    x: 900 + Math.floor(Math.random() * (300 + 1)),
    y,
    vx: -2,
    vy: 0,
    shurui: ransuu
  };
}

function drawItem(entity) {
  noStroke();
  fill("#ffffff")

  if (entity.shurui == 0) {
    image(img3, entity.x - 40, entity.y - 40, 80, 80);
  } else if (entity.shurui == 1) {
    image(img4, entity.x - 40, entity.y - 40, 80, 80);
  } else if (entity.shurui == 2) {
    image(img5, entity.x - 40, entity.y - 40, 80, 80);
  }

}


function itemIsAlive(entity) {
  return -300 < entity.x;


}


function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
) {


  let currentXDistance = abs(entityA.x - entityB.x);
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y);
  if (collisionYDistance <= currentYDistance) return false;

  return true;
}



// ゲーム全体にかかわる部分-----------------


function score() {
  Noscore();
  if (gameState === "play") {
    fill(255);
    textSize(20);
    text('kcal' + sco, 500, 20);
    sco = sco - 5;


  } else {
    fill(255);
    textSize(100);
    text('kcal' + sco, 300, 200);
  }

}

function Noscore() {
  if (sco === 0) gameState = "gameover";

}

// プレイヤーエンティティ
let player = {
  x: 200,
  y: 300,
  vx: 0,
  vy: 0
};

let blocks;

let items;

let gameState;


let img;
let img2;
let img3;
let img4;
let img5;

let sound1;
let sound2;
let sound3;
let sound4;

function preload() {
  sound1 = loadSound("kirby.mp3");   //サウンド読み込み
  sound2 = loadSound("カービィゲームオーバー音.mp3");
  sound3 = loadSound("ジャンプ音.mp3");
  sound4 = loadSound("アイテムゲット音.mp3");

  img = loadImage("Kirby.png");
  img2 = loadImage("MacDonald.jpg");
  img3 = loadImage("ポテトフライ.png");
  img4 = loadImage("もやし.png");
  img5 = loadImage("ラーメン.png");
}


function addBlockPair() {
  let y = random(-100, 100);
  blocks.push(createBlock(y));
  blocks.push(createBlock(y + 600));
}


function addItemPair() {
  let y = random(200, 400);
  items.push(createItem(y));

}


//  試行錯誤中
function Sounds() {
  if (gameState === "play") {
    sound.play();

  } else if (gamestate === "gameover") {
    sound.stop();
  }
}

function drawGameoverScreen() {
  background(0, 192);
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);
}

function resetGame() {
  gameState = "play";
  player = createPlayer();
  blocks = [];
  items = [];
  sco = 8000;
  // Sounds();

}

function updateGame() {
  if (gameState === "gameover") return;

  if (frameCount % 120 === 1) addBlockPair(blocks);
  blocks = blocks.filter(blockIsAlive);

  if (frameCount % (60 * (Math.floor(Math.random() * (4 - 3)) + 3)) === 1) addItemPair(items);
  items = items.filter(itemIsAlive);

  //プレイヤーの位置を更新
  updatePosition(player);
  for (let block of blocks) updatePosition(block);
  for (let item of items) updatePosition(item);

  //プレイヤーに重力を適用
  applyGravity(player);

  if (!playerIsAlive(player)) gameState = "gameover"

  for (let block of blocks) {
    if (entitiesAreColliding(player, block, 20 + 40, 20 + 200)) {
      gameState = "gameover";
      break;
    }
  }

  for (let item of items) {
    if (entitiesAreColliding(player, item, 20 + 40, 20 + 40)) {
      sco = sco + 20;
      // sound4.play();
      break;
    }
  }
}

function drawGame() {
  //プレイヤーを描画
  background(img2);
  drawPlayer(player);

  for (let block of blocks) drawBlock(block);

  for (let item of items) drawItem(item);

  if (gameState === "gameover") drawGameoverScreen();
}

function onMousePress() {
  applyJump(player);
  sound3.play();

  switch (gameState) {
    case "play":
      applyJump(player);
      break;
    case "gameover":
      resetGame();
      break;
  }
}


// setup/draw他----------------------


function setup() {
  createCanvas(800, 600);
  background(200);
  rectMode(CENTER);  //四角形の基準点を角から中心に変える
  // imageMode(CENTER);
  resetGame();
  sound1.loop();


}

function draw() {
  updateGame();
  drawGame();
  score();

}

function mousePressed() {
  onMousePress();
}

