// Motor de probabilidade para Mega Sena e Quina
// Combinatoria exata + PRNG seeded por dia + balanceamento estatistico

// Combinatorio C(n, k)
export function comb(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

// Probabilidades exactas de acerto (aposta simples de 6 ou 5 numeros)
export function megaProb() {
  const T = comb(60, 6);
  return {
    total: T,
    sena: 1 / T,
    quina: (comb(6, 5) * comb(54, 1)) / T,
    quadra: (comb(6, 4) * comb(54, 2)) / T
  };
}

export function quinaProb() {
  const T = comb(80, 5);
  return {
    total: T,
    quina: 1 / T,
    quadra: (comb(5, 4) * comb(75, 1)) / T,
    terno: (comb(5, 3) * comb(75, 2)) / T
  };
}

// PRNG Mulberry32 — deterministico por dia
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Gera 'count' numeros de 1..range com estrategia de balanceamento
function genSet(range, count, seed, strategy) {
  const rng = mulberry32(seed);
  const nums = [];
  const used = new Set();
  let guard = 0;
  while (nums.length < count && guard++ < 1000) {
    const r = rng();
    let pick;
    if (strategy === 'hot') {
      // favorece numeros "quentes" (distribuicao enviesada para centro-baixo)
      pick = Math.floor(Math.pow(r, 0.85) * range) + 1;
    } else if (strategy === 'spread') {
      // distribuicao uniforme ampla
      pick = Math.floor(r * range) + 1;
    } else {
      // balanced — em torno do meio com ruido
      pick = Math.round((range / 2) + (r - 0.5) * range * 0.95);
      pick = Math.max(1, Math.min(range, pick));
    }
    if (!used.has(pick)) { used.add(pick); nums.push(pick); }
  }
  nums.sort((a, b) => a - b);
  return nums;
}

// Score de balanceamento: soma ideal + par/ímpar + spread por decadas
export function quality(nums, range) {
  const sum = nums.reduce((a, b) => a + b, 0);
  const odd = nums.filter(n => n % 2).length;
  const even = nums.length - odd;
  let s = 100;
  s -= Math.abs(odd - even) * 7;
  const ideal = (range * nums.length) / 2;
  s -= (Math.abs(sum - ideal) / range) * 9;
  // spread por decadas (1-10, 11-20, ...)
  const bins = {};
  nums.forEach(n => { const b = Math.floor((n - 1) / 10); bins[b] = (bins[b] || 0) + 1; });
  const maxBin = Math.max(...Object.values(bins));
  s -= Math.max(0, maxBin - 2) * 6;
  return Math.max(0, Math.round(s));
}

// Gera varios candidatos e devolve os 'nPick' melhores por score de balanceamento
function genTopGames(range, count, baseSeed, nCandidates, nPick) {
  const strategies = ['hot', 'balanced', 'spread'];
  const games = [];
  const seen = new Set();
  for (let i = 0; i < nCandidates; i++) {
    const nums = genSet(range, count, baseSeed + i * 31, strategies[i % strategies.length]);
    const key = nums.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    games.push({ nums, q: quality(nums, range) });
  }
  games.sort((a, b) => b.q - a.q);
  return games.slice(0, nPick);
}

export function gerarSugestoes() {
  const seed = dateSeed();
  return {
    date: new Date().toLocaleDateString('pt-BR'),
    mega: { games: genTopGames(60, 6, seed, 90, 4) },
    quina: { games: genTopGames(80, 5, seed + 100, 90, 4) },
    prob: { mega: megaProb(), quina: quinaProb() }
  };
}