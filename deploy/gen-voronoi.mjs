// Génère un diagramme de Voronoï (3 vignettes : girafe, boue craquelée, lave).
// Sortie : SVG sur stdout. Les cellules sont obtenues en découpant un
// rectangle par les demi-plans des médiatrices (clipping de Sutherland-Hodgman).
// Usage : node deploy/gen-voronoi.mjs > static/images/girafe-boue-lave.svg

const W = 360, H = 360;

// Germes communs aux trois vignettes (coordonnées locales 0..W x 0..H).
const seeds = [
  [78, 74], [252, 62], [176, 168], [46, 246],
  [298, 214], [120, 322], [286, 334], [196, 300],
];

function clip(poly, a, b, c) {
  // garde les points tels que a*x + b*y <= c
  const out = [];
  const n = poly.length;
  const f = (p) => a * p[0] + b * p[1] - c;
  for (let i = 0; i < n; i++) {
    const P = poly[i], Q = poly[(i + 1) % n];
    const fp = f(P), fq = f(Q);
    if (fp <= 1e-9) out.push(P);
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) {
      const t = fp / (fp - fq);
      out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
    }
  }
  return out;
}

function cell(p) {
  let poly = [[0, 0], [W, 0], [W, H], [0, H]];
  for (const q of seeds) {
    if (q === p) continue;
    const a = 2 * (q[0] - p[0]);
    const b = 2 * (q[1] - p[1]);
    const c = q[0] * q[0] + q[1] * q[1] - p[0] * p[0] - p[1] * p[1];
    poly = clip(poly, a, b, c);
  }
  return poly;
}

const cells = seeds.map(cell);

function panel(x0, y0, fills, border, dot) {
  let s = `<g transform="translate(${x0},${y0})">`;
  s += `<rect width="${W}" height="${H}" fill="${border}"/>`;
  cells.forEach((poly, i) => {
    const d = "M" + poly.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L") + "Z";
    s += `<path d="${d}" fill="${fills[i % fills.length]}" stroke="${border}" stroke-width="4"/>`;
  });
  seeds.forEach((p) => {
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${dot}"/>`;
  });
  s += `</g>`;
  return s;
}

const panels = [
  {
    x: 20,
    label: "girafe",
    fills: ["#b0763a", "#a86c30", "#b98449", "#9c6128", "#c08f52", "#ad7136", "#a26a34", "#bb8749"],
    border: "#f3e7d3",
    dot: "#6b4420",
  },
  {
    x: 420,
    label: "boue craquelée",
    fills: ["#d8c09a", "#cdb287", "#e0cba8", "#c6a878", "#dcc4a0", "#d1b98f", "#c9ac7e", "#e3d0ad"],
    border: "#7a5a30",
    dot: "#5a4020",
  },
  {
    x: 820,
    label: "lave refroidie",
    fills: ["#7c7c82", "#6d6d74", "#8a8a90", "#74747b", "#828289", "#696970", "#8f8f95", "#78787f"],
    border: "#3a3a40",
    dot: "#2a2a2e",
  },
];

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 440" width="1200" height="440" font-family="Georgia, 'Times New Roman', serif">`;
svg += `<rect width="1200" height="440" fill="#ffffff"/>`;
for (const p of panels) {
  svg += panel(p.x, 20, p.fills, p.border, p.dot);
  svg += `<text x="${p.x + W / 2}" y="418" text-anchor="middle" font-size="26" fill="#2b2b2b">${p.label}</text>`;
}
svg += `</svg>`;

process.stdout.write(svg + "\n");
