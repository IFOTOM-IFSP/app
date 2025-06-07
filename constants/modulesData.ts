// data/modules.ts
import { Module } from '@/interfaces/content';
export const MODULES_DATA: Module[] = [
  // 1. Módulo: Introdução à Espectrofotometria
  {
    id: 'introducao-espectrofotometria',
    title: 'Introdução à Espectrofotometria',
    description: 'Conceitos básicos, importância e o espectro eletromagnético.',
    thumbnailUrl: '/images/spectrophotometry-intro.jpg',
    estimatedTime: '25 min',
    pages: [
      {
        id: 'o-que-e-espectrofotometria',
        title: 'O que é Espectrofotometria?',
        content: [
          {
            id: 'intro-o-que-e-text',
            type: 'text',
            value: 'A **espectrofotometria** é uma poderosa técnica analítica utilizada para medir a quantidade de luz que uma substância absorve ou transmite em diferentes comprimentos de onda. É fundamental em diversas áreas da ciência e indústria.',
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'absorcao-e-emissao',
        title: 'Diferença entre Absorção e Emissão',
        content: [
          {
            id: 'abs-emissao-text',
            type: 'text',
            value: 'A diferença fundamental entre **absorção** e **emissão** reside na forma como a matéria interage com a luz. Na absorção, a substância retira energia da luz, enquanto na emissão, ela libera energia na forma de luz.',
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'importancia-da-tecnica',
        title: 'Importância da Técnica',
        content: [
          {
            id: 'importancia-text-1',
            type: 'text',
            value: 'A importância dessa técnica se estende por diversas áreas, incluindo:',
            format: 'paragraph',
          },
          {
            id: 'importancia-list-1',
            type: 'text',
            value: `- **Química**: Determinação de concentração de analitos, identificação de compostos.
- **Biologia**: Quantificação de proteínas, DNA e RNA.
- **Medicina**: Diagnóstico de doenças, monitoramento de níveis de substâncias no sangue.
- **Indústria**: Controle de qualidade em alimentos, farmacêuticos, plásticos e tintas.`,
            format: 'list',
          },
        ],
      },
      {
        id: 'exemplos-aplicacoes-reais',
        title: 'Exemplos de Aplicações Reais',
        content: [
          {
            id: 'aplicacoes-text-1',
            type: 'text',
            value: `Em laboratórios, a espectrofotometria é usada para:
- **Determinação de concentração de sais metálicos** em amostras de água.
- **Análise de alimentos**, como a quantificação de corantes ou vitaminas.
- **Controle de qualidade de medicamentos**, verificando a pureza de ativos.`,
            format: 'paragraph',
          },
          {
            id: 'aplicacoes-image-1',
            type: 'image',
            src: '/images/aplicacoes-espectro.jpg', // Exemplo de imagem para aplicações
            alt: 'Diversas aplicações da espectrofotometria em diferentes campos.',
            caption: 'A versatilidade da espectrofotometria a torna indispensável em muitos setores.',
          },
        ],
      },
    ],
  },




  {
    id: 'luz-e-materia',
    title: 'Luz e Matéria',
    description: 'Entenda os conceitos de luz, o espectro eletromagnético e a interação da luz com a matéria.',
    thumbnailUrl: '/images/luz-materia.jpg',
    estimatedTime: '20 min',
    pages: [
      {
        id: 'conceitos-de-luz',
        title: 'Conceitos de Luz',
        content: [
          {
            id: 'luz-conceitos-text',
            type: 'text',
            value: 'A luz, uma forma de radiação eletromagnética, é um componente essencial para a espectrofotometria. É caracterizada por seu **comprimento de onda** (a distância entre duas cristas de uma onda) e **frequência** (o número de ondas que passam por um ponto em um segundo).',
            format: 'paragraph',
          },
          {
            id: 'espectro-eletromagnetico-page',
            type: 'image',
            src: '/images/eletromagnetic-spectrum.png',
            alt: 'Espectro eletromagnético com diferentes comprimentos de onda.',
            caption: 'O espectro eletromagnético abrange desde ondas de rádio até raios gama, com a luz visível sendo apenas uma pequena parte.',
          },
        ],
      },
      {
        id: 'interacao-luz-materia',
        title: 'Interação da Luz com a Matéria',
        content: [
          {
            id: 'interacao-text-1',
            type: 'text',
            value: `Quando a luz encontra a matéria, três interações principais podem ocorrer:
- **Absorção**: A matéria absorve energia da luz, resultando em uma diminuição da intensidade da luz transmitida.
- **Transmissão**: A luz passa através da matéria sem ser absorvida.
- **Reflexão**: A luz é rebatida pela superfície da matéria.`,
            format: 'list',
          },
        ],
      },
      {
        id: 'cor-de-substancias',
        title: 'Cor de Substâncias',
        content: [
          {
            id: 'cor-substancias-text',
            type: 'text',
            value: 'A **cor de uma substância** é percebida devido à luz que ela **não absorve**, ou seja, a luz que ela transmite ou reflete. Se uma solução absorve luz azul, ela aparecerá laranja ou amarela, que são as cores complementares do azul.',
            format: 'paragraph',
          },
        ],
      },
    ],
  },



  // 3. Módulo: Princípios da Espectrofotometria de Absorção
  {
    id: 'principios-espectrofotometria-absorcao',
    title: 'Princípios da Espectrofotometria de Absorção 🧪',
    description: 'Aprofunde-se nos conceitos de absorbância, transmitância e a fundamental Lei de Beer-Lambert.',
    thumbnailUrl: '/images/beer-lambert-principle.jpg',
    estimatedTime: '30 min',
    pages: [
      {
        id: 'absorvancia-e-transmitancia',
        title: 'Absorvância e Transmitância',
        content: [
          {
            id: 'abs-trans-text',
            type: 'text',
            value: 'Na espectrofotometria de absorção, medimos a **absorvância (A)** ou a **transmitância (T)**. A **transmitância** é a fração da luz incidente que passa através da amostra, enquanto a **absorvância** é uma medida logarítmica da quantidade de luz absorvida pela amostra.',
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'lei-de-beer-lambert',
        title: 'Lei de Beer-Lambert',
        content: [
          {
            id: 'beer-lambert-intro-text',
            type: 'text',
            value: 'A relação fundamental na espectrofotometria é a **Lei de Beer-Lambert**, que descreve a relação linear entre a absorbância e a concentração de uma substância em solução.',
            format: 'paragraph',
          },
          {
            id: 'beer-lambert-formula-text',
            type: 'text',
            value: '$A = \\varepsilon \\cdot l \\cdot c$',
            format: 'paragraph',
          },
          {
            id: 'beer-lambert-variaveis-text',
            type: 'text',
            value: `Onde:
- $A$ = Absorbância (adimensional)
- $\\varepsilon$ = Coeficiente de absorção molar (ou absortividade molar), uma constante que depende da substância e do comprimento de onda ($\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}$)
- $l$ = Caminho óptico (largura da cubeta), geralmente em centímetros (cm)
- $c$ = Concentração da substância na solução ($\\text{mol} \\cdot \\text{L}^{-1}$ ou outra unidade de concentração)`,
            format: 'list',
          },
        ],
      },
      {
        id: 'limites-de-aplicacao-da-lei',
        title: 'Limites de Aplicação da Lei',
        content: [
          {
            id: 'limites-beer-text',
            type: 'text',
            value: `A Lei de Beer-Lambert é válida sob certas condições e possui **limites de aplicação**:
- A solução deve ser diluída.
- A amostra deve ser quimicamente estável e não reagir com o solvente.
- A luz deve ser monocromática.
- Não deve haver reações de associação ou dissociação do analito.`,
            format: 'paragraph',
          },
        ],
      },
    ],
  },



  // 4. Módulo: Partes de um Espectrofotômetro
  {
    id: 'partes-espectrofotometro',
    title: 'Partes de um Espectrofotômetro ⚙️',
    description: 'Explore os componentes chave de um espectrofotômetro e como eles funcionam em conjunto.',
    thumbnailUrl: '/images/espectrofotometro-diagrama.jpg',
    estimatedTime: '20 min',
    pages: [
      {
        id: 'componentes-principais',
        title: 'Componentes Principais',
        content: [
          {
            id: 'partes-intro-text',
            type: 'text',
            value: 'Um espectrofotômetro é composto por várias partes essenciais que trabalham em conjunto para medir a absorbância ou transmitância de uma amostra.',
            format: 'paragraph',
          },
          {
            id: 'fonte-luz-page',
            type: 'text',
            value: `**Fonte de Luz**: Gera a luz que atravessará a amostra. Lâmpadas de tungstênio são usadas para a região visível, e lâmpadas de deutério para a região ultravioleta.`,
            format: 'paragraph',
          },
          {
            id: 'monocromador-ou-filtro',
            type: 'text',
            value: `**Monocromador ou Filtro**: Seleciona um comprimento de onda específico da luz. Monocromadores usam prismas ou grades de difração para dispersar a luz, enquanto filtros usam materiais que absorvem todos os comprimentos de onda, exceto o desejado.`,
            format: 'paragraph',
          },
          {
            id: 'cubeta-page',
            type: 'text',
            value: `**Cubeta**: Recipiente onde a amostra é colocada. Geralmente feita de quartzo (para UV-Visível) ou vidro (para Visível).`,
            format: 'paragraph',
          },
          {
            id: 'detector-page',
            type: 'text',
            value: `**Detector**: Mede a intensidade da luz que passa pela amostra. Pode ser um fotodiodo, um tubo fotomultiplicador (PMT) ou um arranjo de diodos (CCD).`,
            format: 'paragraph',
          },
          {
            id: 'conversao-luz-sinal-digital',
            type: 'text',
            value: `**Conversão da Luz em Sinal Digital**: O sinal elétrico gerado pelo detector é convertido em um sinal digital e enviado para um computador ou display para processamento e apresentação dos resultados.`,
            format: 'paragraph',
          },
          {
            id: 'espectrofotometro-diagrama-image',
            type: 'image',
            src: '/images/espectrofotometro-partes.png',
            alt: 'Diagrama detalhado das partes de um espectrofotômetro.',
            caption: 'Componentes principais de um espectrofotômetro.',
          },
        ],
      },
    ],
  },


  // 5. Módulo: Tipos de Análises Possíveis
  {
    id: 'tipos-de-analises-possiveis',
    title: 'Tipos de Análises Possíveis 🧬',
    description: 'Descubra as diferentes aplicações analíticas da espectrofotometria.',
    thumbnailUrl: '/images/analises-espectro.jpg',
    estimatedTime: '25 min',
    pages: [
      {
        id: 'visao-geral-analises',
        title: 'Visão Geral das Análises',
        content: [
          {
            id: 'analises-intro-text',
            type: 'text',
            value: 'A espectrofotometria permite uma variedade de análises quantitativas e qualitativas.',
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'curvas-de-calibracao',
        title: 'Curvas de Calibração',
        content: [
          {
            id: 'curvas-calibracao-text',
            type: 'text',
            value: `Uma das aplicações mais comuns. Várias soluções com concentrações conhecidas do analito são preparadas e suas absorbâncias são medidas. Um gráfico de absorbância vs. concentração é plotado, gerando uma curva de calibração que pode ser usada para determinar a concentração de amostras desconhecidas.`,
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'determinacao-de-concentracao',
        title: 'Determinação de Concentração',
        content: [
          {
            id: 'determinacao-concentracao-text',
            type: 'text',
            value: `Usando a curva de calibração ou a Lei de Beer-Lambert diretamente (se o $\\varepsilon$ for conhecido), é possível determinar a concentração de uma amostra.`,
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'comparacao-de-absorvancias',
        title: 'Comparação de Absorvâncias',
        content: [
          {
            id: 'comparacao-absorvancias-text',
            type: 'text',
            value: `Permite avaliar diferenças relativas na quantidade de um componente entre amostras.`,
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'analises-em-diferentes-comprimentos',
        title: 'Análises em Diferentes Comprimentos de Onda',
        content: [
          {
            id: 'analises-comprimentos-text',
            type: 'text',
            value: `Ao escanear a absorbância em uma faixa de comprimentos de onda, é possível obter um espectro de absorção característico da substância, útil para identificação.`,
            format: 'paragraph',
          },
        ],
      },
    ],
  },

  // 6. Módulo: Preparo de Soluções para Análise
  {
    id: 'preparo-solucoes-analise',
    title: 'Preparo de Soluções para Análise 🧫',
    description: 'Aprenda as melhores práticas para o preparo de soluções padrão e diluições.',
    thumbnailUrl: '/images/preparo-solucoes.jpg',
    estimatedTime: '35 min',
    prerequisites: ['principios-espectrofotometria-absorcao'], // Exemplo de pré-requisito
    pages: [
      {
        id: 'importancia-do-preparo-correto',
        title: 'Importância do Preparo Correto',
        content: [
          {
            id: 'preparo-importancia-text',
            type: 'text',
            value: 'O **preparo correto das soluções** é crucial para obter resultados precisos e confiáveis na espectrofotometria. Erros nesta etapa podem levar a resultados incorretos e imprecisos.',
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'conceito-de-solucao-padrao',
        title: 'Conceito de Solução Padrão',
        content: [
          {
            id: 'solucao-padrao-text',
            type: 'text',
            value: `Uma **solução padrão** é uma solução de concentração conhecida e precisa, usada como referência para a calibração de instrumentos ou para a determinação da concentração de amostras desconhecidas.`,
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'diluicoes',
        title: 'Diluições',
        content: [
          {
            id: 'diluicoes-text',
            type: 'text',
            value: `Frequentemente, é necessário diluir soluções mais concentradas para atingir a faixa de trabalho do espectrofotômetro. A fórmula de diluição $C_1V_1 = C_2V_2$ é comumente usada.`,
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'exemplos-praticos-de-calculo',
        title: 'Exemplos Práticos de Cálculo',
        content: [
          {
            id: 'exemplo-pratico-titulo-text',
            type: 'text',
            value: 'Exemplos Práticos',
            format: 'heading2',
          },
          {
            id: 'exemplo-pratico-text',
            type: 'text',
            value: `**Como preparar 100 mL de uma solução 0,1 mol/L de permanganato de potássio ($KMnO_4$)**:
1. Calcule a massa molar do $KMnO_4$.
2. Calcule a massa de $KMnO_4$ necessária para 100 mL de uma solução 0,1 mol/L.
3. Pese cuidadosamente a massa calculada do $KMnO_4$.
4. Transfira o $KMnO_4$ para um balão volumétrico de 100 mL.
5. Adicione água destilada até a marca do balão, agitando para dissolver.`,
            format: 'paragraph',
          },
          {
            id: 'preparo-solucoes-image',
            type: 'image',
            src: '/images/preparo-solucoes.jpg',
            alt: 'Pessoa preparando uma solução em laboratório.',
            caption: 'A precisão no preparo das soluções é fundamental.',
          },
        ],
      },
    ],
  },


  // 7. Módulo: Interpretação de Resultados
  {
    id: 'interpretacao-de-resultados',
    title: 'Interpretação de Resultados 📉',
    description: 'Aprenda a analisar gráficos de absorbância e identificar erros comuns em espectrofotometria.',
    thumbnailUrl: '/images/interpretacao-resultados.jpg',
    estimatedTime: '20 min',
    prerequisites: ['principios-espectrofotometria-absorcao', 'preparo-solucoes-analise'], // Exemplo de pré-requisito
    pages: [
      {
        id: 'como-ler-um-grafico',
        title: 'Como Ler um Gráfico de Absorbância vs. Concentração',
        content: [
          {
            id: 'interpretacao-intro-text',
            type: 'text',
            value: 'Após a coleta dos dados, a **interpretação correta dos resultados** é crucial para tirar conclusões significativas.',
            format: 'paragraph',
          },
          {
            id: 'grafico-absorvancia-text',
            type: 'text',
            value: `Para uma curva de calibração:
- O **eixo X** geralmente representa a concentração (ou tempo, ou comprimento de onda).
- O **eixo Y** representa a absorbância.
- Espera-se uma relação **linear** (Lei de Beer-Lambert) dentro de uma certa faixa, permitindo determinar a concentração de amostras desconhecidas.`,
            format: 'list',
          },
          {
            id: 'grafico-exemplo-image',
            type: 'image',
            src: '/images/curva-calibracao-exemplo.png',
            alt: 'Exemplo de gráfico de absorbância versus concentração.',
            caption: 'Curva de calibração mostrando a relação linear entre absorbância e concentração.',
          },
        ],
      },
      {
        id: 'erros-experimentais-comuns',
        title: 'Erros Experimentais Comuns',
        content: [
          {
            id: 'erros-comuns-text',
            type: 'text',
            value: `Identificar e evitar erros é essencial para a validade dos resultados:
- **Erro na preparação da amostra**: diluição incorreta, contaminação.
- **Bolhas na cubeta**: dispersam a luz e afetam a leitura.
- **Cubetas sujas ou riscadas**: alteram o caminho óptico e a absorbância.
- **Variações de temperatura**: podem afetar a absorbância de algumas substâncias.
- **Desvio da Lei de Beer-Lambert**: ocorre em concentrações muito altas ou baixas.`,
            format: 'list',
          },
        ],
      },
      {
        id: 'analise-critica-dos-dados',
        title: 'Análise Crítica dos Dados',
        content: [
          {
            id: 'analise-critica-text',
            type: 'text',
            value: 'Uma **análise crítica dos dados** envolve a avaliação da reprodutibilidade, a comparação com valores de referência e a consideração de possíveis fontes de erro para garantir a validade dos resultados.',
            format: 'paragraph',
          },
        ],
      },
    ],
  },
];