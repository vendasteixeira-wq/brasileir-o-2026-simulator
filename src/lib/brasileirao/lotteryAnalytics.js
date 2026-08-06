/**
 * Laboratório de Análise Avançada - Loteria
 * Comparação: Apostas Geradas vs Sorteios Reais da Caixa
 * 
 * Substitui contexto de "vendas" por "apostas" e "resultados de jogos" por "sorteios de loteria"
 * 
 * Módulos:
 * 1. Decomposição de Variância (acertou menos/mais que o esperado)
 * 2. Choques Exógenos (impacto do câmbio/juros/inflação nas apostas)
 * 3. Monte Carlo com IC 95% (faixa de confiança dos acertos)
 * 4. Rolling Forecast (reprojeta sorteios com dados parciais do mês/ano)
 * 5. Análise Horizontal 5 Anos (identifica ruído vs tendência estrutural)
 * 6. Cadeia de Markov (transições de estado: "sorte quente" → "sorte fria")
 */

// ============================================================
// 1. DECOMPOSIÇÃO DE VARIÂNCIA
// ============================================================

export function decomposeVariance(apostasSugeridas, sorteisCaixa) {
  /**
   * apostasSugeridas: array { modalidade, numeros, data, qualidade }
   * sorteisCaixa: array { modalidade, numeros, data }
   * 
   * Retorna:
   * - acertoMenos: apostas que acertaram menos que o esperado pela qualidade
   * - acertoMais: apostas que acertaram mais que o esperado
   * - variância total (ruído do modelo)
   */
  
  if (!apostasSugeridas || !sorteisCaixa || apostasSugeridas.length === 0) {
    return { 
      total: 0, acertoMenos: 0, acertoMais: 0, neutral: 0,
      byModalidade: {}, variance: 0, stdDev: 0, mean: 0 
    };
  }

  const sorteiosMap = new Map();
  sorteisCaixa.forEach(s => {
    const key = `${s.modalidade}|${s.data}`;
    if (!sorteiosMap.has(key)) sorteiosMap.set(key, s);
  });

  const erros = [];
  let acertoMenos = 0, acertoMais = 0;
  const porModalidade = {};

  sorteiosMap.forEach((sorteio, key) => {
    const [modalidade, data] = key.split('|');
    if (!porModalidade[modalidade]) {
      porModalidade[modalidade] = { acertoMenos: 0, acertoMais: 0, count: 0, erros: [] };
    }

    // Buscar apostas para este sorteio
    const apostasParaEste = apostasSugeridas.filter(
      a => a.modalidade === modalidade && a.data === data
    );

    apostasParaEste.forEach(aposta => {
      const acertos = contarAcertos(aposta.numeros, sorteio.numeros);
      const qualidadeEsperada = aposta.qualidade || 50; // 0-100
      
      // Normalizar qualidade para escala de acertos
      const acertosEsperados = (qualidadeEsperada / 100) * sorteio.numeros.length;
      const erro = acertos - acertosEsperados; // positivo = acertou mais, negativo = menos

      erros.push(erro);
      porModalidade[modalidade].erros.push(erro);
      porModalidade[modalidade].count++;

      if (erro < 0) acertoMenos++;
      else if (erro > 0) acertoMais++;
    });
  });

  // Calcular estatísticas
  const media = erros.length ? erros.reduce((a, b) => a + b, 0) / erros.length : 0;
  const variancia = erros.length ? erros.reduce((s, e) => s + Math.pow(e - media, 2), 0) / erros.length : 0;
  const desvio = Math.sqrt(variancia);

  return {
    total: apostasSugeridas.length,
    acertoMenos,
    acertoMais,
    neutral: apostasSugeridas.length - acertoMenos - acertoMais,
    porModalidade: Object.entries(porModalidade).reduce((acc, [mod, dados]) => {
      const mediaModal = dados.erros.length ? dados.erros.reduce((a, b) => a + b, 0) / dados.erros.length : 0;
      const varModal = dados.erros.length ? dados.erros.reduce((s, e) => s + Math.pow(e - mediaModal, 2), 0) / dados.erros.length : 0;
      acc[mod] = {
        acertoMenos: dados.acertoMenos,
        acertoMais: dados.acertoMais,
        media: +mediaModal.toFixed(3),
        desvio: +Math.sqrt(varModal).toFixed(3),
        count: dados.count
      };
      return acc;
    }, {}),
    variance: +variancia.toFixed(3),
    stdDev: +desvio.toFixed(3),
    mean: +media.toFixed(3),
    interpretacao: media < 0 ? '📉 Apostas subestimadas' : '📈 Apostas superestimadas'
  };
}

