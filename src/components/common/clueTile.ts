/**
 * One repeating tile of "clues scribbled on the walls of a dark room": keyholes, keys, clocks,
 * magnifiers, fingerprints, morse, cipher scraps... Thin lines, scattered on a jittered grid with
 * a fixed seed, used as a data URL for the page background (the cursor's light reveals it).
 */
export const CLUE_TILE_W = 1600;
export const CLUE_TILE_H = 1000;

const COLS = 8;
const ROWS = 5;
const SEED = 20261105;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SCRAPS = [
  "A7·F2",
  "K-19",
  "XIII",
  "B4 → C9",
  "0x3F",
  "N 32°",
  "R-02",
  "IV · VIII",
  "Ω",
  "∴ ∵ ∴",
];

const glyphs: ((rand: () => number) => string)[] = [
  // keyhole
  () => `<circle cy="-7" r="9"/><path d="M-5 15L-2.5 1H2.5L5 15Z"/>`,
  // key
  () => `<circle cx="-16" r="8"/><path d="M-8 0H24M18 0V9M24 0V6"/>`,
  // clock
  () => `<circle r="17"/><path d="M0 -10V0L7 4M0 -17V-14M17 0H14M0 17V14M-17 0H-14"/>`,
  // magnifier
  () => `<circle cx="-3" cy="-3" r="11"/><path d="M5 5L17 17"/>`,
  // question mark
  () => `<path d="M-8 -9a8 8 0 1 1 11 7c-3 2-3 4-3 7"/><path d="M0 14h.1"/>`,
  // eye
  () => `<path d="M-20 0Q0 -17 20 0Q0 17 -20 0Z"/><circle r="5.5"/>`,
  // fingerprint
  () => `<path d="M-16 8a16 16 0 0 1 32 0M-11 10a11 11 0 0 1 22 0M-6 12a6 6 0 0 1 12 0M-1 14v-3"/>`,
  // morse
  (rand) => {
    let x = -34;
    let d = "";
    for (let i = 0; i < 6; i++) {
      const dash = rand() > 0.5;
      d += `M${x} 0h${dash ? 11 : 0.1}`;
      x += dash ? 17 : 8;
    }
    return `<path d="${d}" stroke-width="3"/>`;
  },
  // tally marks
  () => `<path d="M-14 -10V10M-7 -10V10M0 -10V10M7 -10V10M-18 6L12 -6"/>`,
  // arrow
  () => `<path d="M-20 0H20M12 -8L20 0L12 8"/>`,
  // asterism
  () => `<path d="M0 -10V10M-9 -5L9 5M-9 5L9 -5"/>`,
  // target
  () => `<circle r="14"/><circle r="6"/><path d="M0 -20V-14M0 14V20M-20 0H-14M14 0H20"/>`,
  // cipher scrap
  (rand) => {
    const text = SCRAPS[Math.floor(rand() * SCRAPS.length)];
    return `<text text-anchor="middle" dominant-baseline="central" fill="#9db6ff" stroke="none" font-family="monospace" font-size="15" letter-spacing="2">${text}</text>`;
  },
];

function buildTile() {
  const rand = mulberry32(SEED);
  const cellW = CLUE_TILE_W / COLS;
  const cellH = CLUE_TILE_H / ROWS;
  let body = "";
  let last = -1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let pick = Math.floor(rand() * glyphs.length);
      if (pick === last) pick = (pick + 1) % glyphs.length; // avoid neighbours that repeat
      last = pick;
      const x = col * cellW + cellW * (0.28 + rand() * 0.44);
      const y = row * cellH + cellH * (0.28 + rand() * 0.44);
      const rotate = (rand() - 0.5) * 50;
      const scale = 1.1 + rand() * 0.9;
      body += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rotate.toFixed(0)}) scale(${scale.toFixed(2)})">${glyphs[pick](rand)}</g>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CLUE_TILE_W}" height="${CLUE_TILE_H}" viewBox="0 0 ${CLUE_TILE_W} ${CLUE_TILE_H}" fill="none" stroke="#9db6ff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export const CLUE_TILE_URL = `url("data:image/svg+xml,${encodeURIComponent(buildTile())}")`;
