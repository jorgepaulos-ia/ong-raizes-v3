/*
 * Comportamento do formulário de cadastro: eventos, feedback de validação,
 * campos condicionais, busca de CEP, rascunho automático e gravação no
 * localStorage. As regras de validação ficam em validacao.js.
 */

import { $, $$ } from './dom.js';
import { mascaras, somenteDigitos, validarCampo, querVoluntariar, querDoar } from './validacao.js';
import { ler, salvar, remover, adicionarCadastro } from './armazenamento.js';
import { mostrarToast } from './feedback.js';
import { navegar } from './roteador.js';

const CHAVE_RASCUNHO = 'rascunho-cadastro';
const CAMPOS = ['nome', 'cpf', 'nascimento', 'email', 'telefone', 'cep', 'logradouro',
  'numero', 'cidade', 'uf', 'tipo', 'interesse', 'valor', 'lgpd'];

// ---------- Feedback visual de cada campo ----------

function elementosDoCampo(form, nome) {
  const lista = form.elements[nome];
  if (!lista) return [];
  return lista instanceof RadioNodeList ? [...lista] : [lista];
}

function mostrarResultado(form, nome, mensagem) {
  const erro = $(`#erro-${nome}`, form);
  if (erro) {
    erro.textContent = mensagem;
    erro.hidden = !mensagem;
  }
  elementosDoCampo(form, nome).forEach((el) => {
    if (mensagem) {
      el.setAttribute('aria-invalid', 'true');
      el.removeAttribute('data-valido');
    } else {
      el.removeAttribute('aria-invalid');
      // Só marca como "válido" (borda verde) campos de texto preenchidos
      if (el.classList.contains('campo__entrada') && el.value) el.setAttribute('data-valido', '');
    }
  });
}

function validarEMostrar(form, nome) {
  const mensagem = validarCampo(nome, form);
  mostrarResultado(form, nome, mensagem);
  return mensagem;
}

function limparFeedback(form) {
  CAMPOS.forEach((nome) => mostrarResultado(form, nome, ''));
  $$('[data-valido]', form).forEach((el) => el.removeAttribute('data-valido'));
  $('#resumo-erros', form).hidden = true;
}

// ---------- Resumo de erros no topo do formulário ----------

function mostrarResumo(form, erros) {
  const resumo = $('#resumo-erros', form);
  $('#resumo-erros-titulo', form).textContent = erros.length === 1
    ? 'Falta corrigir 1 campo para concluir o cadastro:'
    : `Faltam corrigir ${erros.length} campos para concluir o cadastro:`;

  const lista = $('.resumo-erros__lista', form);
  lista.replaceChildren(...erros.map(({ nome, mensagem }) => {
    const item = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'link-botao';
    botao.dataset.focar = nome;
    botao.textContent = mensagem;
    item.append(botao);
    return item;
  }));

  resumo.hidden = false;
  resumo.focus();
}

// ---------- Campos que aparecem conforme a escolha ----------

function atualizarCondicionais(form) {
  const grupoInteresse = $('#grupo-interesse', form);
  const grupoDoacao = $('#grupo-doacao', form);
  grupoInteresse.hidden = !querVoluntariar(form);
  grupoDoacao.hidden = !querDoar(form);
  // Campo escondido não deve ser enviado nem validado
  grupoInteresse.disabled = grupoInteresse.hidden;
  grupoDoacao.disabled = grupoDoacao.hidden;
}

// ---------- Busca de endereço pelo CEP (API pública ViaCEP) ----------

async function buscarCep(form) {
  const cep = somenteDigitos(form.elements.cep.value);
  const ajuda = $('#ajuda-cep', form);
  if (cep.length !== 8) return;

  ajuda.textContent = 'Buscando endereço…';
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: AbortSignal.timeout(5000) });
    const dados = await resposta.json();
    if (dados.erro) throw new Error('CEP inexistente');

    const preencher = (nome, valor) => {
      if (valor && !form.elements[nome].value) {
        form.elements[nome].value = valor;
        validarEMostrar(form, nome);
      }
    };
    preencher('logradouro', [dados.logradouro, dados.bairro].filter(Boolean).join(', '));
    preencher('cidade', dados.localidade);
    preencher('uf', dados.uf);
    ajuda.textContent = 'Endereço preenchido pelo CEP. Confira e informe o número.';
    salvarRascunho(form);
  } catch {
    ajuda.textContent = 'Não encontramos este CEP. Preencha o endereço manualmente.';
  }
}

// ---------- Rascunho automático (localStorage) ----------

function lerFormulario(form) {
  const dados = {};
  CAMPOS.concat('mensagem').forEach((nome) => {
    const el = form.elements[nome];
    if (!el) return;
    if (el instanceof RadioNodeList || el.type === 'checkbox') {
      const marcados = $$(`[name="${nome}"]:checked`, form).map((c) => c.value);
      dados[nome] = nome === 'tipo' ? (marcados[0] || '') : marcados;
    } else {
      dados[nome] = el.value;
    }
  });
  return dados;
}

function salvarRascunho(form) {
  const dados = lerFormulario(form);
  delete dados.lgpd; // consentimento deve ser dado de novo, conscientemente
  salvar(CHAVE_RASCUNHO, dados);
}

