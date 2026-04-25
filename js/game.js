// =============================================================
// GAME — the main loop, input, camera, and HUD.
// =============================================================

// ---------- TUNABLE NUMBERS ----------
// Change these to make the game feel different!
const GRAVITY           = 0.6;   // how fast you fall
const JUMP_POWER        = 13;    // how high you jump (bigger = higher)
const MOVE_SPEED        = 4;     // how fast you run
const BULLET_SPEED      = 9;     // how fast bullets fly
const SHOOT_COOLDOWN    = 14;    // frames between shots (60 = 1 sec)
const PLAYER_MAX_HEALTH = 3;
const ENEMY_SPEED       = 1.4;

// ---------- GLOBAL STATE ----------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let player;
let enemies = [];
let bullets = [];
let camera = { x: 0, y: 0 };
let currentLevel = LEVELS[0];
let gameState = "playing"; // "playing" | "won" | "lost"
let frameCount = 0;

// ---------- INPUT ----------
const keys = {};
const justPressed = {};

window.addEventListener("keydown", (e) => {
  if (!keys[e.code]) justPressed[e.code] = true;
  keys[e.code] = true;
  // Prevent Space and arrow keys from scrolling the page.
  if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => { keys[e.code] = false; });

function readInput() {
  return {
    left:         keys.ArrowLeft  || keys.KeyA,
    right:        keys.ArrowRight || keys.KeyD,
    jumpPressed:  justPressed.Space || justPressed.ArrowUp || justPressed.KeyW,
    shootPressed: justPressed.KeyZ || justPressed.KeyJ,
  };
}

// ---------- LEVEL SETUP ----------
function startLevel(level) {
  currentLevel = level;
  player = createPlayer(level.playerStart.x, level.playerStart.y);
  enemies = level.enemies.map(e => createEnemy(e.x, e.y));
  bullets = [];
  camera.x = 0;
  camera.y = 0;
  gameState = "playing";
}

// ---------- MAIN LOOP ----------
function update() {
  frameCount++;

  if (gameState !== "playing") {
    if (justPressed.KeyR) startLevel(currentLevel);
    return;
  }

  const input = readInput();
  updatePlayer(player, currentLevel, input);

  for (const e of enemies) if (e.alive) updateEnemy(e, currentLevel);
  for (const b of bullets) if (b.alive) updateBullet(b, currentLevel);

  // Bullet vs enemy
  for (const b of bullets) {
    if (!b.alive) continue;
    for (const e of enemies) {
      if (!e.alive) continue;
      if (rectsOverlap(b, e)) {
        e.health--;
        if (e.health <= 0) e.alive = false;
        b.alive = false;
        break;
      }
    }
  }

  // Player vs enemy (touch = take damage)
  for (const e of enemies) {
    if (!e.alive) continue;
    if (rectsOverlap(player, e)) {
      hurtPlayer(player, 1);
      // Knockback
      player.vx = (player.x < e.x ? -1 : 1) * 6;
      player.vy = -7;
    }
  }

  // Player vs goal
  const goalRect = goalHitbox(currentLevel);
  if (rectsOverlap(player, goalRect)) gameState = "won";

  if (!player.alive) gameState = "lost";

  // Restart key always works
  if (justPressed.KeyR) startLevel(currentLevel);

  // Camera follows the player, clamped to the level edges.
  const targetX = player.x + player.w / 2 - canvas.width / 2;
  camera.x = Math.max(0, Math.min(targetX, currentLevel.width - canvas.width));
  camera.y = 0;

  // Clean up dead things and clear the just-pressed buffer for next frame.
  enemies = enemies.filter(e => e.alive);
  bullets = bullets.filter(b => b.alive);
  for (const k in justPressed) delete justPressed[k];
}

function goalHitbox(level) {
  return {
    x: level.goal.x,
    y: level.goal.y,
    w: spriteWidth(GOAL_SPRITE),
    h: spriteHeight(GOAL_SPRITE),
  };
}

// ---------- DRAWING ----------
function draw() {
  drawBackground();
  drawTrees();
  drawPlatforms();
  drawSprite(ctx, GOAL_SPRITE,
             currentLevel.goal.x - camera.x,
             currentLevel.goal.y - camera.y);
  for (const e of enemies) drawEnemy(ctx, e, camera);
  for (const b of bullets) drawBullet(ctx, b, camera);
  drawPlayer(ctx, player, camera);
  drawHUD();
  if (gameState === "won")  drawBanner("LEVEL COMPLETE!", "You earned: " + currentLevel.reward, "#7afc7a");
  if (gameState === "lost") drawBanner("GAME OVER",       "Press R to try again",                "#ff6a6a");
}

function drawBackground() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, currentLevel.skyColor);
  grad.addColorStop(1, currentLevel.fogColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars (parallax — they barely move as the camera scrolls)
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 60; i++) {
    const sx = (i * 137 - camera.x * 0.15) % canvas.width;
    const sy = (i * 53) % 220;
    const x = sx < 0 ? sx + canvas.width : sx;
    ctx.fillRect(x, sy, 2, 2);
  }
}

function drawTrees() {
  if (!currentLevel.trees) return;
  for (const t of currentLevel.trees) {
    // Parallax — far trees move slower than the foreground.
    const px = t.x - camera.x * 0.6;
    if (px < -120 || px > canvas.width + 120) continue;
    // Trunk
    ctx.fillStyle = "#3b2614";
    ctx.fillRect(px - 8, t.y - t.h, 16, t.h);
    // Canopy
    ctx.fillStyle = "#2a6f2f";
    ctx.beginPath();
    ctx.arc(px, t.y - t.h, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3fa84a";
    ctx.beginPath();
    ctx.arc(px - 18, t.y - t.h - 14, 36, 0, Math.PI * 2);
    ctx.arc(px + 22, t.y - t.h - 8,  40, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlatforms() {
  for (const p of currentLevel.platforms) {
    const x = p.x - camera.x;
    const y = p.y - camera.y;
    if (x + p.w < 0 || x > canvas.width) continue;
    ctx.fillStyle = currentLevel.groundColor;
    ctx.fillRect(x, y, p.w, p.h);
    // Bright top edge
    ctx.fillStyle = currentLevel.groundEdge;
    ctx.fillRect(x, y, p.w, 4);
  }
}

function drawHUD() {
  // Health hearts (drawn as small red squares for now).
  for (let i = 0; i < PLAYER_MAX_HEALTH; i++) {
    const filled = i < player.health;
    ctx.fillStyle = filled ? "#ff4d6d" : "#3a2030";
    ctx.fillRect(20 + i * 28, 20, 22, 22);
    ctx.fillStyle = filled ? "#ff8aa6" : "#5a3040";
    ctx.fillRect(22 + i * 28, 22, 4, 4);
  }
  // Level name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(currentLevel.name, canvas.width - 20, 36);
  ctx.textAlign = "left";
}

function drawBanner(title, subtitle, color) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 220, canvas.width, 160);
  ctx.fillStyle = color;
  ctx.font = "bold 48px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, 280);
  ctx.fillStyle = "#e0e0ee";
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText(subtitle, canvas.width / 2, 320);
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = "#a0a0b8";
  ctx.fillText("Press R to restart", canvas.width / 2, 350);
  ctx.textAlign = "left";
}

// ---------- BOOT ----------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

startLevel(LEVELS[0]);
loop();
