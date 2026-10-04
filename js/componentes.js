/*
 * Componentes de feedback: modal e toast.
 * Qualquer página pode usá-los só com atributos no HTML:
 *   <button data-abrir-modal="id-do-dialog">   abre o modal
 *   <button data-fechar-modal>                  fecha o modal em que está
 *   <button data-toast="Mensagem">              mostra um toast
 *   <button data-compartilhar="#ancora">        copia o link e avisa por toast
 */

// ---------- Modal (<dialog> nativo) ----------
document.querySelectorAll('[data-abrir-modal]').forEach((botao) => {
  botao.addEventListener('click', () => {
    document.getElementById(botao.dataset.abrirModal).showModal();
  });
});

document.querySelectorAll('dialog.modal').forEach((modal) => {
  modal.addEventListener('click', (evento) => {
    // Botão de fechar, ou clique no fundo escurecido (fora da caixa)
    if (evento.target.closest('[data-fechar-modal]') || evento.target === modal) {
      modal.close();
    }
  });
});

// ---------- Toast ----------
const toast = document.getElementById('toast');
let temporizadorToast;

function mostrarToast(mensagem, tipo = 'sucesso') {
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.toggle('toast--erro', tipo === 'erro');
  toast.classList.add('toast--visivel');

  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => {
    toast.classList.remove('toast--visivel');
  }, 4000);
}

document.querySelectorAll('[data-toast]').forEach((botao) => {
  botao.addEventListener('click', () => {
    mostrarToast(botao.dataset.toast, botao.dataset.toastTipo);
  });
});

document.querySelectorAll('[data-compartilhar]').forEach((botao) => {
  botao.addEventListener('click', async () => {
    const link = location.href.split('#')[0] + botao.dataset.compartilhar;
    try {
      await navigator.clipboard.writeText(link);
      mostrarToast('Link da campanha copiado. Agora é só colar e compartilhar!');
    } catch {
      mostrarToast('Não foi possível copiar o link neste navegador.', 'erro');
    }
  });
});
