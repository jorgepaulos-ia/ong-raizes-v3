/*
 * Gráficos da tela "Meus cadastros", feitos com a biblioteca Chart.js.
 *
 * Integração:
 * - A biblioteca vem da CDN jsDelivr, na versão fixa 4.5.1 (uma versão
 *   nova nunca muda o site sem aviso).
 * - É carregada com import() dinâmico SÓ quando a tela é aberta: quem
 *   nunca visita "Meus cadastros" não baixa os ~200 KB da biblioteca.
 * - Por ser um módulo ES, nada é criado no escopo global (window.Chart),
 *   evitando conflito de nomes com o restante do código.
 * - Se a CDN falhar (sem internet, bloqueio), a tela continua funcionando
 *   e os dados aparecem na tabela.
 */

const URL_CHARTJS = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm';

let carregamento = null; // guarda a Promise para baixar a biblioteca uma única vez
let graficosAtivos = [];

function carregarChartJs() {
  if (!carregamento) {
    carregamento = import(URL_CHARTJS).then(({ Chart, registerables }) => {
      Chart.register(...registerables);
      return Chart;
    });
    carregamento.catch(() => { carregamento = null; }); // permite tentar de novo
  }
  return carregamento;
}

// Cores e fonte vêm das variáveis do design system (css/tokens.css)
function lerTokens() {
  const estilo = getComputedStyle(document.documentElement);
  const token = (nome) => estilo.getPropertyValue(nome).trim();
  return {
    barra: token('--cor-primaria-700'),
    texto: token('--cor-texto'),
    textoSuave: token('--cor-texto-suave'),
    grade: token('--cor-borda'),
    fonte: token('--fonte-base'),
  };
}

function configurar(Chart, canvas, { rotulos, valores }, cores) {
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: rotulos,
      datasets: [{
        data: valores,
        backgroundColor: cores.barra,
        borderRadius: 4,
        borderSkipped: 'start', // cantos arredondados só na ponta da barra
        maxBarThickness: 28,
      }],
    },
    options: {
      indexAxis: 'y', // barras horizontais: rótulos longos ficam legíveis
      responsive: true,
      maintainAspectRatio: false,
      animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 400 },
      plugins: {
        legend: { display: false }, // uma série só: o título do gráfico já a nomeia
        tooltip: {
          callbacks: {
            label: (contexto) => `${contexto.parsed.x} ${contexto.parsed.x === 1 ? 'cadastro' : 'cadastros'}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0, color: cores.textoSuave, font: { family: cores.fonte } },
          grid: { color: cores.grade },
          border: { display: false },
        },
        y: {
          ticks: { color: cores.texto, font: { family: cores.fonte, size: 13 } },
          grid: { display: false },
        },
      },
    },
  });
}

/*
 * Desenha um gráfico por item de "series". Cada item traz o canvas e os
 * dados. Os gráficos anteriores são destruídos antes, porque a SPA recria
 * a tela a cada visita e o Chart.js mantém ouvintes ligados ao canvas.
 */
export async function desenharGraficos(series) {
  graficosAtivos.forEach((grafico) => grafico.destroy());
  graficosAtivos = [];

  const Chart = await carregarChartJs();
  const cores = lerTokens();
  graficosAtivos = series
    .filter(({ canvas }) => canvas.isConnected) // a pessoa pode ter mudado de tela
    .map(({ canvas, dados }) => configurar(Chart, canvas, dados, cores));
}
