import { Module } from "@/src/models";

export const sixthModule: Module = {
  id: "6",
  title: "Preparo de Soluções para Análise",
  description: "Aprenda as melhores práticas para o preparo de soluções padrão e diluições.",
  estimatedTime: "35 min",
  prerequisites: ["principios-espectrofotometria-absorcao"],
  iconName: 'flask-outline',
  iconColorName: 'blue',
  iconBackgroundColorName: 'blueBackground',
  thumbnailUrl: require("@/assets/images/banner_mod_6.png"),
  nextModuleId: '7',
  pages: [
    {
      id: "6.1",
      title: "Importância do Preparo Correto",
      content: [
        {
          id: "preparo-importancia-text",
          type: "text",
          value: "O **preparo correto das soluções** é essencial para garantir a **exatidão e reprodutibilidade** nos resultados espectrofotométricos. Pequenos erros de pesagem, diluição ou contaminação podem impactar significativamente a absorbância medida.",
          format: "paragraph"
        },
        {
          id: "erros-comuns-cards",
          type: "interactive",
          componentName: "InfoCards",
          props: {
            title: "Erros Comuns no Preparo",
            cards: [
              { title: "Impurezas na substância", icon: "times-circle", description: "Afetam a concentração real e a precisão dos cálculos." },
              { title: "Erro na pesagem", icon: "balance-scale-right", description: "Causa desvio na concentração esperada da solução padrão." },
              { title: "Uso incorreto do balão volumétrico", icon: "flask", description: "Leitura incorreta do menisco pode alterar o volume final." }
            ]
          }
        }
      ]
    },
    {
      id: "6.2",
      title: "Conceito de Solução Padrão",
      content: [
        {
          id: "solucao-padrao-text",
          type: "text",
          value: "Uma **solução padrão** possui concentração conhecida com alta precisão. Pode ser preparada por:",
          format: "paragraph"
        },
        {
          id: "solucao-padrao-list",
          type: "list",
          items: [
            "**Pesagem direta** de uma substância pura.\n",
            "**Diluição de uma solução mais concentrada**."
          ],
          format: 'bullet'
        },
        {
          id: "solucao-padrao-text-final",
          type: "text",
          value: "Ela é usada como **referência confiável** em calibrações e validações analíticas.",
          format: "paragraph"
        },
        {
          id: "tipos-solucao-padrao",
          type: "interactive",
          componentName: "ToggleExplanation",
          props: {
            title: "Tipos de Solução Padrão",
            items: [
              { label: "Primária", content: "Preparada a partir de uma substância altamente pura, estável e não higroscópica. Ex: $Na_2CO_3$, $K_2Cr_2O_7$." },
              { label: "Secundária", content: "Concentração determinada por comparação com uma solução padrão primária. Útil quando o soluto não é suficientemente puro." }
            ]
          }
        }
      ]
    },
    {
      id: "6.3",
      title: "Diluições",
      content: [
        {
          id: "diluicoes-text",
          type: "text",
          value: "Diluir é reduzir a concentração de uma solução. A equação clássica usada é: \n$C_1 \\cdot V_1 = C_2 \\cdot V_2$\n\nOnde:",
          format: "paragraph"
        },
        {
          id: "diluicoes-list",
          type: "list",
          items: [
            "$C_1$: concentração inicial\n", 
            "$V_1$: volume a ser retirado\n", 
            "$C_2$: concentração desejada\n- $V_2$: volume final",
          ],
          format: "bullet"
        },
        {
          id: "simulador-diluicao",
          type: "interactive",
          componentName: "FormulaSimulator",
          props: {
            title: "Calculadora de Diluição",
            formula: "C1*V1 = C2*V2",
            variables: [
              { symbol: "C1", label: "C₁ (mol/L)", value: 1.0, unit: "mol/L" },
              { symbol: "V1", label: "V₁ (mL)", value: null, unit: "mL", solveFor: true },
              { symbol: "C2", label: "C₂ (mol/L)", value: 0.1, unit: "mol/L" },
              { symbol: "V2", label: "V₂ (mL)", value: 100, unit: "mL" }
            ]
          }
        },
        {
          id: "dica-vidrarias",
          type: "text",
          value: "**Dica**: Use pipetas graduadas para medir V₁ com exatidão e balões volumétricos para atingir V₂ com precisão.",
          format: "note"
        }
      ]
    },
    {
      id: "6.4",
      title: "Exemplos Práticos de Cálculo",
      content: [
        {
          id: "exemplo-pratico-titulo-text",
          type: "text",
          value: "Exemplo: Preparo de 100 mL de solução 0,1 mol/L de $KMnO_4$",
          format: "heading2"
        },
        {
          id: "exemplo-pratico-text",
          type: "text",
          value: "1. **Cálculo da massa molar** do $KMnO_4$: 158,04 g/mol.\n2. **Cálculo da massa necessária**:\n$massa = M \\cdot V \\cdot MM = 0.1 \\text{ mol/L} \\cdot 0.1 \\text{ L} \\cdot 158.04 \\text{ g/mol} = 1.5804 \\text{ g}$\n3. Pese 1,58 g de $KMnO_4$.\n4. Transfira para balão volumétrico de 100 mL.\n5. Complete com água até a marca e agite bem.",
          format: "paragraph"
        },
        {
          id: "massa-preparo-simulador",
          type: "interactive",
          componentName: "FormulaSimulator",
          props: {
            title: "Calculadora de Massa",
            formula: "massa = M * V * MM",
            variables: [
              { symbol: "M", label: "Molaridade (mol/L)", value: 0.2, unit: "mol/L" },
              { symbol: "V", label: "Volume (L)", value: 0.25, unit: "L" },
              { symbol: "MM", label: "Massa molar (g/mol)", value: 158.04, unit: "g/mol" },
              { symbol: "massa", label: "Massa necessária", value: null, unit: "g", solveFor: true }
            ]
          }
        }
      ]
    },
    {
      id: "6.5",
      title: "Técnica de Diluição Serial",
      content: [
        {
          id: "serial-dilution-intro",
          type: "text",
          value: "Para construir uma curva de calibração, precisamos de vários padrões com concentrações decrescentes. A **diluição serial** é a técnica mais eficiente e precisa para isso. Ela consiste em preparar a primeira solução e, a partir dela, preparar a segunda; da segunda, preparar a terceira, e assim por diante.",
          format: "paragraph"
        },
        {
          id: "serial-dilution-image",
          type: "image",
          src: { uri: "https://i.ytimg.com/vi/Fq3ssyYgP_A/maxresdefault.jpg" },
          alt: "Diagrama ilustrando o processo de diluição serial.",
          caption: "A partir de uma solução estoque, cada nova solução é preparada diluindo-se a anterior."
        },
        {
          id: "serial-dilution-vantagens",
          type: "text",
          value: "A principal vantagem é a **redução de erros de pipetagem cumulativos** e a economia de reagente, pois se parte de um único padrão estoque.",
          format: "paragraph"
        },
        {
          id: "serial-dilution-exemplo",
          type: "interactive",
          componentName: "StepFlow",
          props: {
            title: "Exemplo: Preparando uma Curva de Calibração",
            description: "Partindo de uma solução estoque de 100 mg/L:",
            steps: [
              { label: "1", title: "Padrão 1 (10 mg/L)", description: "Pipete 10 mL da solução estoque para um balão volumétrico de 100 mL e complete o volume." },
              { label: "2", title: "Padrão 2 (1 mg/L)", description: "Pipete 10 mL do Padrão 1 para um novo balão de 100 mL e complete o volume." },
              { label: "3", title: "Padrão 3 (0.1 mg/L)", description: "Pipete 10 mL do Padrão 2 para um terceiro balão de 100 mL e complete o volume." }
            ]
          }
        }
      ]
    }
  ]
};