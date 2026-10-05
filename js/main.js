/*
 * Ponto de entrada da aplicação. Importa os módulos, registra as rotas e
 * inicia cada parte uma única vez. Carregado com type="module", o que
 * permite os import/export e já adia a execução até o HTML estar pronto.
 */

import { iniciarRoteador } from './modulos/roteador.js';
import { iniciarMenu } from './modulos/menu.js';
import { iniciarFeedback } from './modulos/feedback.js';

import inicio from './templates/inicio.js';
import projetos from './templates/projetos.js';
import cadastro from './templates/cadastro.js';
import cadastros from './templates/cadastros.js';
import guia from './templates/guia.js';
import naoEncontrada from './templates/nao-encontrada.js';

const principal = document.getElementById('conteudo');

// O link "Pular para o conteúdo" não pode mudar o hash (o roteador o
// trataria como rota), então ele só move o foco para o <main>.
document.querySelector('.pular-conteudo').addEventListener('click', (evento) => {
  evento.preventDefault();
  principal.focus();
});

iniciarMenu();
iniciarFeedback();

iniciarRoteador({
  conteiner: principal,
  rotas: {
    inicio,
    projetos,
    cadastro,
    cadastros,
    componentes: guia,
  },
  naoEncontrada,
});
