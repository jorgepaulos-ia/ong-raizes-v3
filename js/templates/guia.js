import { html } from '../modulos/dom.js';

/*
 * Guia de componentes: referência visual e de código para quem for dar
 * manutenção no site. O conteúdo é fixo, então o template é só o HTML.
 */
export default {
  titulo: 'Guia de componentes',

  render() {
    return html`
    <div class="introducao container">
      <h1>Guia de componentes</h1>
      <p>Referência dos componentes visuais do site. Todos usam apenas as variáveis de <code>css/tokens.css</code>, e basta copiar o HTML de exemplo para reutilizá-los em novas páginas.</p>
    </div>

    <section class="secao guia" aria-labelledby="g-botoes">
      <div class="container">
        <div class="secao__cabecalho">
          <h2 id="g-botoes">Botões</h2>
          <p>Ação principal (.botao), ação secundária (.botao--secundario) e estado desabilitado (:disabled). Passe o mouse, clique e use a tecla Tab para ver os estados.</p>
        </div>
        <div class="grid">
          <div class="guia__demo col-12 col-lg-7">
            <div class="grupo-botoes">
              <button class="botao" type="button">Principal</button>
              <button class="botao botao--secundario" type="button">Secundário</button>
              <button class="botao" type="button" disabled>Desabilitado</button>
            </div>
          </div>
          <div class="col-12 col-lg-5">
            <pre class="guia__codigo"><code>&lt;button class=&quot;botao&quot;&gt;Principal&lt;/button&gt;
&lt;button class=&quot;botao botao--secundario&quot;&gt;Secundário&lt;/button&gt;
&lt;button class=&quot;botao&quot; disabled&gt;Desabilitado&lt;/button&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>
    <section class="secao guia" aria-labelledby="g-badges">
      <div class="container">
        <div class="secao__cabecalho">
          <h2 id="g-badges">Badges</h2>
          <p>Etiquetas curtas para categoria e situação. A variante .badge--status acrescenta uma bolinha indicando estado.</p>
        </div>
        <div class="grid">
          <div class="guia__demo col-12 col-lg-7">
            <ul class="lista-badges" aria-label="Exemplos de badges">
              <li><span class="badge badge--marca">Público: 6 a 14 anos</span></li>
              <li><span class="badge badge--neutra">Neutra</span></li>
              <li><span class="badge badge--destaque">Aceita itens usados</span></li>
            </ul>
            <ul class="lista-badges" aria-label="Exemplos de badges de status">
              <li><span class="badge badge--sucesso badge--status">Inscrições abertas</span></li>
              <li><span class="badge badge--destaque badge--status">Vagas limitadas</span></li>
              <li><span class="badge badge--neutra badge--status">Lista de espera</span></li>
              <li><span class="badge badge--erro badge--status">Encerrado</span></li>
            </ul>
          </div>
          <div class="col-12 col-lg-5">
            <pre class="guia__codigo"><code>&lt;span class=&quot;badge badge--marca&quot;&gt;Categoria&lt;/span&gt;
&lt;span class=&quot;badge badge--sucesso badge--status&quot;&gt;
  Inscrições abertas
&lt;/span&gt;
&lt;!-- variantes: --neutra --marca --destaque
     --sucesso --erro | modificador: --status --&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>
    <section class="secao guia" aria-labelledby="g-alertas">
      <div class="container">
        <div class="secao__cabecalho">
          <h2 id="g-alertas">Alertas</h2>
          <p>Mensagens contextuais fixas na página. Cada tipo combina cor, ícone e texto, para não depender só da cor.</p>
        </div>
        <div class="grid">
          <div class="guia__demo col-12 col-lg-7">
            <div class="formulario">
              <div class="alerta alerta--info"><p>Informação: a próxima formação de voluntários acontece em novembro.</p></div>
              <div class="alerta alerta--sucesso"><p>Sucesso: cadastro recebido! Entraremos em contato em breve.</p></div>
              <div class="alerta alerta--aviso"><p>Aviso: restam poucas vagas no Clube de Leitura.</p></div>
              <div class="alerta alerta--erro"><p>Erro: alguns campos precisam de atenção.</p></div>
            </div>
          </div>
          <div class="col-12 col-lg-5">
            <pre class="guia__codigo"><code>&lt;div class=&quot;alerta alerta--sucesso&quot; role=&quot;status&quot;&gt;
  &lt;p&gt;Cadastro recebido!&lt;/p&gt;
&lt;/div&gt;
&lt;!-- variantes: --info --sucesso --aviso --erro
     use role=&quot;alert&quot; para erros urgentes --&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>
    <section class="secao guia" aria-labelledby="g-modal">
      <div class="container">
        <div class="secao__cabecalho">
          <h2 id="g-modal">Modal</h2>
          <p>Janela sobreposta para conteúdo que exige atenção. Usa o elemento nativo &lt;dialog&gt;: prende o foco, fecha com Esc e devolve o foco ao botão de origem.</p>
        </div>
        <div class="grid">
          <div class="guia__demo col-12 col-lg-7">
            <button class="botao" type="button" data-abrir-modal="modal-exemplo">Abrir modal de exemplo</button>
          </div>
          <div class="col-12 col-lg-5">
            <pre class="guia__codigo"><code>&lt;button data-abrir-modal=&quot;meu-modal&quot;&gt;Abrir&lt;/button&gt;

&lt;dialog class=&quot;modal&quot; id=&quot;meu-modal&quot;
        aria-labelledby=&quot;meu-titulo&quot;&gt;
  &lt;div class=&quot;modal__cabecalho&quot;&gt;
    &lt;h2 id=&quot;meu-titulo&quot;&gt;Título&lt;/h2&gt;
    &lt;button class=&quot;botao-fechar&quot; data-fechar-modal
            aria-label=&quot;Fechar&quot;&gt;&amp;times;&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class=&quot;modal__corpo&quot;&gt;...&lt;/div&gt;
  &lt;div class=&quot;modal__rodape&quot;&gt;...&lt;/div&gt;
&lt;/dialog&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>
    <section class="secao guia" aria-labelledby="g-toast">
      <div class="container">
        <div class="secao__cabecalho">
          <h2 id="g-toast">Toast</h2>
          <p>Notificação rápida e não obstrutiva no canto da tela. Some sozinha após quatro segundos e é anunciada por leitores de tela (role="status").</p>
        </div>
        <div class="grid">
          <div class="guia__demo col-12 col-lg-7">
            <div class="grupo-botoes">
              <button class="botao" type="button" data-toast="Link da campanha copiado!">Mostrar toast de sucesso</button>
              <button class="botao botao--secundario" type="button" data-toast="Não foi possível copiar o link." data-toast-tipo="erro">Mostrar toast de erro</button>
            </div>
          </div>
          <div class="col-12 col-lg-5">
            <pre class="guia__codigo"><code>&lt;div class=&quot;toast&quot; id=&quot;toast&quot; role=&quot;status&quot;
     aria-live=&quot;polite&quot;&gt;&lt;/div&gt;

&lt;button data-toast=&quot;Mensagem&quot;&gt;Mostrar&lt;/button&gt;
&lt;button data-toast=&quot;Falhou&quot; data-toast-tipo=&quot;erro&quot;&gt;
  Mostrar erro
&lt;/button&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <dialog class="modal" id="modal-exemplo" aria-labelledby="titulo-modal-exemplo">
    <div class="modal__cabecalho">
      <h2 id="titulo-modal-exemplo">Confirme sua inscrição</h2>
      <button class="botao-fechar" type="button" data-fechar-modal aria-label="Fechar">&times;</button>
    </div>
    <div class="modal__corpo">
      <ul class="lista-badges" aria-label="Situação">
        <li><span class="badge badge--sucesso badge--status">Inscrições abertas</span></li>
        <li><span class="badge badge--marca">Formação de voluntários</span></li>
      </ul>
      <p>Você está se inscrevendo na formação inicial de voluntários, com quatro horas de duração, no sábado, 21 de novembro, das 9h às 13h.</p>
      <div class="alerta alerta--aviso">
        <p>Leve um documento com foto no dia da formação.</p>
      </div>
    </div>
    <div class="modal__rodape">
      <button class="botao botao--secundario" type="button" data-fechar-modal>Cancelar</button>
      <button class="botao" type="button" data-fechar-modal data-toast="Inscrição confirmada!">Confirmar</button>
    </div>
  </dialog>
`;
  },
};
