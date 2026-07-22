// === DADOS: 20 CLUBES SERIE A 2026 + ESTRELAS MUNDIAIS ===
const D = `Rossi|GK|Flamengo|Brasil|BRA|52|18|42|20|15|72|76|0|0|62|9.2|12|35|4|0|1.8|3.2|28|0|0|0.2|0|72|0.28
Fabrício Bruno|DEF|Flamengo|Brasil|BRA|68|38|55|42|78|80|78|0.02|0.02|82|10.8|22|62|14|0.4|2.4|1.2|68|0|0|0.4|0|0|0
Wesley|DEF|Flamengo|Brasil|BRA|70|32|54|38|76|74|74|0.01|0.02|76|10.6|20|60|12|0.2|2.4|1.0|64|0|0|0.3|0|0|0
Gerson|MID|Flamengo|Brasil|BRA|74|72|82|84|68|78|82|0.12|0.18|84|11.2|28|58|22|2.8|2.2|1.4|42|14|1.6|2.8|32|0|0
Arrascaeta|MID|Flamengo|Uruguai|BRA|72|80|86|88|42|62|86|0.22|0.28|87|10.4|18|48|16|4.2|1.2|0.8|32|18|2.8|1.4|38|0|0
Pedro|ATK|Flamengo|Brasil|BRA|82|88|68|80|30|74|86|0.52|0.12|72|10.2|32|48|12|7.8|0.6|0.4|28|20|1.4|3.2|52|0|0
Éverton Ribeiro|MID|Flamengo|Brasil|BRA|62|74|84|82|40|58|78|0.14|0.22|85|10.6|16|42|14|3.2|1.4|0.8|38|16|2.2|1.2|34|0|0
Bruno Henrique|ATK|Flamengo|Brasil|BRA|88|76|68|82|26|68|80|0.32|0.14|70|10.8|34|44|10|6.4|0.8|0.4|24|16|1.2|4.4|48|0|0
Ayrton Lucas|DEF|Flamengo|Brasil|BRA|82|40|68|72|64|62|78|0.02|0.10|76|11.0|30|52|10|1.2|1.8|0.8|48|8|1.8|3.2|22|0|0
De La Cruz|MID|Flamengo|Uruguai|BRA|66|62|78|76|58|64|76|0.08|0.14|80|10.8|20|54|16|1.8|2.0|1.0|44|12|1.0|1.6|28|0|0
Lorran|ATK|Flamengo|Brasil|BRA|78|74|62|78|24|60|74|0.28|0.08|66|10.4|26|42|8|5.0|0.4|0.2|22|12|0.8|2.8|42|0|0
Weverton|GK|Palmeiras|Brasil|BRA|48|15|40|18|12|74|78|0|0|58|9.4|10|32|2|0|2.0|3.4|26|0|0|0|0|74|0.32
Gustavo Gómez|DEF|Palmeiras|Paraguai|BRA|62|35|52|38|84|82|82|0.02|0.01|78|10.4|20|66|16|0.2|3.0|1.0|72|0|0|0.4|0|0|0
Murilo|DEF|Palmeiras|Brasil|BRA|66|30|50|34|80|78|76|0.01|0.01|74|10.2|18|62|12|0.2|2.6|1.0|66|0|0|0.3|0|0|0
Rony|ATK|Palmeiras|Brasil|BRA|90|82|62|86|28|62|82|0.42|0.16|68|10.6|36|42|10|7.2|0.4|0.2|22|16|1.6|4.8|54|0|0
Dudu|MID|Palmeiras|Brasil|BRA|84|62|78|82|32|58|78|0.14|0.18|76|10.8|28|40|12|4.8|1.0|0.6|30|14|1.8|3.6|42|0|0
Raphael Veiga|MID|Palmeiras|Brasil|BRA|66|78|80|76|52|68|80|0.18|0.14|82|10.4|20|52|18|2.2|2.0|1.2|48|16|1.4|1.8|38|0|0
Endrick|ATK|Palmeiras|Brasil|BRA|84|78|58|78|20|62|78|0.36|0.08|64|10.2|30|38|8|5.8|0.6|0.2|20|14|0.8|3.8|48|0|0
Estêvão|ATK|Palmeiras|Brasil|BRA|90|72|68|88|22|48|78|0.28|0.22|72|10.0|34|36|8|5.2|0.4|0.2|18|12|2.4|5.2|40|0|0
Marcos Rocha|DEF|Palmeiras|Brasil|BRA|76|38|64|60|68|66|76|0.02|0.08|74|10.8|24|54|12|1.0|2.0|0.8|52|8|1.2|2.4|26|0|0
Aníbal Moreno|MID|Palmeiras|Argentina|BRA|62|56|72|68|66|68|74|0.06|0.10|78|10.6|18|58|16|1.4|2.2|1.2|46|10|0.8|1.4|26|0|0
Alisson|DEF|São Paulo|Brasil|BRA|72|30|58|40|82|78|78|0.01|0.02|74|10.6|22|64|14|0.2|2.8|1.4|66|0|0|0.4|0|0|0
Arboleda|DEF|São Paulo|Colômbia|BRA|74|28|52|32|82|80|80|0.01|0.01|72|10.4|20|66|12|0.2|3.0|1.2|70|0|0|0.3|0|0|0
Rafinha|MID|São Paulo|Brasil|BRA|68|66|76|78|68|64|76|0.10|0.16|78|10.4|22|52|16|2.0|2.2|1.0|44|12|1.4|2.0|36|0|0
Calleri|ATK|São Paulo|Argentina|BRA|78|86|64|76|24|72|82|0.48|0.10|70|10.0|24|50|10|7.0|0.6|0.4|26|18|1.0|2.2|50|0|0
Luciano|MID|São Paulo|Brasil|BRA|60|72|70|72|48|70|72|0.12|0.12|76|10.8|18|50|14|2.4|1.8|0.8|42|14|1.0|1.4|32|0|0
Rafael Costa|ATK|São Paulo|Brasil|BRA|68|72|56|68|22|70|74|0.24|0.06|62|10.0|24|46|8|4.8|0.4|0.2|20|12|0.6|2.0|40|0|0
Cássio|GK|Corinthians|Brasil|BRA|44|12|38|16|10|70|74|0|0|55|9.0|8|28|2|0|1.8|2.8|24|0|0|0|0|70|0.30
Fausto Vera|MID|Corinthians|Argentina|BRA|64|58|72|68|74|72|74|0.06|0.10|80|11.0|20|62|20|1.2|2.8|1.6|52|10|0.8|1.6|28|0|0
Róger Guedes|ATK|Corinthians|Brasil|BRA|86|82|62|80|26|64|78|0.44|0.12|66|10.4|32|40|8|6.8|0.4|0.2|20|16|1.2|3.4|52|0|0
Cacá|DEF|Corinthians|Brasil|BRA|66|28|48|32|76|74|72|0.01|0.01|72|10.2|18|60|12|0.2|2.4|0.8|64|0|0|0.2|0|0|0
Garro|ATK|Corinthians|Argentina|BRA|72|76|58|70|22|68|74|0.32|0.08|64|10.2|26|44|8|5.0|0.4|0.2|22|14|0.6|2.4|42|0|0
Fábio Santos|DEF|Corinthians|Brasil|BRA|58|32|62|58|68|62|70|0.02|0.06|72|10.4|16|52|12|0.8|1.8|0.8|48|8|1.0|1.8|24|0|0
Hugo Moura|MID|Corinthians|Brasil|BRA|60|56|70|66|56|60|70|0.06|0.08|74|10.6|18|50|14|1.4|1.8|0.8|42|10|0.8|1.2|26|0|0
Éverson|GK|Atlético-MG|Brasil|BRA|46|14|36|16|10|72|75|0|0|56|9.2|10|30|2|0|2.2|3.0|25|0|0|0|0|71|0.26
Jemerson|DEF|Atlético-MG|Brasil|BRA|64|30|50|34|80|78|76|0.01|0.01|76|10.4|20|64|14|0.2|2.6|1.2|70|0|0|0.4|0|0|0
Hulk|ATK|Atlético-MG|Brasil|BRA|76|90|68|82|22|80|82|0.58|0.16|74|10.0|18|52|8|6.0|0.4|0.2|18|22|1.6|1.8|44|0|0
Scarpa|MID|Atlético-MG|Brasil|BRA|68|72|80|78|40|56|78|0.18|0.22|82|10.4|18|44|14|3.0|1.4|0.8|34|18|2.0|2.0|32|0|0
Barbosa|MID|Atlético-MG|Brasil|BRA|66|62|74|70|60|66|74|0.08|0.14|76|10.8|20|54|16|1.8|2.0|1.2|44|12|1.0|1.8|30|0|0
Allan|ATK|Atlético-MG|Brasil|BRA|72|74|62|72|34|68|72|0.28|0.10|68|10.4|26|46|10|5.4|0.6|0.4|22|14|0.8|2.8|46|0|0
Igor Rabello|DEF|Atlético-MG|Brasil|BRA|64|28|52|32|78|76|74|0.01|0.01|74|10.4|18|62|12|0.2|2.6|1.0|66|0|0|0.3|0|0|0
John Texteira|GK|Botafogo|Brasil|BRA|44|12|40|16|10|70|76|0|0|60|9.2|10|32|2|0|1.8|2.6|24|0|0|0|0|72|0.30
Bastos|DEF|Botafogo|Brasil|BRA|64|30|54|34|80|80|78|0.02|0.01|76|10.4|18|64|14|0.2|2.8|1.0|72|0|0|0.3|0|0|0
Marçal|DEF|Botafogo|Brasil|BRA|70|32|60|44|72|70|76|0.02|0.06|74|10.8|24|56|12|0.8|2.0|0.8|52|8|1.2|2.2|24|0|0
Eduardo|MID|Botafogo|Brasil|BRA|68|64|78|76|62|66|78|0.10|0.16|80|10.8|22|54|16|2.2|2.0|1.0|46|12|1.4|2.0|30|0|0
Tchê Tchê|MID|Botafogo|Brasil|BRA|66|58|72|68|68|70|76|0.06|0.10|78|10.6|20|60|16|1.6|2.4|1.2|50|10|0.8|1.6|28|0|0
Luiz Henrique|ATK|Botafogo|Brasil|BRA|84|72|70|86|28|58|80|0.32|0.20|74|10.8|32|44|10|5.8|0.6|0.4|22|16|2.0|4.4|40|0|0
Júnior Santos|ATK|Botafogo|Brasil|BRA|78|80|60|76|24|72|80|0.44|0.10|68|10.2|24|50|8|6.4|0.4|0.2|22|16|0.8|2.4|48|0|0
Savarese|ATK|Botafogo|Uruguai|BRA|70|74|58|70|24|68|76|0.30|0.08|64|10.0|22|46|8|4.8|0.4|0.2|22|14|0.6|1.8|42|0|0
Fábio|GK|Fluminense|Brasil|BRA|42|10|38|14|8|68|76|0|0|58|9.0|6|28|2|0|2.0|2.8|22|0|0|0|0|70|0.30
Nino|DEF|Fluminense|Brasil|BRA|62|30|56|34|82|80|80|0.02|0.02|78|10.4|18|66|14|0.2|3.0|1.2|72|0|0|0.3|0|0|0
Thiago Silva|DEF|Fluminense|Brasil|BRA|48|28|68|52|88|72|80|0.02|0.04|84|10.2|10|62|10|0.4|2.4|1.4|76|0|0|0.4|0|0|0
André|MID|Fluminense|Brasil|BRA|72|64|82|80|64|68|80|0.10|0.18|84|11.0|22|56|18|2.4|2.2|1.2|46|14|1.4|2.0|32|0|0
Ganso|MID|Fluminense|Brasil|BRA|52|66|86|82|36|50|76|0.10|0.24|86|9.8|10|36|10|3.0|0.8|0.4|28|22|2.4|1.2|22|0|0
Jhon Arias|ATK|Fluminense|Colômbia|BRA|84|72|74|88|28|54|80|0.30|0.22|74|10.6|30|42|10|5.6|0.6|0.4|22|16|2.0|4.2|38|0|0
Germán Cano|ATK|Fluminense|Argentina|BRA|60|86|72|74|20|62|80|0.56|0.10|76|9.6|12|48|8|6.8|0.4|0.2|18|16|0.8|1.2|54|0|0
Marcelo|DEF|Fluminense|Brasil|BRA|68|36|72|74|58|56|74|0.02|0.12|78|10.8|20|44|10|1.4|1.6|0.6|40|8|1.4|2.8|22|0|0
Marchesín|GK|Grêmio|Brasil|BRA|42|12|42|16|10|70|78|0|0|62|9.4|8|34|2|0|2.0|2.8|24|0|0|0|0|74|0.28
Kannemann|DEF|Grêmio|Argentina|BRA|58|28|56|30|84|80|78|0.02|0.01|76|10.2|14|66|14|0.2|3.0|1.2|74|0|0|0.3|0|0|0
Villasanti|MID|Grêmio|Paraguai|BRA|66|62|76|72|68|72|78|0.08|0.14|78|10.8|20|60|16|1.8|2.4|1.2|48|12|1.2|1.8|30|0|0
Cristaldo|ATK|Grêmio|Paraguai|BRA|74|78|64|76|26|66|78|0.36|0.12|70|10.4|24|48|10|5.8|0.6|0.4|24|14|1.0|2.4|42|0|0
Reinaldo|ATK|Grêmio|Brasil|BRA|72|80|58|72|22|68|76|0.40|0.08|64|10.0|22|46|8|5.6|0.4|0.2|20|14|0.6|2.0|46|0|0
Éverton|ATK|Grêmio|Brasil|BRA|80|74|66|82|24|62|78|0.28|0.14|70|10.6|28|44|10|5.0|0.6|0.4|22|14|1.0|3.2|40|0|0
Geromel|DEF|Grêmio|Brasil|BRA|54|26|52|28|80|78|76|0.01|0.01|72|10.0|12|64|12|0.2|2.8|1.0|72|0|0|0.2|0|0|0
Rochet|GK|Internacional|Brasil|BRA|44|12|38|14|10|68|76|0|0|58|9.2|8|30|2|0|1.8|2.6|24|0|0|0|0|70|0.28
Mercado|DEF|Internacional|Argentina|BRA|64|32|56|36|80|78|78|0.02|0.02|76|10.4|18|64|14|0.2|2.8|1.2|70|0|0|0.3|0|0|0
Vitão|DEF|Internacional|Brasil|BRA|66|28|52|32|78|76|76|0.01|0.01|72|10.2|16|62|12|0.2|2.4|1.0|66|0|0|0.2|0|0|0
Fernando|MID|Internacional|Brasil|BRA|60|58|76|70|70|72|76|0.06|0.12|80|10.8|18|60|18|2.0|2.4|1.4|50|10|1.0|1.4|28|0|0
Alan Patrick|MID|Internacional|Brasil|BRA|64|70|80|78|48|56|78|0.14|0.20|82|10.4|16|46|12|2.8|1.4|0.8|34|18|1.8|1.8|32|0|0
Enner Valencia|ATK|Internacional|Equador|BRA|72|84|62|72|22|70|80|0.50|0.10|68|10.0|20|52|8|6.4|0.4|0.2|20|16|0.8|1.6|52|0|0
Borré|ATK|Internacional|Colômbia|BRA|70|80|64|78|26|74|80|0.42|0.12|72|10.2|22|50|10|6.0|0.6|0.4|24|16|1.0|2.2|46|0|0
Rafael Cabral|GK|Cruzeiro|Brasil|BRA|44|12|40|16|10|70|76|0|0|58|9.4|8|30|2|0|1.8|2.6|24|0|0|0|0|72|0.28
Zé Ivaldo|DEF|Cruzeiro|Brasil|BRA|62|28|52|32|80|78|76|0.01|0.01|74|10.2|16|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Matheus Pereira|MID|Cruzeiro|Brasil|BRA|72|74|82|84|48|56|80|0.16|0.22|82|10.8|24|46|14|3.0|1.6|0.8|34|18|2.0|2.8|34|0|0
Nikão|MID|Cruzeiro|Brasil|BRA|68|66|74|78|44|58|76|0.10|0.16|76|10.6|22|48|12|2.4|1.6|0.8|36|14|1.4|2.2|30|0|0
Rafael Bilu|ATK|Cruzeiro|Brasil|BRA|78|76|60|78|22|64|78|0.34|0.10|68|10.4|26|46|8|5.4|0.4|0.2|22|14|0.8|2.6|44|0|0
Willyan Rocha|DEF|Cruzeiro|Brasil|BRA|64|28|56|34|76|74|74|0.02|0.02|72|10.4|18|58|12|0.4|2.2|0.8|58|8|0.8|1.8|24|0|0
Léo Jardim|GK|Vasco|Brasil|BRA|44|12|38|14|10|68|74|0|0|56|9.0|8|28|2|0|1.6|2.4|22|0|0|0|0|68|0.30
Maicon|DEF|Vasco|Brasil|BRA|62|28|58|34|80|78|78|0.02|0.02|76|10.4|16|64|14|0.2|2.8|1.2|72|0|0|0.3|0|0|0
Payet|MID|Vasco|França|BRA|60|72|88|86|28|48|82|0.12|0.28|88|9.6|10|36|8|3.6|0.8|0.4|24|26|2.8|1.4|20|0|0
Vegetti|ATK|Vasco|Argentina|BRA|58|80|62|68|18|68|78|0.48|0.08|68|9.4|10|48|6|6.0|0.4|0.2|16|14|0.6|1.0|52|0|0
Puma Rodríguez|ATK|Vasco|Colômbia|BRA|80|74|66|82|24|60|78|0.30|0.14|72|10.6|28|44|10|5.4|0.6|0.4|22|14|1.2|3.4|38|0|0
Adson|MID|Vasco|Brasil|BRA|72|62|72|78|42|56|76|0.08|0.16|74|10.8|26|46|10|2.2|1.6|0.8|36|12|1.2|2.4|28|0|0
Léo|DEF|Vasco|Brasil|BRA|66|30|58|38|72|68|74|0.02|0.04|72|10.6|20|54|12|0.6|2.0|0.8|52|8|0.8|2.0|22|0|0
Marcos Felipe|GK|Bahia|Brasil|BRA|42|10|38|14|8|68|74|0|0|56|9.0|8|28|2|0|1.6|2.4|22|0|0|0|0|68|0.28
Luciano Juba|DEF|Bahia|Brasil|BRA|68|32|58|40|74|72|76|0.02|0.04|74|10.6|22|56|12|0.6|2.0|0.8|54|8|1.0|2.0|24|0|0
Caio Alexandre|MID|Bahia|Brasil|BRA|66|62|78|76|60|66|78|0.08|0.16|80|10.8|20|54|16|2.0|2.0|1.0|44|14|1.2|1.8|30|0|0
Thaciano|MID|Bahia|Brasil|BRA|62|60|74|72|56|62|74|0.08|0.12|76|10.6|18|52|14|1.6|1.8|0.8|42|10|0.8|1.4|28|0|0
Everaldo|ATK|Bahia|Brasil|BRA|80|78|64|80|24|62|78|0.36|0.12|70|10.4|26|46|10|5.8|0.4|0.2|22|14|1.0|2.8|44|0|0
Gilberto|ATK|Bahia|Brasil|BRA|76|74|62|78|22|60|76|0.30|0.10|68|10.2|24|44|8|5.0|0.4|0.2|20|12|0.8|2.4|40|0|0
Kanu|DEF|Bahia|Nigéria|BRA|66|28|54|34|78|76|74|0.01|0.01|72|10.2|16|62|12|0.2|2.4|1.0|68|0|0|0.2|0|0|0
João Ricardo|GK|Fortaleza|Brasil|BRA|44|12|40|16|10|70|76|0|0|58|9.2|8|30|2|0|2.0|2.8|24|0|0|0|0|72|0.30
Brítez|DEF|Fortaleza|Paraguai|BRA|64|30|54|36|78|76|76|0.02|0.02|74|10.4|18|62|12|0.2|2.6|1.0|66|0|0|0.3|0|0|0
Yago Pikachu|DEF|Fortaleza|Brasil|BRA|78|40|66|68|64|58|76|0.04|0.10|74|11.0|28|50|10|1.4|1.8|0.6|44|8|1.4|2.8|22|0|0
Hércules|MID|Fortaleza|Brasil|BRA|64|60|76|74|58|64|76|0.08|0.14|78|10.6|20|54|14|2.0|2.0|1.0|44|12|1.0|1.6|28|0|0
Moisés|MID|Fortaleza|Brasil|BRA|58|54|78|72|62|68|76|0.06|0.14|82|10.4|14|52|16|2.0|2.2|1.2|46|12|1.0|1.4|26|0|0
Lucero|ATK|Fortaleza|Colômbia|BRA|72|82|64|74|22|68|80|0.46|0.12|70|10.0|20|50|8|6.2|0.4|0.2|20|16|0.8|1.8|48|0|0
Pochettino|ATK|Fortaleza|Argentina|BRA|68|72|58|72|24|64|74|0.28|0.08|66|10.2|22|46|8|4.8|0.4|0.2|22|12|0.6|2.0|40|0|0
Titi|DEF|Fortaleza|Brasil|BRA|62|26|52|32|76|74|72|0.01|0.01|70|10.0|16|60|10|0.2|2.4|0.8|64|0|0|0.2|0|0|0
Bento|GK|Athletico-PR|Brasil|BRA|46|14|38|16|10|72|78|0|0|60|9.4|8|32|2|0|2.0|3.0|26|0|0|0|0|74|0.26
Thiago Heleno|DEF|Athletico-PR|Brasil|BRA|56|24|50|28|84|80|78|0.01|0.01|72|10.0|12|66|12|0.2|3.0|1.2|76|0|0|0.2|0|0|0
Fernandinho|MID|Athletico-PR|Brasil|BRA|54|58|84|76|72|68|80|0.06|0.18|88|10.6|12|58|18|1.6|2.6|1.6|52|12|1.2|1.2|24|0|0
Terans|MID|Athletico-PR|Paraguai|BRA|66|64|74|76|56|58|76|0.10|0.16|76|10.6|20|48|12|2.2|1.6|0.8|38|14|1.4|2.2|30|0|0
Pablo|ATK|Athletico-PR|Brasil|BRA|76|78|62|78|24|66|78|0.38|0.10|70|10.4|24|48|8|5.6|0.4|0.2|22|14|0.8|2.4|44|0|0
Canobbio|ATK|Athletico-PR|Uruguai|BRA|74|72|70|80|26|52|76|0.30|0.14|74|10.4|26|42|10|5.2|0.4|0.2|22|14|1.4|3.0|38|0|0
Esquivel|MID|Athletico-PR|Argentina|BRA|68|66|76|78|50|56|76|0.08|0.14|78|10.8|22|48|14|2.0|1.6|0.8|40|12|1.2|2.0|28|0|0
Gabriel|GK|Juventude|Brasil|BRA|42|10|36|14|8|66|72|0|0|52|8.8|6|26|2|0|1.6|2.4|20|0|0|0|0|66|0.30
Zé Marcos|DEF|Juventude|Brasil|BRA|60|24|50|28|76|74|72|0.01|0.01|70|10.0|14|60|10|0.2|2.4|1.0|64|0|0|0.2|0|0|0
Nogueira|MID|Juventude|Brasil|BRA|58|54|72|68|56|62|72|0.06|0.10|74|10.4|16|52|12|1.4|1.8|0.8|42|10|0.8|1.2|24|0|0
Ricardo Bueno|ATK|Juventude|Brasil|BRA|64|78|56|66|20|68|74|0.36|0.06|62|9.8|18|48|6|4.8|0.4|0.2|18|12|0.6|1.4|44|0|0
Alan Ruschel|DEF|Juventude|Brasil|BRA|62|28|56|36|70|68|70|0.02|0.04|70|10.4|18|54|10|0.6|1.8|0.8|52|8|0.8|1.8|22|0|0
Jadson|ATK|Juventude|Brasil|BRA|72|70|58|74|22|60|72|0.24|0.08|64|10.2|22|44|8|4.4|0.4|0.2|20|12|0.6|2.0|38|0|0
Lucas Arcanjo|GK|Vitória|Brasil|BRA|40|10|34|12|8|64|70|0|0|50|8.8|6|24|2|0|1.4|2.0|18|0|0|0|0|64|0.32
Wagner Leonardo|DEF|Vitória|Brasil|BRA|58|24|48|28|76|72|70|0.01|0.01|68|10.0|14|58|10|0.2|2.2|0.8|62|0|0|0.2|0|0|0
Léo Naldi|MID|Vitória|Brasil|BRA|58|52|68|66|52|60|70|0.06|0.10|72|10.4|16|48|10|1.4|1.6|0.8|40|10|0.6|1.2|24|0|0
Alerrandro|ATK|Vitória|Brasil|BRA|70|74|56|72|20|64|74|0.32|0.06|60|10.0|22|44|8|4.8|0.4|0.2|20|12|0.6|2.0|40|0|0
Rodriguinho|MID|Vitória|Brasil|BRA|60|58|70|72|44|54|70|0.08|0.12|74|10.2|16|46|10|1.8|1.4|0.6|34|10|0.8|1.4|24|0|0
Patric|DEF|Vitória|Brasil|BRA|56|22|48|26|74|70|68|0.01|0.01|66|9.8|14|56|10|0.2|2.2|0.8|60|0|0|0.2|0|0|0
Arthur|GK|Criciúma|Brasil|BRA|40|10|34|12|8|64|70|0|0|50|8.6|6|24|2|0|1.4|2.0|18|0|0|0|0|64|0.32
Bergson|DEF|Criciúma|Brasil|BRA|56|22|48|28|78|74|70|0.01|0.01|68|10.0|14|62|10|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Marllon|DEF|Criciúma|Brasil|BRA|58|24|50|30|76|72|70|0.01|0.01|66|9.8|14|58|10|0.2|2.2|0.8|62|0|0|0.2|0|0|0
Léo Gamalho|ATK|Criciúma|Brasil|BRA|66|72|54|68|20|64|72|0.30|0.06|58|9.8|20|46|6|4.4|0.4|0.2|18|12|0.4|1.4|42|0|0
Ruan|ATK|Criciúma|Brasil|BRA|68|68|56|72|22|58|70|0.24|0.06|60|10.0|22|42|6|3.8|0.4|0.2|20|10|0.4|1.6|36|0|0
Juninho|MID|Criciúma|Brasil|BRA|54|50|68|64|52|58|68|0.06|0.08|72|10.2|14|48|10|1.2|1.6|0.6|38|8|0.6|1.0|22|0|0
João Paulo|GK|Santos|Brasil|BRA|44|12|40|16|10|70|76|0|0|58|9.2|8|30|2|0|2.0|2.8|24|0|0|0|0|72|0.28
Maicon Santos|DEF|Santos|Brasil|BRA|60|26|54|32|78|76|74|0.01|0.02|72|10.2|14|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Nathan|MID|Santos|Brasil|BRA|62|60|74|76|50|58|74|0.08|0.14|76|10.4|18|50|12|2.0|1.6|0.8|40|12|1.0|1.6|28|0|0
Soteldo|ATK|Santos|Venezuela|BRA|86|68|68|90|22|48|78|0.22|0.20|70|10.6|32|36|8|4.8|0.4|0.2|20|14|2.0|4.8|34|0|0
Marcos Leonardo|ATK|Santos|Brasil|BRA|74|80|58|72|22|66|78|0.44|0.08|64|10.0|22|48|8|5.8|0.4|0.2|20|14|0.6|1.8|46|0|0
Ricky|MID|Santos|Brasil|BRA|58|56|70|68|48|56|70|0.06|0.10|72|10.4|16|48|10|1.4|1.6|0.6|38|10|0.6|1.2|24|0|0
Walter|GK|Cuiabá|Brasil|BRA|40|10|34|12|8|64|70|0|0|50|8.6|6|24|2|0|1.4|2.0|18|0|0|0|0|64|0.32
Marllon Cui|DEF|Cuiabá|Brasil|BRA|56|24|50|30|76|72|70|0.01|0.01|68|10.0|14|60|10|0.2|2.4|1.0|64|0|0|0.2|0|0|0
Denilson|MID|Cuiabá|Brasil|BRA|56|52|68|66|58|62|70|0.06|0.08|72|10.4|16|52|12|1.4|1.8|0.8|42|10|0.6|1.2|24|0|0
Deyverson|ATK|Cuiabá|Brasil|BRA|62|78|52|64|20|72|74|0.40|0.06|58|9.6|14|50|6|5.0|0.4|0.2|16|12|0.4|1.0|48|0|0
Jandrei|DEF|Cuiabá|Brasil|BRA|60|26|56|34|72|68|70|0.02|0.04|70|10.4|18|54|10|0.6|1.8|0.8|52|8|0.8|1.8|22|0|0
Everalton|ATK|Cuiabá|Brasil|BRA|68|68|56|70|22|62|72|0.22|0.06|60|10.0|22|44|8|4.0|0.4|0.2|20|12|0.4|1.8|36|0|0
Cleiton|GK|Bragantino|Brasil|BRA|44|12|40|16|10|70|76|0|0|58|9.2|8|30|2|0|2.0|2.8|24|0|0|0|0|72|0.28
Léo Ortiz|DEF|Bragantino|Brasil|BRA|62|28|56|34|82|78|78|0.02|0.02|76|10.4|18|64|14|0.2|3.0|1.2|72|0|0|0.3|0|0|0
Aderlan|DEF|Bragantino|Brasil|BRA|74|36|64|56|68|64|76|0.02|0.06|74|10.8|26|54|10|1.0|2.0|0.6|48|8|1.2|2.6|22|0|0
Eric Ramires|MID|Bragantino|Brasil|BRA|68|66|78|80|48|56|78|0.10|0.18|78|10.8|24|48|14|2.4|1.8|0.8|38|14|1.4|2.4|30|0|0
Helinho|ATK|Bragantino|Brasil|BRA|80|72|68|84|24|54|78|0.28|0.16|74|10.8|30|42|10|5.2|0.6|0.4|22|14|1.4|3.6|36|0|0
Eduardo Sasha|ATK|Bragantino|Brasil|BRA|66|82|58|70|22|74|78|0.48|0.08|66|9.8|16|50|6|6.0|0.4|0.2|18|14|0.6|1.2|50|0|0
Lincoln|MID|Bragantino|Brasil|BRA|62|60|76|78|44|54|74|0.08|0.14|76|10.6|20|48|12|1.8|1.6|0.6|36|12|1.0|1.8|26|0|0
Keiller|GK|Chapecoense|Brasil|BRA|40|10|36|14|8|66|73|0|0|54|8.8|6|26|2|0|1.6|2.2|20|0|0|0|0|68|0.30
Miller Bolzan|DEF|Chapecoense|Brasil|BRA|68|28|52|36|78|74|74|0.01|0.01|72|10.2|14|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Demétrius|DEF|Chapecoense|Brasil|BRA|64|26|50|34|76|72|72|0.01|0.01|70|10.0|12|60|10|0.2|2.4|0.8|64|0|0|0.2|0|0|0
João Pedro|DEF|Chapecoense|Brasil|BRA|72|30|58|44|74|70|73|0.02|0.04|72|10.6|22|56|12|0.6|2.0|0.8|52|8|1.0|2.0|22|0|0
Hygor|MID|Chapecoense|Brasil|BRA|66|60|76|72|58|62|74|0.08|0.14|78|10.6|20|50|12|1.8|1.8|0.8|40|12|1.2|2.0|28|0|0
Kevin|MID|Chapecoense|Brasil|BRA|62|56|72|68|56|60|73|0.06|0.10|74|10.4|16|50|12|1.4|1.6|0.8|42|10|0.8|1.4|24|0|0
Anselmo Ramon|ATK|Chapecoense|Brasil|BRA|70|76|58|72|22|68|75|0.34|0.08|62|10.0|22|46|8|5.0|0.4|0.2|20|12|0.6|2.2|42|0|0
Carioca|MID|Chapecoense|Brasil|BRA|68|62|74|72|56|64|74|0.08|0.12|76|10.6|20|50|12|1.6|1.8|0.8|40|12|1.0|1.8|28|0|0
Wilson|GK|Coritiba|Brasil|BRA|42|12|40|16|10|72|74|0|0|56|9.0|8|30|2|0|2.0|2.6|24|0|0|0|0|72|0.28
Henrique|DEF|Coritiba|Brasil|BRA|64|30|54|38|80|78|75|0.02|0.01|76|10.4|18|64|14|0.2|2.8|1.2|72|0|0|0.3|0|0|0
Andrei|DEF|Coritiba|Brasil|BRA|66|28|52|36|78|76|74|0.01|0.01|74|10.2|16|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Nathan|DEF|Coritiba|Brasil|BRA|70|32|58|42|74|70|74|0.02|0.04|72|10.6|20|56|12|0.6|2.0|0.8|52|8|1.0|2.0|22|0|0
Viktor|MID|Coritiba|Brasil|BRA|68|64|78|76|60|66|75|0.10|0.16|80|10.8|22|52|16|2.2|2.0|1.0|46|14|1.4|2.0|30|0|0
Alef Manga|ATK|Coritiba|Brasil|BRA|78|80|64|82|24|64|77|0.42|0.12|68|10.4|28|44|10|6.4|0.4|0.2|22|14|1.2|3.2|48|0|0
Bruno Gomes|MID|Coritiba|Brasil|BRA|64|58|74|70|58|62|74|0.08|0.12|76|10.6|18|50|12|1.6|1.8|0.8|42|12|1.0|1.6|26|0|0
Mosquera|ATK|Coritiba|Colômbia|BRA|76|74|62|78|24|62|76|0.32|0.14|70|10.4|26|44|10|5.4|0.4|0.2|22|14|1.0|2.8|44|0|0
Lucas Lopes|GK|Athletico-GO|Brasil|BRA|42|12|38|16|10|70|74|0|0|58|9.0|8|30|2|0|2.0|2.6|24|0|0|0|0|72|0.28
Leo Pereira|DEF|Athletico-GO|Brasil|BRA|66|30|54|38|82|78|76|0.02|0.01|76|10.4|18|64|14|0.2|2.8|1.2|72|0|0|0.3|0|0|0
Eder Ferreira|DEF|Athletico-GO|Brasil|BRA|64|28|52|34|78|76|74|0.01|0.01|74|10.2|16|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Luiz Fernando|MID|Athletico-GO|Brasil|BRA|72|66|78|76|62|66|76|0.10|0.16|80|10.8|22|52|16|2.2|2.0|1.0|46|14|1.4|2.0|30|0|0
Willian Oliveira|MID|Athletico-GO|Brasil|BRA|66|60|74|70|58|64|75|0.08|0.12|76|10.6|20|50|12|1.6|1.8|0.8|42|12|1.0|1.8|28|0|0
Shaylon|MID|Athletico-GO|Brasil|BRA|68|62|76|74|56|62|74|0.10|0.14|78|10.6|20|48|12|1.8|1.6|0.8|40|12|1.2|1.8|28|0|0
Jander|ATK|Athletico-GO|Brasil|BRA|74|72|60|76|24|66|76|0.30|0.12|68|10.4|26|44|10|5.0|0.4|0.2|22|12|1.2|2.6|44|0|0
Wellington Rato|ATK|Athletico-GO|Brasil|BRA|72|76|62|74|26|68|77|0.34|0.10|68|10.2|24|48|8|5.2|0.4|0.2|22|14|0.8|2.2|46|0|0
Lucas Frigeri|GK|Sport|Brasil|BRA|44|12|40|16|10|72|75|0|0|60|9.2|8|32|2|0|2.0|2.8|26|0|0|0|0|72|0.28
Flavio|DEF|Sport|Brasil|BRA|66|30|56|38|80|78|76|0.02|0.01|76|10.4|18|64|14|0.2|2.8|1.2|72|0|0|0.3|0|0|0
Sabino|DEF|Sport|Brasil|BRA|64|28|52|36|78|76|75|0.01|0.01|74|10.2|16|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Gustavo|DEF|Sport|Brasil|BRA|72|32|60|44|74|70|75|0.02|0.04|74|10.6|22|56|12|0.6|2.0|0.8|52|8|1.0|2.0|22|0|0
Cuca|MID|Sport|Brasil|BRA|70|64|78|76|62|66|76|0.10|0.16|80|10.8|22|52|16|2.2|2.0|1.0|46|14|1.4|2.0|30|0|0
Neto|MID|Sport|Brasil|BRA|66|60|74|70|58|62|75|0.08|0.12|76|10.6|20|50|12|1.6|1.8|0.8|42|12|1.0|1.8|28|0|0
Roger Martins|ATK|Sport|Brasil|BRA|78|78|62|80|24|64|77|0.38|0.12|68|10.4|28|44|10|6.0|0.4|0.2|22|14|1.2|3.0|48|0|0
Sander|ATK|Sport|Brasil|BRA|74|72|60|76|26|66|76|0.32|0.12|68|10.4|26|44|10|5.0|0.4|0.2|22|12|1.0|2.6|44|0|0
Brunno|GK|Ceará|Brasil|BRA|42|12|38|16|10|72|74|0|0|58|9.0|8|30|2|0|2.0|2.6|24|0|0|0|0|72|0.28
Luiz Otávio|DEF|Ceará|Brasil|BRA|66|30|54|38|80|78|76|0.02|0.01|76|10.4|18|64|14|0.2|2.8|1.2|72|0|0|0.3|0|0|0
Eduardo|DEF|Ceará|Brasil|BRA|64|28|52|34|78|76|74|0.01|0.01|74|10.2|16|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Richardson|MID|Ceará|Brasil|BRA|70|64|78|76|62|66|76|0.10|0.16|80|10.8|22|52|16|2.2|2.0|1.0|46|14|1.4|2.0|30|0|0
Jajá|MID|Ceará|Brasil|BRA|66|60|74|70|58|62|75|0.08|0.12|76|10.6|20|50|12|1.6|1.8|0.8|42|12|1.0|1.8|28|0|0
Charles|MID|Ceará|Brasil|BRA|64|58|72|68|56|60|74|0.08|0.10|74|10.4|18|48|12|1.4|1.6|0.8|40|10|0.8|1.4|26|0|0
Erick Farias|ATK|Ceará|Brasil|BRA|76|78|62|80|24|64|77|0.38|0.12|68|10.4|28|44|10|6.0|0.4|0.2|22|14|1.2|3.0|48|0|0
Fernando Sobral|ATK|Ceará|Brasil|BRA|72|70|58|74|24|62|75|0.28|0.10|68|10.4|26|44|10|4.8|0.4|0.2|22|12|1.0|2.4|42|0|0
Tadeu|GK|Goiás|Brasil|BRA|42|12|38|16|10|72|74|0|0|58|9.0|8|30|2|0|2.0|2.6|24|0|0|0|0|72|0.28
Edson|DEF|Goiás|Brasil|BRA|66|30|54|38|78|76|75|0.02|0.01|76|10.4|18|64|14|0.2|2.8|1.2|72|0|0|0.3|0|0|0
Caio|DEF|Goiás|Brasil|BRA|64|28|52|34|76|74|74|0.01|0.01|74|10.2|16|62|12|0.2|2.6|1.0|68|0|0|0.2|0|0|0
Dyego|DEF|Goiás|Brasil|BRA|70|32|58|42|74|70|73|0.02|0.04|72|10.6|20|56|12|0.6|2.0|0.8|52|8|1.0|2.0|22|0|0
Lucas|MID|Goiás|Brasil|BRA|68|62|76|72|60|64|75|0.10|0.14|78|10.6|20|50|12|1.8|1.8|0.8|42|12|1.2|2.0|28|0|0
Zé Roberto|MID|Goiás|Brasil|BRA|64|58|74|68|56|62|74|0.08|0.10|74|10.4|16|48|12|1.4|1.6|0.8|40|10|0.8|1.4|26|0|0
Apodi|DEF|Goiás|Brasil|BRA|68|28|52|36|74|72|73|0.01|0.01|72|10.2|16|60|10|0.2|2.4|0.8|64|0|0|0.2|0|0|0
Pedro Raul|ATK|Goiás|Brasil|BRA|70|80|58|70|22|76|77|0.44|0.08|64|9.8|16|52|6|6.2|0.4|0.2|18|14|0.6|1.4|50|0|0
Mirassol|GK|Mirassol|Brasil|BRA|40|10|34|12|8|64|70|0|0|50|8.6|6|24|2|0|1.4|2.0|18|0|0|0|0|64|0.32
Braga|DEF|Mirassol|Brasil|BRA|62|26|50|32|76|72|72|0.01|0.01|70|10.0|14|60|10|0.2|2.4|0.8|64|0|0|0.2|0|0|0
Reinaldo|DEF|Mirassol|Brasil|BRA|70|32|58|42|74|70|73|0.02|0.04|72|10.6|20|56|12|0.6|2.0|0.8|52|8|1.0|2.0|22|0|0
Maurício|MID|Mirassol|Brasil|BRA|64|58|72|68|56|60|72|0.06|0.10|74|10.4|16|48|12|1.4|1.6|0.8|40|10|0.8|1.4|24|0|0
Léo Gaúcho|MID|Mirassol|Brasil|BRA|62|54|70|66|54|58|72|0.06|0.08|72|10.2|14|46|10|1.2|1.6|0.8|38|8|0.6|1.2|22|0|0
Negueba|ATK|Mirassol|Brasil|BRA|78|70|60|76|22|60|74|0.30|0.12|66|10.4|26|42|8|4.8|0.4|0.2|20|12|1.0|2.6|42|0|0
Bruno Rodrigues|ATK|Mirassol|Brasil|BRA|72|72|58|72|22|64|74|0.28|0.08|64|10.0|24|44|8|4.4|0.4|0.2|20|12|0.6|2.0|40|0|0
Hugo Souza|GK|Atlético-GO|Brasil|BRA|44|12|40|16|10|72|75|0|0|60|9.2|8|32|2|0|2.0|2.8|26|0|0|0|0|72|0.26
Courtois|GK|Real Madrid|Bélgica|ESP|42|12|44|18|14|82|90|0|0|68|9.8|8|40|2|0|2.4|2.8|32|0|0|0|0|78|0.24
Bellingham|MID|Real Madrid|Inglaterra|ESP|78|84|80|86|72|80|90|0.28|0.22|84|11.4|26|56|20|3.6|2.0|1.2|50|20|2.0|3.0|40|0|0
Vinícius Jr|ATK|Real Madrid|Brasil|ESP|97|86|80|95|36|68|92|0.62|0.30|78|11.0|38|48|14|8.4|0.8|0.4|26|24|2.4|5.8|46|0|0
Mbappé|ATK|Real Madrid|França|ESP|97|92|78|92|34|78|91|0.72|0.25|76|10.8|34|52|12|7.8|0.6|0.4|24|22|1.8|4.2|52|0|0
Pedri|MID|Barcelona|Espanha|ESP|72|68|88|90|64|58|88|0.14|0.24|90|11.0|22|52|22|2.4|1.6|1.0|40|18|2.2|2.4|32|0|0
Lamine Yamal|ATK|Barcelona|Espanha|ESP|90|76|78|92|24|42|84|0.32|0.28|76|10.2|30|34|10|5.6|0.4|0.2|18|14|2.6|5.4|38|0|0
Lewandowski|ATK|Barcelona|Polônia|ESP|68|92|78|82|34|80|88|0.68|0.14|82|9.8|14|54|8|6.4|0.4|0.4|20|24|1.2|1.4|56|0|0
Rodri|MID|Man City|Espanha|ENG|58|72|86|78|84|82|92|0.08|0.18|92|11.4|18|68|24|1.0|3.4|2.0|62|8|1.2|1.2|28|0|0
De Bruyne|MID|Man City|Bélgica|ENG|74|86|94|88|58|72|91|0.22|0.38|88|10.6|16|46|14|2.8|1.2|0.6|36|28|3.2|1.8|34|0|0
Haaland|ATK|Man City|Noruega|ENG|89|94|62|78|40|88|93|0.82|0.10|72|10.2|26|58|10|8.8|0.4|0.4|22|26|1.0|2.0|58|0|0
Salah|ATK|Liverpool|Egito|ENG|90|90|80|90|34|68|89|0.58|0.28|80|10.8|30|46|12|7.4|0.6|0.4|24|22|2.6|4.6|48|0|0
Saka|ATK|Arsenal|Inglaterra|ENG|86|80|80|90|42|60|88|0.38|0.26|80|11.0|30|48|14|6.2|0.8|0.4|28|20|2.4|4.8|42|0|0
Kane|ATK|Bayern|Inglaterra|GER|70|94|78|78|40|80|91|0.78|0.14|82|9.6|12|56|8|6.8|0.4|0.4|20|26|1.2|1.0|58|0|0
Dembélé|ATK|PSG|França|FRA|96|80|74|92|28|56|86|0.36|0.28|72|10.4|36|38|10|6.0|0.4|0.2|20|14|2.2|5.6|38|0|0
Lautaro|ATK|Inter Milan|Argentina|ITA|80|88|68|82|36|72|88|0.56|0.12|74|10.4|26|52|12|7.2|0.6|0.4|26|20|1.2|2.8|50|0|0
Messi|ATK|Inter Miami|Argentina|USA|72|94|92|96|28|56|93|0.68|0.42|88|9.4|10|44|8|6.4|0.4|0.2|16|32|3.4|2.0|36|0|0
Armani|GK|River Plate|Argentina|ARG|40|10|38|16|10|68|78|0|0|58|9.0|8|30|2|0|2.0|2.8|24|0|0|0|0|70|0.30
Solari|ATK|River Plate|Argentina|ARG|78|82|70|80|28|62|80|0.40|0.14|74|10.2|24|48|10|6.2|0.6|0.4|24|16|1.4|2.8|44|0|0
Cavani|ATK|Boca Juniors|Uruguai|ARG|62|86|62|72|28|76|80|0.52|0.08|70|9.6|14|54|6|5.8|0.4|0.2|18|20|0.8|1.2|54|0|0
Henry Martín|ATK|América MX|México|MEX|78|82|60|74|24|70|78|0.42|0.10|68|10.0|24|48|8|6.4|0.4|0.2|22|16|0.8|2.4|48|0|0`;

