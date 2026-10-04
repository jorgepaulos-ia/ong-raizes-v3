/*
 * Menu principal: abre e fecha o menu hambúrguer (celular) e o submenu
 * de Projetos. O JavaScript só troca o atributo aria-expanded e uma
 * classe; toda a aparência e as transições ficam no CSS.
 */

const botaoMenu = document.querySelector('.menu-toggle');
const navegacao = document.getElementById('menu-principal');
const botaoSubmenu = document.querySelector('.submenu-toggle');

function alternarMenu(abrir) {
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  navegacao.classList.toggle('navegacao--aberta', abrir);
}

function alternarSubmenu(abrir) {
  botaoSubmenu.setAttribute('aria-expanded', String(abrir));
}

botaoMenu.addEventListener('click', () => {
  alternarMenu(botaoMenu.getAttribute('aria-expanded') !== 'true');
});

botaoSubmenu.addEventListener('click', () => {
  alternarSubmenu(botaoSubmenu.getAttribute('aria-expanded') !== 'true');
});

// Esc fecha o que estiver aberto e devolve o foco ao botão correspondente
document.addEventListener('keydown', (evento) => {
  if (evento.key !== 'Escape') return;

  if (botaoSubmenu.getAttribute('aria-expanded') === 'true') {
    alternarSubmenu(false);
    botaoSubmenu.focus();
  } else if (botaoMenu.getAttribute('aria-expanded') === 'true') {
    alternarMenu(false);
    botaoMenu.focus();
  }
});

// Clique fora do submenu o fecha (comportamento esperado de um dropdown)
document.addEventListener('click', (evento) => {
  if (!evento.target.closest('.menu__item--submenu')) {
    alternarSubmenu(false);
  }
});

// Ao clicar num link interno (ex.: projetos.html#leitura), recolhe o menu
navegacao.addEventListener('click', (evento) => {
  if (evento.target.closest('a')) {
    alternarMenu(false);
    alternarSubmenu(false);
  }
});

// Se a tela crescer até o layout de desktop, o estado do celular é zerado
window.matchMedia('(min-width: 768px)').addEventListener('change', (consulta) => {
  if (consulta.matches) alternarMenu(false);
});
