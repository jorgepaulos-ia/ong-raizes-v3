/*
 * Máscaras de preenchimento do formulário de cadastro.
 * A validação de formato continua sendo feita pelo HTML (atributos
 * required e pattern); este script apenas formata a digitação e
 * confere os dígitos verificadores do CPF.
 */

function somenteDigitos(valor) {
  return valor.replace(/\D/g, '');
}

function mascaraCPF(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraTelefone(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function mascaraCEP(valor) {
  return somenteDigitos(valor)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

// Confere os dois dígitos verificadores do CPF (algoritmo da Receita Federal).
function cpfValido(cpf) {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  for (let pos = 9; pos <= 10; pos++) {
    let soma = 0;
    for (let i = 0; i < pos; i++) {
      soma += Number(d[i]) * (pos + 1 - i);
    }
    const digito = (soma * 10) % 11 % 10;
    if (digito !== Number(d[pos])) return false;
  }
  return true;
}

function aplicarMascara(id, mascara) {
  const campo = document.getElementById(id);
  campo.addEventListener('input', () => {
    campo.value = mascara(campo.value);
  });
}

aplicarMascara('cpf', mascaraCPF);
aplicarMascara('telefone', mascaraTelefone);
aplicarMascara('cep', mascaraCEP);

// Integra a checagem do CPF à validação nativa do navegador.
const campoCPF = document.getElementById('cpf');
campoCPF.addEventListener('input', () => {
  const completo = campoCPF.value.length === 14;
  campoCPF.setCustomValidity(
    completo && !cpfValido(campoCPF.value) ? 'CPF inválido. Confira os números digitados.' : ''
  );
});

// Envio do formulário (projeto acadêmico: nenhum dado sai do navegador).
// A validação continua nativa: o evento "submit" só dispara se todos os
// campos forem válidos. Se algum falhar, o navegador dispara "invalid".
const formulario = document.querySelector('.formulario');
const alertaErro = document.getElementById('alerta-erro');
const alertaSucesso = document.getElementById('alerta-sucesso');
const botaoEnviar = formulario.querySelector('button[type="submit"]');

formulario.addEventListener('invalid', () => {
  alertaSucesso.hidden = true;
  alertaErro.hidden = false;
}, true); // "true" captura o evento, que não sobe dos campos até o form

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  alertaErro.hidden = true;

  // Estado :disabled do botão enquanto "envia", evitando clique duplo
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = 'Enviando…';

  setTimeout(() => {
    formulario.reset();
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = 'Enviar cadastro';
    alertaSucesso.hidden = false;
    alertaSucesso.focus(); // leva o foco (e o leitor de tela) até a mensagem
  }, 1200);
});

formulario.addEventListener('reset', () => {
  alertaErro.hidden = true;
});