export const PL = D.trim().split('\n').filter(l => l.trim()).map(l => {
  const d = l.split('|');
  return {
    name: d[0], pos: d[1], club: d[2], nation: d[3], league: d[4],
    pac: +d[5], sho: +d[6], pas: +d[7], dri: +d[8], def: +d[9], phy: +d[10], ovr: +d[11],
    xG90: +d[12], xA90: +d[13], passComp: +d[14], dist90: +d[15], sprints90: +d[16],
    duelWin: +d[17], press90: +d[18], touchesBox: +d[19], tackles90: +d[20], interceptions90: +d[21],
    aerialWin: +d[22], conversion: +d[23], keyPasses90: +d[24], progRuns90: +d[25],
    shotFromBox: +d[26], saveRate: +d[27], psxG90: +d[28]
  };
});

export const B20 = ['Flamengo','Palmeiras','Botafogo','São Paulo','Corinthians','Atlético-MG','Fortaleza','Internacional','Grêmio','Bahia','Athletico-PR','Cruzeiro','Vasco','Fluminense','Bragantino','Juventude','Vitória','Criciúma','Santos','Cuiabá','Chapecoense','Coritiba','Athletico-GO','Sport','Ceará','Goiás','Mirassol'];

export const LG = {
  BRA: { name: 'Brasileirão', icon: '🇧🇷' },
  ESP: { name: 'La Liga', icon: '🇪🇸' },
  ENG: { name: 'Premier League', icon: '🏴' },
  GER: { name: 'Bundesliga', icon: '🇩🇪' },
  FRA: { name: 'Ligue 1', icon: '🇫🇷' },
  ITA: { name: 'Serie A', icon: '🇮🇹' },
  ARG: { name: 'Argentina', icon: '🇦🇷' },
  USA: { name: 'MLS', icon: '🇺🇸' },
  MEX: { name: 'Liga MX', icon: '🇲🇽' }
};

