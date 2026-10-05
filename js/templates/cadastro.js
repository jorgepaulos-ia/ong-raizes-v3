import { html, atributos } from '../modulos/dom.js';
import { estados, projetos } from '../dados/conteudo.js';
import { dataLimiteMaioridade } from '../modulos/validacao.js';
import { montarFormulario } from '../modulos/formulario.js';

const obrigatorio = html`<span class="obrigatorio" aria-hidden="true">*</span>`;

/*
 * Template de um campo de texto. Cada campo tem um parágrafo de erro
 * próprio (erro-<id>), ligado ao input por aria-describedby, para que o
 * leitor de tela leia a mensagem junto com o rótulo.
 */
function campo({ id, rotulo, colunas = 'col-12', ajuda = '', ...attrs }) {
  const descricao = [ajuda && `ajuda-${id}`, `erro-${id}`].filter(Boolean).join(' ');
  return html`
    <div class="campo ${colunas}">
      <label class="campo__rotulo" for="${id}">${rotulo} ${obrigatorio}</label>
      <input class="campo__entrada" ${atributos({ id, name: id, type: 'text', 'aria-describedby': descricao, ...attrs })}>
      ${ajuda && html`<p id="ajuda-${id}" class="campo__ajuda" aria-live="polite">${ajuda}</p>`}
      <p id="erro-${id}" class="campo__erro" hidden></p>
    </div>`;
}

function opcao(tipo, nome, valor, rotulo) {
  const id = `${nome}-${valor}`;
  return html`
    <div class="opcao">
      <input type="${tipo}" id="${id}" name="${nome}" value="${valor}">
      <label for="${id}">${rotulo}</label>
    </div>`;
}

