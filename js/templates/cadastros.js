import { html } from '../modulos/dom.js';
import { listarCadastros, excluirCadastro, limparCadastros } from '../modulos/armazenamento.js';
import { confirmar, mostrarToast } from '../modulos/feedback.js';
import { atualizar } from '../modulos/roteador.js';
import { projetos } from '../dados/conteudo.js';
import { badge } from './componentes.js';
import { desenharGraficos } from '../modulos/graficos.js';

const ROTULOS_TIPO = {
  voluntario: ['Voluntário', 'marca'],
  doador: ['Doador', 'destaque'],
  ambos: ['Voluntário e doador', 'sucesso'],
};

const nomeProjeto = (id) => projetos.find((p) => p.id === id)?.titulo || id;

// Mostra só o miolo do CPF, como fazem bancos e órgãos públicos
const cpfProtegido = (cpf) => `***.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-**`;

const dataBr = (iso) => new Date(iso).toLocaleDateString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

function cartaoCadastro(c) {
  const [rotulo, tipo] = ROTULOS_TIPO[c.tipo] || [c.tipo, 'neutra'];
  return html`
    <li class="cartao registro col-12 col-md-6">
      <div class="registro__topo">
        <h2 class="registro__nome">${c.nome}</h2>
        ${badge(rotulo, tipo)}
      </div>
      <dl class="registro__dados">
        <div><dt>CPF</dt><dd>${cpfProtegido(c.cpf)}</dd></div>
        <div><dt>Cidade</dt><dd>${c.cidade}/${c.uf}</dd></div>
        <div><dt>E-mail</dt><dd>${c.email}</dd></div>
        <div><dt>Celular</dt><dd>${c.telefone}</dd></div>
        ${c.interesses.length > 0 && html`<div><dt>Projetos</dt><dd>${c.interesses.map(nomeProjeto).join(', ')}</dd></div>`}
        ${c.valor && html`<div><dt>Doação mensal</dt><dd>${c.valor === 'outro' ? 'A combinar' : `R$ ${c.valor}`}</dd></div>`}
      </dl>
      <p class="registro__data">Cadastrado em ${dataBr(c.criadoEm)}</p>
      <button class="botao botao--perigo cartao__acao" type="button" data-excluir="${c.id}">Excluir cadastro</button>
    </li>`;
}

// ---------- Dados resumidos para os gráficos ----------

function contarPorTipo(cadastros) {
  const chaves = Object.keys(ROTULOS_TIPO);
  return {
    rotulos: chaves.map((k) => ROTULOS_TIPO[k][0]),
    valores: chaves.map((k) => cadastros.filter((c) => c.tipo === k).length),
  };
}

function contarPorProjeto(cadastros) {
  return {
    rotulos: projetos.map((p) => p.titulo),
    valores: projetos.map((p) => cadastros.filter((c) => c.interesses.includes(p.id)).length),
  };
}

// Descrição em texto do gráfico, lida pelos leitores de tela no <canvas>
const descrever = ({ rotulos, valores }) => rotulos.map((r, i) => `${r}: ${valores[i]}`).join('; ');

/*
 * Cada gráfico tem título, o <canvas> que o Chart.js desenha e uma tabela
 * com os mesmos números, para quem não enxerga o gráfico ou se a
 * biblioteca não carregar.
 */
function figuraGrafico(id, titulo, dados) {
  return html`
    <figure class="grafico cartao col-12 col-md-6">
      <figcaption class="grafico__titulo">${titulo}</figcaption>
      <div class="grafico__area">
        <canvas id="${id}" role="img" aria-label="${titulo}. ${descrever(dados)}"></canvas>
        <p class="grafico__aviso" aria-live="polite">Carregando gráfico…</p>
      </div>
      <details class="grafico__tabela">
        <summary>Ver os dados em tabela</summary>
        <table>
          <thead><tr><th scope="col">Categoria</th><th scope="col">Cadastros</th></tr></thead>
          <tbody>
            ${dados.rotulos.map((r, i) => html`<tr><th scope="row">${r}</th><td>${dados.valores[i]}</td></tr>`)}
          </tbody>
        </table>
      </details>
    </figure>`;
}