export const COMP = [
  { id: 'bra', name: 'Brasileirão Série A 2026', type: 'league', teams: B20 },
  { id: 'lib', name: 'Copa Libertadores 2026', type: 'groups', teams: ['Flamengo','Palmeiras','Botafogo','Fortaleza','Internacional','River Plate','Boca Juniors','América MX'] },
  { id: 'cbd', name: 'Copa do Brasil 2026', type: 'knockout', teams: ['Flamengo','Palmeiras','Botafogo','São Paulo','Corinthians','Atlético-MG','Grêmio','Internacional','Bahia','Athletico-PR','Cruzeiro','Sport','Ceará','Coritiba','Chapecoense','Goiás'] },
  { id: 'ucl', name: 'Champions League 2026', type: 'groups', teams: ['Real Madrid','Barcelona','Man City','Liverpool','Arsenal','Bayern','PSG','Inter Milan'] },
  { id: 'lal', name: 'La Liga 2026', type: 'league', teams: ['Real Madrid','Barcelona'] },
  { id: 'epl', name: 'Premier League 2026', type: 'league', teams: ['Man City','Liverpool','Arsenal'] },
  { id: 'arg', name: 'Argentina 2026', type: 'league', teams: ['River Plate','Boca Juniors'] },
  { id: 'mx', name: 'Liga MX 2026', type: 'league', teams: ['América MX'] }
];

