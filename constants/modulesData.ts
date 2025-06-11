// data/modules.ts
import { Module } from '@/interfaces/content';
export const MODULES_DATA: Module[] = [
  // 1. Módulo: Introdução à Espectrofotometria
  {
    id: '1',
    title: 'Introdução à Espectrofotometria',
    description: 'Conceitos básicos, importância e o espectro eletromagnético.',
    estimatedTime: '25 min',
    pages: [
      {
        id: '1.1',
        title: 'O que é Espectrofotometria?',
        content: [
              {
                "id": "intro-o-que-e-paragraph",
                "type": "text",
                "value": "A **espectrofotometria** é uma técnica analítica essencial que mede como uma substância interage com a luz. Ao analisar a quantidade de luz **absorvida** ou **transmitida** em diferentes comprimentos de onda, cientistas obtêm informações cruciais sobre a **composição** e a **concentração** de uma amostra. É uma ferramenta fundamental em diversas áreas da ciência e da indústria.",
                "format": "paragraph"
              },
              {
                "id": "comofunciona-heading",
                "type": "text",
                "value": "Como Funciona?",
                "format": "heading2"
              },
              {
                "id": "comofunciona-paragraph",
                "type": "text",
                "value": "O princípio é simples: um **feixe de luz** atravessa uma amostra e um **detector** mede a intensidade da luz que chega ao outro lado. A diferença entre a luz emitida e a detectada revela o quanto foi absorvido pela substância. Essa medida de absorção está diretamente relacionada à **concentração** do composto de interesse, permitindo sua quantificação precisa.",
                "format": "paragraph"
              },
              {
                "id": "composicao-luz-bloco",
                "type": "text",
                "value": "Assim como a luz branca se decompõe em um arco-íris, ela é formada por múltiplos comprimentos de onda (cores). Cada substância possui uma afinidade única por certos comprimentos de onda, absorvendo-os de maneira seletiva. Esse padrão de absorção cria uma **'assinatura espectral'** única, que funciona como uma impressão digital para **identificar** e **quantificar** o material.",
                "format": "blockquote"
              },
              {
                "id": "espectros-heading",
                "type": "text",
                "value": "O que são Espectros?",
                "format": "heading2"
              },
              {
                "id": "espectros-paragraph",
                "type": "text",
                "value": "O resultado de uma análise espectrofotométrica é um **espectro**: um gráfico que mapeia a intensidade da absorção (ou transmissão) de luz em função do comprimento de onda. Os **picos e vales** neste gráfico revelam os comprimentos de onda que a substância mais absorve, permitindo que cientistas **identifiquem compostos**, **determinem sua pureza** e **acompanhem o andamento de reações químicas**.",
                "format": "paragraph"
              },
              {
                "id": "exemplo-imagem-espectro",
                "type": "image",
                "src": { "uri": "https://cdn.kastatic.org/ka-perseus-images/7368b813cebab3abdd88286e456d16819743a6d1.png"},
                "alt": "Exemplo de espectro eletromagnético",
                "caption": "Exemplo de espectro eletromagnético.",
                "width": 300,
                "height": 200
              },
              {
                "id": "contexto-historico-heading",
                "type": "text",
                "value": "Breve Contexto Histórico",
                "format": "heading2"
              },
              {
                "id": "contexto-historico-paragraph",
                "type": "text",
                "value": "As raízes da espectrofotometria remontam ao **século XIX**, com os primeiros estudos sobre a decomposição da luz. Contudo, foi no **século XX** que a técnica floresceu, impulsionada pelos **avanços na eletrônica e na óptica**. O desenvolvimento de **espectrofotômetros modernos** transformou a análise química, oferecendo resultados rápidos, precisos e reprodutíveis.",
                "format": "paragraph"
              },
              {
                "id": "tecnologias-relacionadas-heading",
                "type": "text",
                "value": "Tecnologias Relacionadas",
                "format": "heading2"
              },
              {
                "id": "tecnologias-relacionadas-paragraph",
                "type": "text",
                "value": "A espectrofotometria é a base para diversas técnicas especializadas, como **UV-Vis** (ultravioleta-visível), **IV** (infravermelho) e **absorção atômica**. Cada uma é aplicada em contextos específicos, como controle de qualidade farmacêutico, monitoramento ambiental e diagnóstico bioquímico.",
                "format": "paragraph"
              },
              {
                "id": "preview-proxima-pagina",
                "type": "text",
                "value": "Para aprofundar seu conhecimento, o próximo passo é diferenciar os fenômenos de **absorção e emissão** de luz. Vamos descobrir como eles se complementam na próxima página!",
                "format": "list"
              }
            ] },
      {
        id: '1.2',
        title: 'Diferença entre Absorção e Emissão',
        content: [
              {
                id: 'abs-emissao-heading',
                type: 'text',
                value: 'Diferença entre Absorção e Emissão',
                format: 'heading1',
              },
              {
                id: 'abs-emissao-paragraph-intro',
                type: 'text',
                value: 'A diferença fundamental entre **absorção** e **emissão** reside na forma como a matéria interage com a luz. Na absorção, a substância retira energia da luz; na emissão, ela libera energia na forma de luz.',
                format: 'paragraph',
              },
              {
                id: 'conceitos-basicos-heading',
                type: 'text',
                value: 'Conceitos Básicos',
                format: 'heading2',
              },
              {
                id: 'absorcao-explicacao',
                type: 'text',
                value:'**Absorção:** Ocorre quando um átomo ou molécula absorve um fóton (partícula de luz), o que faz com que seus elétrons passem para um nível de energia mais alto. Esse processo consome energia.',
                format: 'paragraph',
              },
              {
                id: 'emissao-explicacao',
                type: 'text',
                value:'**Emissão:** Acontece quando esses elétrons excitados retornam a níveis de energia mais baixos, liberando a energia excedente na forma de luz. Esse processo emite radiação.',
                format: 'paragraph',
              },
              {
                id: 'exemplo-cotidiano-bloco',
                type: 'text',
                value:'Um exemplo comum: quando aquecemos certos sais metálicos (como o sal de cozinha), vemos chamas coloridas. Essa luz é resultado da **emissão** de energia pelos átomos excitados.',
                format: 'blockquote',
              },
              {
                id: 'abs-emissao-diagrama',
                type: 'image',
                src: {uri: "https://astronoo.com/images/articles/principe-absorption-emission-atomique.webp"}, 
                alt: 'Diagrama explicando absorção e emissão de luz por elétrons em um átomo',
                caption: 'Ilustração da absorção e emissão: elétrons saltam para níveis energéticos mais altos e depois retornam, emitindo luz.',
                width: 320,
                height: 220,
              },
              {
                id: 'comparacao-tabela-heading',
                type: 'text',
                value: 'Comparação Lado a Lado',
                format: 'heading2',
              },
              {
                id: 'comparacao-tabela-interativa',
                type: 'interactive',
                componentName: 'AbsorcaoEmissaoTable',
                props: {
                  data: [
                    { aspecto: 'Interação com luz', absorcao: 'Absorve luz', emissao: 'Emite luz' },
                    { aspecto: 'Energia do sistema', absorcao: 'Aumenta', emissao: 'Diminui' },
                    { aspecto: 'Nível eletrônico', absorcao: 'Eletrons sobem', emissao: 'Eletrons descem' },
                    { aspecto: 'Exemplo', absorcao: 'Pigmentos absorvendo luz', emissao: 'Neon emitindo luz' },
                  ],
                },
              },
              {
                id: 'transicao-proxima',
                type: 'text',
                value:
                  'Agora que você entende a diferença entre absorção e emissão, podemos avançar para entender por que essa técnica é tão importante na ciência e na indústria.',
                format: 'paragraph',
              }
          ],
      },
      {
        id: '1.3',
        title: 'Importância da Técnica',
        content: [
            {
              id: 'importancia-intro-paragraph',
              type: 'text',
              value: 'A espectrofotometria é considerada uma das ferramentas mais versáteis e essenciais da análise científica moderna. Sua importância se estende por diversas áreas do conhecimento e setores produtivos.',
              format: 'paragraph',
            },
            {
              id: 'importancia-list-heading',
              type: 'text',
              value: 'Principais Áreas de Aplicação',
              format: 'heading2',
            },
            {
              id: 'importancia-list-1',
              type: 'text',
              value: `**Química**: Determinação de concentração de analitos, cinética de reações químicas, identificação de compostos.
  - **Biologia**: Quantificação de proteínas, DNA, RNA e outros biomarcadores em pesquisas laboratoriais e clínicas.
  - **Medicina**: Diagnóstico de doenças, exames laboratoriais (como bilirrubina, glicose e creatinina), monitoramento de níveis hormonais e metabólicos.
  - **Indústria**: Controle de qualidade em produtos como alimentos, bebidas, fármacos, tintas, plásticos e combustíveis.
  - **Meio ambiente**: Monitoramento de poluentes em água, solo e ar.`,
              format: 'list',
            },
            {
              id: 'precisao-confiabilidade',
              type: 'text',
              value:
                'A técnica é altamente valorizada por sua precisão, rapidez e baixo custo operacional. Além disso, permite análises não destrutivas, o que é ideal para amostras valiosas ou limitadas.',
              format: 'paragraph',
            },
            {
              id: 'beneficios-bloco',
              type: 'text',
              value:
                'Ao permitir a detecção de substâncias mesmo em concentrações muito baixas, a espectrofotometria tem um papel crucial na segurança de medicamentos, na pureza de reagentes químicos e no controle ambiental.',
              format: 'blockquote',
            },
            {
              id: 'grafico-interativo-impacto',
              type: 'interactive',
              componentName: 'ImpactoSetorialChart',
              props: {
                data: [
                  { area: 'Química', impacto: 90 },
                  { area: 'Biologia', impacto: 85 },
                  { area: 'Medicina', impacto: 95 },
                  { area: 'Indústria', impacto: 80 },
                  { area: 'Meio ambiente', impacto: 88 },
                ],
                unit: '%',
                description: 'Nível de impacto da espectrofotometria por setor',
              },
            },
            {
              id: 'imagem-importancia',
              type: 'image',
              src: {uri: 'data:image/jpeg;base64,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'}, // Substituir com caminho real
              alt: 'Laboratório com espectrofotômetro em uso',
              caption: 'Exemplo de uso da espectrofotometria em laboratório clínico.',
              width: 320,
              height: 220,
            },
            {
              id: 'conclusao-importancia',
              type: 'text',
              value:
                'Com tantas aplicações e benefícios, a espectrofotometria é uma técnica indispensável para o avanço da ciência, saúde e indústria moderna.',
              format: 'paragraph',
            },
            {
              id: 'preview-proxima-pagina',
              type: 'text',
              value:
                'Vamos agora conhecer alguns exemplos práticos e reais de como essa técnica é utilizada no dia a dia.',
              format: 'paragraph',
            }
          ],
      },
      {
        id: '1.4',
        title: 'Exemplos de Aplicações Reais',
        content: [
            {
              id: 'aplicacoes-heading',
              type: 'text',
              value: 'Exemplos de Aplicações Reais',
              format: 'heading1',
            },
            {
              id: 'aplicacoes-intro',
              type: 'text',
              value:
                'A espectrofotometria é amplamente empregada em cenários do cotidiano científico e industrial. Aqui estão alguns exemplos práticos que demonstram sua utilidade na prática:',
              format: 'paragraph',
            },
            {
              id: 'aplicacoes-lista-principal',
              type: 'text',
              value: `- **Análise da qualidade da água**: Detecção e quantificação de metais pesados, como chumbo e mercúrio, em estações de tratamento.
  - **Controle de alimentos**: Medição de teores de vitamina C em sucos ou presença de corantes artificiais em doces e refrigerantes.
  - **Farmácia e medicamentos**: Avaliação da concentração de substâncias ativas em comprimidos para garantir eficácia e segurança.
  - **Laboratórios clínicos**: Testes bioquímicos como ureia, creatinina e glicose utilizam espectrofotometria como método padrão.
  - **Indústria de cosméticos**: Determinação da estabilidade e coloração de cremes e protetores solares.`,
              format: 'list',
            },
            {
              id: 'aplicacoes-imagem',
              type: 'image',
              src: require('@/assets/images/aplicacoes-espectro.jpg'),
              alt: 'Diversas aplicações da espectrofotometria em diferentes campos.',
              caption: 'A versatilidade da espectrofotometria a torna indispensável em muitos setores.',
              width: 320,
              height: 220,
            },
            {
              id: 'caso-real-heading',
              type: 'text',
              value: 'Exemplo Real: Análise de Água Potável',
              format: 'heading2',
            },
            {
              id: 'caso-real-descricao',
              type: 'text',
              value:
                'Em estações de tratamento, a espectrofotometria é utilizada para monitorar a presença de nitratos e fosfatos em águas superficiais. Isso garante que os níveis estejam dentro dos padrões permitidos pela legislação ambiental.',
              format: 'paragraph',
            },
            {
              id: 'caso-real-quote',
              type: 'text',
              value:
                '“Sem espectrofotometria, seria quase impossível garantir a qualidade da água que chega às nossas casas.” — Técnico ambiental, SABESP',
              format: 'blockquote',
            },
            {
              id: 'interativo-cards-aplicacoes',
              type: 'interactive',
              componentName: "InfoCards",
              props: {
                cards: [
                  {
                    title: 'Análises Clínicas',
                    description: 'Dosagem de glicose, colesterol, ureia e outros exames laboratoriais.',
                    icon: 'stethoscope',
                  },
                  {
                    title: 'Alimentos e Bebidas',
                    description: 'Controle de cor, pureza e presença de aditivos em produtos industrializados.',
                    icon: 'utensils',
                  },
                  {
                    title: 'Ambiental',
                    description: 'Monitoramento de águas, solos e efluentes industriais.',
                    icon: 'leaf',
                  },
                  {
                    title: 'Farmacêutica',
                    description: 'Verificação da pureza e concentração de ingredientes ativos.',
                    icon: 'capsule',
                  },
              ],
            },
          },
          {
            id: 'conclusao-aplicacoes',
            type: 'text',
            value:
              'Esses exemplos demonstram o quão presente a espectrofotometria está em nosso cotidiano, mesmo que de forma invisível. Sua aplicação garante qualidade, segurança e precisão em diversas áreas.',
            format: 'paragraph',
          },
          {
            id: 'fim-capitulo-preview',
            type: 'text',
            value:
              'Com isso, concluímos a introdução à espectrofotometria. A seguir, você poderá revisar os principais conceitos ou avançar para atividades práticas.',
            format: 'paragraph',
          }
        ],
      },
    ] 
  },

  {
    id: '2',
    title: 'Luz e Matéria',
    description: 'Entenda os conceitos de luz, o espectro eletromagnético e a interação da luz com a matéria.',
    estimatedTime: '20 min',
    pages: [
        {
          id: '2.1',
          title: 'Conceitos de Luz',
          content: [
            {
              id: 'luz-conceitos-intro',
              type: 'text',
              value: 'A luz é uma forma de **radiação eletromagnética** que se propaga em ondas e pode se comportar como partícula (fóton) em certas situações. Ela é essencial para diversos fenômenos naturais e aplicações científicas, como a espectrofotometria.',
              format: 'paragraph',
            },
            {
              id: 'luz-caracteristicas',
              type: 'text',
              value: 'As principais características da luz incluem seu **comprimento de onda** (a distância entre dois picos sucessivos da onda) e sua **frequência** (quantidade de ciclos por segundo, medida em Hertz). Essas propriedades determinam a energia da radiação e sua posição no espectro eletromagnético.',
              format: 'paragraph',
            },
            {
              id: 'luz-visivel',
              type: 'text',
              value: 'A luz visível é apenas uma pequena faixa do espectro eletromagnético, abrangendo comprimentos de onda de aproximadamente **400 nm (violeta)** a **700 nm (vermelho)**. Além dessa faixa, existem radiações como **infravermelho, ultravioleta, micro-ondas** e **raios X**, que não são visíveis ao olho humano, mas têm diversas aplicações tecnológicas e médicas.',
              format: 'paragraph',
            },
            {
              id: 'espectro-eletromagnetico-page',
              type: 'image',
              src: {uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXvNiezFsE0EpjNxip73QcdWzApsHtp6Dcw&s"},
              alt: 'Espectro eletromagnético com diferentes comprimentos de onda.',
              caption: 'O espectro eletromagnético mostra a variedade de radiações, desde as de baixa energia (como ondas de rádio) até as de alta energia (como raios gama). A luz visível é uma pequena porção dessa escala, perceptível ao olho humano.',
            },
            {
              id: 'luz-aplicacoes',
              type: 'text',
              value: 'Na espectrofotometria, diferentes substâncias interagem com diferentes comprimentos de onda da luz. A análise dessas interações permite identificar e quantificar compostos com precisão.',
              format: 'paragraph',
            },
            {
              id: 'espectro-video',
              type: 'video',
              src: 'https://www.youtube.com/watch?v=cfXzwh3KadE',
              alt: "https://www.youtube.com/watch?v=cfXzwh3KadE",
              provider: "youtube",
              caption: 'Entenda o que é o espectro eletromagnético e como a luz visível se encaixa nele. (Canal: Manual do Mundo)',
            },
          ],
        },
        
        {
          id: '2.2',
          title: 'Interação da Luz com a Matéria',
          content: [
            {
              id: 'interacao-intro',
              type: 'text',
              value: 'Quando a luz incide sobre um material, ela pode interagir de diferentes formas, dependendo das propriedades físicas e químicas do material. Essas interações são fundamentais para entender como funcionam técnicas como a espectrofotometria.',
              format: 'paragraph',
            },
            {
              id: 'interacao-tipos',
              type: 'text',
              value: `As três principais formas de interação entre a luz e a matéria são:
  - **Absorção**: Parte da energia da luz é absorvida pela matéria. Isso pode excitar elétrons em átomos ou moléculas para níveis de energia mais altos. A intensidade da luz transmitida diminui.
  -  **Transmissão**: A luz atravessa o material sem ser absorvida. Esse fenômeno é comum em substâncias transparentes, como vidro ou soluções diluídas.
  -  **Reflexão**: A luz é rebatida na superfície do material, podendo ser parcial (em superfícies transparentes) ou total (em materiais opacos como metais).`,
              format: 'list',
            },
            {
              id: 'interacao-contexto',
              type: 'text',
              value: 'Esses fenômenos podem ocorrer simultaneamente e em diferentes intensidades. Por exemplo, em uma solução colorida, parte da luz é absorvida (relacionada à cor da substância), outra parte pode ser transmitida, e alguma fração pode ser refletida na superfície do recipiente.',
              format: 'paragraph',
            },
            {
              id: 'interacao-aplicacao',
              type: 'text',
              value: 'Na espectrofotometria, é a **absorção da luz** que é medida para determinar a concentração de uma substância. A escolha do comprimento de onda adequado permite maximizar a absorção e obter resultados precisos.',
              format: 'paragraph',
            },
            {
              id: 'interacao-video',
              type: 'video',
              src: 'https://youtu.be/VpOlt8kcxko',
              alt: 'https://youtu.be/VpOlt8kcxko',
              caption: 'Vídeo explicativo sobre como a luz interage com diferentes materiais, com exemplos do cotidiano e conceitos fundamentais de óptica. (Canal: Ciência Todo Dia)',
            },
          ],
        },  
        {
          id: '2.3',
          title: 'Cor de Substâncias',
          content: [
            {
              id: 'cor-substancias-intro',
              type: 'text',
              value: 'A **cor de uma substância** está diretamente relacionada à forma como ela interage com a luz visível. Quando a luz branca (que contém todas as cores) incide sobre uma substância, parte dessa luz pode ser **absorvida**, enquanto o restante é **transmitido** ou **refletido** — e é essa parte que percebemos como cor.',
              format: 'paragraph',
            },
            {
              id: 'cor-substancias-complementares',
              type: 'text',
              value: 'Por exemplo, se uma substância **absorve luz azul** (em torno de 450 nm), ela refletirá/transmitirá a cor **laranja**, sua cor complementar. Isso acontece porque o cérebro interpreta a mistura da luz que chega até os olhos após a absorção.',
              format: 'paragraph',
            },
            {
              id: 'cor-substancias-interativo',
              type: 'interactive',
              componentName: 'ComplementaryColorPicker',
              props: {
                title: 'Simulador de Cores Complementares',
                description: 'Selecione uma cor absorvida para ver a cor percebida:',
                options: [
                  { name: 'Vermelho', swatchColor: '#FF0000', perceivedName: 'Ciano', perceivedHex: '#00FFFF' },
                  { name: 'Laranja', swatchColor: '#FFA500', perceivedName: 'Azul', perceivedHex: '#0000FF' },
                  { name: 'Amarelo', swatchColor: '#FFFF00', perceivedName: 'Violeta', perceivedHex: '#8A2BE2' },
                  { name: 'Verde', swatchColor: '#008000', perceivedName: 'Magenta', perceivedHex: '#FF00FF' },
                  { name: 'Ciano', swatchColor: '#00FFFF', perceivedName: 'Vermelho', perceivedHex: '#FF0000' },
                  { name: 'Azul', swatchColor: '#0000FF', perceivedName: 'Laranja', perceivedHex: '#FFA500' },
                  { name: 'Violeta', swatchColor: '#8A2BE2', perceivedName: 'Amarelo', perceivedHex: '#FFFF00' },
                ],
              },
            },
            {
              id: 'cor-substancias-aplicacao',
              type: 'text',
              value: 'Na espectrofotometria, essa relação entre cor percebida e luz absorvida é fundamental. Conhecendo a cor de uma solução, é possível **inferir quais comprimentos de onda ela absorve mais intensamente**, o que ajuda na escolha do filtro ou do comprimento de onda ideal para análise.',
              format: 'paragraph',
            },
            {
              id: 'cor-substancias-video',
              type: 'video',
              src: 'https://youtu.be/k0PFj2i70n8?si=IjdlC486FYDtYuB1',
              alt: 'https://youtu.be/k0PFj2i70n8?si=IjdlC486FYDtYuB1',
              caption: 'Entenda como vemos as cores e por que substâncias diferentes têm cores distintas — uma explicação com animações e exemplos do dia a dia.',
            },
          ],
      }
    ],
  },
  {
    id: '3',
    title: 'Princípios da Espectrofotometria de Absorção',
    description: 'Aprofunde-se nos conceitos de absorbância, transmitância e a fundamental Lei de Beer-Lambert.',
    estimatedTime: '30 min',
    pages: [
        {
          id: '3.1',
          title: 'Absorvância e Transmitância',
          content: [
            {
              id: 'abs-trans-text',
              type: 'text',
              value: 'Na espectrofotometria de absorção, medimos a **absorvância (A)** e a **transmitância (T)**. A **transmitância** é a razão entre a intensidade da luz transmitida ($I$) e a luz incidente ($I_0$), ou seja, $T = I/I_0$. Já a **absorvância** é dada por $A = -\\log(T)$, indicando quanta luz foi absorvida pela amostra.',
              format: 'paragraph',
            },
            {
              id: 'abs-trans-image',
              type: 'image',
              src: {uri: 'https://kasvi.com.br/wp-content/uploads/2022/12/espectrofotometro-02.jpg'},
              alt: 'Diagrama mostrando a luz incidente e a transmitida por uma amostra.',
              caption: 'Transmitância e absorvância em um sistema de espectrofotometria.',
            },
            {
              id: 'abs-trans-slider',
              type: 'interactive',
              componentName: 'SliderVisualization', 
              props: {
                title: 'Relação T vs A',
                description: 'Ajuste a transmitância (T) para ver como a absorvância (A) muda.',
                input: {
                  id: 'T',
                  label: 'Transmitância (%)',
                  min: 1,
                  max: 100,
                  step: 1,
                  unit: '%'
                },
                outputFormula: 'A = -log(T / 100)',
                outputLabel: 'Absorbância (A)',
                graph: true
              }
            },
          ],
        },
        {
          id: '3.2', 
          title: 'Lei de Beer-Lambert',
          content: [
            {
              id: 'beer-lambert-intro-text',
              type: 'text',
              value: 'A **Lei de Beer-Lambert** descreve a relação linear entre a absorbância e a concentração da substância em solução. Essa relação é essencial para a quantificação de analitos por espectrofotometria.',
              format: 'paragraph',
            },
            {
              id: 'beer-lambert-formula-text',
              type: 'text',
              value: '$A = \\varepsilon \\cdot l \\cdot c$',
              format: 'paragraph',
            },
            {
              "id": "beer-lambert-variaveis-intro",
              "type": "text",
              "value": "Onde cada termo da equação significa:",
              "format": "paragraph" 
            },
            {
              "id": "beer-lambert-variaveis-list",
              "type": "text",
              "format": "list",
              "value": "- $A$ = Absorbância\n- $\\varepsilon$ = Coeficiente de absorção molar ($\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}$)\n- $l$ = Caminho óptico (cm)\n- $c$ = Concentração da substância ($\\text{mol} \\cdot \\text{L}^{-1}$)"
            },
            {
              id: 'beer-lambert-video',
              type: 'video',
              src: 'https://www.youtube.com/watch?v=Yq6jd5YHxXA&pp=ygUxVsOtZGVvIGludHJvZHV0w7NyaW8gc29icmUgYSBMZWkgZGUgQmVlci1MYW1iZXJ0Lg%3D%3D',
              alt: 'Explicação visual da Lei de Beer-Lambert com exemplos práticos.',
              caption: 'Vídeo introdutório sobre a Lei de Beer-Lambert.',
              provider: 'youtube',
            },
            {
              id: 'beer-lambert-simulador',
              type: 'interactive',
              componentName: 'MultiSlider', 
              props: {
                title: 'Simulador da Lei de Beer-Lambert',
                description: 'Ajuste os parâmetros para ver como a absorbância varia.',
                inputs: [
                  { id: 'epsilon', label: 'ε (L·mol⁻¹·cm⁻¹)', min: 10, max: 200, default: 100 },
                  { id: 'l', label: 'l (cm)', min: 0.1, max: 5, step: 0.1, default: 1 },
                  { id: 'c', label: 'c (mol/L)', min: 0.001, max: 0.1, step: 0.001, default: 0.01 },
                ],
                outputFormula: 'A = ε * l * c',
                outputLabel: 'Absorbância (A)',
                graph: true,
              }
            },
          ],
        },
        {
          id: '3.3',
          title: 'Limites de Aplicação da Lei',
          content: [
            {
              "id": "limites-intro-text",
              "type": "text",
              "format": "paragraph",
              "value": "A **Lei de Beer-Lambert** é aplicável apenas em condições ideais. Aqui estão algumas limitações:"
            },
            {
              "id": "limites-list",
              "type": "text",
              "format": "list",
              "value": "A concentração deve ser baixa, evitando interações entre moléculas.\n- A luz deve ser monocromática, com um comprimento de onda específico.\n- O solvente não deve absorver luz no mesmo comprimento de onda.\n- Não devem ocorrer reações químicas durante a medição."
            },
            {
              id: 'limites-cards',
              type: 'interactive',
              componentName: "InfoCards",
            
              props: {
                title: 'Limitações da Lei de Beer-Lambert',
                description: 'Clique em cada cartão para entender as limitações da lei.',
                cards: [
                  {
                    "title": "Altas Concentrações",
                    "description": "A Lei deixa de ser linear em concentrações elevadas, devido a interações intermoleculares.",
                    "icon": "vials" 
                  },
                  {
                    "title": "Luz Não Monocromática",
                    "description": "Fontes de luz com múltiplos comprimentos de onda afetam a precisão da medição.",
                    "icon": "spectrum" 
                  },
                  {
                    "title": "Reações Químicas",
                    "description": "Mudanças químicas na amostra durante a medição comprometem a validade dos dados.",
                    "icon": "react" 
                  },
                  {
                    "title": "Interferência do Solvente",
                    "description": "Solventes que absorvem na mesma faixa espectral afetam o resultado.",
                    "icon": "tint-slash" 
                  }
                ]
              }
            }
        ],
      },
    ],
  },
  {
      "id": "4",
      "title": "Partes de um Espectrofotômetro",
      "description": "Explore os componentes chave de um espectrofotômetro e como eles funcionam em conjunto.",
      "estimatedTime": "20 min",
      "pages": [
        {
          "id": "4.1",
          "title": "Componentes Principais",
          "content": [
            {
              "id": "partes-intro-text",
              "type": "text",
              "value": "Um espectrofotômetro é composto por diversas partes essenciais que trabalham em conjunto para medir a transmitância ou absorbância de uma amostra. Entender o papel de cada componente é fundamental para interpretar corretamente os dados obtidos.",
              "format": "paragraph"
            },
            {
              "id": "espectrofotometro-diagrama-image",
              "type": "image",
              "src": { "uri": "data:image/png;base64,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" },
              "alt": "Diagrama detalhado das partes de um espectrofotômetro.",
              "caption": "Componentes principais de um espectrofotômetro em sequência funcional."
            },
            {
              "id": "componentes-explicativos",
              "type": "interactive",
              "componentName": "InfoCards",
              "props": {
                "title": "Componentes do Espectrofotômetro",
                "description": "Toque em cada cartão para explorar os componentes.",
                "cards": [
                  {
                    "title": "Fonte de Luz",
                    "icon": "lightbulb",
                    "description": "Gera a luz inicial. Para espectros visíveis, usa-se lâmpada de tungstênio; para UV, lâmpada de deutério."
                  },
                  {
                    "title": "Monocromador",
                    "icon": "filter",
                    "description": "Isola o comprimento de onda desejado. Pode usar prismas, grades de difração ou filtros ópticos."
                  },
                  {
                    "title": "Cubeta",
                    "icon": "vial",
                    "description": "Pequeno recipiente onde a amostra líquida é colocada. Feita de vidro ou quartzo."
                  },
                  {
                    "title": "Detector",
                    "icon": "microchip",
                    "description": "Converte luz em sinal elétrico. Tipos comuns incluem fotodiodos e tubos fotomultiplicadores."
                  },
                  {
                    "title": "Sistema de Leitura",
                    "icon": "desktop",
                    "description": "Converte o sinal analógico em dados digitais para visualização e análise."
                  }
                ]
              }
            },
            {
              "id": "caminho-da-luz",
              "type": "interactive",
              "componentName": "StepFlow",
              "props": {
                "title": "O Caminho da Luz",
                "description": "Veja a jornada que a luz percorre dentro do espectrofotômetro.",
                "steps": [
                  { "label": "1", "title": "Emissão", "description": "A fonte emite luz de amplo espectro." },
                  { "label": "2", "title": "Seleção", "description": "O monocromador filtra e seleciona um comprimento de onda." },
                  { "label": "3", "title": "Interação", "description": "A luz atravessa a amostra na cubeta e parte é absorvida." },
                  { "label": "4", "title": "Detecção", "description": "O detector capta a luz transmitida e a converte em sinal elétrico." },
                  { "label": "5", "title": "Leitura", "description": "O sinal é processado e exibido como um resultado numérico." }
                ]
              }
            },
            {
              "id": "video-espectrofotometro",
              "type": "video",
              "src": "https://youtu.be/wS0va4G2UMA?si=7__ump5jhpEcPE-D",
              "alt": "Funcionamento de um espectrofotômetro em animação.",
              "caption": "Animação explicativa mostrando o funcionamento dos componentes.",
              "provider": "youtube"
            }
          ]
        }
      ]
  },

    {
      "id": "5",
      "title": "Tipos de Análises Possíveis",
      "description": "Descubra as diferentes aplicações analíticas da espectrofotometria.",
      "estimatedTime": "25 min",
      "pages": [
        {
          "id": "5.1",
          "title": "Visão Geral das Análises",
          "content": [
            {
              "id": "analises-intro-text",
              "type": "text",
              "value": "A espectrofotometria é uma técnica poderosa que pode ser aplicada em análises **quantitativas** e **qualitativas**. A seguir, exploraremos os principais tipos de análises possíveis com essa ferramenta.",
              "format": "paragraph"
            },
            {
              "id": "tipos-analises-cards",
              "type": "interactive",
              "componentName": "InfoCards",
              "props": {
                "title": "Tipos de Análises",
                "description": "Toque em cada tipo para descobrir sua função analítica.",
                "cards": [
                  { "title": "Curvas de Calibração", "description": "Relacionam absorbância com concentração conhecida." },
                  { "title": "Determinação de Concentração", "description": "Usa curvas ou a Lei de Beer-Lambert para obter valores desconhecidos." },
                  { "title": "Comparação de Absorvâncias", "description": "Avalia diferenças de concentração entre amostras." },
                  { "title": "Análises Espectrais", "description": "Permitem identificar substâncias pelo seu espectro característico." }
                ]
              }
            }
          ]
        },
        {
          "id": "5.2",
          "title": "Curvas de Calibração",
          "content": [
            {
              "id": "curvas-calibracao-text",
              "type": "text",
              "value": "Uma das aplicações mais comuns. Diversas soluções com **concentrações conhecidas** do analito são medidas em suas absorbâncias. A partir dos dados, é construído um **gráfico de absorbância vs. concentração**, que gera uma curva (geralmente linear) chamada **curva de calibração**.",
              "format": "paragraph"
            },
            {
              "id": "grafico-curva-calibracao",
              "type": "interactive",
              "componentName": "PlotSlider",
              "props": {
                "title": "Curva de Calibração Interativa",
                "caption": "Ajuste a concentração para ver como a absorbância muda na curva.",
                "xLabel": "Concentração (mol/L)",
                "yLabel": "Absorbância (A)",
                "formula": "1.25 * x",
                "domain": [0, 1]
              }
            },
            {
              "id": "calibracao-uso-text",
              "type": "text",
              "value": "Uma vez obtida a curva, podemos **interpolar** a absorbância de uma amostra desconhecida para estimar sua concentração.",
              "format": "paragraph"
            }
          ]
        },
        {
          "id": "5.3",
          "title": "Determinação de Concentração",
          "content": [
            {
              "id": "determinacao-concentracao-text",
              "type": "text",
              "value": "Se o coeficiente de absorção molar ($\\varepsilon$), o caminho óptico ($l$) e a absorbância ($A$) forem conhecidos, é possível aplicar diretamente a **Lei de Beer-Lambert** para calcular a concentração ($c$).",
              "format": "paragraph"
            },
            {
              "id": "beer-calc-simulador",
              "type": "interactive",
              "componentName": "FormulaSimulator",
              "props": {
                "title": "Simulador da Lei de Beer-Lambert",
                "formula": "A = ε * l * c",
                "variables": [
                  { "symbol": "A", "label": "Absorbância", "value": 0.5, "unit": "", "fixed": true },
                  { "symbol": "ε", "label": "ε (L·mol⁻¹·cm⁻¹)", "value": 1.25, "unit": "L/mol·cm" },
                  { "symbol": "l", "label": "Caminho óptico (cm)", "value": 1, "unit": "cm" },
                  { "symbol": "c", "label": "Concentração", "value": null, "unit": "mol/L", "solveFor": true }
                ]
              }
            }
          ]
        },
        {
          "id": "5.4",
          "title": "Comparação de Absorvâncias",
          "content": [
            {
              "id": "comparacao-absorvancias-text",
              "type": "text",
              "value": "A comparação direta de absorbâncias entre diferentes amostras permite uma **análise relativa da concentração**, especialmente útil quando não se deseja ou não se pode usar uma curva de calibração completa.",
              "format": "paragraph"
            },
            {
              "id": "comparacao-interativa",
              "type": "interactive",
              "componentName": "BarComparison",
              "props": {
                "title": "Comparação de Absorbâncias",
                "bars": [
                  { "label": "Amostra 1", "value": 0.6 },
                  { "label": "Amostra 2", "value": 0.9 }
                ]
              }
            }
          ]
        },
        {
          "id": "5.5",
          "title": "Análises em Diferentes Comprimentos de Onda",
          "content": [
            {
              "id": "analises-comprimentos-text",
              "type": "text",
              "value": "Ao escanear uma faixa de comprimentos de onda, obtemos um **espectro de absorção** que mostra como a absorbância varia com a energia da luz. Cada substância possui um espectro único, funcionando como uma \"impressão digital molecular\".",
              "format": "paragraph"
            },
            {
              "id": "espectro-interativo",
              "type": "interactive",
              "componentName": "SpectrumGraph",
              "props": {
                "title": "Espectro de Absorção",
                "xLabel": "Comprimento de Onda (nm)",
                "yLabel": "Absorbância",
                "spectrumData": {
                  "wavelengths": [200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400],
                  "absorbances": [0.1, 0.25, 0.55, 0.9, 1.1, 0.8, 0.5, 0.3, 0.15, 0.1, 0.05]
                }
              }
            },
            {
              "id": "aplicacoes-espectro-text",
              "type": "text",
              "value": "Esses espectros são frequentemente utilizados para **identificação qualitativa** de compostos em química analítica, farmacologia e bioquímica.",
              "format": "paragraph"
            }
          ]
        }
      ]
     },

  // 6. Módulo: Preparo de Soluções para Análise
  {
    "id": "6",
    "title": "Preparo de Soluções para Análise",
    "description": "Aprenda as melhores práticas para o preparo de soluções padrão e diluições.",
    "estimatedTime": "35 min",
    "prerequisites": ["principios-espectrofotometria-absorcao"],
    "pages": [
      {
        "id": "6.1",
        "title": "Importância do Preparo Correto",
        "content": [
          {
            "id": "preparo-importancia-text",
            "type": "text",
            "value": "O **preparo correto das soluções** é essencial para garantir a **exatidão e reprodutibilidade** nos resultados espectrofotométricos. Pequenos erros de pesagem, diluição ou contaminação podem impactar significativamente a absorbância medida.",
            "format": "paragraph"
          },
          {
            "id": "erros-comuns-cards",
            "type": "interactive",
            "componentName": "InfoCards",
            "props": {
              "title": "Erros Comuns no Preparo",
              "cards": [
                { "title": "Impurezas na substância", "icon": "times-circle", "description": "Afetam a concentração real e a precisão dos cálculos." },
                { "title": "Erro na pesagem", "icon": "balance-scale-right", "description": "Causa desvio na concentração esperada da solução padrão." },
                { "title": "Uso incorreto do balão volumétrico", "icon": "flask", "description": "Leitura incorreta do menisco pode alterar o volume final." }
              ]
            }
          }
        ]
      },
      {
        "id": "6.2",
        "title": "Conceito de Solução Padrão",
        "content": [
          {
            "id": "solucao-padrao-text",
            "type": "text",
            "value": "Uma **solução padrão** possui concentração conhecida com alta precisão. Pode ser preparada por:\n- **Pesagem direta** de uma substância pura.\n- **Diluição de uma solução mais concentrada**.\n\nEla é usada como **referência confiável** em calibrações e validações analíticas.",
            "format": "paragraph"
          },
          {
            "id": "tipos-solucao-padrao",
            "type": "interactive",
            "componentName": "ToggleExplanation",
            "props": {
              "title": "Tipos de Solução Padrão",
              "items": [
                { "label": "Primária", "content": "Preparada a partir de uma substância altamente pura, estável e não higroscópica. Ex: $Na_2CO_3$, $K_2Cr_2O_7$." },
                { "label": "Secundária", "content": "Concentração determinada por comparação com uma solução padrão primária. Útil quando o soluto não é suficientemente puro." }
              ]
            }
          }
        ]
      },
      {
        "id": "6.3",
        "title": "Diluições",
        "content": [
          {
            "id": "diluicoes-text",
            "type": "text",
            "value": "Diluir é reduzir a concentração de uma solução. A equação clássica usada é $C_1 \\cdot V_1 = C_2 \\cdot V_2$\n\nOnde:\n- $C_1$: concentração inicial\n- $V_1$: volume a ser retirado\n- $C_2$: concentração desejada\n- $V_2$: volume final",
            "format": "paragraph"
          },
          {
            "id": "simulador-diluicao",
            "type": "interactive",
            "componentName": "FormulaSimulator",
            "props": {
              "title": "Calculadora de Diluição",
              "formula": "C1*V1 = C2*V2",
              "variables": [
                { "symbol": "C1", "label": "C₁ (mol/L)", "value": 1.0, "unit": "mol/L" },
                { "symbol": "V1", "label": "V₁ (mL)", "value": null, "unit": "mL", "solveFor": true },
                { "symbol": "C2", "label": "C₂ (mol/L)", "value": 0.1, "unit": "mol/L" },
                { "symbol": "V2", "label": "V₂ (mL)", "value": 100, "unit": "mL" }
              ]
            }
          },
          {
            "id": "dica-vidrarias",
            "type": "text",
            "value": "**Dica**: Use pipetas graduadas para medir V₁ com exatidão e balões volumétricos para atingir V₂ com precisão.",
            "format": "note",
          }
        ]
      },
      {
        "id": "6.4",
        "title": "Exemplos Práticos de Cálculo",
        "content": [
          {
            "id": "exemplo-pratico-titulo-text",
            "type": "text",
            "value": "Exemplo: Preparo de 100 mL de solução 0,1 mol/L de $KMnO_4$",
            "format": "heading2"
          },
          {
            "id": "exemplo-pratico-text",
            "type": "text",
            "value": "1. **Cálculo da massa molar** do $KMnO_4$: 158,04 g/mol.\n2. **Cálculo da massa necessária**:\n$massa = M \\cdot V \\cdot MM = 0.1 \\text{ mol/L} \\cdot 0.1 \\text{ L} \\cdot 158.04 \\text{ g/mol} = 1.5804 \\text{ g}$\n3. Pese 1,58 g de $KMnO_4$.\n4. Transfira para balão volumétrico de 100 mL.\n5. Complete com água até a marca e agite bem.",
            "format": "paragraph"
          },
          {
            "id": "massa-preparo-simulador",
            "type": "interactive",
            "componentName": "FormulaSimulator",
            "props": {
              "title": "Calculadora de Massa",
              "formula": "massa = M * V * MM",
              "variables": [
                { "symbol": "M", "label": "Molaridade (mol/L)", "value": 0.2, "unit": "mol/L" },
                { "symbol": "V", "label": "Volume (L)", "value": 0.25, "unit": "L" },
                { "symbol": "MM", "label": "Massa molar (g/mol)", "value": 158.04, "unit": "g/mol" },
                { "symbol": "massa", "label": "Massa necessária", "value": null, "unit": "g", "solveFor": true }
              ]
            }
          }
        ]
      }
    ]
  },


  {
    "id": "7",
    "title": "Interpretação de Resultados",
    "description": "Aprenda a analisar gráficos e identificar erros comuns.",
    "estimatedTime": "20 min",
    "prerequisites": ["principios-espectrofotometria-absorcao", "preparo-solucoes-analise"],
    "pages": [
      {
        "id": "7.1",
        "title": "Como Ler um Gráfico",
        "content": [
          {
            "id": "interpretacao-intro-text",
            "type": "text",
            "value": "Após coletar os dados, a **interpretação correta dos resultados** é fundamental para tirar conclusões confiáveis sobre a concentração e pureza das amostras.",
            "format": "paragraph"
          },
          {
            "id": "grafico-absorvancia-explicacao",
            "type": "interactive",
            "componentName": "ImageHighlight",
            "props": {
              "title": "Anatomia de um Gráfico de Calibração",
              "src": { "uri": "https://i.imgur.com/your-chart-image.png" }, // Substitua pela URL da sua imagem de gráfico
              "highlights": [
                { "label": "Eixo X (Concentração)", "description": "Representa a concentração das soluções padrão ou da amostra.", "x": "30%", "y": "85%" },
                { "label": "Eixo Y (Absorbância)", "description": "Representa a absorbância medida pelo espectrofotômetro.", "x": "10%", "y": "50%" },
                { "label": "Linha de Tendência", "description": "Deve ser aproximadamente linear, seguindo a Lei de Beer-Lambert.", "x": "50%", "y": "50%" },
                { "label": "Ponto Fora da Curva", "description": "Pode indicar erro experimental ou desvio da linearidade.", "x": "70%", "y": "30%" }
              ]
            }
          }
        ]
      },
      {
        "id": "7.2",
        "title": "Erros Experimentais Comuns",
        "content": [
          {
            "id": "erros-comuns-intro",
            "type": "text",
            "value": "A **identificação de erros** é essencial para garantir que os dados sejam confiáveis. Muitos erros podem parecer pequenos, mas afetam diretamente o valor da absorbância e a precisão do resultado.",
            "format": "paragraph"
          },
          {
            "id": "erros-comuns-cards",
            "type": "interactive",
            "componentName": "InfoCards",
            "props": {
              "title": "Erros Frequentes em Espectrofotometria",
              "cards": [
                { "title": "Bolhas de ar na cubeta", "icon": "dot-circle", "description": "Interferem na passagem da luz, gerando leituras erradas." },
                { "title": "Cubetas sujas ou riscadas", "icon": "hand-sparkles", "description": "Causam absorção ou espalhamento de luz não relacionado à amostra." },
                { "title": "Diluição incorreta", "icon": "flask", "description": "Afeta diretamente a concentração final e a posição na curva de calibração." },
                { "title": "Variações de temperatura", "icon": "thermometer-half", "description": "Mudam a absorvância de substâncias sensíveis ao calor." }
              ]
            }
          },
          {
            "id": "dica-uso-padrao",
            "type": "text",
            "value": "Sempre utilize **soluções padrão** e revise os procedimentos antes de cada análise para minimizar erros sistemáticos.",
            "format": "note"
          }
        ]
      },
      {
        "id": "7.3",
        "title": "Análise Crítica dos Dados",
        "content": [
          {
            "id": "analise-critica-text",
            "type": "text",
            "value": "A **análise crítica dos resultados** vai além de olhar os números. Envolve:",
            "format": "paragraph"
          },
          {
            "id": "checklist-analise-critica",
            "type": "interactive",
            "componentName": "Checklist",
            "props": {
              "title": "Checklist de Boas Práticas",
              "items": [
                "Verifique a linearidade da curva de calibração (coeficiente de correlação $R^2$ próximo de 1).",
                "Avalie se a amostra está dentro da faixa da curva.",
                "Confirme a repetibilidade com replicatas (valores próximos entre si).",
                "Compare com valores de referência (literatura ou padrões).",
                "Considere os possíveis erros sistemáticos e aleatórios."
              ]
            }
          },
          {
            "id": "grafico-simulador-linearidade",
            "type": "interactive",
            "componentName": "LinearitySimulator",
            "props": {
              "title": "Simulador de Linearidade",
              "description": "Adicione pontos fora da curva para ver como a reta de regressão e o $R^2$ são afetados.",
              "initialData": [ { "x": 0.1, "y": 0.12 }, { "x": 0.2, "y": 0.25 }, { "x": 0.3, "y": 0.38 }, { "x": 0.4, "y": 0.50 } ]
            }
          },
          {
            "id": "conclusao-interpretacao",
            "type": "text",
            "value": "A confiabilidade dos resultados depende de toda a cadeia de preparação e análise. Interpretar bem significa **questionar, comparar e validar**.",
            "format": "note",
          }
        ]
      }
    ]
  }
];