import { useEffect, useRef } from 'react';
import '@/brasileirao.css';
import { initBrasileirao } from '@/lib/brasileirao/ui';

const HTML = `<div class="br-app">
<header class="hdr"><div class="logo"><i class="fas fa-futbol"></i><h1>BRASILEIRAO 2026 - SIMULADOR OPTA</h1></div><div class="bdg"><i class="fas fa-chart-line"></i> 20 CLUBES</div></header>
<nav id="nav"><button class="on" data-t="match"><i class="fas fa-play-circle"></i>Partida</button><button data-t="squad"><i class="fas fa-users"></i>Elenco UT</button><button data-t="tourn"><i class="fas fa-trophy"></i>Previsoes</button><button data-t="db"><i class="fas fa-database"></i>Dados</button></nav>
<div class="tc on" id="t-match"><div class="ml"><div>
<div class="pnl" style="padding:8px"><div class="ts"><label>Casa:</label><select id="ht"></select><label>Fora:</label><select id="at"></select></div></div>
<div class="cw"><canvas id="cv"></canvas><div class="hud"><span class="xg" id="hxg">xG 0.00 - 0.00</span><span class="tn h" id="hh">-</span><span class="sc" id="hsc">0 - 0</span><span class="tn a" id="ha">-</span><span class="tm2" id="htm">00'</span></div></div>
<div class="pnl" style="padding:8px"><div class="mc"><button class="pr" id="bS"><i class="fas fa-play"></i> Iniciar</button><button id="bQ" style="background:rgba(255,214,0,.1);border-color:var(--ac2);color:var(--ac2)"><i class="fas fa-bolt"></i> Rápido</button><button id="bP"><i class="fas fa-pause"></i> Pausar</button><button id="bR"><i class="fas fa-redo"></i> Resetar</button><button id="bSp"><i class="fas fa-forward"></i> 1x</button></div></div>
</div><div class="sb"><div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-chart-bar"></i>Estatisticas Opta</div><div class="ms" id="mst"></div></div><div class="pnl" style="padding:8px;flex:1;display:flex;flex-direction:column"><div class="pt"><i class="fas fa-list"></i>Eventos</div><div class="el" id="elog"></div></div><div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-brain"></i>Probabilidades</div><div class="pp" id="ppnl"></div></div></div></div></div>
<div class="tc" id="t-squad"><div class="sl"><div><div class="pnl" style="padding:8px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:5px"><div class="fs" id="fsel"></div><button id="bA" style="padding:4px 10px;background:rgba(0,230,118,.1);border:1px solid var(--ac);color:var(--ac);border-radius:4px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px">Auto Preencher</button></div></div><div class="sp" id="spit"></div></div><div style="display:flex;flex-direction:column;gap:8px"><div class="pnl" style="padding:8px"><div style="display:flex;align-items:center;gap:10px"><div class="cc" id="ccir">0</div><div class="ci"><div class="cl2">Quimica</div><div class="cv" id="cval">0/100</div><div class="to" id="sovr">OVR: 0</div></div></div><div id="mms"></div></div><div class="pnl" style="padding:8px;flex:1;display:flex;flex-direction:column"><input class="psr" id="psrch" placeholder="Buscar jogador..."><div class="pli" id="plist" style="margin-top:5px"></div></div></div></div></div>
<div class="tc" id="t-tourn"><div class="pnl" style="padding:8px"><div class="th"><select id="csel"></select><button id="bST"><i class="fas fa-bolt"></i> Simular</button></div></div><div id="tcon"></div></div>
<div class="tc" id="t-db"><div class="df"><input id="dbs" placeholder="Buscar..."><select id="dbl"><option value="">Todas Ligas</option></select><select id="dbp"><option value="">Todas Pos</option><option value="GK">GK</option><option value="DEF">DEF</option><option value="MID">MID</option><option value="ATK">ATK</option></select><select id="dbs2"><option value="ovr">OVR</option><option value="xG90">xG/90</option><option value="xA90">xA/90</option><option value="passComp">Passe%</option><option value="tackles90">Desarmes</option></select></div><div class="dg" id="dgr"></div></div>
<div class="mo" id="slmod"><div class="md"><button class="mx" id="mcls"><i class="fas fa-times"></i></button><h3 id="mttl">Selecionar</h3><input class="psr" id="msrc" placeholder="Filtrar..." style="width:100%;margin-bottom:6px"><div class="mp" id="mpl"></div></div></div>
<div class="tc2" id="tsts"></div>
</div>`;

export default function Brasileirao() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = initBrasileirao(ref.current);
    return cleanup;
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: HTML }} />;
}