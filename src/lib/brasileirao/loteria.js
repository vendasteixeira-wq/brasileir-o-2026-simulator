// Motor de probabilidade para Mega Sena, Quina e Lotofacil
// Combinatoria exata + PRNG seeded por dia + geracao estocastica 70% frios / 30% quentes
// sobre o historico de 6 anos da Caixa

export const MODALIDADES = {
  mega: { name: 'Mega Sena', range: 60, count: 6, ac: 'ac2', disc: '6 de 60' },
  quina: { name: 'Quina', range: 80, count: 5, ac: 'ac', disc: '5 de 80' },
  lotofacil: { name: 'Lotofacil', range: 25, count: 15, ac: 'ob', disc: '15 de 25' }
};

export function comb(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

export function megaProb() {
  const T = comb(60, 6);
  return { total: T, sena: 1 / T, quina: (comb(6, 5) * comb(54, 1)) / T, quadra: (comb(6, 4) * comb(54, 2)) / T };
}

export function quinaProb() {
  const T = comb(80, 5);
  return { total: T, quina: 1 / T, quadra: (comb(5, 4) * comb(75, 1)) / T, terno: (comb(5, 3) * comb(75, 2)) / T };
}

export function lotofacilProb() {
  const T = comb(25, 15);
  return {
    total: T,
    faixa15: 1 / T,
    faixa14: (comb(15, 14) * comb(10, 1)) / T,
    faixa12: (comb(15, 12) * comb(10, 3)) / T,
    faixa11: (comb(15, 11) * comb(10, 4)) / T
  };
}

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

// Score de balanceamento: soma ideal + par/impar + spread por decadas
export function quality(nums, range) {
  const sum = nums.reduce((a, b) => a + b, 0);
  const odd = nums.filter(n => n % 2).length;
  const even = nums.length - odd;
  let s = 100;
  s -= Math.abs(odd - even) * 7;
  const ideal = (range * nums.length) / 2;
  s -= (Math.abs(sum - ideal) / range) * 9;
  const bins = {};
  nums.forEach(n => { const b = Math.floor((n - 1) / 10); bins[b] = (bins[b] || 0) + 1; });
  const maxBin = Math.max(...Object.values(bins));
  s -= Math.max(0, maxBin - 2) * 6;
  return Math.max(0, Math.round(s));
}

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

export function avgCovariance(games, range) {
  if (games.length < 2) return 0;
  let s = 0, c = 0;
  for (let i = 0; i < games.length; i++)
    for (let j = i + 1; j < games.length; j++) { s += correlation(games[i].nums, games[j].nums, range); c++; }
  return +(s / c).toFixed(3);
}

// Amostragem estocastica ponderada (sem reposicao)
function weightedPick(items, weights, n, rng) {
  const avail = items.map((v, i) => ({ v, w: Math.max(weights[i], 1e-6) }));
  const picked = [];
  while (picked.length < n && avail.length) {
    const total = avail.reduce((s, o) => s + o.w, 0);
    let r = rng() * total, idx = avail.length - 1;
    for (let i = 0; i < avail.length; i++) { r -= avail[i].w; if (r <= 0) { idx = i; break; } }
    picked.push(avail.splice(idx, 1)[0].v);
  }
  return picked;
}

// Geracao estocastica: 70% dezenas frias (menos sorteadas, peso inverso) + 30% quentes (mais sorteadas, peso direto)
function genBet(mod, freq, rng) {
  const { range, count } = mod;
  const nums = [];
  for (let i = 1; i <= range; i++) nums.push(i);
  const sorted = [...nums].sort((a, b) => freq[a - 1] - freq[b - 1]);
  const half = Math.floor(range / 2);
  const coldPool = sorted.slice(0, half);           // metade menos sorteada (frios)
  const hotPool = sorted.slice(half);              // metade mais sorteada (quentes)
  const coldN = Math.min(Math.round(count * 0.7), coldPool.length);
  const hotN = Math.min(count - coldN, hotPool.length);
  const coldW = coldPool.map(n => 1 / (freq[n - 1] + 1));  // frio raro = maior peso
  const hotW = hotPool.map(n => freq[n - 1] + 1);          // quente frequente = maior peso
  const picked = new Set([
    ...weightedPick(coldPool, coldW, coldN, rng),
    ...weightedPick(hotPool, hotW, hotN, rng)
  ]);
  let guard = 0;
  while (picked.size < count && guard++ < 500) picked.add(Math.floor(rng() * range) + 1);
  return [...picked].sort((a, b) => a - b);
}

function genTopGames(mod, freq, baseSeed, nCandidates, nPick) {
  const games = [];
  const seen = new Set();
  for (let i = 0; i < nCandidates; i++) {
    const rng = mulberry32(baseSeed + i * 31);
    const nums = genBet(mod, freq, rng);
    const key = nums.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    games.push({ nums, q: quality(nums, mod.range) });
  }
  games.sort((a, b) => b.q - a.q);
  const pool = games.slice(0, Math.min(nPick * 8, games.length));
  const picked = [pool[0]];
  const rest = pool.slice(1);
  while (picked.length < nPick && rest.length) {
    let bi = -1, bs = -Infinity;
    for (let i = 0; i < rest.length; i++) {
      let cs = 0;
      for (const p of picked) cs += correlation(rest[i].nums, p.nums, mod.range);
      const score = rest[i].q - (cs / picked.length) * 60;
      if (score > bs) { bs = score; bi = i; }
    }
    picked.push(rest.splice(bi, 1)[0]);
  }
  picked.sort((a, b) => b.q - a.q);
  return picked;
}

function shufflePool(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function gerarReuso(games, count, range, seed) {
  const pool = [...new Set(games.flatMap(g => g.nums))].sort((a, b) => a - b);
  if (pool.length < count) return [];
  const rng = mulberry32(seed);
  const bets = [];
  const seen = new Set();
  let guard = 0;
  while (bets.length < 3 && guard++ < 200) {
    const picked = shufflePool(pool, rng).slice(0, count).sort((a, b) => a - b);
    const key = picked.join(',');
    if (!seen.has(key)) { seen.add(key); bets.push({ nums: picked, q: quality(picked, range), pool: pool.length }); }
  }
  return bets;
}

export function gerarSugestoes(freqTables) {
  const seed = dateSeed();
  const result = { date: new Date().toLocaleDateString('pt-BR'), reuso: {}, sources: {}, prob: {} };
  let ki = 0;
  for (const key of ['mega', 'quina', 'lotofacil']) {
    const mod = MODALIDADES[key];
    const ft = freqTables[key];
    const games = genTopGames(mod, ft.table, seed + (ki++) * 1000, 400, 12);
    result[key] = { games, cov: avgCovariance(games, mod.range), source: ft.source };
    result.sources[key] = ft.source;
    result.reuso[key] = gerarReuso(games, mod.count, mod.range, seed + ki * 500);
  }
  result.prob = { mega: megaProb(), quina: quinaProb(), lotofacil: lotofacilProb() };
  return result;
}