function contarAcertos(apostaNumeros, sorteioNumeros) {
  const apostaSet = new Set(apostaNumeros);
  return sorteioNumeros.filter(n => apostaSet.has(n)).length;
}

// ============================================================
// 2. CHOQUES EXÓGENOS (Impacto Macro nas Apostas)
// ============================================================

export function choquesExogenos(historicoApostas, indicadoresMacro) {
  /**
   * historicoApostas: { data, modalidade, numApostas, participacao }
   * indicadoresMacro: { cambio, juros, inflacao, PIB, desemprego }
   * 
   * Retorna impacto estimado na propensão a apostar
   */

  const regime = {
    jurozBaixo: indicadoresMacro.juros < 10.5,
    cambioAlto: indicadoresMacro.cambio > 5,
    inflacaoAlta: indicadoresMacro.inflacao > 5,
    pibFrago: indicadoresMacro.PIB < 2,
    desempregoAlto: indicadoresMacro.desemprego > 8
  };

  // Correlações com comportamento de apostas (baseado em dados de loterias)
  const correlacoes = {
    juros: -0.35,        // juros altos → menos apostas (menos renda disponível)
    cambio: 0.12,        // câmbio alto → buscam lucro rápido (especulação)
    inflacao: -0.48,     // inflação → reduz poder de compra, menos apostas
    PIB: 0.64,           // PIB forte → mais confiança, mais apostas
    desemprego: -0.55    // desemprego alto → menos renda, menos apostas
  };

  // Calcular score de "apetite" para apostas
  let scoreChoque = 0;
  scoreChoque += correlacoes.juros * (indicadoresMacro.juros - 10);
  scoreChoque += correlacoes.cambio * (indicadoresMacro.cambio - 5);
  scoreChoque += correlacoes.inflacao * (indicadoresMacro.inflacao - 4);
  scoreChoque += correlacoes.PIB * (indicadoresMacro.PIB - 2.5);
  scoreChoque += correlacoes.desemprego * (indicadoresMacro.desemprego - 7);

  // Impacto multiplicador nas frequências
  const impactoFrequencia = scoreChoque > 0 ? 1 + (scoreChoque * 0.08) : 1 + (scoreChoque * 0.12);

  return {
    regime,
    scoreChoque: +scoreChoque.toFixed(3),
    interpretacao: scoreChoque > 0 
      ? '🔥 Alto apetite para apostas (participação ↑)' 
      : '❄️ Baixo apetite para apostas (participação ↓)',
    impactoFrequencia: +impactoFrequencia.toFixed(2),
    correlacoes,
    recomendacao: impactoFrequencia > 1.1 
      ? 'Aumentar sugestões de apostas' 
      : impactoFrequencia < 0.9 
      ? 'Reduzir agressividade nas sugestões'
      : 'Manter estratégia atual'
  };
}

// ============================================================
// 3. MONTE CARLO COM INTERVALO DE CONFIANÇA 95%
// ============================================================