function restaurarRascunho(form) {
  const dados = ler(CHAVE_RASCUNHO);
  const temConteudo = dados && Object.values(dados).some((v) => (Array.isArray(v) ? v.length : v));
  if (!temConteudo) return;

  Object.entries(dados).forEach(([nome, valor]) => {
    if (Array.isArray(valor) || nome === 'tipo') {
      const valores = [].concat(valor);
      $$(`[name="${nome}"]`, form).forEach((c) => { c.checked = valores.includes(c.value); });
    } else if (form.elements[nome]) {
      form.elements[nome].value = valor;
    }
  });
  $('#alerta-rascunho', form).hidden = false;
}

function atualizarContador(form) {
  const total = form.elements.mensagem.value.length;
  $('#contador-mensagem', form).textContent = `${total} de 500 caracteres`;
}

// ---------- Ligação dos eventos ----------

export function montarFormulario(form) {
  let temporizador;
  const tentouEnviar = () => form.dataset.enviado === 'true';

  restaurarRascunho(form);
  atualizarCondicionais(form);
  atualizarContador(form);

  // Máscaras e rascunho enquanto digita
  form.addEventListener('input', (evento) => {
    const el = evento.target;
    if (mascaras[el.name]) el.value = mascaras[el.name](el.value);
    if (el.name === 'mensagem') atualizarContador(form);

    // Depois do primeiro erro, a mensagem some assim que o campo fica certo
    if (el.getAttribute('aria-invalid') === 'true' || tentouEnviar()) validarEMostrar(form, el.name);

    clearTimeout(temporizador);
    temporizador = setTimeout(() => salvarRascunho(form), 400);
  });

  // Rádios, caixas e selects: valida e reage na hora da escolha
  form.addEventListener('change', (evento) => {
    const { name } = evento.target;
    if (name === 'tipo') {
      atualizarCondicionais(form);
      validarEMostrar(form, 'tipo');
      if (tentouEnviar()) ['interesse', 'valor'].forEach((n) => validarEMostrar(form, n));
    } else if (['interesse', 'valor', 'lgpd', 'uf'].includes(name)) {
      validarEMostrar(form, name);
    }
    salvarRascunho(form);
  });

  // Ao sair de um campo de texto preenchido, valida e mostra o resultado
  form.addEventListener('focusout', (evento) => {
    const el = evento.target;
    if (!el.classList.contains('campo__entrada') || !CAMPOS.includes(el.name)) return;
    if (el.value || tentouEnviar()) validarEMostrar(form, el.name);
    if (el.name === 'cep' && !validarCampo('cep', form)) buscarCep(form);
  });

  // Cliques em botões internos: descartar rascunho e links do resumo de erros
  form.addEventListener('click', (evento) => {
    const descartar = evento.target.closest('[data-acao="descartar-rascunho"]');
    const focar = evento.target.closest('[data-focar]');
    if (descartar) {
      form.reset();
    } else if (focar) {
      const alvo = elementosDoCampo(form, focar.dataset.focar)[0];
      alvo?.scrollIntoView({ block: 'center' });
      alvo?.focus({ preventScroll: true });
    }
  });

  form.addEventListener('reset', () => {
    remover(CHAVE_RASCUNHO);
    delete form.dataset.enviado;
    // O reset do navegador acontece depois deste evento; esperamos um ciclo
    setTimeout(() => {
      limparFeedback(form);
      atualizarCondicionais(form);
      atualizarContador(form);
      $('#alerta-rascunho', form).hidden = true;
      $('#ajuda-cep', form).textContent = 'O endereço é preenchido automaticamente.';
    });
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    form.dataset.enviado = 'true';

    const erros = CAMPOS
      .filter((nome) => !(nome === 'interesse' && !querVoluntariar(form)) && !(nome === 'valor' && !querDoar(form)))
      .map((nome) => ({ nome, mensagem: validarEMostrar(form, nome) }))
      .filter((item) => item.mensagem);

    if (erros.length) {
      mostrarResumo(form, erros);
      return;
    }

    const dados = lerFormulario(form);
    const botao = $('button[type="submit"]', form);
    botao.disabled = true;
    botao.textContent = 'Salvando…';

    const salvou = adicionarCadastro({
      id: Date.now(),
      nome: dados.nome.trim(),
      cpf: somenteDigitos(dados.cpf),
      email: dados.email.trim(),
      telefone: dados.telefone,
      cidade: dados.cidade.trim(),
      uf: dados.uf,
      tipo: dados.tipo,
      interesses: querVoluntariar(form) ? dados.interesse : [],
      valor: querDoar(form) ? dados.valor : '',
      criadoEm: new Date().toISOString(),
    });

    // Pequena pausa só para o usuário perceber o estado "Salvando…"
    setTimeout(() => {
      if (!salvou) {
        botao.disabled = false;
        botao.textContent = 'Enviar cadastro';
        mostrarToast('Não foi possível salvar: o armazenamento do navegador está indisponível.', 'erro');
        return;
      }
      remover(CHAVE_RASCUNHO);
      mostrarToast(`Cadastro de ${dados.nome.trim().split(' ')[0]} salvo com sucesso!`);
      navegar('cadastros');
    }, 600);
  });
}
