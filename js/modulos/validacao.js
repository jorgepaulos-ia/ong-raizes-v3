/*
 * Validação do formulário de cadastro.
 *
 * Cada campo tem uma lista de regras. Uma regra é uma função que recebe o
 * valor (e o formulário, para regras que dependem de outros campos) e
 * devolve a mensagem de erro, ou uma string vazia quando está tudo certo.
 * A primeira regra que falhar define a mensagem mostrada ao usuário.
 */

import { cpfJaCadastrado } from './armazenamento.js';

// ---------- Máscaras ----------

export const somenteDigitos = (valor) => valor.replace(/\D/g, '');

export const mascaras = {
  cpf: (v) => somenteDigitos(v).slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  telefone: (v) => somenteDigitos(v).slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2'),
  cep: (v) => somenteDigitos(v).slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2'),
};

// ---------- Verificações auxiliares ----------

// Dígitos verificadores do CPF (algoritmo da Receita Federal)
export function cpfValido(cpf) {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  for (let posicao = 9; posicao <= 10; posicao++) {
    let soma = 0;
    for (let i = 0; i < posicao; i++) {
      soma += Number(d[i]) * (posicao + 1 - i);
    }
    if ((soma * 10) % 11 % 10 !== Number(d[posicao])) return false;
  }
  return true;
}

// Idade em anos completos, calculada sobre a data de hoje
export function calcularIdade(dataIso, hoje = new Date()) {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario = hoje.getMonth() + 1 < mes
    || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

// Data máxima de nascimento para ter 18 anos hoje (usada no atributo max)
export function dataLimiteMaioridade(hoje = new Date()) {
  const limite = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
  // Formata no fuso local (toISOString usaria UTC e poderia mudar o dia)
  const doisDigitos = (n) => String(n).padStart(2, '0');
  return `${limite.getFullYear()}-${doisDigitos(limite.getMonth() + 1)}-${doisDigitos(limite.getDate())}`;
}

const marcado = (form, nome) => form.querySelectorAll(`[name="${nome}"]:checked`).length > 0;
const valorMarcado = (form, nome) => form.querySelector(`[name="${nome}"]:checked`)?.value || '';
const querVoluntariar = (form) => ['voluntario', 'ambos'].includes(valorMarcado(form, 'tipo'));
const querDoar = (form) => ['doador', 'ambos'].includes(valorMarcado(form, 'tipo'));

// ---------- Regras por campo ----------

const obrigatorio = (mensagem) => (v) => (v.trim() ? '' : mensagem);

export const regras = {
  nome: [
    obrigatorio('Informe seu nome completo.'),
    (v) => (/^[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)+$/.test(v.trim()) ? '' : 'Informe nome e sobrenome, usando apenas letras.'),
  ],
  cpf: [
    obrigatorio('Informe seu CPF.'),
    (v) => (somenteDigitos(v).length === 11 ? '' : 'O CPF precisa ter 11 números.'),
    (v) => (cpfValido(v) ? '' : 'Este CPF não é válido. Confira os números digitados.'),
    (v) => (cpfJaCadastrado(somenteDigitos(v)) ? 'Já existe um cadastro com este CPF neste navegador.' : ''),
  ],
  nascimento: [
    obrigatorio('Informe sua data de nascimento.'),
    (v) => (calcularIdade(v) >= 18 ? '' : 'É preciso ter 18 anos ou mais para se cadastrar.'),
    (v) => (calcularIdade(v) <= 110 ? '' : 'Confira o ano de nascimento.'),
  ],
  email: [
    obrigatorio('Informe seu e-mail.'),
    (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido, como nome@exemplo.com.'),
  ],
  telefone: [
    obrigatorio('Informe seu celular com DDD.'),
    (v) => (/^\(\d{2}\) 9\d{4}-\d{4}$/.test(v) ? '' : 'Informe um celular válido, como (11) 91234-5678.'),
  ],
  cep: [
    obrigatorio('Informe seu CEP.'),
    (v) => (/^\d{5}-\d{3}$/.test(v) ? '' : 'O CEP precisa ter 8 números.'),
  ],
  logradouro: [obrigatorio('Informe o endereço.')],
  numero: [
    obrigatorio('Informe o número ou S/N.'),
    (v) => (/^(\d+|S\/N)$/i.test(v.trim()) ? '' : 'Use apenas números ou S/N.'),
  ],
  cidade: [obrigatorio('Informe a cidade.')],
  uf: [obrigatorio('Selecione o estado.')],
  tipo: [(_, form) => (marcado(form, 'tipo') ? '' : 'Escolha como deseja contribuir.')],
  // Regras cruzadas: dependem do que foi escolhido em "tipo"
  interesse: [(_, form) => (!querVoluntariar(form) || marcado(form, 'interesse')
    ? '' : 'Como voluntário, escolha ao menos um projeto de interesse.')],
  valor: [(v, form) => (!querDoar(form) || v ? '' : 'Escolha um valor para a doação mensal.')],
  lgpd: [(_, form) => (marcado(form, 'lgpd') ? '' : 'É preciso autorizar o uso dos dados para concluir o cadastro.')],
};

// Valida um campo pelo nome e devolve a mensagem de erro ('' se válido)
export function validarCampo(nome, form) {
  const campo = form.elements[nome];
  const valor = campo && 'value' in campo ? campo.value : '';
  for (const regra of regras[nome] || []) {
    const mensagem = regra(valor, form);
    if (mensagem) return mensagem;
  }
  return '';
}

export { querVoluntariar, querDoar };