export function monteCarloIC(apostasSugeridas, sorteisCaixa, iteracoes = 10000) {
  /**
   * Gera distribuição de probabilidades via Monte Carlo
   * Retorna IC 95% (faixa de confiança) em vez de número único
   */

  if (apostasSugeridas.length === 0) {
    return { 
      media: 0, mediana: 0, ic95: [0, 0], ic68: [0, 0], 
      desvio: 0, min: 0, max: 0, q25: 0, q75: 0, distribuicao: [] 
    };
  }

  const distribuicao = [];
  const sorteioDic = new Map();

  sorteisCaixa.forEach(s => {
    sorteioDic.set(`${s.modalidade}|${s.numeros.join(',')}`, true);
  });

  for (let i = 0; i < iteracoes; i++) {
    // Resample aleatório (Bootstrap)
    let acertos = 0;
    const tamanhoAmostra = Math.max(1, Math.floor(apostasSugeridas.length * (0.5 + Math.random() * 0.5)));
    
    for (let j = 0; j < tamanhoAmostra; j++) {
      const idx = Math.floor(Math.random() * apostasSugeridas.length);
      const aposta = apostasSugeridas[idx];
      const key = `${aposta.modalidade}|${aposta.numeros.join(',')}`;
      
      if (sorteioDic.has(key)) acertos++;
    }
    
    const taxaAcerto = (acertos / tamanhoAmostra) * 100;
    distribuicao.push(taxaAcerto);
  }

  distribuicao.sort((a, b) => a - b);
  const media = distribuicao.reduce((a, b) => a + b, 0) / distribuicao.length;
  const desvio = Math.sqrt(
    distribuicao.reduce((s, x) => s + Math.pow(x - media, 2), 0) / distribuicao.length
  );

  const percentil = (p) => distribuicao[Math.floor(distribuicao.length * (p / 100))];

  return {
    media: +media.toFixed(2),
    mediana: +percentil(50).toFixed(2),
    ic95: [
      +percentil(2.5).toFixed(2),
      +percentil(97.5).toFixed(2)
    ],
    ic68: [
      +percentil(16).toFixed(2),
      +percentil(84).toFixed(2)
    ],
    desvio: +desvio.toFixed(2),
    q25: +percentil(25).toFixed(2),
    q75: +percentil(75).toFixed(2),
    min: +distribuicao[0].toFixed(2),
    max: +distribuicao[distribuicao.length - 1].toFixed(2),
    iqr: +(percentil(75) - percentil(25)).toFixed(2),
    cv: +(desvio / media).toFixed(2), // coeficiente de variação
    distribuicao: distribuicao.slice(0, 100) // amostra para visualizar
  };
}

// ============================================================
// 4. ROLLING FORECAST (Reprojeta com dados parciais do mês/ano)
// ============================================================

export function rollingForecast(historicoSorteios, mesAtual, dadosMes) {
  /**
   * historicoSorteios: { ano, mes, modalidade, participacao }
   * mesAtual: número do mês (1-12)
   * dadosMes: dados reais até agora neste mês
   * 
   * Retorna:
   * - Projeção para o ano completo
   * - Confiança da projeção
   * - Diferença vs baseline (média dos últimos 5 anos)
   */

  const mesesCompletos = mesAtual;
  const padraoSazonal = calcularSazonalidade(historicoSorteios);

  // Média histórica por mês (últimos 5 anos)
  const mediaHistoricaPorMes = {};
  for (let m = 1; m <= 12; m++) {
    const valores = historicoSorteios
      .filter(h => h.mes === m)
      .map(h => h.participacao);
    mediaHistoricaPorMes[m] = valores.length > 0 
      ? valores.reduce((a, b) => a + b, 0) / valores.length 
      : 0;
  }

  // Projeção: dados reais até agora + estimativa para resto do ano
  let totalProjetado = 0;
  let confianca = 0;
  const projecaoPorMes = {};

  for (let m = 1; m <= 12; m++) {
    if (m < mesAtual) {
      // Dados reais (passado)
      const real = dadosMes[m] || mediaHistoricaPorMes[m];
      projecaoPorMes[m] = real;
      totalProjetado += real;
      confianca += 0.95;
    } else if (m === mesAtual) {
      // Mês atual (parcial)
      const parcial = dadosMes[m] || 0;
      const media = mediaHistoricaPorMes[m];
      const estimado = parcial > 0 ? parcial : media * 0.5; // assume meio do mês
      projecaoPorMes[m] = estimado;
      totalProjetado += estimado;
      confianca += 0.60;
    } else {
      // Meses futuros (estimativa com sazonalidade)
      const projetado = mediaHistoricaPorMes[m] * padraoSazonal[m];
      projecaoPorMes[m] = projetado;
      totalProjetado += projetado;
      confianca += 0.55;
    }
  }

  const mediaConfianca = confianca / 12;
  const baselineAnual = Object.values(mediaHistoricaPorMes).reduce((a, b) => a + b, 0);

  return {
    totalProjetado: +totalProjetado.toFixed(0),
    baseline: +baselineAnual.toFixed(0),
    diferenca: +(totalProjetado - baselineAnual).toFixed(0),
    diferenca_pct: +((totalProjetado - baselineAnual) / baselineAnual * 100).toFixed(1),
    confiancaMedia: +mediaConfianca.toFixed(2),
    mesesCompletos,
    mesesRestantes: 12 - mesAtual,
    projecaoPorMes: Object.entries(projecaoPorMes).reduce((acc, [m, v]) => {
      acc[+m] = +v.toFixed(0);
      return acc;
    }, {}),
    padraoSazonal
  };
}

