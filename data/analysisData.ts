import { InfoCardData, TypesAnalysisData } from "@/src/models/analysis";

export const INFO_CARD_DATA: InfoCardData[] = [
  {
    title: "Minhas Análises",
    subtitle: "Clique para ver suas análises",
    largeNumber: "1",
    smallIcon: require("@/assets/images/icon_analysis.png"),
    route: "/analyses",
  },
  {
    title: "Aparelhos calibrados",
    subtitle: "Clique para ver seus aparelhos salvos",
    largeNumber: "2",
    smallIcon: require("@/assets/images/spectrophotometer.png"),
    route: "/devices",
  },
  {
    title: "Curvas de calibração",
    subtitle: "Clique para ver suas curvas",
    largeNumber: "3",
    smallIcon: require("@/assets/images/color_wheel.png"),
    route: "/calibration-curves",
  },
  {
    title: "Conversor de unidades",
    subtitle: "Clique para converter unidades",
    largeNumber: "4",
    smallIcon: require("@/assets/images/math.png"),
    route: "/unit-converter",
  },
];

export const TYPES_ANALYSIS_DATA: TypesAnalysisData[] = [
    {
      id: "quantitative",
      title: "Análise Quantitativa",
      icon: "beaker-outline",
      subtitle: "Cálculo de Concentração",
      keyQuestion: "Quanto tem?",
      explanation:
        "Este método determina a concentração exata de uma substância em uma amostra líquida. É a análise mais comum para controle de qualidade e medições ambientais.",
      howItWorks: [
        "Primeiro, você mede amostras com concentrações conhecidas (padrões) para criar uma 'régua' chamada Curva de Calibração.",
        "Em seguida, o aparelho mede sua amostra desconhecida e usa essa 'régua' para calcular a concentração precisa.",
        "A medição é feita em um comprimento de onda (cor) específico onde a substância absorve mais luz.",
      ],
      useCases: [
        "Verificar a concentração de um produto.",
        "Analisar a quantidade de um poluente na água.",
        "Realizar exames bioquímicos.",
      ],
      enabled: true,
    },
    {
      id: "scan",
      title: "Análise de Varredura",
      icon: "chart-bell-curve-cumulative",

      subtitle: "Espectro Completo",
      keyQuestion: "Qual é a 'impressão digital' da amostra?",
      explanation:
        "Este modo não mede a concentração, mas sim cria um perfil completo de como a sua amostra interage com todas as cores de luz visível. O resultado é um gráfico que funciona como uma 'impressão digital' da substância.",
      howItWorks: [
        "O aparelho mede a absorbância da amostra em todos os comprimentos de onda disponíveis de uma só vez.",
        "O resultado é um gráfico do espectro de absorção, mostrando os picos onde a amostra absorve mais luz.",
      ],
      useCases: [
        "Encontrar o comprimento de onda ideal (λmax) para realizar uma Análise Quantitativa precisa.",
        "Caracterizar uma nova substância.",
        "Verificar a pureza de uma amostra (procurando por picos inesperados).",
      ],
      enabled: false,
    },
    {
      id: "kinetic",
      title: "Análise Cinética",
      icon: "clock-fast",
      subtitle: "Variação no Tempo",
      keyQuestion: "Com que velocidade a amostra está mudando?",
      explanation:
        "Este método monitora como a absorbância de uma amostra muda ao longo do tempo. É como 'filmar' uma reação química para ver o quão rápido ela acontece.",
      howItWorks: [
        "O aparelho realiza medições contínuas da mesma amostra em um único comprimento de onda em intervalos de tempo definidos.",
        "O resultado é um gráfico de Absorbância vs. Tempo, que permite calcular a velocidade (taxa) da reação.",
      ],
      useCases: [
        "Estudar a velocidade de reações enzimáticas.",
        "Monitorar a degradação de um composto sob a luz.",
        "Acompanhar processos de descoloração ou formação de cor.",
      ],
      enabled: false,
    },
]