export const FMS = {
  '4-3-3': { ps: ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'], sl: [[50,92],[15,75],[37,75],[63,75],[85,75],[25,48],[50,45],[75,48],[15,22],[50,15],[85,22]] },
  '4-4-2': { ps: ['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'], sl: [[50,92],[15,75],[37,75],[63,75],[85,75],[12,48],[37,48],[63,48],[88,48],[35,18],[65,18]] },
  '3-5-2': { ps: ['GK','CB','CB','CB','LM','CM','CM','CM','RM','ST','ST'], sl: [[50,92],[30,78],[50,78],[70,78],[10,50],[33,48],[50,42],[67,48],[90,50],[35,18],[65,18]] },
  '4-2-3-1': { ps: ['GK','LB','CB','CB','RB','CDM','CDM','LAM','CAM','RAM','ST'], sl: [[50,92],[15,75],[37,75],[63,75],[85,75],[35,58],[65,58],[18,35],[50,30],[82,35],[50,15]] }
};

export function pc(p) {
  if (p === 'GK') return 'GK';
  if ('CBLR'.includes(p)) return 'DEF';
  if ('CMCDMLMRAMCMID'.includes(p)) return 'MID';
  return 'ATK';
}

export function pco(s, p) {
  if (pc(s) === pc(p.pos)) return 1;
  if (s === 'GK' || p.pos === 'GK') return 0;
  return 0.3;
}

export function rc(o) {
  return o >= 85 ? 'var(--gd)' : o >= 75 ? 'var(--sv)' : 'var(--br)';
}

export function gtp(c) { return PL.filter(p => p.club === c); }

export function gto(c) {
  const t = gtp(c);
  if (!t.length) return 50;
  return Math.round([...t].sort((a, b) => b.ovr - a.ovr).slice(0, Math.min(11, t.length)).reduce((a, p) => a + p.ovr, 0) / Math.min(11, t.length));
}

export function gppda(c) {
  const t = gtp(c);
  if (!t.length) return 12;
  return Math.round(t.reduce((a, p) => a + p.press90, 0) / t.length);
}

// === Geometria espacial e física ===
class V {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  c() { return new V(this.x, this.y); }
  s(x, y) { this.x = x; this.y = y; return this; }
  a(v) { this.x += v.x; this.y += v.y; return this; }
  sub(v) { return new V(this.x - v.x, this.y - v.y); }
  sc(s) { return new V(this.x * s, this.y * s); }
  as(v, s) { this.x += v.x * s; this.y += v.y * s; return this; }
  dot(v) { return this.x * v.x + this.y * v.y; }
  ln() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  nm() { const l = this.ln(); return l > 1e-8 ? this.sc(1 / l) : new V(); }
  dt(v) { return this.sub(v).ln(); }
}

const PW = 1050, PH = 680, GH = 73, BR = 7, PR = 14, BM = 0.43, PM = 75, AD = 0.003, GF = 0.985, BB = 0.65, PB = 0.4;

function scc(a, b, ra, rb, dt) {
  const dp = b.p.sub(a.p), dv = b.v.sub(a.v), rs = ra + rb;
  const a2 = dv.dot(dv), b2 = 2 * dp.dot(dv), c2 = dp.dot(dp) - rs * rs;
  if (a2 < 1e-10) return null;
  const d = b2 * b2 - 4 * a2 * c2;
  if (d < 0) return null;
  const sq = Math.sqrt(d);
  let t = (-b2 - sq) / (2 * a2);
  if (t < 0) t = (-b2 + sq) / (2 * a2);
  return (t >= 0 && t <= dt) ? t : null;
}

function rcol(a, b, t, dt, r) {
  a.p.as(a.v, t); b.p.as(b.v, t);
  const n = b.p.sub(a.p).nm(), rv = a.v.sub(b.v), vn = rv.dot(n);
  if (vn > 0) return;
  const j = -(1 + r) * vn / (1 / a.m + 1 / b.m), imp = n.sc(j);
  a.v.as(imp, 1 / a.m); b.v.as(imp, -1 / b.m);
  const ol = (a.r + b.r) - a.p.dt(b.p);
  if (ol > 0) { const tm = a.m + b.m; a.p.as(n, -ol * b.m / tm); b.p.as(n, ol * a.m / tm); }
  const rm = dt - t; a.p.as(a.v, rm); b.p.as(b.v, rm);
}

function calcXG(sh, bp) {
  const gx = sh.hm ? PW : 0, dist = bp.dt(new V(gx, PH / 2));
  const ang = Math.abs(Math.atan2(bp.y - PH / 2, bp.x - gx));
  let x = 0;
  if (dist < 60) x = 0.35 + sh.d.sho * 0.003;
  else if (dist < 150) x = 0.12 + sh.d.xG90 * 0.2;
  else if (dist < 300) x = 0.03 + sh.d.xG90 * 0.08;
  else x = 0.01 + sh.d.xG90 * 0.02;
  x *= Math.max(0.2, 1 - ang / (Math.PI * 0.6));
  x *= 0.8 + sh.d.conversion * 0.005;
  const opps = sh.hm ? sh._a : sh._h;
  let pr = 0;
  if (opps) opps.forEach(o => { const d = o.p.dt(bp); if (d < 80) pr += (80 - d) / 80; });
  x *= Math.max(0.5, 1 - pr * 0.15);
  return Math.min(0.95, Math.max(0.01, x));
}

class Ent {
  constructor(x, y, r, m) { this.p = new V(x, y); this.v = new V(); this.ac = new V(); this.r = r; this.m = m; this.og = true; }
  af(f) { this.ac.as(f, 1 / this.m); }
  up(dt) { this.v.as(this.ac, dt); this.p.as(this.v, dt); this.ac.s(0, 0); }
}

class Ball extends Ent {
  constructor() { super(PW / 2, PH / 2, BR, BM); this.sp = 0; this.tr = []; this.lt = null; this.ip = true; }
  up(dt) {
    const s = this.v.ln();
    if (s > 1) this.af(this.v.nm().sc(-AD * s * s));
    if (Math.abs(this.sp) > 0.1 && s > 5) this.af(new V(-this.v.y, this.v.x).nm().sc(this.sp * 0.0003 * s));
    if (this.og) { this.v.x *= GF; this.v.y *= GF; this.sp *= 0.98; }
    super.up(dt);
    this.tr.push(this.p.c());
    if (this.tr.length > 18) this.tr.shift();
    this.bc();
    if (this.v.ln() < 0.4) this.v.s(0, 0);
  }
  bc() {
    const gt = PH / 2 - GH / 2, gb = PH / 2 + GH / 2;
    if (this.p.y - BR < 0) { this.p.y = BR; this.v.y = Math.abs(this.v.y) * BB; }
    if (this.p.y + BR > PH) { this.p.y = PH - BR; this.v.y = -Math.abs(this.v.y) * BB; }
    if (this.p.x - BR < 0) { if (this.p.y > gt && this.p.y < gb) { this.ip = false; return; } this.p.x = BR; this.v.x = Math.abs(this.v.x) * BB; }
    if (this.p.x + BR > PW) { if (this.p.y > gt && this.p.y < gb) { this.ip = false; return; } this.p.x = PW - BR; this.v.x = -Math.abs(this.v.x) * BB; }
  }
  kick(d, pw, sp = 0) { const n = d.nm(); this.v.s(n.x * pw, n.y * pw); this.sp = sp; this.og = pw < 400; }
}

class MP extends Ent {
  constructor(d, tm, sx, sy, hm) {
    super(sx, sy, PR, PM + d.phy * 0.3);
    this.d = d; this.tm = tm; this.hm = hm;
    this.hp = new V(sx, sy);
    this.ms = 150 + d.pac * 3.5;
    this.ac2 = 200 + d.pac * 2;
    this.hb = false; this.st = 'POS';
    this.fc = new V(hm ? 1 : -1, 0);
    this.en = 100; this.tcd = 0; this._h = null; this._a = null;
  }
  up(dt) {
    this.v.x *= 0.92; this.v.y *= 0.92;
    if (this.v.ln() > this.ms) this.v = this.v.nm().sc(this.ms);
    super.up(dt);
    this.p.x = Math.max(PR, Math.min(PW - PR, this.p.x));
    this.p.y = Math.max(PR, Math.min(PH - PR, this.p.y));
    if (this.tcd > 0) this.tcd -= dt;
  }
  mt(t, dt) {
    const dir = t.sub(this.p), dist = dir.ln();
    if (dist < 3) return;
    const ds = dir.nm().sc(Math.min(this.ms * this.en / 100, dist * 3));
    const f = ds.sub(this.v).sc(this.ac2 * 0.1);
    this.af(f); this.fc = dir.nm();
  }
}

// === SIMULADOR DE PARTIDA ===
export class Sim {
  constructor(cv, hc, ac) {
    this.cv = cv; this.cx = cv.getContext('2d');
    this.hc = hc; this.ac = ac;
    this.bl = new Ball(); this.ents = []; this.hp = []; this.ap = [];
    this.gt = 0; this.mt = 5400;
    this.run = false; this.spd = 1;
    this.sc2 = { h: 0, a: 0 }; this.xg = { h: 0, a: 0 }; this.evs = []; this.gcd = 0; this.dtm = 0;
    this.st = {
      h: { sh: 0, ot: 0, pa: 0, pc: 0, tk: 0, fl: 0, pr: 0, ps: 0, kr: 0, dist: 0 },
      a: { sh: 0, ot: 0, pa: 0, pc: 0, tk: 0, fl: 0, pr: 0, ps: 0, kr: 0, dist: 0 }
    };
    this.pt = { h: 0, a: 0 }; this.lp = 'h'; this.pd = {};
    this.init();
  }

  init() {
    this.ents = [this.bl];
    const fm = FMS['4-3-3'];
    const hp = gtp(this.hc), ap = gtp(this.ac);
    const asn = (pool, slots) => {
      const a = [], u = new Set();
      for (const s of slots) {
        let best = null, bs = -1;
        for (let i = 0; i < pool.length; i++) {
          if (u.has(i)) continue;
          const c = pco(s, pool[i]), sc = c * 100 + pool[i].ovr;
          if (c > 0 && sc > bs) { bs = sc; best = i; }
        }
        if (best !== null) { u.add(best); a.push(pool[best]); }
        else a.push(pool[a.length % pool.length]);
      }
      return a;
    };
    const ha = asn(hp, fm.ps), aa = asn(ap, fm.ps);
    fm.sl.forEach((s, i) => {
      const h = new MP(ha[i], 'h', s[0] / 100 * PW, s[1] / 100 * PH, true);
      const a = new MP(aa[i], 'a', (1 - s[0] / 100) * PW, s[1] / 100 * PH, false);
      h._h = this.hp; h._a = this.ap; a._h = this.hp; a._a = this.ap;
      this.hp.push(h); this.ap.push(a); this.ents.push(h, a);
    });
    this.rp();
  }

  rp() {
    this.bl.p.s(PW / 2, PH / 2); this.bl.v.s(0, 0); this.bl.ip = true;
    this.hp.forEach((p, i) => { const s = FMS['4-3-3'].sl[i]; p.p.s(s[0] / 100 * PW, s[1] / 100 * PH); p.v.s(0, 0); p.hb = false; p.st = 'POS'; });
    this.ap.forEach((p, i) => { const s = FMS['4-3-3'].sl[i]; p.p.s((1 - s[0] / 100) * PW, s[1] / 100 * PH); p.v.s(0, 0); p.hb = false; p.st = 'POS'; });
  }

  ga() { return [...this.hp, ...this.ap]; }
  start() { this.run = true; }
  pause() { this.run = false; }

  reset() {
    this.run = false; this.gt = 0;
    this.sc2 = { h: 0, a: 0 }; this.xg = { h: 0, a: 0 }; this.evs = []; this.gcd = 0;
    this.st = {
      h: { sh: 0, ot: 0, pa: 0, pc: 0, tk: 0, fl: 0, pr: 0, ps: 0, kr: 0, dist: 0 },
      a: { sh: 0, ot: 0, pa: 0, pc: 0, tk: 0, fl: 0, pr: 0, ps: 0, kr: 0, dist: 0 }
    };
    this.pt = { h: 0, a: 0 }; this.rp();
  }

  setSpd(s) { this.spd = s; }

  quickSim() {
    this.reset();
    const hp = gtp(this.hc), ap = gtp(this.ac);
    const hOvr = gto(this.hc), aOvr = gto(this.ac);
    const hFwd = hp.filter(p => p.pos !== 'GK' && pc(p.pos) !== 'DEF');
    const aFwd = ap.filter(p => p.pos !== 'GK' && pc(p.pos) !== 'DEF');
    const events = [];
    const numShots = 10 + Math.floor(Math.random() * 14);

    for (let i = 0; i < numShots; i++) {
      const min = 1 + Math.floor(Math.random() * 89);
      const isHome = Math.random() < (hOvr + 1) / (hOvr + aOvr + 2);
      const team = isHome ? 'h' : 'a';
      const pool = isHome ? hFwd : aFwd;
      if (!pool.length) continue;
      const shooter = pool[Math.floor(Math.random() * pool.length)];
      const xg = 0.03 + Math.random() * 0.45;
      this.xg[team] += xg;
      this.st[team].sh++;
      if (Math.random() < xg * 1.6) {
        this.sc2[team]++;
        this.st[team].ot++;
        events.push({ min, tp: 'gl', tx: `GOL ${isHome ? this.hc : this.ac}! ${shooter.name} ${min}'` });
      } else {
        const onTarget = Math.random() < 0.35;
        if (onTarget) this.st[team].ot++;
        events.push({ min, tp: 'sh', tx: `${shooter.name} chuta!${onTarget ? ' No alvo!' : ' Fora!'}${xg >= 0.25 ? ' (xG ' + xg.toFixed(2) + ')' : ''}` });
      }
    }

    const numFouls = 6 + Math.floor(Math.random() * 10);
    for (let i = 0; i < numFouls; i++) {
      const min = 1 + Math.floor(Math.random() * 89);
      const isHome = Math.random() < 0.5;
      const pool = isHome ? hp : ap;
      const fouler = pool[Math.floor(Math.random() * pool.length)];
      if (fouler) { this.st[isHome ? 'h' : 'a'].fl++; events.push({ min, tp: 'fl', tx: `Falta de ${fouler.name}` }); }
    }

    events.sort((a, b) => a.min - b.min);
    events.forEach(e => this.aev(e.min, e.tp, e.tx));

    this.st.h.pa = 250 + Math.floor(Math.random() * 200);
    this.st.a.pa = 250 + Math.floor(Math.random() * 200);
    this.st.h.pc = Math.floor(this.st.h.pa * (0.72 + Math.random() * 0.15));
    this.st.a.pc = Math.floor(this.st.a.pa * (0.72 + Math.random() * 0.15));
    this.st.h.tk = 12 + Math.floor(Math.random() * 18);
    this.st.a.tk = 12 + Math.floor(Math.random() * 18);
    this.st.h.ps = 35 + Math.floor(Math.random() * 45);
    this.st.a.ps = 35 + Math.floor(Math.random() * 45);
    this.st.h.dist = 95 + Math.random() * 25;
    this.st.a.dist = 95 + Math.random() * 25;
    this.st.h.kr = 6 + Math.floor(Math.random() * 12);
    this.st.a.kr = 6 + Math.floor(Math.random() * 12);

    const possH = Math.max(30, Math.min(70, 50 + (hOvr - aOvr) * 1.5 + (Math.random() - 0.5) * 16));
    this.pt.h = possH; this.pt.a = 100 - possH;

    this.gt = this.mt;
    this.run = false;
    this.aev(90, 'fm', 'Fim de Jogo!');
  }

  tick(dt) {
    const gd = dt * this.spd;
    this.gt += gd;
    if (this.gt >= this.mt) { this.run = false; this.aev(90, 'fm', 'Fim de Jogo!'); return; }
    if (this.gcd > 0) { this.gcd -= gd; if (this.gcd <= 0) this.rp(); }
    else {
      this.dtm -= gd;
      if (this.dtm <= 0) { this.dtm = 0.15; this.dec(); }
      this.exe(gd);
    }
    this.phys(gd);
    const c = this.car();
    if (c) { this.lp = c.tm; this.pt[c.tm] += gd; }
    this.updP(c);
    this.ga().forEach(p => { if (p.v.ln() > 2) this.st[p.tm].dist += p.v.ln() * gd / 1000; });
  }

  phys(dt) {
    this.ents.forEach(e => e.up(dt));
    const pl = this.ga();
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
      const t = scc(pl[i], pl[j], PR, PR, dt);
      if (t !== null) rcol(pl[i], pl[j], t, dt, PB);
    }
    pl.forEach(p => {
      const t = scc(p, this.bl, PR + 2, BR, dt);
      if (t !== null) {
        rcol(p, this.bl, t, dt, 0.6);
        this.bl.lt = p;
        if (!p.hb && this.bl.v.ln() < p.ms * 3) {
          p.hb = true;
          this.ga().forEach(o => { if (o !== p) o.hb = false; });
        }
      }
    });
    pl.forEach(p => {
      if (p.hb) {
        const off = p.fc.sc(PR + BR + 2);
        this.bl.p.s(p.p.x + off.x, p.p.y + off.y);
        this.bl.v.s(0, 0);
      }
    });
  }

  car() { return this.ga().find(p => p.hb) || null; }

  dec() {
    const all = this.ga(), c = this.car();
    if (!c) {
      let nr = null, nd = 999;
      all.forEach(p => { if (p.d.pos === 'GK') return; const d = p.p.dt(this.bl.p); if (d < nd) { nd = d; nr = p; } });
      all.forEach(p => {
        if (p === nr) p.st = 'CHASE';
        else p.st = 'POS';
      });
      return;
    }
    all.forEach(p => {
      if (p.hb) this.dA(p);
      else if (c.tm !== p.tm) this.dD(p, c);
      else this.dP(p, c);
    });
  }

  dA(p) {
    const gx = p.hm ? PW : 0, dist = p.p.dt(new V(gx, PH / 2));
    const ang = Math.abs(Math.atan2(p.p.y - PH / 2, p.p.x - gx));
    let base = (p.d.sho / 100) * 0.6 + (p.d.xG90 * 0.8);
    base *= Math.max(0, 1 - dist / 420);
    base *= Math.max(0, 1 - ang / (Math.PI / 2));
    if (dist < 120) base *= 2.2;
    const shP = base * 70;
    const tm2 = (p.hm ? this.hp : this.ap).filter(t => t !== p);
    let bs = 0;
    tm2.forEach(t => { const d = t.p.dt(p.p); if (d < 30 || d > 500) return; const op = this.iO(t); bs = Math.max(bs, op * p.d.pas / 100 * (p.d.xA90 * 2 + 0.5)); });
    const paP = bs * 55 + 18;
    let th = 0;
    const opp = p.hm ? this.ap : this.hp;
    opp.forEach(o => { const d = o.p.dt(p.p); if (d < 100) th += 1 - d / 100; });
    const drP = th * p.d.dri / 100 * 45;
    const tot = shP + paP + drP, r = Math.random() * tot;
    if (r < shP && dist < 380) p.st = 'SHOOT';
    else if (r < shP + paP) p.st = 'PASS';
    else p.st = 'DRIBBLE';
  }

  dD(p, c) {
    const d = c.p.dt(p.p);
    const tppda = p.hm ? gppda(this.hc) : gppda(this.ac);
    const thr = 120 + tppda * 8;
    if (d < thr && p.tcd <= 0) { p.st = 'TACKLE'; if (d < 150) this.st[p.tm].pr++; }
    else if (d < thr + 80) p.st = 'PRESS';
    else p.st = 'DEFEND';
  }

  dP(p, c) { if (c && c.tm === p.tm) p.st = 'ATKR'; else p.st = 'POS'; }

  iO(p) { const opp = p.hm ? this.ap : this.hp; let mn = 999; opp.forEach(o => { mn = Math.min(mn, o.p.dt(p.p)); }); return Math.min(1, mn / 150); }

  exe(dt) {
    this.ga().forEach(p => {
      switch (p.st) {
        case 'SHOOT': this.eS(p); break;
        case 'PASS': this.ePa(p); break;
        case 'DRIBBLE': this.eDr(p, dt); break;
        case 'TACKLE': this.eT(p); break;
        case 'CHASE': p.mt(this.bl.p, dt); break;
        case 'PRESS': { const c = this.car(); if (c) p.mt(c.p, dt); break; }
        case 'DEFEND': { const t = p.hp.c(); t.a(this.bl.p.sub(t).sc(0.15)); p.mt(t, dt); break; }
        case 'ATKR': {
          const f = p.hm ? 1 : -1;
          const t = p.hp.c(); t.x += f * 80;
          t.y += Math.sin(this.gt * 0.02 + p.hp.x) * 40;
          t.x = Math.max(50, Math.min(PW - 50, t.x));
          p.mt(t, dt);
          if (p.v.ln() > p.ms * 0.5 && Math.abs(p.p.x - p.hp.x) > 80) this.st[p.tm].ps++;
          break;
        }
        case 'POS': p.mt(p.hp, dt); break;
      }
    });
  }

  eS(p) {
    if (!p.hb) return;
    p.hb = false;
    const gx = p.hm ? PW : 0, gy = PH / 2 + (Math.random() - 0.5) * GH * 0.7;
    const tgt = new V(gx, gy), dir = tgt.sub(p.p);
    const xg = calcXG(p, p.p);
    this.xg[p.tm] += xg;
    const acc = (p.d.passComp / 100) * 0.4 + (p.d.conversion / 100) * 0.3 + (p.d.sho / 100) * 0.3;
    const df = Math.max(0.3, 1 - p.p.dt(tgt) / 600);
    const fa = acc * df;
    const pw = 300 + p.d.sho * 4;
    const er = (1 - fa) * 55;
    const spin = (Math.random() - 0.5) * p.d.sho * 0.05;
    this.bl.kick(dir.a(new V((Math.random() - 0.5) * er, (Math.random() - 0.5) * er)), pw * (0.7 + Math.random() * 0.3), spin);
    this.bl.og = pw < 350;
    this.st[p.tm].sh++;
    const gc = new V(gx, PH / 2);
    const pred = this.bl.p.c().as(this.bl.v, this.bl.p.dt(gc) / Math.max(1, this.bl.v.ln()));
    const ot = Math.abs(pred.y - PH / 2) < GH / 2 - 5;
    if (ot) this.st[p.tm].ot++;
    this.aev(Math.floor(this.gt / 60), 'sh', `${p.d.name} chuta!${ot ? ' No alvo!' : ' Fora!'}${xg >= 0.3 ? ' (xG ' + xg.toFixed(2) + ')' : ''}`);
  }

  ePa(p) {
    if (!p.hb) return;
    const tm2 = (p.hm ? this.hp : this.ap).filter(t => t !== p);
    if (!tm2.length) return;
    let best = null, bs = -999, isK = false;
    tm2.forEach(t => {
      const d = t.p.dt(p.p);
      if (d < 30 || d > 500) return;
      const op = this.iO(t);
      const fw = p.hm ? (t.p.x - p.p.x) / 200 : (p.p.x - t.p.x) / 200;
      const k = fw > 0.3 && op > 0.6;
      const sc = op * 50 + fw * 20 - d * 0.05;
      if (sc > bs) { bs = sc; best = t; isK = k; }
    });
    if (!best) return;
    p.hb = false;
    const dir = best.p.sub(p.p), dist = dir.ln();
    const pw = Math.min(dist * 2.5, 200 + p.d.pas * 3);
    const acc = p.d.passComp / 100, dp = Math.max(0.5, 1 - dist / 500), fa = acc * dp;
    const er = (1 - fa) * 28;
    this.bl.kick(dir.a(new V((Math.random() - 0.5) * er, (Math.random() - 0.5) * er)), pw, 0);
    this.bl.og = true;
    this.st[p.tm].pa++;
    if (fa > 0.6) this.st[p.tm].pc++;
    if (isK) this.st[p.tm].kr++;
  }

  eDr(p, dt) {
    if (!p.hb) return;
    const opp = p.hm ? this.ap : this.hp;
    let dir = new V(p.hm ? 1 : -1, 0);
    opp.forEach(o => { const to = o.p.sub(p.p), d = to.ln(); if (d < 100) dir.as(to.nm(), -(100 - d) / 100 * 2); });
    dir = dir.nm();
    const spd = p.ms * (0.5 + p.d.dri / 200) * (p.en / 100);
    p.v.s(dir.x * spd, dir.y * spd);
    opp.forEach(o => {
      const d = o.p.dt(p.p);
      if (d < PR * 2 + 4) {
        const suc = p.d.duelWin / (p.d.duelWin + o.d.def) * 0.8;
        if (Math.random() > suc) {
          p.hb = false;
          this.bl.kick(p.p.sub(o.p).nm(), 100 + Math.random() * 100, 0);
          this.st[o.tm].tk++;
        }
      }
    });
  }

  eT(p) {
    const c = this.car();
    if (!c) return;
    p.mt(c.p, 0.016);
    const d = c.p.dt(p.p);
    if (d < PR * 2 + 6) {
      p.tcd = 1;
      const suc = (p.d.tackles90 * 0.15 + p.d.duelWin * 0.5) / (p.d.duelWin + c.d.dri) * 0.85;
      if (Math.random() < suc) {
        c.hb = false;
        this.bl.kick(p.p.sub(c.p).nm(), 80 + Math.random() * 60, 0);
        this.st[p.tm].tk++;
        this.aev(Math.floor(this.gt / 60), 'fl', `${p.d.name} desarma ${c.d.name}`);
      } else {
        this.st[p.tm].fl++;
        this.aev(Math.floor(this.gt / 60), 'fl', `Falta de ${p.d.name}`);
      }
    }
  }

  chkG() {
    if (this.bl.ip || this.gcd > 0) return;
    const sl = this.bl.p.x < 50, sr = this.bl.p.x > PW - 50;
    if (!sl && !sr) return;
    if (sl) { this.sc2.a++; this.aev(Math.floor(this.gt / 60), 'gl', `GOL ${this.ac}!`); }
    else { this.sc2.h++; this.aev(Math.floor(this.gt / 60), 'gl', `GOL ${this.hc}!`); }
    this.gcd = 3;
  }

  aev(mn, tp, tx) { this.evs.unshift({ mn, tp, tx }); if (this.evs.length > 40) this.evs.pop(); }

  updP(c) {
    if (!c) return;
    const gx = c.hm ? PW : 0, dist = c.p.dt(new V(gx, PH / 2));
    this.pd = {
      sh: Math.min(95, (c.d.sho / 100 * 0.6 + c.d.xG90 * 0.8) * Math.max(0, 1 - dist / 420) * 70),
      pa: c.d.passComp * (Math.max(0.5, 1 - dist / 400)),
      dr: c.d.duelWin / (c.d.duelWin + 70) * 100,
      xg: calcXG(c, c.p)
    };
  }

  render() {
    const cx = this.cx, w = this.cv.width, h = this.cv.height, sx = w / PW, sy = h / PH;
    cx.clearRect(0, 0, w, h);
    this.dPit(cx, w, h);
    cx.save();
    this.bl.tr.forEach((p, i) => { cx.fillStyle = `rgba(255,255,255,${i / this.bl.tr.length * 0.3})`; cx.beginPath(); cx.arc(p.x * sx, p.y * sy, 2, 0, Math.PI * 2); cx.fill(); });
    cx.restore();
    this.ga().forEach(p => { cx.fillStyle = 'rgba(0,0,0,0.18)'; cx.beginPath(); cx.ellipse(p.p.x * sx + 2, p.p.y * sy + 3, PR * sx * 0.8, PR * sy * 0.4, 0, 0, Math.PI * 2); cx.fill(); });
    this.hp.forEach(p => this.dPl(cx, p, sx, sy, true));
    this.ap.forEach(p => this.dPl(cx, p, sx, sy, false));
    cx.save();
    cx.fillStyle = '#fff'; cx.shadowColor = 'rgba(255,255,255,0.4)'; cx.shadowBlur = 6;
    cx.beginPath(); cx.arc(this.bl.p.x * sx, this.bl.p.y * sy, BR * sx * 1.2, 0, Math.PI * 2); cx.fill();
    cx.shadowBlur = 0; cx.restore();
    this.chkG();
  }

  dPit(cx, w, h) {
    const s = 12;
    for (let i = 0; i < s; i++) { cx.fillStyle = i % 2 ? '#1e7a36' : '#1a6b30'; cx.fillRect(i * w / s, 0, w / s + 1, h); }
    cx.strokeStyle = 'rgba(255,255,255,0.28)'; cx.lineWidth = 2;
    const m = 8;
    cx.strokeRect(m, m, w - 2 * m, h - 2 * m);
    cx.beginPath(); cx.moveTo(w / 2, m); cx.lineTo(w / 2, h - m); cx.stroke();
    cx.beginPath(); cx.arc(w / 2, h / 2, Math.min(w, h) * .11, 0, Math.PI * 2); cx.stroke();
    cx.fillStyle = 'rgba(255,255,255,0.28)'; cx.beginPath(); cx.arc(w / 2, h / 2, 3, 0, Math.PI * 2); cx.fill();
    const pw2 = w * .15, ph = h * .58, gw = w * .05, gh = h * .28;
    cx.strokeRect(m, h / 2 - ph / 2, pw2, ph); cx.strokeRect(m, h / 2 - gh / 2, gw, gh);
    cx.strokeRect(w - m - pw2, h / 2 - ph / 2, pw2, ph);
    cx.strokeRect(w - m - gw, h / 2 - gh / 2, gw, gh);
    const ghl = h * GH / PH;
    cx.strokeStyle = 'rgba(255,255,255,0.45)'; cx.lineWidth = 3;
    cx.strokeRect(0, h / 2 - ghl / 2, m, ghl);
    cx.strokeRect(w - m, h / 2 - ghl / 2, m, ghl);
  }

  dPl(cx, p, sx, sy, hm) {
    const x = p.p.x * sx, y = p.p.y * sy, r = PR * sx;
    if (p.hb) { cx.strokeStyle = hm ? '#ff6d3a' : '#40a0ff'; cx.lineWidth = 2; cx.setLineDash([3, 3]); cx.beginPath(); cx.arc(x, y, r + 4, 0, Math.PI * 2); cx.stroke(); cx.setLineDash([]); }
    const g = cx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
    g.addColorStop(0, hm ? '#ff8f5a' : '#6ab8ff'); g.addColorStop(1, hm ? '#cc4a1a' : '#2070cc');
    cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
    cx.strokeStyle = 'rgba(255,255,255,0.2)'; cx.lineWidth = 1; cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.stroke();
    cx.fillStyle = '#fff'; cx.font = `bold ${Math.round(r * .8)}px Rajdhani`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(hm ? this.hp.indexOf(p) + 1 : this.ap.indexOf(p) + 1, x, y + 1);
  }

  gm() { return Math.min(90, Math.floor(this.gt / 60)); }

  gSH() {
    const s = this.st, t = this.pt.h + this.pt.a || 1;
    s.h.pr = Math.round(this.pt.h / t * 100); s.a.pr = 100 - s.h.pr;
    const i = [
      ['Posse', s.h.pr + '%', s.a.pr + '%', s.h.pr],
      ['Finaliz.', s.h.sh, s.a.sh, s.h.sh / (s.h.sh + s.a.sh || 1) * 100],
      ['No Alvo', s.h.ot, s.a.ot, s.h.ot / (s.h.ot + s.a.ot || 1) * 100],
      ['xG', this.xg.h.toFixed(2), this.xg.a.toFixed(2), this.xg.h / (this.xg.h + this.xg.a || .01) * 100],
      ['Passes', s.h.pa, s.a.pa, s.h.pa / (s.h.pa + s.a.pa || 1) * 100],
      ['Key Pass', s.h.kr, s.a.kr, s.h.kr / (s.h.kr + s.a.kr || 1) * 100],
      ['Desarmes', s.h.tk, s.a.tk, s.h.tk / (s.h.tk + s.a.tk || 1) * 100],
      ['Pressão', s.h.pr, s.a.pr, s.h.pr / (s.h.pr + s.a.pr || 1) * 100],
      ['Corr.Prog', s.h.ps, s.a.ps, s.h.ps / (s.h.ps + s.a.ps || 1) * 100],
      ['Dist.km', s.h.dist.toFixed(1), s.a.dist.toFixed(1), s.h.dist / (s.h.dist + s.a.dist || .01) * 100]
    ];
    return i.map(([l, hv, av, pc]) =>
      `<span class="hv">${hv}</span><span class="lb">${l}</span><span class="av">${av}</span>` +
      `<div class="bw"><div class="bf hh" style="width:${pc}%"></div><div class="bf aa" style="width:${100 - pc}%"></div></div>`
    ).join('');
  }

  gEH() {
    return this.evs.map(e => {
      const ic = { gl: '<span class="ic gl"><i class="fas fa-futbol"></i></span>', sh: '<span class="ic sh"><i class="fas fa-crosshairs"></i></span>', fl: '<span class="ic fl"><i class="fas fa-exclamation-triangle"></i></span>', fm: '<span class="ic fm"><i class="fas fa-flag-checkered"></i></span>' };
      return `<div class="ev"><span class="mn">${e.mn}'</span>${ic[e.tp] || ''}<span>${e.tx}</span></div>`;
    }).join('');
  }

  gPH() {
    if (!this.pd.sh) return '<div style="grid-column:1/-1;color:var(--mt);text-align:center;padding:12px;font-size:10px">Aguardando...</div>';
    const i = [
      ['Chance Chute', this.pd.sh, 'var(--dn)'],
      ['Precisao Passe', this.pd.pa, 'var(--ob)'],
      ['Sucesso Drible', this.pd.dr, 'var(--ac)'],
      ['xG Chute', this.pd.xg * 100, 'var(--oo)']
    ];
    return i.map(([l, v, c]) =>
      `<div class="pi"><div class="pl">${l}</div><div class="pb"><div class="pf" style="width:${Math.min(100, v)}%;background:${c}"></div></div><div class="pv" style="color:${c}">${v.toFixed(1)}%</div></div>`
    ).join('');
  }
}

