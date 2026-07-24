// Motor estatistico open-source em JS puro (sem binarios/dependencias privadas).
// Implementa algoritmos abertos equivalentes em metodo ao R / PSPP / jamovi / Minitab:
// - lgamma (aproximacao Lanczos)
// - beta incompleta regularizada I_x(a,b) (Numerical Recipes, algoritmo aberto)
// - distribuicoes t (Student) e F (Snedecor) para p-valores exatos
// - estatistica descritiva, Pearson/Spearman, regressao linear OLS, ANOVA one-way, t-Test Welch
// Referencias: Lanczos (1964), Numerical Recipes (Press et al.), algoritmos de dominio publico.

// === lgamma (log-gamma) — aproximacao de Lanczos ===
function lgamma(x) {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// === Fracao continua de Lentz para beta incompleta ===
function betacf(a, b, x) {
  const fpmin = 1e-30;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < fpmin) d = fpmin;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c; if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c; if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return h;
}

// === Beta incompleta regularizada I_x(a,b) ===
export function betai(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lbeta = lgamma(a + b) - lgamma(a) - lgamma(b);
  const bt = Math.exp(lbeta + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
  return 1 - bt * betacf(b, a, 1 - x) / b;
}

// === p-valor bicaudal da distribuicao t de Student ===
export function tPValue(t, df) {
  if (df <= 0) return 1;
  const x = df / (df + t * t);
  return betai(df / 2, 0.5, x); // bicaudal
}

// === p-valor (cauda superior) da distribuicao F de Snedecor ===
export function fPValue(F, df1, df2) {
  if (F <= 0 || df1 <= 0 || df2 <= 0) return 1;
  const x = df2 / (df2 + df1 * F);
  return betai(df2 / 2, df1 / 2, x);
}

// === Estatistica descritiva ===
export function mean(xs) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
export function variance(xs) {
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
}
export function stdDev(xs) { return Math.sqrt(variance(xs)); }
export function median(xs) {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
export function quantile(xs, q) {
  const s = [...xs].sort((a, b) => a - b);
  const pos = (s.length - 1) * q, base = Math.floor(pos), rest = pos - base;
  return s[base] + (s[base + 1] !== undefined ? rest * (s[base + 1] - s[base]) : 0);
}
export function skewness(xs) {
  const n = xs.length, m = mean(xs);
  const s2 = xs.reduce((a, x) => a + (x - m) ** 2, 0);
  const s3 = xs.reduce((a, x) => a + (x - m) ** 3, 0);
  return (s3 / n) / Math.pow(s2 / n, 1.5);
}
export function kurtosis(xs) {
  const n = xs.length, m = mean(xs);
  const s2 = xs.reduce((a, x) => a + (x - m) ** 2, 0);
  const s4 = xs.reduce((a, x) => a + (x - m) ** 4, 0);
  return (s4 / n) / Math.pow(s2 / n, 2) - 3;
}
export function descriptive(xs) {
  const n = xs.length, m = mean(xs), sd = stdDev(xs);
  return {
    n, mean: m, sd, min: Math.min(...xs), max: Math.max(...xs),
    median: median(xs), q1: quantile(xs, 0.25), q3: quantile(xs, 0.75),
    cv: sd / m, skew: skewness(xs), kurt: kurtosis(xs)
  };
}

// === Correlacao Pearson ===
export function pearson(xs, ys) {
  const n = xs.length, mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
  return sxy / Math.sqrt(sxx * syy);
}

// === Correlacao Spearman (Pearson sobre postos) ===
export function rank(xs) {
  const idx = xs.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j < idx.length && idx[j][0] === idx[i][0]) j++;
    const rk = (i + j - 1) / 2 + 1;
    for (let k = i; k < j; k++) r[idx[k][1]] = rk;
    i = j;
  }
  return r;
}
export function spearman(xs, ys) { return pearson(rank(xs), rank(ys)); }

// === Regressao linear OLS (y ~ x) com R^2, erro padrao, t, p ===
export function linearRegression(xs, ys) {
  const n = xs.length, mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx; sxy += dx * (ys[i] - my); sxx += dx * dx; syy += (ys[i] - my) ** 2; }
  const slope = sxy / sxx, intercept = my - slope * mx;
  const yhat = xs.map(x => slope * x + intercept);
  const ssRes = ys.reduce((s, y, i) => s + (y - yhat[i]) ** 2, 0);
  const r2 = 1 - ssRes / syy;
  const r = Math.sqrt(Math.abs(r2)) * Math.sign(slope);
  const df = n - 2;
  const se = Math.sqrt(ssRes / df) / Math.sqrt(sxx);
  const t = slope / se;
  const p = tPValue(t, df);
  return { slope, intercept, r, r2, se, t, p, df, n };
}

// === ANOVA one-way ===
export function anova(groups) {
  const k = groups.length;
  const all = groups.flat();
  const n = all.length, gm = mean(all);
  let ssB = 0;
  groups.forEach(g => { const mg = mean(g); ssB += g.length * (mg - gm) ** 2; });
  let ssW = 0;
  groups.forEach(g => { const mg = mean(g); g.forEach(x => ssW += (x - mg) ** 2); });
  const dfB = k - 1, dfW = n - k;
  const msB = ssB / dfB, msW = ssW / dfW;
  const F = msB / msW;
  const p = fPValue(F, dfB, dfW);
  return { F, p, dfB, dfW, ssB, ssW, msB, msW, k, n };
}

// === t-Test de Welch (variancias desiguais) ===
export function welchTTest(a, b) {
  const ma = mean(a), mb = mean(b);
  const va = variance(a), vb = variance(b);
  const na = a.length, nb = b.length;
  const se = Math.sqrt(va / na + vb / nb);
  const t = (ma - mb) / se;
  const df = (va / na + vb / nb) ** 2 / ((va / na) ** 2 / (na - 1) + (vb / nb) ** 2 / (nb - 1));
  const p = tPValue(t, df);
  return { t, df, p, meanDiff: ma - mb };
}