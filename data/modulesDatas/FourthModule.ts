import { Module } from "@/models";

export const fourthModule: Module = {
"id": "4",
    "title": "Partes de um Espectrofotômetro",
    "description": "Explore os componentes chave de um espectrofotômetro e como eles funcionam em conjunto.",
    "estimatedTime": "20 min",
    "iconName": 'settings-outline',
    "iconColorName": 'pink',
    "iconBackgroundColorName": 'pinkBackground',
    "nextModuleId": '5',
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
      },
      {
        "id": "4.2",
        "title": "Tipos de Arranjos Ópticos",
        "content": [
          {
            "id": "arranjos-intro-text",
            "type": "text",
            "value": "Embora os componentes básicos sejam os mesmos, os espectrofotômetros podem ser construídos com dois arranjos ópticos principais: **Feixe Simples** e **Feixe Duplo**. A escolha do arranjo afeta a estabilidade e a forma como as medições são realizadas.",
            "format": "paragraph"
          },
          {
            "id": "arranjos-diagrama-comparativo",
            "type": "image",
            "src": { "uri": "https://i.ytimg.com/vi/f2n21gBWr5k/maxresdefault.jpg" },
            "alt": "Diagrama comparando os caminhos da luz em espectrofotômetros de feixe simples e feixe duplo.",
            "caption": "Diferença visual entre o arranjo de feixe simples (acima) e feixe duplo (abaixo)."
          },
          {
            "id": "feixe-simples-heading",
            "type": "text",
            "value": "Arranjo de Feixe Simples (Single Beam)",
            "format": "heading2"
          },
          {
            "id": "feixe-simples-text",
            "type": "text",
            "value": "Neste arranjo, toda a luz do monocromador passa através da cubeta para chegar ao detector. Para fazer uma medição, o operador primeiro insere o **'branco'** (solvente puro) para zerar o equipamento. Em seguida, o branco é removido e a **amostra** é inserida para a leitura da absorbância. É um design mais simples e de menor custo.",
            "format": "paragraph"
          },
          {
              "id": "feixe-duplo-heading",
              "type": "text",
              "value": "Arranjo de Feixe Duplo (Double Beam)",
              "format": "heading2"
            },
            {
              "id": "feixe-duplo-text",
              "type": "text",
              "value": "Este arranjo mais sofisticado divide o feixe de luz em dois caminhos separados. Um feixe passa pela amostra, enquanto o outro passa simultaneamente pelo branco. O equipamento compara a intensidade dos dois feixes em tempo real. Isso corrige automaticamente flutuações na fonte de luz ou a absorbância do solvente, resultando em medições mais estáveis e precisas, ideais para análises longas.",
              "format": "paragraph"
            },
          {
              "id": "arranjos-comparacao-cards",
              "type": "interactive",
              "componentName": "InfoCards",
              "props": {
                "title": "Vantagens e Desvantagens",
                "description": "",
                "cards": [
                  {
                    "title": "Feixe Simples",
                    "icon": "analytics-outline",
                    "description": "**Prós:** Mais barato, menos componentes ópticos. **Contras:** Menos estável, suscetível a variações da lâmpada. Requer zerar o branco manualmente."
                  },
                  {
                    "title": "Feixe Duplo",
                    "icon": "git-compare-outline",
                    "description": "**Prós:** Alta estabilidade, correção automática de variações. **Contras:** Mais caro, opticamente mais complexo."
                  }
                ]
              }
            }
        ]
      },
      {
          "id": "4.3",
          "title": "Boas Práticas e Erros Comuns",
          "content": [
            {
              "id": "boas-praticas-intro",
              "type": "text",
              "value": "A precisão de uma análise espectrofotométrica não depende apenas do equipamento, mas também do cuidado do analista. Erros simples no manuseio podem levar a resultados incorretos. Aqui estão as boas práticas essenciais.",
              "format": "paragraph"
            },
            {
              "id": "boas-praticas-cards",
              "type": "interactive",
              "componentName": "InfoCards",
              "props": {
                "title": "Cuidados Essenciais com a Cubeta",
                "description": "Toque em cada cartão para ver uma dica crucial.",
                "cards": [
                  {
                    "title": "Manuseio Correto",
                    "icon": "hand-left-outline",
                    "description": "Sempre segure a cubeta pelas faces foscas. Impressões digitais nas faces transparentes (caminho óptico) absorvem luz, especialmente UV, e causam erros significativos."
                  },
                  {
                    "title": "Orientação Consistente",
                    "icon": "swap-horizontal-outline",
                    "description": "Pequenas imperfeições no material da cubeta podem afetar a leitura. Insira a cubeta sempre na mesma orientação. Muitas cubetas têm uma marca para ajudar."
                  },
                  {
                    "title": "Ausência de Bolhas",
                    "icon": "water-outline",
                    "description": "Bolhas de ar na amostra espalham a luz, resultando em leituras de absorbância falsamente altas. Inspecione a cubeta contra a luz e dê leves batidas para remover quaisquer bolhas."
                  },
                  {
                    "title": "Limpeza e 'Branco'",
                    "icon": "flask-outline",
                    "description": "A cubeta deve estar perfeitamente limpa. O 'branco' (ou blank) é usado para zerar o aparelho, descontando a absorbância do solvente e da própria cubeta. Ele deve ser tratado com o mesmo cuidado da amostra."
                  }
                ]
              }
            },
            {
              "id": "erros-comuns-heading",
              "type": "text",
              "value": "Outras Fontes de Erro",
              "format": "heading2"
            },
            {
              "id": "erros-comuns-text",
              "type": "text",
              "value": "**Luz Espúria (Stray Light):** É qualquer luz que atinge o detector sem ter passado pelo caminho óptico correto (monocromador e amostra). É uma das principais causas de desvio da linearidade da Lei de Beer-Lambert, especialmente em amostras com alta absorbância.",
              "format": "paragraph"
            }
          ]
        }
    ]
}