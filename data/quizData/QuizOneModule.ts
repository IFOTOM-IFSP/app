import { Quiz } from "@/models";

export const quizOneModule: Quiz[] = [
  {
    id: "101",
    title: "Introdução aos Fundamentos",
    description: "Um teste rápido sobre os conceitos mais básicos da espectrofotometria.",
    moduleId: "1",
    difficulty: "Fácil",
    questions: [
      {
        id: "q101_1",
        question: "Qual é o principal objetivo da espectrofotometria de absorção?",
        options: ["Medir o peso de uma amostra", "Identificar a cor de uma solução", "Quantificar a concentração de uma substância", "Separar diferentes compostos"],
        answerIndex: 2,
        explanation: "A espectrofotometria de absorção é uma técnica primariamente quantitativa, usada para determinar a concentração de um analito com base na quantidade de luz que ele absorve."
      },
      {
        id: "q101_2",
        question: "Qual item é inserido no espectrofotômetro para a leitura?",
        options: ["Tubo de ensaio", "Placa de Petri", "Cuveta", "Béquer"],
        answerIndex: 2,
        explanation: "A cuveta é o recipiente óptico padrão, com paredes transparentes e um caminho óptico definido, projetado especificamente para uso em espectrofotômetros."
      }
    ]
  },
  {
    id: "102",
    title: "Conceitos Intermediários de Introdução",
    description: "Aprofunde seu conhecimento sobre os termos e objetivos iniciais da técnica.",
    moduleId: "1",
    difficulty: "Médio",
    questions: [
      {
        id: "q102_1",
        question: "A espectrofotometria pode ser usada para análises qualitativas. Como?",
        options: ["Medindo a densidade da amostra", "Comparando o espectro de absorção da amostra com um padrão", "Observando a mudança de temperatura", "Calculando a massa molar do analito"],
        answerIndex: 1,
        explanation: "Uma análise qualitativa busca identificar 'o que é'. Ao obter o espectro de absorção completo de uma amostra e compará-lo com o espectro de uma substância conhecida, é possível confirmar sua identidade."
      },
      {
        id: "q102_2",
        question: "Qual a diferença fundamental entre Absorbância e Transmitância?",
        options: ["São a mesma coisa", "Absorbância mede a luz que passa, Transmitância mede a luz bloqueada", "Absorbância é uma escala logarítmica, Transmitância é linear (percentual)", "Apenas a Absorbância é usada para cálculos"],
        answerIndex: 2,
        explanation: "A Transmitância (T) é a fração de luz que atravessa a amostra (T = I/I₀). A Absorbância (A) é o logaritmo negativo da transmitância (A = -log(T)), e é a medida que se relaciona linearmente com a concentração."
      },
      {
        id: "q102_3",
        question: "O que significa 'zerar' o equipamento com um 'branco'?",
        options: ["Desligar e ligar o aparelho", "Ajustar o equipamento para ignorar a absorção do solvente e da cuveta", "Usar uma amostra de ar como referência", "Limpar a cuveta antes do uso"],
        answerIndex: 1,
        explanation: "O 'branco' contém tudo exceto o analito. Ao 'zerar' com ele, o equipamento estabelece uma linha de base de 100% de transmitância (ou 0 de absorbância), garantindo que a medição subsequente se deva apenas ao analito."
      }
    ]
  },
    {
    id: "103",
    title: "Desafio Introdutório",
    description: "Teste seu conhecimento sobre as nuances e aplicações iniciais da espectrofotometria.",
    moduleId: "1",
    difficulty: "Difícil",
    questions: [
      {
        id: "q103_1",
        question: "A espectrofotometria é mais adequada para analisar amostras em qual estado físico?",
        options: ["Sólido", "Gasoso", "Líquido (soluções)", "Plasma"],
        answerIndex: 2,
        explanation: "Embora existam acessórios para amostras sólidas e gasosas, a aplicação mais comum e direta da espectrofotometria UV-Vis é na análise de analitos dissolvidos em um solvente, ou seja, em soluções líquidas."
      },
      {
        id: "q103_2",
        question: "Qual das seguintes aplicações NÃO é um uso comum da espectrofotometria?",
        options: ["Determinação da concentração de DNA em uma amostra", "Controle de qualidade de corantes em alimentos", "Análise da composição de gases em um exaustor", "Monitoramento de reações enzimáticas"],
        answerIndex: 2,
        explanation: "Embora a espectroscopia possa ser usada para gases (geralmente na região do infravermelho), a análise de gases de exaustão é mais comumente realizada por outras técnicas, como a cromatografia gasosa ou sensores eletroquímicos."
      },
      {
        id: "q103_3",
        question: "O que limita a faixa superior de concentração que pode ser medida com precisão?",
        options: ["A intensidade da lâmpada", "A sensibilidade do detector e a luz espúria", "O material da cuveta", "A temperatura do laboratório"],
        answerIndex: 1,
        explanation: "Em altas concentrações, muito pouca luz chega ao detector, tornando o sinal fraco e suscetível a ruídos. Além disso, a luz espúria (luz indesejada) se torna proporcionalmente maior, causando desvios negativos na Lei de Beer-Lambert."
      },
      {
        id: "q103_4",
        question: "Por que é importante escolher o comprimento de onda do pico de absorção (λmax) para a análise quantitativa?",
        options: ["Porque é o único comprimento de onda que o equipamento consegue ler", "Para garantir a cor mais bonita na amostra", "Porque nesse ponto a absorbância é máxima, garantindo maior sensibilidade e menor erro", "Porque a Lei de Beer-Lambert só é válida no pico de absorção"],
        answerIndex: 2,
        explanation: "No λmax, a mudança na absorbância por unidade de concentração é a maior, o que maximiza a sensibilidade do método. Além disso, a curva do espectro é relativamente plana no pico, minimizando erros se houver uma pequena variação no comprimento de onda selecionado pelo monocromador."
      }
    ]
  }
]