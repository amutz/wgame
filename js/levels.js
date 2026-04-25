// =============================================================
// LEVELS — the layout for each planet.
// Edit anything in here to change the level: move platforms,
// add enemies, change colors, make the level longer, etc.
//
// Coordinates: (0,0) is the TOP-LEFT corner.
//   x grows to the right, y grows downward.
// Each platform is { x, y, w, h }.
// =============================================================

const LEVELS = [
  // ----- LEVEL 1: JUNGLE PLANET -----
  {
    name: "Jungle Planet",
    width: 3200,         // total length of the level
    height: 600,         // canvas height
    skyColor: "#1f3a2c", // background color
    fogColor: "#0f1f1a", // far background tint
    groundColor: "#2d5a2d",
    groundEdge:  "#3fa84a", // bright top edge of platforms
    playerStart: { x: 60, y: 400 },

    // Solid platforms the player can stand on.
    platforms: [
      // The main ground (broken up by gaps)
      { x: 0,    y: 540, w: 700,  h: 60 },
      { x: 820,  y: 540, w: 500,  h: 60 },
      { x: 1440, y: 540, w: 600,  h: 60 },
      { x: 2160, y: 540, w: 1040, h: 60 },

      // Floating platforms (jungle trees / vines)
      { x: 320,  y: 420, w: 120, h: 20 },
      { x: 540,  y: 340, w: 120, h: 20 },
      { x: 900,  y: 420, w: 140, h: 20 },
      { x: 1120, y: 320, w: 120, h: 20 },
      { x: 1500, y: 420, w: 140, h: 20 },
      { x: 1700, y: 320, w: 140, h: 20 },
      { x: 1900, y: 420, w: 120, h: 20 },
      { x: 2300, y: 380, w: 160, h: 20 },
      { x: 2560, y: 280, w: 140, h: 20 },
      { x: 2800, y: 380, w: 200, h: 20 },
    ],

    // Enemies to place. y is the platform top they stand on
    // (so 540 = ground, 320 = top of a platform whose y is 320).
    enemies: [
      { x: 480,  y: 540 },
      { x: 980,  y: 540 },
      { x: 1180, y: 320 },
      { x: 1620, y: 540 },
      { x: 1820, y: 540 },
      { x: 2050, y: 540 },
      { x: 2380, y: 380 },
      { x: 2700, y: 540 },
      { x: 2950, y: 380 },
    ],

    // Decorative trees in the background (just for looks).
    trees: [
      { x: 100, y: 540, h: 200 },
      { x: 250, y: 540, h: 260 },
      { x: 700, y: 540, h: 220 },
      { x: 1050, y: 540, h: 280 },
      { x: 1380, y: 540, h: 240 },
      { x: 1750, y: 540, h: 300 },
      { x: 2100, y: 540, h: 240 },
      { x: 2450, y: 540, h: 280 },
      { x: 2900, y: 540, h: 260 },
    ],

    // Where the goal is. Touching it finishes the level.
    goal: { x: 3060, y: 480 },

    // What you get for completing this planet.
    reward: "Shield",
  },
];
