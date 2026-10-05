/*
 * Serviços de rede: comunicação com APIs externas.
 * Este é o único módulo que faz requisições HTTP. As telas não sabem qual
 * API é usada nem o formato da resposta: recebem um objeto já tratado.
 */

const TEMPO_LIMITE_MS = 5000;

/*
 * Consulta o endereço de um CEP na API pública ViaCEP.
 * Devolve { logradouro, cidade, uf } ou null se o CEP não existir.
 * Lança erro em falha de rede ou tempo esgotado, para quem chamou decidir
 * o que mostrar ao usuário.
 */
export async function buscarEnderecoPorCep(cepSomenteDigitos) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cepSomenteDigitos}/json/`, {
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  });
  if (!resposta.ok) throw new Error(`ViaCEP respondeu ${resposta.status}`);

  const dados = await resposta.json();
  if (dados.erro) return null;

  return {
    logradouro: [dados.logradouro, dados.bairro].filter(Boolean).join(', '),
    cidade: dados.localidade,
    uf: dados.uf,
  };
}
