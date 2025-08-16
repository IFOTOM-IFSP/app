import { Module } from "@/models";

export const secondModule: Module = {
    id: '2',
    title: 'Luz e Matéria',
    description: 'Entenda os conceitos de luz, o espectro eletromagnético e a interação da luz com a matéria.',
    estimatedTime: '20 min',
    iconName: 'bulb-outline',
    iconColorName: 'blue',
    iconBackgroundColorName: 'blueBackground',
    nextModuleId: '3',
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
            type: 'list',
            items: [
              "As três principais formas de interação entre a luz e a matéria são:",
              "**Absorção**: Parte da energia da luz é absorvida pela matéria. Isso pode excitar elétrons em átomos ou moléculas para níveis de energia mais altos. A intensidade da luz transmitida diminui.",
              "**Transmissão**: A luz atravessa o material sem ser absorvida. Esse fenômeno é comum em substâncias transparentes, como vidro ou soluções diluídas.",
              "**Reflexão**: A luz é rebatida na superfície do material, podendo ser parcial (em superfícies transparentes) ou total (em materiais opacos como metais)."
            ],
            format: 'bullet',
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
}