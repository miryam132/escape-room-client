/**
 * One repeating tile of an architectural floor plan (walls, doors, furniture, dimension
 * lines), drawn as a thin-line SVG and used as a data URL for the page background.
 */
export const PLAN_TILE_W = 1600;
export const PLAN_TILE_H = 1000;

const stairs = Array.from({ length: 9 }, (_, i) => `M1160 ${700 + i * 22}H1280`).join("");
const hatch = Array.from({ length: 15 }, (_, i) => `M${700 + i * 20} 110l-10 30`).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PLAN_TILE_W}" height="${PLAN_TILE_H}" viewBox="0 0 ${PLAN_TILE_W} ${PLAN_TILE_H}" fill="none" stroke="#9db6ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<rect x="100" y="100" width="1400" height="800" stroke-width="3"/>
<rect x="112" y="112" width="1376" height="776" stroke-width="1"/>
<path d="M640 112V400M640 520V888M640 640H1100M1200 640H1488M1100 112V500M1100 580V640" stroke-width="2.5"/>
<path d="M640 520H760A120 120 0 0 0 640 400" stroke-dasharray="3 5"/>
<path d="M1100 640V740A100 100 0 0 1 1200 640" stroke-dasharray="3 5" transform="translate(0 -0)"/>
<path d="M1100 500H1200A100 100 0 0 0 1100 580" stroke-dasharray="3 5"/>
<rect x="180" y="200" width="240" height="90" stroke-dasharray="7 6"/>
<circle cx="300" cy="345" r="22" stroke-dasharray="4 5"/>
<rect x="160" y="650" width="210" height="140" stroke-dasharray="7 6"/>
<rect x="170" y="660" width="70" height="40"/>
<circle cx="880" cy="330" r="74" stroke-dasharray="7 6"/>
<circle cx="880" cy="230" r="16"/><circle cx="880" cy="430" r="16"/><circle cx="780" cy="330" r="16"/><circle cx="980" cy="330" r="16"/>
<rect x="1380" y="160" width="76" height="76" stroke-width="2"/>
<path d="M1380 160L1456 236M1456 160L1380 236"/>
<rect x="700" y="112" width="300" height="30"/>
<path d="${hatch}" stroke-width="1"/>
<path d="${stairs}"/>
<rect x="1160" y="700" width="120" height="176"/>
<path d="M100 56H1500M100 44V68M1500 44V68M60 100V900M48 100H72M48 900H72" stroke-width="1"/>
<circle cx="1440" cy="790" r="34" stroke-width="1"/>
<path d="M1440 744V836M1394 790H1486" stroke-width="1"/>
<g fill="#9db6ff" stroke="none" font-family="monospace" font-size="15" letter-spacing="2">
<text x="760" y="46">14.00 M</text>
<text x="190" y="170">R-01</text>
<text x="670" y="680">R-02</text>
<text x="1130" y="180">R-03</text>
<text x="1160" y="920">B-04</text>
</g>
</svg>`;

export const PLAN_TILE_URL = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
