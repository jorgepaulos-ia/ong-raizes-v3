/*
 * Componentes reutilizáveis: pequenas funções que recebem dados e devolvem
 * HTML. Usadas por várias views, garantem que o mesmo cartão ou badge seja
 * sempre gerado do mesmo jeito.
 */

import { html } from '../modulos/dom.js';

export function badge(texto, tipo = 'marca', comStatus = false) {
  return html`<span class="badge badge--${tipo}${comStatus ? ' badge--status' : ''}">${texto}</span>`;
}

export function alerta(texto, tipo = 'info') {
  return html`<div class="alerta alerta--${tipo}"><p>${texto}</p></div>`;
}

export function cabecalhoSecao(id, titulo, descricao = '') {
  return html`
    <div class="secao__cabecalho">
      <h2 id="${id}">${titulo}</h2>
      ${descricao && html`<p>${descricao}</p>`}
    </div>`;
}

export function cartaoProjeto(projeto) {
  return html`
    <article id="${projeto.id}" class="projeto col-12 col-md-6 col-lg-4">
      <figure class="projeto__figura">
        <img src="../imagens/${projeto.imagem}" alt="${projeto.alt}" width="320" height="200">
        <figcaption class="projeto__legenda">${projeto.legenda}</figcaption>
      </figure>
      <div class="projeto__corpo">
        <header class="projeto__cabecalho">
          <h3>${projeto.titulo}</h3>
          <ul class="lista-badges" aria-label="Situação do projeto">
            <li>${badge(`Público: ${projeto.publico}`)}</li>
            <li>${badge(projeto.status.texto, projeto.status.tipo, true)}</li>
          </ul>
        </header>
        <p>${projeto.descricao}</p>
        <h4>Resultados</h4>
        <ul>
          ${projeto.resultados.map((r) => html`<li>${r}</li>`)}
        </ul>
      </div>
    </article>`;
}

export function cartaoCampanha(campanha) {
  const percentual = Math.round((campanha.arrecadado / campanha.meta) * 100);
  const formatar = (n) => (campanha.unidade === 'reais'
    ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : `${n} ${campanha.unidade}`);
  const idMeta = `meta-${campanha.id}`;

  return html`
    <article class="cartao campanha col-12 col-md-6">
      <ul class="lista-badges" aria-label="Situação da campanha">
        <li>${badge('Em andamento', 'sucesso', true)}</li>
        <li>${badge(campanha.prazo, campanha.unidade === 'reais' ? 'marca' : 'destaque')}</li>
      </ul>
      <h3>${campanha.titulo}</h3>
      <p>${campanha.descricao}</p>
      <p class="campanha__meta">
        <label for="${idMeta}">Arrecadado: ${formatar(campanha.arrecadado)} de ${formatar(campanha.meta)}</label>
        <span aria-hidden="true">${percentual}%</span>
      </p>
      <progress id="${idMeta}" max="${campanha.meta}" value="${campanha.arrecadado}">${percentual}%</progress>
      <button class="botao botao--secundario cartao__acao" type="button" data-compartilhar="#/projetos/doacoes">Compartilhar campanha</button>
    </article>`;
}
