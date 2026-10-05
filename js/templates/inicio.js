import { html } from '../modulos/dom.js';
import { indicadores } from '../dados/conteudo.js';
import { cabecalhoSecao } from './componentes.js';

export default {
  titulo: 'Início',

  render() {
    return html`
      <section class="destaque" aria-labelledby="titulo-principal">
        <div class="container grid">
          <div class="destaque__texto col-12 col-lg-6 col-xl-5">
            <h1 id="titulo-principal">Educação que transforma o futuro de quem mais precisa</h1>
            <p>Desde 2012, oferecemos reforço escolar, leitura e oficinas de tecnologia gratuitas para crianças e adolescentes de 6 a 17 anos na zona sul de São Paulo.</p>
            <div class="grupo-botoes">
              <a class="botao" href="#/cadastro">Quero ajudar</a>
              <a class="botao botao--secundario" href="#/projetos">Conheça os projetos</a>
            </div>
          </div>
          <figure class="destaque__figura col-12 col-lg-6 col-xl-7">
            <img src="../imagens/sala-de-aula.svg" alt="Ilustração de crianças estudando em mesas coletivas com uma educadora" width="640" height="360">
          </figure>
        </div>
      </section>

      <section class="secao" aria-labelledby="titulo-sobre">
        <div class="container">
          ${cabecalhoSecao('titulo-sobre', 'Quem somos', 'O Instituto Raízes do Amanhã é uma organização da sociedade civil sem fins lucrativos. Atuamos no contraturno escolar, complementando o ensino público com acompanhamento pedagógico individualizado.')}
          <div class="grid">
            <div class="cartao col-12 col-md-4">
              <h3>Missão</h3>
              <p>Reduzir a defasagem escolar de crianças e adolescentes em situação de vulnerabilidade social por meio da educação complementar.</p>
            </div>
            <div class="cartao col-12 col-md-4">
              <h3>Visão</h3>
              <p>Ser referência regional em educação complementar comunitária até 2030.</p>
            </div>
            <div class="cartao col-12 col-md-4">
              <h3>Valores</h3>
              <ul>
                <li>Respeito à individualidade de cada estudante</li>
                <li>Transparência na gestão de recursos</li>
                <li>Participação ativa das famílias e da comunidade</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="secao secao--alternada" aria-labelledby="titulo-impacto">
        <div class="container">
          ${cabecalhoSecao('titulo-impacto', 'Nosso impacto em 2025')}
          <ul class="indicadores grid">
            ${indicadores.map((item) => html`
              <li class="indicador col-12 col-sm-4"><strong class="indicador__numero">${item.numero}</strong> ${item.texto}</li>`)}
          </ul>
        </div>
      </section>

      <section class="secao" aria-labelledby="titulo-como-ajudar">
        <div class="container">
          ${cabecalhoSecao('titulo-como-ajudar', 'Como você pode ajudar')}
          <div class="grid">
            <article class="cartao col-12 col-md-6">
              <h3>Seja voluntário</h3>
              <p>Dedique duas horas por semana como educador, mentor ou apoio administrativo.</p>
              <a class="botao cartao__acao" href="#/cadastro">Cadastre-se como voluntário</a>
            </article>
            <article class="cartao col-12 col-md-6">
              <h3>Faça uma doação</h3>
              <p>Com R$ 50 por mês você custeia o material escolar de um estudante durante o ano.</p>
              <a class="botao botao--secundario cartao__acao" href="#/cadastro">Cadastre-se como doador</a>
            </article>
          </div>
        </div>
      </section>`;
  },
};
