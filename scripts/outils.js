import { elements,game } from "./script.js";
export function throttle(func, interval) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= interval) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
export const getNb = (n) => {
  return Math.floor(Math.random() * n);
};

export function isColliding(bullet, enemy) {
  let a = bullet.getBoundingClientRect();
  let b = enemy.getBoundingClientRect();
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

export function distroy(name) {
  document.querySelectorAll(name).forEach((x) => {
    x.remove();
  });
}

function createWall() {
  let wall = document.createElement("div");
  wall.classList.add("wall");
  let empty = document.createElement("div");
  empty.classList.add("empty");
  wall.appendChild(empty);
  for (let i = 0; i < 48; i++) {
    let pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.classList.add("existsPixel");
    wall.appendChild(pixel);
  }
  return wall;
}
export function addWalls() {
  elements.Walls.innerHTML = "";
  for (let i = 0; i < game.wallNbr; i++) {
    let wall = createWall();
    elements.Walls.appendChild(wall);
  }
}
