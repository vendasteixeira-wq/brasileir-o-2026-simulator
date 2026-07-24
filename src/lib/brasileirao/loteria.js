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

// === Matriz de covariancia entre jogos (indicadores binarios) ===
// Cada jogo é um vetor indicador 0/1 sobre o espaco de dezenas.
// cov = E[(x-mx)(y-my)]; corr = cov / sqrt(var_x * var_y) em [-1,1].
// Baixa correlacao entre os 4 jogos = cobertura independente de dezenas (menor sobreposicao).
function indicator(nums, range) {
  const v = new Array(range).fill(0);
  for (const n of nums) v[n - 1] = 1;
  return v;
}

export function correlation(a, b, range) {
  const va = indicator(a, range), vb = indicator(b, range);
  const n = range;
  const ma = va.reduce((s, x) => s + x, 0) / n;
  const mb = vb.reduce((s, x) => s + x, 0) / n;
  let cov = 0, va2 = 0, vb2 = 0;
  for (let i = 0; i < n; i++) {
    const da = va[i] - ma, db = vb[i] - mb;
    cov += da * db; va2 += da * da; vb2 += db * db;
  }
  const den = Math.sqrt(va2 * vb2);
  return den < 1e-9 ? 0 : cov / den;
}

// Covariancia media de todos os pares do conjunto selecionado
export function avgCovariance(games, range) {
  if (games.length < 2) return 0;
  let s = 0, c = 0;
  for (let i = 0; i < games.length; i++)
    for (let j = i + 1; j < games.length; j++) { s += correlation(games[i].nums, games[j].nums, range); c++; }
  return +(s / c).toFixed(3);
}

// Gera candidatos e seleciona os 'nPick' com melhor qualidade + menor covariancia mutua
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
  // Selecao gulosa: maximiza qualidade mantendo baixa correlacao (independencia) entre jogos
  const pool = games.slice(0, Math.min(nPick * 6, games.length));
  const picked = [pool[0]];
  const rest = pool.slice(1);
  while (picked.length < nPick && rest.length) {
    let bi = -1, bs = -Infinity;
    for (let i = 0; i < rest.length; i++) {
      let maxCorr = 0;
      for (const p of picked) maxCorr = Math.max(maxCorr, correlation(rest[i].nums, p.nums, range));
      const score = rest[i].q - maxCorr * 55; // penaliza sobreposicao (alta covariancia)
      if (score > bs) { bs = score; bi = i; }
    }
    picked.push(rest.splice(bi, 1)[0]);
  }
  picked.sort((a, b) => b.q - a.q);
  return picked;
}

export function gerarSugestoes() {
  const seed = dateSeed();
  const megaGames = genTopGames(60, 6, seed, 120, 4);
  const quinaGames = genTopGames(80, 5, seed + 100, 120, 4);
  return {
    date: new Date().toLocaleDateString('pt-BR'),
    mega: { games: megaGames, cov: avgCovariance(megaGames, 60) },
    quina: { games: quinaGames, cov: avgCovariance(quinaGames, 80) },
    prob: { mega: megaProb(), quina: quinaProb() }
  };
}