// === Química Ultimate Team ===
export class CH {
  static lk(a, b) {
    let p = 0;
    if (a.club === b.club) p += 3;
    else if (a.league === b.league) p += 1;
    if (a.nation === b.nation) p += 1;
    return Math.min(3, p);
  }
  static ls(f) {
    switch (f) {
      case '4-3-3': return [[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[1,5],[2,5],[2,6],[2,7],[3,7],[3,8],[4,8],[4,9],[4,10],[5,6],[6,7],[7,8],[5,9],[6,9],[7,10],[8,10],[9,10]];
      case '4-4-2': return [[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[1,5],[4,8],[5,6],[6,7],[7,8],[5,9],[6,9],[7,10],[8,10],[9,10]];
      case '3-5-2': return [[0,1],[0,2],[0,3],[1,2],[2,3],[1,4],[3,8],[4,5],[5,6],[6,7],[7,8],[4,9],[5,9],[6,9],[7,10],[8,10],[9,10]];
      case '4-2-3-1': return [[0,1],[0,2],[0,3],[0,4],[1,5],[4,7],[5,6],[5,8],[6,7],[5,9],[6,9],[7,9],[8,9],[8,10],[9,10]];
      default: return [];
    }
  }
  static calc(sq, f) {
    if (!f) f = '4-3-3';
    const sl = FMS[f].ps;
    let tl = 0, mx = 0, cs = 0;
    this.ls(f).forEach(([a, b]) => { mx += 3; if (sq[a] && sq[b]) tl += this.lk(sq[a], sq[b]); });
    sl.forEach((s, i) => { if (sq[i]) cs += pco(s, sq[i]); });
    return Math.round((mx ? tl / mx * 100 : 0) * 0.7 + cs / sl.length * 100 * 0.3);
  }
  static bst(c) { return c >= 90 ? 1.05 : c >= 70 ? 1.02 : c >= 50 ? 1 : c >= 30 ? .97 : .93; }
  static ovr(sq, c) {
    if (!sq.filter(Boolean).length) return 0;
    const b = this.bst(c);
    const o = sq.filter(Boolean).map(p => Math.round(p.ovr * b));
    return Math.round(o.reduce((a, b) => a + b, 0) / o.length);
  }
  static lc(p) { return p >= 3 ? 'var(--ac)' : p >= 2 ? 'var(--ac2)' : p >= 1 ? 'var(--oo)' : 'var(--dn)'; }
}

// === Previsor de campeonatos ===
export class TPred {
  constructor(id) {
    this.cp = COMP.find(c => c.id === id);
    this.tms = this.cp.teams.map(t => {
      const tp = gtp(t);
      const av = (k) => tp.length ? Math.round(tp.reduce((a, p) => a + p[k], 0) / tp.length * 10) / 10 : 0;
      return { name: t, ovr: gto(t), pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pl: 0, xG: av('xG90'), xA: av('xA90'), ppda: gppda(t), pas: av('passComp'), conv: av('conversion') };
    });
    this.grps = []; this.ko = []; this.win = null;
  }

  sm(t1, t2) {
    const df = (t1.ovr - t2.ovr) * 0.015 + (t1.xG - t2.xG) * 0.3 + (t1.conv - t2.conv) * 0.1;
    const p = 0.5 + df;
    const r = Math.random();
    let g1, g2;
    if (r < p * 0.4) { g1 = Math.floor(Math.random() * 3) + 1; g2 = Math.floor(Math.random() * Math.max(1, g1)); }
    else if (r < (p * 0.4 + 0.3)) { g1 = Math.floor(Math.random() * 2); g2 = g1; }
    else { g2 = Math.floor(Math.random() * 3) + 1; g1 = Math.floor(Math.random() * Math.max(1, g2)); }
    return { g1, g2 };
  }

  sL() {
    const n = this.tms.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const r = this.sm(this.tms[i], this.tms[j]);
      this.tms[i].gf += r.g1; this.tms[i].ga += r.g2; this.tms[i].pl++; this.tms[j].gf += r.g2; this.tms[j].ga += r.g1; this.tms[j].pl++;
      if (r.g1 > r.g2) { this.tms[i].pts += 3; this.tms[i].w++; this.tms[j].l++; }
      else if (r.g1 === r.g2) { this.tms[i].pts++; this.tms[i].d++; this.tms[j].pts++; this.tms[j].d++; }
      else { this.tms[j].pts += 3; this.tms[j].w++; this.tms[i].l++; }
    }
    this.tms.sort((a, b) => b.pts - a.pts || b.gf - b.ga - a.gf + a.ga || b.gf - a.gf);
    this.win = this.tms[0];
  }

  sG() {
    const n = this.tms.length, gs = 4, ng = Math.ceil(n / gs);
    this.grps = [];
    for (let g = 0; g < ng; g++) {
      const gr = [];
      for (let i = 0; i < gs; i++) { const idx = g * gs + i; if (idx < n) gr.push({ ...this.tms[idx], pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pl: 0 }); }
      for (let i = 0; i < gr.length; i++) for (let j = 0; j < gr.length; j++) {
        if (i === j) continue;
        const r = this.sm(gr[i], gr[j]);
        gr[i].gf += r.g1; gr[i].ga += r.g2; gr[i].pl++; gr[j].gf += r.g2; gr[j].ga += r.g1; gr[j].pl++;
        if (r.g1 > r.g2) { gr[i].pts += 3; gr[i].w++; gr[j].l++; }
        else if (r.g1 === r.g2) { gr[i].pts++; gr[i].d++; gr[j].pts++; gr[j].d++; }
        else { gr[j].pts += 3; gr[j].w++; gr[i].l++; }
      }
      gr.sort((a, b) => b.pts - a.pts || b.gf - b.ga - a.gf + a.ga);
      this.grps.push(gr);
    }
    const q = []; this.grps.forEach(g => { q.push(g[0], g[1]); }); return q;
  }

  sK(teams) {
    this.ko = [teams.slice()];
    let r = teams;
    while (r.length > 1) {
      const nx = [];
      for (let i = 0; i < r.length; i += 2) {
        if (i + 1 >= r.length) { nx.push(r[i]); continue; }
        const m = this.sm(r[i], r[i + 1]);
        nx.push(m.g1 >= m.g2 ? r[i] : r[i + 1]);
      }
      this.ko.push(nx);
      r = nx;
    }
    this.win = r[0];
  }

  sim() {
    if (this.cp.type === 'league') this.sL();
    else if (this.cp.type === 'groups') { const q = this.sG(); if (q.length >= 2) this.sK(q); else if (q.length) this.win = q[0]; }
    else this.sK(this.tms);
  }

  rG() {
    if (!this.grps.length) return '';
    const L = 'ABCDEFGH';
    return '<div class="gg">' + this.grps.map((g, gi) => `
      <div class="gc"><div class="gt">Grupo ${L[gi]}</div>
      <table class="gt2"><tr><th>#</th><th>Time</th><th>OVR</th><th>xG</th><th>PPDA</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GF</th><th>GA</th><th>Pts</th></tr>${
        g.map((t, i) => `<tr class="${i < 2 ? 'ql' : 'el'}"><td>${i + 1}</td><td>${t.name}</td><td style="color:${rc(t.ovr)};font-family:Rajdhani;font-weight:700">${t.ovr}</td><td style="color:var(--oo);font-family:Rajdhani;font-weight:700">${t.xG}</td><td style="color:var(--ob);font-family:Rajdhani;font-weight:700">${t.ppda}</td><td>${t.pl}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gf}</td><td>${t.ga}</td><td class="pts">${t.pts}</td></tr>`
      ).join('')
    }</div>`).join('') + '</div>';
  }

