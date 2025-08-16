import { Quiz } from "@/models";

export const quizFifthModule: Quiz[] = [{
    id: "501",
    title: "Tipos de Análise",
    description: "Identifique os diferentes tipos de análises que podem ser feitas com a espectrofotometria.",
    moduleId: "5",
    difficulty: "Fácil",
    questions: [
        {
            id: "q501_1",
            question: "Qual tipo de análise busca determinar 'quanto' de uma substância existe em uma amostra?",
            options: ["Análise Qualitativa", "Análise Quantitativa", "Análise Cinética", "Análise Espectral"],
            answerIndex: 1,
            explanation: "A análise quantitativa é focada em medir a quantidade ou concentração de um analito específico, sendo a aplicação mais comum da espectrofotometria de absorção."
        },
        {
            id: "q501_2",
            question: "A construção de uma curva de calibração é um passo essencial para qual tipo de análise?",
            options: ["Análise Qualitativa", "Análise Quantitativa", "Identificação de picos", "Estudos de estabilidade"],
            answerIndex: 1,
            explanation: "Para determinar a concentração de uma amostra desconhecida, primeiro é necessário criar uma curva de calibração usando padrões de concentração conhecida. A absorbância da amostra é então comparada com esta curva."
        }
    ]
    },
    {
     id: "502",
        title: "Aplicações Específicas",
        description: "Explore exemplos práticos e métodos comuns de análise espectrofotométrica.",
        moduleId: "5",
        difficulty: "Médio",
        questions: [
            {
                id: "q502_1",
                question: "A pureza do DNA extraído de uma amostra é frequentemente avaliada pela razão das absorbâncias em:",
                options: ["260 nm / 280 nm", "280 nm / 260 nm", "595 nm / 260 nm", "230 nm / 340 nm"],
                answerIndex: 0,
                explanation: "O DNA tem seu pico de absorção em 260 nm, enquanto as proteínas contaminantes absorvem em 280 nm. Uma razão A260/A280 em torno de 1.8 é geralmente considerada indicativa de um DNA puro."
            },
            {
                id: "q502_2",
                question: "Um varrimento espectral (spectral scan) é útil para:",
                options: ["Determinar a concentração de uma única amostra", "Encontrar o comprimento de onda de máxima absorção (λmax) de um composto", "Monitorar uma reação ao longo do tempo", "Calibrar o equipamento"],
                answerIndex: 1,
                explanation: "O varrimento espectral mede a absorbância em uma faixa de comprimentos de onda, gerando o espectro de absorção. Isso é fundamental para identificar o λmax, que será usado para as análises quantitativas subsequentes por ser o ponto de maior sensibilidade."
            },
            {
                id: "q502_3",
                question: "Em um ensaio enzimático, a diminuição da absorbância de um substrato ao longo do tempo indica:",
                options: ["Que a enzima está inativa", "Que o substrato está sendo consumido pela reação enzimática", "Que a temperatura está muito baixa", "Que o 'branco' foi preparado incorretamente"],
                answerIndex: 1,
                explanation: "Se o substrato absorve luz e o produto não, a diminuição da absorbância ao longo do tempo é uma medida direta da velocidade com que a enzima está consumindo o substrato, permitindo o cálculo da atividade enzimática."
            }
        ]
    },
   {
    id: "503",
    title: "Desafio: Análises Complexas",
    description: "Analise métodos avançados e a análise de misturas por espectrofotometria.",
    moduleId: "5",
    difficulty: "Difícil",
    questions: [
        {
            id: "q503_1",
            question: "Como é possível determinar a concentração de dois analitos diferentes (X e Y) em uma mesma solução usando espectrofotometria?",
            options: ["É impossível, a técnica só mede um analito por vez", "Medindo a absorbância em dois comprimentos de onda diferentes e resolvendo um sistema de equações", "Usando uma cuveta com dois compartimentos", "Aumentando a intensidade da luz até que um dos analitos se degrade"],
            answerIndex: 1,
            explanation: "Se os espectros de absorção dos dois analitos forem conhecidos e se sobrepuserem, pode-se medir a absorbância total da mistura em dois comprimentos de onda diferentes (idealmente, no λmax de cada um). Isso cria um sistema de duas equações e duas incógnitas (as concentrações de X e Y), que pode ser resolvido matematicamente."
        },
        {
            id: "q503_2",
            question: "O que é a 'espectroscopia de derivada' e para que serve?",
            options: ["Uma técnica para medir a derivada da concentração", "Um método para aumentar a absorbância da amostra", "Um tratamento matemático do espectro para resolver picos sobrepostos e remover a linha de base", "Uma forma de corrigir a luz espúria"],
            answerIndex: 2,
            explanation: "A espectroscopia de derivada calcula a primeira ou a segunda derivada do espectro de absorbância. Isso pode amplificar pequenas variações, ajudando a resolver picos que estão muito próximos (sobrepostos) e a corrigir desvios na linha de base, melhorando a análise qualitativa e quantitativa de misturas complexas."
        },
        {
            id: "q503_3",
            question: "A titulação espectrofotométrica é uma técnica usada para:",
            options: ["Limpar o espectrofotômetro", "Determinar o ponto final de uma titulação monitorando a mudança de absorbância", "Calcular a absortividade molar de um solvente", "Medir a absorbância de amostras sólidas"],
            answerIndex: 1,
            explanation: "Em uma titulação espectrofotométrica, a absorbância da solução é monitorada à medida que o titulante é adicionado. O ponto final da titulação é identificado por uma mudança brusca na absorbância, que ocorre quando o reagente, o titulante ou o produto absorve luz em um determinado comprimento de onda."
        },
        {
            id: "q503_4",
            question: "Na análise de turbidez de culturas de células (como bactérias), a medição é chamada de Densidade Óptica (D.O.). Este valor representa principalmente:",
            options: ["A absorção de luz pelas células", "O espalhamento da luz pelas células em suspensão", "A cor das células", "A concentração de DNA dentro das células"],
            answerIndex: 1,
            explanation: "Embora o equipamento leia como 'absorbância', o fenômeno principal na medição de D.O. de culturas celulares não é a absorção, mas sim o espalhamento da luz (light scattering) pelas partículas (células). Portanto, a D.O. é uma medida da turbidez, que é proporcional ao número de células."
        }
    ]
  },
]