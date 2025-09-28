import { Module } from "@/src/models";

export const thirdModule: Module = {
  id: '3',
  title: 'Princípios da Espectrofotometria de Absorção',
  description: 'Aprofunde-se nos conceitos de absorbância, transmitância e a fundamental Lei de Beer-Lambert.',
  estimatedTime: '30 min',
  iconName: 'flask-outline',
  iconColorName: 'green',
  iconBackgroundColorName: 'greenBackground',
  thumbnailUrl: require("@/assets/images/banner_mod_3.png"),
  nextModuleId: '4',
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
            id: "beer-lambert-variaveis-intro",
            type: "text",
            value: "Onde cada termo da equação significa:",
            format: "paragraph" 
          },
          {
            id: "beer-lambert-variaveis-list",
            type: "list",
            format: "bullet",
            items: [
              "$A$ = Absorbância\n", 
              "$\\varepsilon$ = Coeficiente de absorção molar ($\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}$)\n",
              "$l$ = Caminho óptico (cm)\n",
              "$c$ = Concentração da substância ($\\text{mol} \\cdot \\text{L}^{-1}$)"
            ],
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
            id: "limites-intro-text",
            type: "text",
            format: "paragraph",
            value: "A **Lei de Beer-Lambert** é aplicável apenas em condições ideais. Aqui estão algumas limitações:"
          },
          {
            id: "limites-list",
            type: "list",
            format: "bullet",
            items: [
              "A concentração deve ser baixa, evitando interações entre moléculas.\n",
              "A luz deve ser monocromática, com um comprimento de onda específico.\n", 
              "O solvente não deve absorver luz no mesmo comprimento de onda.\n", 
              "Não devem ocorrer reações químicas durante a medição."
            ]
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
}