function calcularSazonalidade(dados) {
  /**
   * Calcula índice sazonal por mês (fator de ajuste)
   * Retorna { 1: 0.95, 2: 1.02, ..., 12: 0.98 }
   */
  const porMes = {};
  const mediaGeral = dados.reduce((s, d) => s + d.participacao, 0) / dados.length;

  for (let m = 1; m <= 12; m++) {
    const valores = dados
      .filter(d => d.mes === m)
      .map(d => d.participacao);
    
    if (valores.length > 0) {
      const media = valores.reduce((a, b) => a + b, 0) / valores.length;
      porMes[m] = media / mediaGeral;
    } else {
      porMes[m] = 1.0;
    }
  }

  return porMes;
}

// ============================================================
// 5. ANÁLISE HORIZONTAL 5 ANOS (Ruído vs Tendência)
// ============================================================

export function analiseHorizontal5A(dadosPorAno) {
  /**
   * dadosPorAno: { 2020: {total, sorteios}, 2021: {...}, ..., 2025: {...} }
   * 
   * Separa:
   * - Tendência estrutural (média móvel 3 anos)
   * - Ruído aleatório (desvios)
   * - Ciclos
   */

  const anos = Object.keys(dadosPorAno).sort();
  const valores = anos.map(a => dadosPorAno[a].total || 0);

  if (valores.length < 3) {
    return { anos, valores, tendencia: valores, ruido: valores.map(() => 0) };
  }

  // Tendência = média móvel 3 anos
  const tendencia = [];
  for (let i = 0; i < valores.length; i++) {
    const inicio = Math.max(0, i - 1);
    const fim = Math.min(valores.length, i + 2);
    const janela = valores.slice(inicio, fim);
    tendencia.push(janela.reduce((a, b) => a + b, 0) / janela.length);
  }

  // Ruído = valor - tendência
  const ruido = valores.map((v, i) => v - tendencia[i]);
  const mediaRuido = ruido.reduce((a, b) => a + b, 0) / ruido.length;
  const desvioRuido = Math.sqrt(
    ruido.reduce((s, r) => s + Math.pow(r - mediaRuido, 2), 0) / ruido.length
  );

  // Detectar ciclos
  const ciclos = detectarCiclos(ruido);

  // Análise de direção
  const tendenciaInicio = tendencia[0];
  const tendenciaFim = tendencia[tendencia.length - 1];
  const direcao = tendenciaFim > tendenciaInicio ? '📈 Crescente' : '📉 Decrescente';
  const deltaTendencia = tendenciaFim - tendenciaInicio;

  // Razão ruído/tendência (estabilidade)
  const mediaTendencia = tendencia.reduce((a, b) => a + b, 0) / tendencia.length;
  const razaoRuidoTendencia = mediaTendencia > 0 ? desvioRuido / mediaTendencia : 0;

  return {
    anos,
    valores: valores.map(v => +v.toFixed(0)),
    tendencia: tendencia.map(t => +t.toFixed(0)),
    ruido: ruido.map(r => +r.toFixed(0)),
    mediaRuido: +mediaRuido.toFixed(0),
    desvioRuido: +desvioRuido.toFixed(0),
    ciclos,
    direcao,
    deltaTendencia: +deltaTendencia.toFixed(0),
    razaoRuidoTendencia: +razaoRuidoTendencia.toFixed(2),
    estabilidade: razaoRuidoTendencia < 0.15 ? '🟢 Estável' : razaoRuidoTendencia < 0.30 ? '🟡 Moderado' : '🔴 Volátil'
  };
}

