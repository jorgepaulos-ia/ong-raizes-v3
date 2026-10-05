/*
 * Roteador da SPA (Single Page Application), baseado no hash da URL.
 *
 *   #/projetos            -> rota "projetos"
 *   #/projetos/leitura    -> rota "projetos", parâmetro "leitura"
 *
 * A página nunca recarrega: a cada mudança de hash, o roteador escolhe a
 * view, gera o HTML pelo template e o coloca dentro do <main>. O hash
 * mantém os botões Voltar/Avançar e permite compartilhar o link de cada
 * tela, e funciona no GitHub Pages sem configuração de servidor.
 */

import { $, $$ } from './dom.js';

const ROTA_PADRAO = 'inicio';
const NOME_SITE = 'Instituto Raízes do Amanhã';

let rotas = {};
let viewNaoEncontrada = null;
let destino = null;
let primeiraCarga = true;

export function lerHash() {
  const caminho = location.hash.replace(/^#\/?/, '');
  const [rota = ROTA_PADRAO, parametro = null] = caminho.split('/').filter(Boolean);
  return { rota: rota || ROTA_PADRAO, parametro };
}

export function navegar(rota) {
  location.hash = `#/${rota}`;
}

function marcarMenu(rota) {
  $$('[data-rota]').forEach((link) => {
    if (link.dataset.rota === rota) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function renderizar() {
  // Hash que não é rota (ex.: link antigo #conteudo) é ignorado
  if (location.hash && !location.hash.startsWith('#/')) return;

  const { rota, parametro } = lerHash();
  const view = rotas[rota] || viewNaoEncontrada;

  destino.innerHTML = view.render(parametro).toString();
  document.title = `${view.titulo} | ${NOME_SITE}`;
  marcarMenu(rotas[rota] ? rota : null);

  // Cada view pode registrar seus próprios eventos depois de desenhada
  if (view.montar) view.montar(destino, parametro);

  // Animação de entrada (o CSS desativa para quem prefere menos movimento)
  destino.classList.remove('view--entrando');
  void destino.offsetWidth; // força o navegador a reiniciar a animação
  destino.classList.add('view--entrando');

  posicionar(parametro);
  primeiraCarga = false;
}

/*
 * Depois de trocar a tela: se houver parâmetro (ex.: #/projetos/leitura),
 * rola até aquela seção; senão volta ao topo. O foco vai para o título,
 * para que leitores de tela anunciem a nova página, como num site comum.
 */
function posicionar(parametro) {
  const alvo = parametro && document.getElementById(parametro);
  if (alvo) {
    alvo.scrollIntoView();
    alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
    return;
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  if (!primeiraCarga) {
    const titulo = $('h1', destino);
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
  }
}

export function iniciarRoteador({ conteiner, rotas: mapa, naoEncontrada }) {
  destino = conteiner;
  rotas = mapa;
  viewNaoEncontrada = naoEncontrada;

  window.addEventListener('hashchange', renderizar);

  // Primeira visita sem hash: assume a página inicial
  if (!location.hash) {
    history.replaceState(null, '', `#/${ROTA_PADRAO}`);
  }
  renderizar();
}

// Permite redesenhar a tela atual (ex.: depois de excluir um cadastro)
export function atualizar() {
  renderizar();
}
