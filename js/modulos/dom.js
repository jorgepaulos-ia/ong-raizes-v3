/*
 * Utilitários para gerar HTML a partir de templates JavaScript.
 *
 * A função html`` é uma "tagged template": junta o texto do template com
 * os valores e ESCAPA tudo o que vem de fora (por exemplo, o nome digitado
 * no formulário). Isso impede que alguém injete código na página (XSS).
 * Para inserir um trecho que já é HTML gerado por outro template, ele
 * passa por html`` também e vira um objeto HtmlSeguro, que não é escapado.
 */

class HtmlSeguro {
  constructor(texto) {
    this.texto = texto;
  }

  toString() {
    return this.texto;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

function converter(valor) {
  if (valor === null || valor === undefined || valor === false) return '';
  if (valor instanceof HtmlSeguro) return valor.texto;
  if (Array.isArray(valor)) return valor.map(converter).join('');
  return escapar(valor);
}

export function html(partes, ...valores) {
  const texto = partes.reduce((acc, parte, i) => acc + parte + (i < valores.length ? converter(valores[i]) : ''), '');
  return new HtmlSeguro(texto);
}

/*
 * Gera atributos a partir de um objeto, escapando os valores:
 *   atributos({ type: 'email', required: true, maxlength: 120 })
 *   -> type="email" required maxlength="120"
 * true vira atributo booleano; false, null e undefined são omitidos.
 */
export function atributos(objeto) {
  const texto = Object.entries(objeto)
    .filter(([, valor]) => valor !== false && valor !== null && valor !== undefined)
    .map(([nome, valor]) => (valor === true ? nome : `${nome}="${escapar(valor)}"`))
    .join(' ');
  return new HtmlSeguro(texto);
}

// Atalho para buscar um elemento dentro de um contêiner
export const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
export const $$ = (seletor, contexto = document) => [...contexto.querySelectorAll(seletor)];