  rK() {
    if (!this.ko.length) return '';
    const rn = this.ko.length === 1 ? ['Final'] : this.ko.length === 2 ? ['Semi', 'Final'] : this.ko.length === 3 ? ['QF', 'Semi', 'Final'] : this.ko.length === 4 ? ['Oitavas', 'QF', 'Semi', 'Final'] : this.ko.map((_, i) => `R${i + 1}`);
    return '<div class="bk">' + this.ko.map((rd, ri) => {
      const ms = [];
      for (let i = 0; i < rd.length; i += 2) {
        const t1 = rd[i], t2 = rd[i + 1];
        if (!t2) ms.push(`<div class="bm"><div class="br w">${t1.name} <span style="color:var(--ac2)">${t1.ovr}</span></div><div class="br" style="color:var(--mt);text-align:center">bye</div></div>`);
        else {
          const nr = this.ko[ri + 1];
          ms.push(`<div class="bm"><div class="br ${nr && nr.includes(t1) ? 'w' : 'l'}">${t1.name} <span style="color:var(--ac2)">${t1.ovr}</span></div><div class="br ${nr && nr.includes(t2) ? 'w' : 'l'}">${t2.name} <span style="color:var(--ac2)">${t2.ovr}</span></div></div>`);
        }
      }
      return `<div class="bkr"><div class="rt">${rn[ri] || ''}</div>${ms.join('')}</div>`;
    }).join('<div style="color:var(--bd);font-size:16px;flex-shrink:0"><i class="fas fa-chevron-right"></i></div>') + '</div>';
  }