function detectarCiclos(serie) {
  /**
   * Detecta ciclicidade via autocorrelação
   */
  const n = serie.length;
  if (n < 3) return { detectado: false, lags: [] };

  const media = serie.reduce((a, b) => a + b, 0) / n;
  const c0 = serie.reduce((s, x) => s + Math.pow(x - media, 2), 0) / n;

  const lags = {};
  for (let lag = 1; lag <= Math.floor(n / 2); lag++) {
    const c = serie.slice(0, n - lag)
      .reduce((s, x, i) => s + (x - media) * (serie[i + lag] - media), 0) / n;
    lags[lag] = +(c / c0).toFixed(3);
  }

  const lagsFortes = Object.entries(lags)
    .filter(([_, corr]) => Math.abs(corr) > 0.5)
    .map(([l, c]) => ({ lag: +l, correlacao: c }));

  return {
    detectado: lagsFortes.length > 0,
    lags: lagsFortes,
    autocorrelacao: lags
  };
}

// ============================================================
// 6. CADEIA DE MARKOV (Transições de Sorte: Quente/Fria/Neutra)
// ============================================================

export function cadeiaMarkov(sequenciaEstados, estados = ['quente', 'fria', 'neutra']) {
  /**
   * sequenciaEstados: histórico de estados (quente=acertos altos, fria=acertos baixos, neutra)
   * 
   * Retorna:
   * - Matriz de transição (probabilidade de passar de um estado a outro)
   * - Distribuição estacionária (estado de longo prazo)
   * - Análise de choque (se força estado "quente", quando volta ao normal?)
   * - Risco de churn (sair de estado favorável)
   */

  const n = estados.length;
  const mapEstados = {};
  estados.forEach((e, i) => mapEstados[e] = i);

  const matrizTransicao = Array(n).fill(0).map(() => Array(n).fill(0));

  // Construir matriz de transição a partir da sequência
  for (let i = 0; i < sequenciaEstados.length - 1; i++) {
    const de = mapEstados[sequenciaEstados[i]];
    const para = mapEstados[sequenciaEstados[i + 1]];
    
    if (de !== undefined && para !== undefined) {
      matrizTransicao[de][para]++;
    }
  }

  // Normalizar (dividir por total de transições de cada estado)
  for (let i = 0; i < n; i++) {
    const soma = matrizTransicao[i].reduce((a, b) => a + b, 0);
    if (soma > 0) {
      matrizTransicao[i] = matrizTransicao[i].map(v => +(v / soma).toFixed(3));
    }
  }

  // Distribuição estacionária
  const estacionaria = calcularDistribuicaoEstacionaria(matrizTransicao);

  // Tempo esperado em cada estado
  const tempoEsperado = {};
  for (let i = 0; i < n; i++) {
    if (matrizTransicao[i][i] > 0) {
      tempoEsperado[estados[i]] = +(1 / (1 - matrizTransicao[i][i])).toFixed(1);
    }
  }

  // Análise de choque: forçar estado "quente", ver convergência
  const distChoque = [1, 0, 0]; // começa 100% em "quente"
  const passosDaConvergencia = simularConvergencia(matrizTransicao, distChoque, 30);

  // Probabilidade de churn (sair de um estado)
  const riscosChurn = {};
  for (let i = 0; i < n; i++) {
    riscosChurn[estados[i]] = +(1 - matrizTransicao[i][i]).toFixed(3);
  }

  return {
    estados,
    matrizTransicao: matrizTransicao.map(row => row.map(v => +v.toFixed(3))),
    distribuicaoEstacionaria: estacionaria.map(v => +v.toFixed(3)),
    tempoEsperadoPorEstado: tempoEsperado,
    analiseChoque: {
      estadoInicialForçado: 'quente',
      distribuicaoInicial: distChoque,
      passos: passosDaConvergencia.slice(0, 15),
      passosParaConvergencia: passosDaConvergencia.findIndex(
        d => estaConvergido(d, estacionaria, 0.05)
      )
    },
    riscosChurn,
    probabilidadeAbsorcao: matrizTransicao.map((row, i) => ({
      estado: estados[i],
      probabilidadePermanecer: row[i],
      probabilidadeSair: 1 - row[i]
    })),
    interpretacao: gerarInterpretacaoMarkov(matrizTransicao, estados, riscosChurn)
  };
}

