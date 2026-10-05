/*
 * Dados do site. Os templates leem daqui para montar os cartões, então
 * incluir um projeto ou uma campanha nova não exige mexer em HTML.
 */

export const projetos = [
  {
    id: 'reforco',
    titulo: 'Reforço Escolar',
    publico: '6 a 14 anos',
    status: { texto: 'Inscrições abertas', tipo: 'sucesso' },
    imagem: 'reforco.svg',
    alt: 'Ilustração de um caderno aberto com contas de matemática e um lápis',
    legenda: 'Aulas em grupos de até oito estudantes.',
    descricao: 'Acompanhamento em português e matemática, com diagnóstico individual no início de cada semestre.',
    resultados: ['180 estudantes atendidos em 2025', 'Melhora média de 1,8 ponto nas notas bimestrais'],
  },
  {
    id: 'leitura',
    titulo: 'Clube de Leitura',
    publico: '8 a 17 anos',
    status: { texto: 'Vagas limitadas', tipo: 'destaque' },
    imagem: 'leitura.svg',
    alt: 'Ilustração de uma pilha de livros coloridos',
    legenda: 'Acervo de 2.400 livros doados pela comunidade.',
    descricao: 'Encontros semanais de leitura compartilhada e produção de textos, com rodas de conversa mediadas por voluntários.',
    resultados: ['90 participantes por semestre', 'Mais de 1.500 empréstimos de livros por ano'],
  },
  {
    id: 'tecnologia',
    titulo: 'Oficina de Tecnologia',
    publico: '12 a 17 anos',
    status: { texto: 'Lista de espera', tipo: 'neutra' },
    imagem: 'tecnologia.svg',
    alt: 'Ilustração de um notebook exibindo linhas de código',
    legenda: 'Laboratório com 15 computadores doados.',
    descricao: 'Introdução à informática, lógica de programação e criação de páginas web, preparando jovens para o primeiro emprego.',
    resultados: ['50 jovens formados por ano', '12 encaminhados a programas de jovem aprendiz em 2025'],
  },
];

export const campanhas = [
  {
    id: 'material',
    titulo: 'Material escolar 2027',
    descricao: 'Kits completos de material para os 320 estudantes no início do ano letivo.',
    prazo: 'Até 31/01/2027',
    unidade: 'reais',
    arrecadado: 11200,
    meta: 16000,
  },
  {
    id: 'computadores',
    titulo: 'Novos computadores para a oficina',
    descricao: 'Ampliação do laboratório de 15 para 25 computadores, aceitando equipamentos usados em bom estado.',
    prazo: 'Aceita itens usados',
    unidade: 'computadores',
    arrecadado: 4,
    meta: 10,
  },
];

export const indicadores = [
  { numero: '320', texto: 'estudantes atendidos' },
  { numero: '85', texto: 'voluntários ativos' },
  { numero: '92%', texto: 'de aprovação escolar entre os atendidos' },
];

export const perfisVoluntariado = [
  { titulo: 'Educador', texto: 'Conduz aulas de reforço ou encontros do clube de leitura, com material preparado pela equipe pedagógica.' },
  { titulo: 'Mentor de tecnologia', texto: 'Apoia os jovens da oficina em lógica de programação e criação de páginas web.' },
  { titulo: 'Apoio administrativo', texto: 'Ajuda na organização de eventos, na comunicação e na prestação de contas.' },
];

export const etapasVoluntariado = [
  'Preencha o formulário de cadastro.',
  'Participe de uma conversa de acolhimento com nossa equipe.',
  'Faça a formação inicial de quatro horas sobre a metodologia da ONG.',
  'Comece a atuar no projeto escolhido.',
];

export const estados = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'],
  ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'],
  ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'],
  ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'], ['RS', 'Rio Grande do Sul'],
  ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'],
  ['SE', 'Sergipe'], ['TO', 'Tocantins'],
];
