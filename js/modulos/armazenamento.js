/*
 * Camada de acesso ao localStorage.
 * Centraliza o prefixo das chaves e trata erros: em janela anônima ou com
 * armazenamento cheio/bloqueado, o navegador pode lançar exceção, e o site
 * continua funcionando (apenas sem guardar os dados).
 */

const PREFIXO = 'raizes:';

export function ler(chave, padrao = null) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    return bruto === null ? padrao : JSON.parse(bruto);
  } catch {
    return padrao;
  }
}

export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* sem armazenamento disponível: nada a remover */
  }
}

// ---------- Cadastros de voluntários e doadores ----------

const CHAVE_CADASTROS = 'cadastros';

export function listarCadastros() {
  return ler(CHAVE_CADASTROS, []);
}

export function adicionarCadastro(cadastro) {
  const lista = listarCadastros();
  lista.push(cadastro);
  const ok = salvar(CHAVE_CADASTROS, lista);
  avisarMudanca();
  return ok;
}

export function excluirCadastro(id) {
  const lista = listarCadastros().filter((item) => item.id !== id);
  salvar(CHAVE_CADASTROS, lista);
  avisarMudanca();
}

export function limparCadastros() {
  remover(CHAVE_CADASTROS);
  avisarMudanca();
}

export function cpfJaCadastrado(cpfSomenteDigitos) {
  return listarCadastros().some((item) => item.cpf === cpfSomenteDigitos);
}

// Avisa o restante da aplicação (ex.: contador no menu) que a lista mudou
function avisarMudanca() {
  document.dispatchEvent(new CustomEvent('cadastros:mudou'));
}
