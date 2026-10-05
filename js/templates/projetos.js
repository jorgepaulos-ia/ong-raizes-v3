import { html } from '../modulos/dom.js';
import { projetos, campanhas, perfisVoluntariado, etapasVoluntariado } from '../dados/conteudo.js';
import { cabecalhoSecao, cartaoProjeto, cartaoCampanha, alerta } from './componentes.js';

const atalhos = [
  ...projetos.map((p) => ({ id: p.id, texto: p.titulo })),
  { id: 'voluntariado', texto: 'Como ser voluntário' },
  { id: 'doacoes', texto: 'Campanhas de doação' },
];

export default {
  titulo: 'Projetos',

  render() {
    return html`
      <div class="introducao container">
        <h1>Nossos projetos sociais</h1>
        <p>Três frentes de atuação, todas gratuitas e realizadas no contraturno escolar.</p>
        <nav class="sumario" aria-label="Sumário dos projetos">
          <ul class="sumario__lista">
            ${atalhos.map((a) => html`<li><a class="sumario__link" href="#/projetos/${a.id}">${a.texto}</a></li>`)}
          </ul>
        </nav>
      </div>

      <section class="secao" aria-labelledby="titulo-em-andamento">
        <div class="container">
          ${cabecalhoSecao('titulo-em-andamento', 'Projetos em andamento')}
          <div class="grid">
            ${projetos.map(cartaoProjeto)}
          </div>
        </div>
      </section>

      <section id="voluntariado" class="secao secao--alternada" aria-labelledby="titulo-voluntariado">
        <div class="container">
          <div class="secao__cabecalho">
            <h2 id="titulo-voluntariado">Como ser voluntário</h2>
            <p>Não é preciso ser professor. Buscamos pessoas maiores de 18 anos com disponibilidade mínima de duas horas por semana.</p>
            ${alerta('A próxima formação de voluntários acontece em novembro. Inscrições abertas até o dia 20.')}
          </div>
          <div class="grid">
            <div class="col-12 col-md-6">
              <h3>Perfis de voluntariado</h3>
              <dl class="perfis">
                ${perfisVoluntariado.map((p) => html`<div><dt>${p.titulo}</dt><dd>${p.texto}</dd></div>`)}
              </dl>
            </div>
            <div class="col-12 col-md-6">
              <h3>Etapas para começar</h3>
              <ol class="etapas">
                ${etapasVoluntariado.map((etapa) => html`<li>${etapa}</li>`)}
              </ol>
              <a class="botao" href="#/cadastro">Quero me cadastrar</a>
            </div>
          </div>
        </div>
      </section>

      <section id="doacoes" class="secao" aria-labelledby="titulo-doacoes">
        <div class="container">
          ${cabecalhoSecao('titulo-doacoes', 'Campanhas de doação', 'Toda doação é destinada a uma campanha com meta e prazo definidos, e o resultado é publicado ao final.')}
          <div class="grid">
            ${campanhas.map(cartaoCampanha)}
            <div class="col-12 col-md-6">
              <h3>Formas de doar</h3>
              <ul>
                <li><strong>Doação mensal:</strong> a partir de R$ 30, com débito automático.</li>
                <li><strong>Doação única:</strong> qualquer valor, destinado à campanha de sua escolha.</li>
                <li><strong>Doação de itens:</strong> livros, material escolar e computadores.</li>
              </ul>
            </div>
            <div class="col-12 col-md-6">
              <h3>Transparência</h3>
              <p>Publicamos anualmente o relatório de atividades e o balanço financeiro, auditados por empresa independente.</p>
              <a class="botao" href="#/cadastro">Cadastre-se como voluntário ou doador</a>
            </div>
          </div>
        </div>
      </section>`;
  },
};
