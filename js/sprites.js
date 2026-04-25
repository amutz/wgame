// =============================================================
// SPRITES — pixel art for the player, enemies, and items.
// Each sprite is a list of strings. Each character is one pixel.
// You can edit any letter below to change how things look!
// Color key is at the top of each sprite. "." means transparent.
// =============================================================

// --- Player astronaut (16 wide x 24 tall) ---
// W=white suit  B=blue visor  S=silver helmet rim
// R=red badge   D=dark boots   .=transparent
const PLAYER_SPRITE = {
  scale: 2,            // each pixel becomes a 2x2 square (32x48 on screen)
  colors: {
    W: "#f0f0f5",
    B: "#1d3f7a",
    S: "#a4a8b8",
    R: "#d63a3a",
    D: "#2a2730",
  },
  pixels: [
    "......SSSSSS....",
    "....SSWWWWWWSS..",
    "...SWWWWWWWWWWS.",
    "...SWBBBBBBBBWS.",
    "...SWBBBBBBBBWS.",
    "...SWBBBBBBBBWS.",
    "...SWWWWWWWWWWS.",
    "....WWWWWWWWWW..",
    "...DWWWWWWWWWWD.",
    "..DDWWWWWWWWWWDD",
    "..DWWWWRRWWWWWWD",
    "..DWWWWRRWWWWWWD",
    "..DWWWWWWWWWWWWD",
    "..DWWWWWWWWWWWWD",
    "...WWWWWWWWWWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "...WWWW....WWWW.",
    "..DDDDDD..DDDDDD",
    "..DDDDDD..DDDDDD",
    "..DDDDDD..DDDDDD",
    "................",
  ],
};

// --- Jungle alien (16 wide x 16 tall) ---
// G=green body  D=dark green outline  Y=yellow eye  K=black pupil
// P=pink mouth  L=leaf on top
const ALIEN_SPRITE = {
  scale: 2,
  colors: {
    G: "#3fa84a",
    D: "#1f5c2a",
    Y: "#fff066",
    K: "#0a0a0a",
    P: "#d44a86",
    L: "#7adb5e",
  },
  pixels: [
    ".....LL...LL....",
    "....LLLL.LLLL...",
    "....DDDDDDDD....",
    "...DGGGGGGGGD...",
    "..DGGYYGGYYGGD..",
    "..DGYKYGGYKYGD..",
    "..DGYYYGGYYYGD..",
    "..DGGGGGGGGGGD..",
    "..DGGGPPPPGGGD..",
    "..DGGGPPPPGGGD..",
    "...DGGGGGGGGD...",
    "....DDDDDDDD....",
    "....D.DD.DD.D...",
    "....D.DD.DD.D...",
    "....DDD..DDD....",
    "................",
  ],
};

// --- Bullet (small laser bolt, 6x4) ---
const BULLET_SPRITE = {
  scale: 2,
  colors: { Y: "#ffe34a", O: "#ff8a00", W: "#ffffff" },
  pixels: [
    "..WW..",
    ".OYYO.",
    ".OYYO.",
    "..WW..",
  ],
};

// --- Goal flag (planet rocket / portal, 12 wide x 24 tall) ---
const GOAL_SPRITE = {
  scale: 3,
  colors: {
    P: "#9d6cff",
    L: "#dab8ff",
    D: "#3b1f70",
    W: "#ffffff",
  },
  pixels: [
    "....WW......",
    "...WLLW.....",
    "..WLLLLW....",
    "..WLPPLW....",
    ".WLPPPPLW...",
    ".WPPPPPPW...",
    ".WPPPPPPW...",
    ".WPDDDDPW...",
    ".WPDPPDPW...",
    ".WPDPPDPW...",
    ".WPDDDDPW...",
    ".WPPPPPPW...",
    ".WPPPPPPW...",
    "..WPPPPW....",
    "..WPPPPW....",
    "...WPPW.....",
    "...WPPW.....",
    "..WP..PW....",
    ".WP....PW...",
    "WP......PW..",
  ],
};

// =============================================================
// drawSprite — paints a sprite onto the canvas.
// You probably won't need to change this unless you're curious.
// =============================================================
function drawSprite(ctx, sprite, x, y, flip) {
  const s = sprite.scale;
  for (let row = 0; row < sprite.pixels.length; row++) {
    const line = sprite.pixels[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === "." || ch === " ") continue;
      const color = sprite.colors[ch];
      if (!color) continue;
      const drawCol = flip ? line.length - 1 - col : col;
      ctx.fillStyle = color;
      ctx.fillRect(x + drawCol * s, y + row * s, s, s);
    }
  }
}

// Width and height of a sprite in screen pixels.
function spriteWidth(sprite)  { return sprite.pixels[0].length * sprite.scale; }
function spriteHeight(sprite) { return sprite.pixels.length    * sprite.scale; }
