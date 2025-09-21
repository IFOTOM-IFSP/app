import { Module } from "@/src/models";

export const fifthModule : Module = {
  id: "5",
  title: "Tipos de Análises Possíveis",
  description: "Descubra as diferentes aplicações analíticas da espectrofotometria.",
  estimatedTime: "25 min",
  iconName: 'file-tray-full-outline',
  iconColorName : 'warning',
  iconBackgroundColorName : 'warningBackground',
  nextModuleId : '6',
  pages : [
    {
      id :  "5.1" ,  
      title: "Visão Geral das Análises",
      content: [
          {
            id: "analises-intro-text",
            type: "text",
            value: "A espectrofotometria é uma técnica poderosa que pode ser aplicada em análises **quantitativas** e **qualitativas**. A seguir, exploraremos os principais tipos de análises possíveis com essa ferramenta.",
            format: "paragraph"
          },
          {
            id: "tipos-analises-cards",
            type: "interactive",
            componentName: "InfoCards",
            props: {
            title: "Tipos de Análises",
            description: "Toque em cada tipo para descobrir sua função analítica.",
            cards: [
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
        id: "5.2",
        title: "Curvas de Calibração",
        content: [
          {
            id: "curvas-calibracao-text",
            type: "text",
            value: "Uma das aplicações mais comuns. Diversas soluções com **concentrações conhecidas** do analito são medidas em suas absorbâncias. A partir dos dados, é construído um **gráfico de absorbância vs. concentração**, que gera uma curva (geralmente linear) chamada **curva de calibração**.",
            format: "paragraph"
          },
          {
            id: "importancia-coeficiente",
            type: "text",
            value: "A qualidade da curva é avaliada pelo Coeficiente de Correlação (R²). Um valor de R² próximo a 1 (ex: 0,999) indica uma boa linearidade e uma calibração confiável.",
            format: "blockquote",
          },
          {
            id: "grafico-curva-calibracao",
            type: "interactive",
            componentName: "PlotSlider",
            props: {
              title: "Curva de Calibração Interativa",
              caption: "Ajuste a concentração para ver como a absorbância muda na curva.",
              xLabel: "Concentração (mol/L)",
              yLabel: "Absorbância (A)",
              formula: "1.25 * x",
              domain: [0, 1]
            }
          },
          {
            id: "calibracao-uso-text",
            type: "text",
            value: "Uma vez obtida a curva, podemos **interpolar** a absorbância de uma amostra desconhecida para estimar sua concentração.",
            format: "paragraph"
          }
        ]
      },
      {
        id: "5.3",
        title: "Determinação de Concentração",
        content: [
          {
            id: "determinacao-concentracao-text",
            type: "text",
            value: "Se o coeficiente de absorção molar ($\\varepsilon$), o caminho óptico ($l$) e a absorbância ($A$) forem conhecidos, é possível aplicar diretamente a **Lei de Beer-Lambert** para calcular a concentração ($c$).",
            format: "paragraph"
          },
          {
            id: "beer-calc-simulador",
            type: "interactive",
            componentName: "FormulaSimulator",
            props: {
              title: "Simulador da Lei de Beer-Lambert",
              formula: "A = ε * l * c",
              variables: [
                { symbol: "A", label: "Absorbância", value: 0.5, unit: "", fixed: true },
                { symbol: "ε", label: "ε (L·mol⁻¹·cm⁻¹)", value: 1.25, unit: "L/mol·cm" },
                { symbol: "l", label: "Caminho óptico (cm)", value: 1, unit: "cm" },
                { symbol: "c", label: "Concentração", value: null, unit: "mol/L", solveFor: true }
              ]
            }
          },
          {
            id: "contextualizando",
            type: "text",
            value: "Este método é rápido, mas menos robusto que a curva de calibração, pois o valor de ε pode ser sensível a pequenas variações no solvente ou na temperatura. Por isso, a calibração com padrões é o método preferido na maioria dos laboratórios de controle de qualidade.",
            format: "blockquote",
          },
        ]
      },
      {
        id: "5.4",
        title: "Comparação de Absorvâncias",
        content: [
          {
            id: "comparacao-absorvancias-text",
            type: "text",
            value: "A comparação direta de absorbâncias entre diferentes amostras permite uma **análise relativa da concentração**, especialmente útil quando não se deseja ou não se pode usar uma curva de calibração completa.",
            format: "paragraph"
          },
          {
            id: "comparacao-interativa",
            type: "interactive",
            componentName: "BarComparison",
            props: {
              title: "Comparação de Absorbâncias",
              bars: [
                { label: "Amostra 1", value: 0.6 },
                { label: "Amostra 2", value: 0.9 }
              ]
            }
          }
        ]
      },
      {
        id: "5.5",
        title: "Análises em Diferentes Comprimentos de Onda",
        content: [
          {
            id: "analises-comprimentos-text",
            type: "text",
            value: "Ao escanear uma faixa de comprimentos de onda, obtemos um **espectro de absorção** que mostra como a absorbância varia com a energia da luz. Cada substância possui um espectro único, funcionando como uma \"impressão digital molecular\".",
            format: "paragraph"
          },
          {
            id: "espectro-interativo",
            type: "interactive",
            componentName: "SpectrumGraph",
            props: {
              title: "Espectro de Absorção",
              xLabel: "Comprimento de Onda (nm)",
              yLabel: "Absorbância",
              spectrumData: {
                wavelengths: [200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400],
                absorbances: [0.1, 0.25, 0.55, 0.9, 1.1, 0.8, 0.5, 0.3, 0.15, 0.1, 0.05]
              }
            }
          },
            {
            id: "introduzir",
            type: "text",
            value: "O pico do espectro, conhecido como lambda máximo (λmax), representa o comprimento de onda onde a substância absorve mais luz. Para análises quantitativas (como na curva de calibração), as medições são idealmente feitas neste comprimento de onda, pois ele oferece a maior sensibilidade e minimiza erros.",
            format: "blockquote",
          },
          {
            id: "aplicacoes-espectro-text",
            type: "text",
            value: "Esses espectros são frequentemente utilizados para **identificação qualitativa** de compostos em química analítica, farmacologia e bioquímica.",
            format: "paragraph"
          }
        ]
      }
  ]
}