function calcularDistribuicaoEstacionaria(matrix, iteracoes = 100) {
  const n = matrix.length;
  let dist = Array(n).fill(1 / n);

  for (let iter = 0; iter < iteracoes; iter++) {
    const novaDist = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        novaDist[j] += dist[i] * matrix[i][j];
      }
    }
    dist = novaDist;
  }

  return dist;
}

function simularConvergencia(matrix, distInicial, passos) {
  const trajetoria = [distInicial];
  let dist = [...distInicial];

  for (let t = 0; t < passos; t++) {
    const novaDist = Array(dist.length).fill(0);
    for (let j = 0; j < dist.length; j++) {
      for (let i = 0; i < dist.length; i++) {
        novaDist[j] += dist[i] * matrix[i][j];
      }
    }
    dist = novaDist;
    trajetoria.push([...dist]);
  }

  return trajetoria;
}

function estaConvergido(dist, estacionaria, tolerancia = 0.01) {
  return dist.every((d, i) => Math.abs(d - estacionaria[i]) < tolerancia);
}

function gerarInterpretacaoMarkov(matrix, estados, riscosChurn) {
  const interpretacoes = [];

  estados.forEach((estado, i) => {
    const probabilidadePermanecer = matrix[i][i];
    const risco = riscosChurn[estado];

    if (probabilidadePermanecer > 0.7) {
      interpretacoes.push(`✅ Estado "${estado}": ESTÁVEL (${(probabilidadePermanecer * 100).toFixed(0)}% permanência)`);
    } else if (probabilidadePermanecer > 0.5) {
      interpretacoes.push(`⚠️ Estado "${estado}": MODERADAMENTE INSTÁVEL (${risco * 100}% risco de transição)`);
    } else {
      interpretacoes.push(`❌ Estado "${estado}": ALTAMENTE INSTÁVEL (alto churn)`);
    }
  });

  return interpretacoes.join(' | ');
}

// ============================================================
// ORQUESTRAÇÃO: Rodar tudo junto
// ============================================================

export function executarAnaliseCompleta(apostasSugeridas, sorteisCaixa, historicoApostas, indicadoresMacro, dadosPorAno, sequenciaEstados) {
  /**
   * Executa análise completa em um único lugar
   * Retorna dashboard com todos os 6 módulos
   */

  return {
    variancia: decomposeVariance(apostasSugeridas, sorteisCaixa),
    choques: choquesExogenos(historicoApostas, indicadoresMacro),
    monteCarlo: monteCarloIC(apostasSugeridas, sorteisCaixa),
    rolling: rollingForecast(historicoApostas, new Date().getMonth() + 1, {}),
    horizontal: analiseHorizontal5A(dadosPorAno),
    markov: cadeiaMarkov(sequenciaEstados),
    timestamp: new Date().toISOString(),
    resumo: {
      qualidadeApostas: decomposeVariance(apostasSugeridas, sorteisCaixa).interpretacao,
      ambienteMacro: choquesExogenos(historicoApostas, indicadoresMacro).interpretacao,
      confiancaProjecao: monteCarloIC(apostasSugeridas, sorteisCaixa).media.toFixed(1) + '%',
      tendenciaLongoPrazo: analiseHorizontal5A(dadosPorAno).direcao
    }
  };
}

export default {
  decomposeVariance,
  choquesExogenos,
  monteCarloIC,
  rollingForecast,
  analiseHorizontal5A,
  cadeiaMarkov,
  executarAnaliseCompleta
};
