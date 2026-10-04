# Instituto Raízes do Amanhã

Projeto acadêmico das Experiências Práticas I e II, disciplina de Desenvolvimento Front-end. A ONG é fictícia.

## Páginas

- `index.html`: apresentação da ONG, missão, impacto e formas de ajudar.
- `projetos.html`: os três projetos sociais (Reforço Escolar, Clube de Leitura, Oficina de Tecnologia).
- `cadastro.html`: formulário de voluntários e doadores com validações nativas e máscaras de CPF, telefone e CEP.

## Estrutura de pastas

```
ong-raizes/
├── index.html
├── projetos.html
├── cadastro.html
├── css/
│   ├── tokens.css       (design system: cores, tipografia, espaçamentos)
│   ├── base.css         (estilos dos elementos HTML)
│   ├── layout.css       (grid de 12 colunas e breakpoints)
│   └── componentes.css  (componentes no padrão BEM, com Flexbox)
├── js/   (mascaras.js: máscaras do formulário | menu.js: menu hambúrguer e submenu)mascaras.js
└── img/  (logotipo e ilustrações em SVG)
```

## Validação

As três páginas, o CSS e as imagens SVG passam no W3C Nu Html Checker sem erros ou avisos.

## Como abrir

Basta abrir `index.html` no navegador. Nenhuma instalação é necessária.
