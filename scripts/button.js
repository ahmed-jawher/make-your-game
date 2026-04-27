import * as main from "./script.js";
import * as outil from "./outils.js";
import * as Moving from "./moving.js";
import { game, requestID, elements } from "./script.js";

export function Restart() {

  outil.distroy(".will");
  outil.addWalls();
  
  cancelAnimationFrame(requestID.requestID)
  requestID.requestID = null
  game.time = 0

  elements.enemysDiv.innerHTML = "";
  elements.PauseBtn.style.visibility = "visible";
  game.second = 0;
  elements.timer.textContent ="000"
  game.livesNbr = 3;

  for (let i = 0; i < 3; i++) {
    elements.lives[i].style.visibility = "visible";
  }

  game.isGamrOver = false;
  game.isPaused = false;
  game.LEVEL = 0;
  game.enemyLevel = 0;
  game.score = 0;

  elements.ScoreBar.textContent = "0000";
  elements.menu.style.display = "none";
  elements.blurOverlay.style.zIndex = "-1";
  main.setup()
  
}
export function Pause() {
  elements.menu.style.display = "flex";
  elements.blurOverlay.style.zIndex = "1";
  if (game.isStoryshowed){
    elements.menu.style.display = "none";
    elements.story.style.zIndex = "2";
  }else{
    elements.menu.style.zIndex = "2";
  }
  
  elements.PauseBtn.style.visibility = "hidden";
  game.isPaused = true;
  
}
export function Continue() {
  game.isPaused = false;
  elements.PauseBtn.style.visibility = "visible";
  elements.menu.style.display = "none";
  elements.blurOverlay.style.zIndex = "-1";
 
}
