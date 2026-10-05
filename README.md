# Instituto Raízes do Amanhã

Projeto acadêmico das Experiências Práticas I, II e III da disciplina de Desenvolvimento Front-end. A ONG é fictícia.

Na Experiência III, o site virou uma **SPA** (Single Page Application): uma única página HTML cujo conteúdo é trocado por JavaScript, sem recarregar.

## Estrutura de pastas

```
ong-raizes-v3/
├── index.html                 redireciona para html/index.html (exigência do GitHub Pages)
├── html/
│   └── index.html             página única da SPA: cabeçalho, <main> vazio, rodapé e modais
├── css/
│   ├── tokens.css             design system: cores, tipografia, espaçamentos
│   ├── base.css               estilos dos elementos HTML
│   ├── layout.css             grid de 12 colunas e breakpoints
│   └── componentes.css        componentes no padrão BEM
├── imagens/                   logotipo e ilustrações em SVG
└── js/
    ├── main.js                ponto de entrada: registra as rotas e inicia os módulos
    ├── dados/
    │   └── conteudo.js        projetos, campanhas e listas usados pelos templates
    ├── modulos/
    │   ├── roteador.js        navegação por hash (#/projetos) sem recarregar a página
    │   ├── dom.js             função html`` que escapa dados (proteção contra XSS)
    │   ├── armazenamento.js   leitura e gravação no localStorage
    │   ├── validacao.js       máscaras e regras de cada campo
    │   ├── formulario.js      eventos do cadastro: validação, rascunho, CEP, envio
    │   ├── feedback.js        modal, confirmação e toast
    │   └── menu.js            menu hambúrguer, submenu e contador de cadastros
    └── templates/
        ├── componentes.js     badge, alerta, cartão de projeto e de campanha
        ├── inicio.js          tela Início
        ├── projetos.js        tela Projetos
        ├── cadastro.js        tela Cadastro
        ├── cadastros.js       tela Meus cadastros (dados do localStorage)
        ├── guia.js            Guia de componentes
        └── nao-encontrada.js  tela de página não encontrada (404)
```

## Rotas

| Endereço | Tela |
|---|---|
| `#/inicio` | Início |
| `#/projetos` | Projetos (aceita `#/projetos/leitura` para ir direto a uma seção) |
| `#/cadastro` | Formulário de cadastro |
| `#/cadastros` | Meus cadastros |
| `#/componentes` | Guia de componentes |

## Biblioteca externa

[Chart.js 4.5.1](https://www.chartjs.org/), carregada da CDN jsDelivr como módulo ES por `import()` dinâmico, apenas quando a tela Meus cadastros é aberta. Se a CDN não responder, os dados continuam disponíveis em tabela.

## Como executar

Os módulos JavaScript (`import`/`export`) não funcionam abrindo o arquivo direto do disco. Use um servidor local, por exemplo:

```
python3 -m http.server
```

e acesse `http://localhost:8000`. No GitHub Pages, o site funciona sem configuração.
