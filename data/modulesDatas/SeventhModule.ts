import { Module } from "@/src/models";

export const seventhModule: Module = {
  id: "7",
  title: "Interpretação de Resultados",
  description: "Aprenda a analisar gráficos e identificar erros comuns.",
  estimatedTime: "20 min",
  prerequisites: ["principios-espectrofotometria-absorcao", "preparo-solucoes-analise"],
  iconName: 'analytics-outline',
  iconColorName: 'pink',
  iconBackgroundColorName: 'pinkBackground',
  nextModuleId: null,
  pages: [
    {
      id: "7.1",
      title: "Como Ler um Gráfico",
      content: [
        {
          id: "interpretacao-intro-text",
          type: "text",
          value: "Após coletar os dados, a **interpretação correta dos resultados** é fundamental para tirar conclusões confiáveis sobre a concentração e pureza das amostras.",
          format: "paragraph"
        },
        {
          id: "grafico-absorvancia-explicacao",
          type: "interactive",
          componentName: "ImageHighlight",
          props: {
            title: "Anatomia de um Gráfico de Calibração",
            src: { "uri": "" },
            highlights: [
              { label: "Eixo X (Concentração)", description: "Representa a concentração das soluções padrão ou da amostra.", x: "30%", y: "85%" },
              { label: "Eixo Y (Absorbância)", description: "Representa a absorbância medida pelo espectrofotômetro.", x: "10%", y: "50%" },
              { label: "Linha de Tendência", description: "Deve ser aproximadamente linear, seguindo a Lei de Beer-Lambert.", x: "50%", y: "50%" },
              { label: "Ponto Fora da Curva", description: "Pode indicar erro experimental ou desvio da linearidade.", x: "70%", y: "30%" }
            ]
          }
        }
      ]
    },
    {
      id: "7.2",
      title: "Erros Experimentais Comuns",
      content: [
        {
          id: "erros-comuns-intro",
          type: "text",
          value: "A **identificação de erros** é essencial para garantir que os dados sejam confiáveis. Muitos erros podem parecer pequenos, mas afetam diretamente o valor da absorbância e a precisão do resultado.",
          format: "paragraph"
        },
        {
          id: "erros-comuns-cards",
          type: "interactive",
          componentName: "InfoCards",
          props: {
            title: "Erros Frequentes em Espectrofotometria",
            cards: [
              { title: "Bolhas de ar na cubeta", icon: "dot-circle", description: "Interferem na passagem da luz, gerando leituras erradas." },
              { title: "Cubetas sujas ou riscadas", icon: "hand-sparkles", description: "Causam absorção ou espalhamento de luz não relacionado à amostra." },
              { title: "Diluição incorreta", icon: "flask", description: "Afeta diretamente a concentração final e a posição na curva de calibração." },
              { title: "Variações de temperatura", icon: "thermometer-half", description: "Mudam a absorvância de substâncias sensíveis ao calor." }
            ]
          }
        },
        {
          id: "dica-uso-padrao",
          type: "text",
          value: "Sempre utilize **soluções padrão** e revise os procedimentos antes de cada análise para minimizar erros sistemáticos.",
          format: "note"
        }
      ]
    },
    {
      id: "7.3",
      title: "Análise Crítica dos Dados",
      content: [
        {
          id: "analise-critica-text",
          type: "text",
          value: "A **análise crítica dos resultados** vai além de olhar os números. Envolve:",
          format: "paragraph"
        },
        {
          id: "checklist-analise-critica",
          type: "interactive",
          componentName: "Checklist",
          props: {
            title: "Checklist de Boas Práticas",
            items: [
              "Verifique a linearidade da curva de calibração (coeficiente de correlação $R^2$ próximo de 1).",
              "Avalie se a amostra está dentro da faixa da curva.",
              "Confirme a repetibilidade com replicatas (valores próximos entre si).",
              "Compare com valores de referência (literatura ou padrões).",
              "Considere os possíveis erros sistemáticos e aleatórios."
            ]
          }
        },
        {
          id: "grafico-simulador-linearidade",
          type: "interactive",
          componentName: "LinearitySimulator",
          props: {
            title: "Simulador de Linearidade",
            description: "Adicione pontos fora da curva para ver como a reta de regressão e o $R^2$ são afetados.",
            initialData: [{ x: 0.1, y: 0.12 }, { x: 0.2, y: 0.25 }, { x: 0.3, y: 0.38 }, { x: 0.4, y: 0.50 }]
          }
        },
        {
          id: "conclusao-interpretacao",
          type: "text",
          value: "A confiabilidade dos resultados depende de toda a cadeia de preparação e análise. Interpretar bem significa **questionar, comparar e validar**.",
          format: "note"
        }
      ]
    },
    {
      id: "7.4",
      title: "Parabéns e Próximos Passos",
      content: [
        {
          id: "parabens-text",
          type: "text",
          value: "🎉 **Parabéns!** Você concluiu com sucesso a jornada de aprendizado sobre os fundamentos da espectrofotometria. Você agora possui o conhecimento teórico e prático para entender essa poderosa técnica analítica.",
          format: "paragraph"
        },
        {
          id: "revisao-habilidades-heading",
          type: "text",
          value: "O que você aprendeu:",
          format: "heading2"
        },
        {
          id: "revisao-habilidades-list",
          type: "list",
          items: [
            "✓ Os princípios da interação entre luz e matéria.\n", 
            "✓ A Lei de Beer-Lambert e os cálculos de concentração.\n", 
            "✓ O funcionamento e os componentes de um espectrofotômetro.\n", 
            "✓ As boas práticas de preparo de soluções e calibração.\n",
            "✓ Como interpretar e validar criticamente os resultados."
          ],
          format: "bullet"
        },
        {
          id: "proximos-passos-text",
          type: "text",
          value: "O conhecimento é uma jornada contínua. Continue explorando, praticando em laboratórios (reais ou virtuais) e aplicando esses conceitos em suas áreas de estudo e trabalho. A precisão está nos detalhes!",
          format: "note"
        },
        {
          id: "conclusao-final-app",
          type: "text",
          value: "Fim do Curso",
          format: "heading1"
        }
      ]
    }
  ]
};