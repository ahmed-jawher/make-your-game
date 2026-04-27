import * as Moving from "./moving.js";
import * as outil from "./outils.js";
import * as Btn from "./button.js";
export var game = {
  LEVEL: 0,
  enemyLevel: 0,
  enemyNBR: 0,
  isPaused: false,
  isGamrOver: false,
  isleave: false,
  isStoryshowed: false,
  score: 0,
  livesNbr: 3,
  wallNbr: 3,
  line: 8,
  second: 0,
  time: 0,
  gameresultTexts: [
    "You Win",
    "Game Over"
  ]
};
export var speed = {
  bulletSpeed: 5,
  enemySpeed: 1,
  shipSpeed: 3,
  speedEnemyBullet: 5,
}

export var elements = {
  timer: document.getElementById("timer"),
  ScoreBar: document.getElementById("score"),
  menu: document.querySelector("#menu"),
  enemysDiv: document.getElementById("enemysDiv"),
  board: document.getElementById("board"),
  levelDiv: document.getElementById("level"),
  blurOverlay: document.querySelector("#blur-overlay"),
  PauseBtn: document.querySelector("#pause"),
  lives: document.querySelectorAll(".lives"),
  story: document.getElementById("story"),
  textStory: document.getElementById("textStory"),
  Walls: document.getElementById("Walls"),
  battlestartbtn: document.querySelector(".battlestart"),
};

export var requestID = {
  requestID: 0,
};

export var cords = elements.board.getBoundingClientRect();
export let ship = document.createElement("div");

function refreshBoardMetrics() {
  cords = elements.board.getBoundingClientRect();
}

function applyResponsiveLayout() {
  refreshBoardMetrics();

  const boardWidth = elements.board.clientWidth;

  game.line = 8;
  game.wallNbr = 3;

  if (boardWidth < 560 && boardWidth > 300) {
    game.line = 6;
  } else if (boardWidth <= 300) {
    game.line = 4;
    game.wallNbr = 2;
  }

  elements.enemysDiv.style.width = `${Math.round(cords.width * 0.7)}px`;
  elements.enemysDiv.style.left = `${Math.ceil(cords.left)}px`;
  elements.enemysDiv.style.top = `${Math.round(cords.top + Math.max(60, cords.height * 0.14))}px`;
  elements.enemysDiv.style.gridTemplateColumns = `repeat(${game.line}, 1fr)`;

  ship.style.left = `${Math.round(cords.left + cords.width / 2 - ship.offsetWidth / 2)}px`;
  ship.style.top = `${Math.round(cords.top + cords.height - ship.offsetHeight - Math.max(20, cords.height * 0.04))}px`;

  Moving.syncTransforms();
}

/**********************************************/

document.addEventListener("DOMContentLoaded", () => {
  Btn.Pause()
  elements.menu.style.display = "none";
  elements.story.style.zIndex = "2";
  game.isStoryshowed = true
})

elements.battlestartbtn.addEventListener("click", () => {
  elements.story.style.display = "none"
  game.isStoryshowed = false
  if (game.isGamrOver) {

    Btn.Restart()
  } else {
    Btn.Continue()
  }
})

setInterval(function updatetimer() {
  if (game.isGamrOver || game.isPaused) {
    return;
  }
  game.second++;
  elements.timer.textContent = String(game.second).padStart(3, "0");
}, 1000);

document.addEventListener("keydown", (e) => {
  if (game.isStoryshowed) return
  if (e.key == "Escape") {
    if (game.isPaused) {
      Btn.Continue();
    } else {
      Btn.Pause();
    }

  }

});

/*****************LEVEL************************/

export function levelUP() {
  cancelAnimationFrame(requestID.requestID_MoveEnemy);
  applyResponsiveLayout();

  if (game.LEVEL === 4) {
    gameOver(1);
    return;
  }
  if (game.LEVEL == 0) {
    outil.addWalls();
  }
  game.LEVEL++;

  if (game.LEVEL > 1) {
    game.isStoryshowed = true;
    elements.story.style.display = "flex";
    elements.textStory.textContent = `LEVEL ${game.LEVEL}`;
    elements.textStory.style.color = "blanchedalmond";
    elements.battlestartbtn.textContent = "Start";
    Btn.Pause();
  }

  elements.enemysDiv.innerHTML = "";
  outil.distroy(".bullets");
  elements.enemysDiv.style.gridTemplateRows = `repeat(${game.LEVEL}, 62.5px);`;
  elements.enemysDiv.style.height = `${40 * game.LEVEL}px`;

  game.enemyLevel += game.line;
  game.enemyNBR = game.enemyLevel;
  for (let i = 0; i < game.enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.classList.add("existsEnemy");
    elements.enemysDiv.appendChild(enemy);
  }

  elements.levelDiv.textContent = "LEVEL " + game.LEVEL.toString();
}


function gameLoop(t) {
  Moving.handleShooting();
  Moving.moveShip();
  Moving.moveEnemys();
  Moving.enemyShoot(t)
  Moving.moveBullet()
  Moving.movingEnemybullets()

  requestID.requestID = requestAnimationFrame(gameLoop);
}

/**********************************************/

/****************************************/
export function gameOver(win) {
  game.isGamrOver = true;
  game.isStoryshowed = true
  elements.story.style.display = "flex"
  if (win == 1) {
    elements.textStory.textContent = game.gameresultTexts[0];
    elements.textStory.style.color = "green";
  } else {
    elements.textStory.textContent = game.gameresultTexts[1];
    elements.textStory.style.color = "red";
  }
  elements.battlestartbtn.textContent = "Restart"

  outil.distroy(".bullets");
  //elements.board.removeChild(ship)
}

/*************************************/
export function setup() {
  elements.PauseBtn.onclick = Btn.Pause;
  document.getElementById("startCon").onclick = Btn.Continue;
  document.getElementById("restart").onclick = Btn.Restart;

  ship.id = "ship";
  if (!elements.board.contains(ship)) {
    elements.board.appendChild(ship);
  }

  applyResponsiveLayout();

  levelUP();
  requestID.requestID = requestAnimationFrame(gameLoop);
}

setup();

window.addEventListener("resize", () => {
  applyResponsiveLayout();
});


let bl = false;
setInterval(function () {
  if (game.isGamrOver || game.isPaused) {
    return;
  }
  let existEnemy = document.querySelectorAll(".existsEnemy");
  if (!existEnemy) {
    return;
  }
  existEnemy.forEach((e) => {
    if (bl) {
      e.style.backgroundImage = "url('assets/enemy-1.png')";
    } else {
      e.style.backgroundImage = "url('assets/enemy-2.png')";
    }
  });
  if (bl) {
    bl = false;
  } else {
    bl = true;
  }
}, 500);
