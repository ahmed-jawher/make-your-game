import * as main from "./script.js";
import * as outil from "./outils.js";
import { game, ship, cords, requestID, speed, elements } from "./script.js";



let bullets = [];
let isShooting = false;

/**********************shooting***************************/
var throttledShut = outil.throttle(shut, 500);
window.addEventListener("keydown", (event) => {
  if (game.isPaused || game.isGamrOver) {
    return;
  }
  if (event.key == " ") {
    event.preventDefault();
    isShooting = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key == " ") {
    isShooting = false;
  }
});

export function handleShooting() {
  if (game.isPaused || game.isGamrOver || game.isStoryshowed) {
    return;
  }

  if (isShooting) {
    throttledShut();
  }
}

export function shut() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullets", "Ybullets");
  const shipRect = ship.getBoundingClientRect();
  bullet.style.left = `${shipRect.left + 10}px`;
  bullet.style.top = `${shipRect.top}px`;
  bullet.style.transform = `translateY(0px)`;
  elements.board.appendChild(bullet);
  bullets.push(bullet);
}

export function moveBullet() {
  if (game.isPaused || game.isGamrOver) return;

  let pixels = document.querySelectorAll(".existsPixel");

  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    let bulletRect = bullet.getBoundingClientRect();

    let tf = false
    for (let ii = 0; ii < pixels.length; ii++) {
      if (outil.isColliding(bullet, pixels[ii])) {
        bullet.remove();
        bullets.splice(i, 1);
        pixels[ii].classList.remove("existsPixel");
        tf = true
        break
      }
    }

    if (tf) continue

    if (bulletRect.top > main.cords.top) {
      let c = parseFloat(bullet.style.transform.split('translateY(')[1]);
      bullet.style.transform = `translateY(${c - speed.bulletSpeed}px)`;

      document.querySelectorAll(".existsEnemy").forEach((enemy) => {
        if (outil.isColliding(bullet, enemy)) {
          enemy.classList.remove("existsEnemy");
          game.score += 5;
          elements.ScoreBar.textContent = String(game.score).padStart(4, "0");
          bullet.remove();
          bullets.splice(i, 1);
          game.enemyNBR--;

          if (game.enemyNBR === 0) {
            main.levelUP();
            return
          }
        }
      });
    } else {
      bullet.remove();
      bullets.splice(i, 1);
    }
  }
}


/***************************move Enemys****************************/
let xx = 0;
export function moveEnemys() {
  if (game.isPaused || game.isGamrOver) {
    return;
  }

  const enemyCords = elements.enemysDiv.getBoundingClientRect();

  if (enemyCords.right > cords.right || enemyCords.left < cords.left) {
    speed.enemySpeed *= -1;
  }

  xx += speed.enemySpeed;
  elements.enemysDiv.style.transform = `translateX(${xx}px)`;
}

export function syncTransforms() {
  ship.style.transform = `translateX(${x}px)`;
  elements.enemysDiv.style.transform = `translateX(${xx}px)`;
}

/***********************ship**************************/

var isMoving = false;
var direction;
window.addEventListener("keydown", (event) => {
  if (game.isPaused || game.isGamrOver) return;

  if ((event.key === "ArrowLeft" || event.key === "ArrowRight")) {
    event.preventDefault();
    direction = event.key;
    isMoving = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key == direction) {
    isMoving = false;
  }
});

var x = 0;
export function moveShip() {
  if (game.isPaused || game.isGamrOver) {
    return;
  }

  if (isMoving &&
    direction == "ArrowLeft" &&
    x >= ship.offsetWidth / 2 - elements.board.offsetWidth / 2
  ) {
    ship.style.transform = ` translateX(${x}px)`;
    x -= speed.shipSpeed;
  }

  if (isMoving &&
    direction == "ArrowRight" &&
    x <= elements.board.offsetWidth / 2 - ship.offsetWidth / 2
  ) {
    ship.style.transform = ` translateX(${x}px)`;
    x += speed.shipSpeed;
  }

}
/***********************enemy shuting******************************/


let enemyBullets = [];


export function enemyShoot(t) {
  if (game.isPaused || game.isGamrOver) {
    return;
  }

  if (t - game.time < 2000 / game.LEVEL) {
    return;
  }

  let existEnemy = document.querySelectorAll(".existsEnemy");

  let a = existEnemy[outil.getNb(existEnemy.length)];
  let b = document.createElement("div");
  b.classList.add("bullets");
  b.classList.add("Xbullets");

  let cord = a.getBoundingClientRect();

  b.style.left = `${cord.left + existEnemy[0].offsetWidth / 2}px`;
  b.style.top = `${cord.top + existEnemy[0].offsetHeight}px`;
  b.style.transform = `translateY(0px)`;

  elements.board.appendChild(b);
  enemyBullets.push(b);

  game.time = t
}

export function movingEnemybullets() {
  if (game.isPaused || game.isGamrOver) {
    return;
  }

  let pixels = document.querySelectorAll(".existsPixel");

  for (let i = 0; i < enemyBullets.length; i++) {

    for (let ii = 0; ii < pixels.length; ii++) {
      if (outil.isColliding(enemyBullets[i], pixels[ii])) {
        enemyBullets[i].remove();
        enemyBullets.splice(i, 1);
        pixels[ii].classList.remove("existsPixel");
        return
      }
    }

    let c = enemyBullets[i].getBoundingClientRect();
    if (c.top + c.height < cords.bottom) {
      const currentY = parseFloat(enemyBullets[i].style.transform.split('translateY(')[1]);
      enemyBullets[i].style.transform = `translateY(${currentY + speed.speedEnemyBullet}px) translateZ(0)`;

      if (outil.isColliding(enemyBullets[i], ship)) {
        enemyBullets[i].remove();
        enemyBullets.splice(i, 1);
        game.livesNbr--;
        elements.lives[game.livesNbr].style.visibility = "hidden";
        if (game.livesNbr == 0) {
          main.gameOver(0);
          return
        }
      }
    } else {
      enemyBullets[i].remove();
      enemyBullets.splice(i, 1);
    }
  }
}