export default {
  titulo: 'Meus cadastros',

  render() {
    const cadastros = listarCadastros();
    const total = cadastros.length;

    return html`
      <div class="introducao container">
        <h1>Meus cadastros</h1>
        <p>Cadastros feitos neste navegador. Os dados ficam salvos no seu computador (localStorage) e não são enviados a nenhum servidor.</p>
      </div>

      <section class="container secao secao--colada" id="area-cadastros" aria-label="Lista de cadastros">
        ${total === 0
          ? html`
            <div class="vazio">
              <p class="vazio__titulo">Nenhum cadastro por aqui ainda.</p>
              <p>Quando você preencher o formulário, o cadastro aparece nesta lista.</p>
              <a class="botao" href="#/cadastro">Fazer meu cadastro</a>
            </div>`
          : html`
            <div class="barra-acoes">
              <p role="status">${total === 1 ? '1 cadastro salvo' : `${total} cadastros salvos`}</p>
              <div class="grupo-botoes">
                <a class="botao botao--secundario" href="#/cadastro">Novo cadastro</a>
                <button class="botao botao--perigo" type="button" data-acao="limpar-tudo">Excluir todos</button>
              </div>
            </div>
            <div class="grid graficos">
              ${figuraGrafico('grafico-tipo', 'Cadastros por forma de contribuição', contarPorTipo(cadastros))}
              ${figuraGrafico('grafico-projeto', 'Voluntários por projeto de interesse', contarPorProjeto(cadastros))}
            </div>
            <ul class="grid lista-registros">
              ${[...cadastros].reverse().map(cartaoCadastro)}
            </ul>`}
      </section>`;
  },

  montar(conteiner) {
    // Gráficos (biblioteca Chart.js, carregada sob demanda)
    const cadastros = listarCadastros();
    if (cadastros.length > 0) {
      const series = [
        { canvas: conteiner.querySelector('#grafico-tipo'), dados: contarPorTipo(cadastros) },
        { canvas: conteiner.querySelector('#grafico-projeto'), dados: contarPorProjeto(cadastros) },
      ];
      desenharGraficos(series)
        .then(() => conteiner.querySelectorAll('.grafico__aviso').forEach((aviso) => aviso.remove()))
        .catch(() => {
          conteiner.querySelectorAll('.grafico').forEach((figura) => {
            figura.classList.add('grafico--sem-grafico');
            figura.querySelector('.grafico__aviso').textContent = 'Não foi possível carregar o gráfico. Os números estão na tabela abaixo.';
            figura.querySelector('canvas').hidden = true;
            figura.querySelector('details').open = true;
          });
        });
    }

    // O ouvinte fica na seção, que é recriada a cada renderização. Se
    // ficasse no <main> (que é permanente), acumularia a cada visita.
    conteiner.querySelector('#area-cadastros').addEventListener('click', async (evento) => {
      const excluir = evento.target.closest('[data-excluir]');
      const limpar = evento.target.closest('[data-acao="limpar-tudo"]');

      if (excluir) {
        const id = Number(excluir.dataset.excluir);
        const nome = listarCadastros().find((c) => c.id === id)?.nome;
        const ok = await confirmar({
          titulo: 'Excluir cadastro?',
          texto: `O cadastro de ${nome} será apagado deste navegador. Esta ação não pode ser desfeita.`,
          botao: 'Excluir',
        });
        if (ok) {
          excluirCadastro(id);
          mostrarToast('Cadastro excluído.');
          atualizar();
        }
      }

      if (limpar) {
        const ok = await confirmar({
          titulo: 'Excluir todos os cadastros?',
          texto: 'Todos os cadastros salvos neste navegador serão apagados. Esta ação não pode ser desfeita.',
          botao: 'Excluir todos',
        });
        if (ok) {
          limparCadastros();
          mostrarToast('Todos os cadastros foram excluídos.');
          atualizar();
        }
      }
    });
  },
};