  rL() {
    return `<div class="gc" style="max-width:820px"><div class="gt">Classificação - ${this.cp.name}</div>
    <table class="gt2"><tr><th>#</th><th>Time</th><th>OVR</th><th>xG/90</th><th>PPDA</th><th>Passe%</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GF</th><th>GA</th><th>SG</th><th>Pts</th></tr>${
      this.tms.map((t, i) => `<tr class="${i < 4 ? 'ql' : i >= this.tms.length - 2 ? 'el' : ''}">
        <td>${i + 1}</td><td>${t.name}</td>
        <td style="color:${rc(t.ovr)};font-family:Rajdhani;font-weight:700">${t.ovr}</td>
        <td style="color:var(--oo);font-family:Rajdhani;font-weight:700">${t.xG}</td>
        <td style="color:var(--ob);font-family:Rajdhani;font-weight:700">${t.ppda}</td>
        <td style="font-family:Rajdhani;font-weight:700">${t.pas}</td>
        <td>${t.pl}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gf}</td><td>${t.ga}</td>
        <td style="color:${t.gf - t.ga >= 0 ? 'var(--ac)' : 'var(--dn)'};font-family:Rajdhani;font-weight:700">${t.gf - t.ga > 0 ? '+' : ''}${t.gf - t.ga}</td>
        <td class="pts">${t.pts}</td></tr>`
      ).join('')
    }</table></div>`;
  }

  render() {
    let h = '';
    if (this.cp.type === 'groups') h += this.rG();
    if (this.cp.type === 'league') h += this.rL();
    if (this.ko.length) h += this.rK();
    if (this.win) h += `<div class="pnl" style="text-align:center;padding:14px;margin-top:8px"><h2 style="color:var(--ac2);font-size:20px"><i class="fas fa-trophy" style="margin-right:6px"></i>${this.win.name}</h2><p style="color:var(--mt);font-size:12px">Campeão previsto - ${this.cp.name} <span style="color:var(--ob)">(Opta Model)</span></p></div>`;
    return h;
  }
}