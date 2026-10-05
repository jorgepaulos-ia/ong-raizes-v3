import { html } from '../modulos/dom.js';

export default {
  titulo: 'Página não encontrada',

  render() {
    return html`
      <div class="introducao container">
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe ou mudou de lugar.</p>
        <div class="grupo-botoes">
          <a class="botao" href="#/inicio">Voltar ao início</a>
          <a class="botao botao--secundario" href="#/projetos">Ver os projetos</a>
        </div>
      </div>`;
  },
};