export default {
  titulo: 'Cadastro',

  render() {
    return html`
      <div class="introducao container">
        <h1>Cadastro de voluntários e doadores</h1>
        <p>Preencha o formulário abaixo. Campos marcados com ${obrigatorio} são obrigatórios. O preenchimento é salvo automaticamente neste navegador enquanto você digita.</p>
      </div>

      <div class="container secao secao--colada">
        <div class="grid">
          <form class="formulario col-12 col-lg-8" id="form-cadastro" novalidate>
            <div class="alerta alerta--info" id="alerta-rascunho" hidden>
              <p>Recuperamos o preenchimento que você não terminou. <button type="button" class="link-botao" data-acao="descartar-rascunho">Descartar e começar de novo</button></p>
            </div>

            <div class="alerta alerta--erro resumo-erros" id="resumo-erros" role="alert" tabindex="-1" hidden>
              <div>
                <p id="resumo-erros-titulo"></p>
                <ul class="resumo-erros__lista"></ul>
              </div>
            </div>

            <fieldset class="formulario__grupo">
              <legend class="formulario__legenda">Dados pessoais</legend>
              <div class="grid">
                ${campo({ id: 'nome', rotulo: 'Nome completo', autocomplete: 'name', maxlength: 100 })}
                ${campo({ id: 'cpf', rotulo: 'CPF', colunas: 'col-12 col-md-6', inputmode: 'numeric', maxlength: 14, placeholder: '000.000.000-00', ajuda: 'Somente números; a formatação é automática.' })}
                ${campo({ id: 'nascimento', rotulo: 'Data de nascimento', colunas: 'col-12 col-md-6', type: 'date', autocomplete: 'bday', min: '1916-01-01', max: dataLimiteMaioridade(), ajuda: 'É preciso ter 18 anos ou mais.' })}
              </div>
            </fieldset>

            <fieldset class="formulario__grupo">
              <legend class="formulario__legenda">Contato</legend>
              <div class="grid">
                ${campo({ id: 'email', rotulo: 'E-mail', colunas: 'col-12 col-md-6', type: 'email', autocomplete: 'email', maxlength: 120, placeholder: 'nome@exemplo.com' })}
                ${campo({ id: 'telefone', rotulo: 'Telefone celular', colunas: 'col-12 col-md-6', type: 'tel', autocomplete: 'tel', maxlength: 15, placeholder: '(11) 91234-5678' })}
              </div>
            </fieldset>

            <fieldset class="formulario__grupo">
              <legend class="formulario__legenda">Endereço</legend>
              <div class="grid">
                ${campo({ id: 'cep', rotulo: 'CEP', colunas: 'col-12 col-md-4', inputmode: 'numeric', autocomplete: 'postal-code', maxlength: 9, placeholder: '00000-000', ajuda: 'O endereço é preenchido automaticamente.' })}
                ${campo({ id: 'logradouro', rotulo: 'Endereço', colunas: 'col-12 col-md-8', autocomplete: 'address-line1', maxlength: 150 })}
                ${campo({ id: 'numero', rotulo: 'Número', colunas: 'col-12 col-md-3', maxlength: 6, ajuda: 'Números ou S/N.' })}
                ${campo({ id: 'cidade', rotulo: 'Cidade', colunas: 'col-12 col-md-5', autocomplete: 'address-level2', maxlength: 80 })}
                <div class="campo col-12 col-md-4">
                  <label class="campo__rotulo" for="uf">Estado ${obrigatorio}</label>
                  <select class="campo__entrada" id="uf" name="uf" autocomplete="address-level1" aria-describedby="erro-uf">
                    <option value="">Selecione</option>
                    ${estados.map(([sigla, nome]) => html`<option value="${sigla}">${nome}</option>`)}
                  </select>
                  <p id="erro-uf" class="campo__erro" hidden></p>
                </div>
              </div>
            </fieldset>

            <fieldset class="formulario__grupo" aria-describedby="erro-tipo">
              <legend class="formulario__legenda">Como deseja contribuir? ${obrigatorio}</legend>
              <div class="opcoes">
                ${opcao('radio', 'tipo', 'voluntario', 'Voluntário')}
                ${opcao('radio', 'tipo', 'doador', 'Doador')}
                ${opcao('radio', 'tipo', 'ambos', 'Voluntário e doador')}
              </div>
              <p id="erro-tipo" class="campo__erro" hidden></p>
            </fieldset>

            <fieldset class="formulario__grupo" id="grupo-interesse" aria-describedby="ajuda-interesse erro-interesse" hidden>
              <legend class="formulario__legenda">Projetos de interesse ${obrigatorio}</legend>
              <p id="ajuda-interesse" class="campo__ajuda">Escolha um ou mais projetos em que gostaria de atuar.</p>
              <div class="opcoes">
                ${projetos.map((p) => opcao('checkbox', 'interesse', p.id, p.titulo))}
              </div>
              <p id="erro-interesse" class="campo__erro" hidden></p>
            </fieldset>

            <fieldset class="formulario__grupo" id="grupo-doacao" hidden>
              <legend class="formulario__legenda">Doação mensal</legend>
              <div class="campo">
                <label class="campo__rotulo" for="valor">Valor que pretende doar por mês ${obrigatorio}</label>
                <select class="campo__entrada" id="valor" name="valor" aria-describedby="erro-valor">
                  <option value="">Selecione</option>
                  <option value="30">R$ 30</option>
                  <option value="50">R$ 50 (material escolar de um estudante)</option>
                  <option value="100">R$ 100</option>
                  <option value="outro">Outro valor (combinamos por e-mail)</option>
                </select>
                <p id="erro-valor" class="campo__erro" hidden></p>
              </div>
            </fieldset>

            <div class="campo">
              <label class="campo__rotulo" for="mensagem">Conte um pouco sobre você (opcional)</label>
              <textarea class="campo__entrada" id="mensagem" name="mensagem" rows="4" maxlength="500" aria-describedby="contador-mensagem"></textarea>
              <p id="contador-mensagem" class="campo__ajuda">0 de 500 caracteres</p>
            </div>

            <div>
              <div class="opcao opcao--consentimento">
                <input type="checkbox" id="lgpd" name="lgpd" aria-describedby="erro-lgpd">
                <label for="lgpd">Autorizo o uso dos meus dados para contato, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). ${obrigatorio}</label>
              </div>
              <p id="erro-lgpd" class="campo__erro" hidden></p>
            </div>

            <p class="campo__ajuda">Quer saber exatamente como usamos seus dados? <button type="button" class="link-botao" data-abrir-modal="modal-privacidade">Leia a política de privacidade</button>.</p>

            <div class="grupo-botoes">
              <button type="submit" class="botao">Enviar cadastro</button>
              <button type="reset" class="botao botao--secundario">Limpar</button>
            </div>
          </form>

          <div class="col-12 col-lg-4">
            <div class="cartao painel">
              <h2 class="painel__titulo">Por que pedimos esses dados?</h2>
              <ul>
                <li>O CPF evita cadastros duplicados.</li>
                <li>E-mail e telefone são usados só para o contato da nossa equipe.</li>
                <li>O endereço nos ajuda a indicar o projeto mais próximo de você.</li>
              </ul>
              <p>Neste projeto acadêmico, os dados ficam apenas no seu navegador. Você pode vê-los e apagá-los em <a href="#/cadastros">Meus cadastros</a>.</p>
            </div>
          </div>
        </div>
      </div>`;
  },

  montar(conteiner) {
    montarFormulario(conteiner.querySelector('#form-cadastro'));
  },
};
