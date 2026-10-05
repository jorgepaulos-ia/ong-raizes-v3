/*
 * Componentes de feedback: modal, confirmação e toast.
 *
 * Numa SPA o conteúdo do <main> é trocado a cada navegação, então os
 * botões não existem quando a página carrega. Por isso os eventos são
 * escutados no document (delegação): um único ouvinte atende qualquer
 * botão com data-abrir-modal, data-toast ou data-compartilhar, mesmo os
 * criados depois pelos templates.
 */

// ---------- Toast ----------

let temporizadorToast;

export function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.toggle('toast--erro', tipo === 'erro');
  toast.classList.add('toast--visivel');

  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => toast.classList.remove('toast--visivel'), 4000);
}

// ---------- Confirmação (modal que devolve sim ou não) ----------

/*
 * Abre o modal de confirmação e devolve uma Promise que resolve com true
 * (confirmou) ou false (cancelou, Esc ou clique fora). O formulário com
 * method="dialog" fecha o <dialog> e grava em returnValue o valor do
 * botão clicado.
 */
export function confirmar({ titulo, texto, botao = 'Confirmar' }) {
  const modal = document.getElementById('modal-confirmar');
  modal.querySelector('#confirmar-titulo').textContent = titulo;
  modal.querySelector('#confirmar-texto').textContent = texto;
  modal.querySelector('[value="sim"]').textContent = botao;
  modal.returnValue = '';
  modal.showModal();

  return new Promise((resolver) => {
    modal.addEventListener('close', () => resolver(modal.returnValue === 'sim'), { once: true });
  });
}

// ---------- Ligação dos eventos (uma única vez, no início) ----------

export function iniciarFeedback() {
  document.addEventListener('click', async (evento) => {
    const abrir = evento.target.closest('[data-abrir-modal]');
    const fechar = evento.target.closest('[data-fechar-modal]');
    const toast = evento.target.closest('[data-toast]');
    const compartilhar = evento.target.closest('[data-compartilhar]');

    if (abrir) document.getElementById(abrir.dataset.abrirModal)?.showModal();
    if (fechar) fechar.closest('dialog')?.close();
    if (toast) mostrarToast(toast.dataset.toast, toast.dataset.toastTipo);

    if (compartilhar) {
      const link = location.href.split('#')[0] + compartilhar.dataset.compartilhar;
      try {
        await navigator.clipboard.writeText(link);
        mostrarToast('Link da campanha copiado. Agora é só colar e compartilhar!');
      } catch {
        mostrarToast('Não foi possível copiar o link neste navegador.', 'erro');
      }
    }
  });

  // Clique no fundo escurecido (fora da caixa) fecha qualquer modal
  document.querySelectorAll('dialog.modal').forEach((modal) => {
    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) modal.close();
    });
  });
}
