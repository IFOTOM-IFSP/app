import { Quiz } from "@/models";


export const quizSecondModule: Quiz[] = [
    {
    id: "201",
    title: "Interação Luz-Matéria",
    description: "Teste seus conhecimentos básicos sobre como a luz e a matéria interagem.",
    moduleId: "2",
    difficulty: "Fácil",
    questions: [
      {
        id: "q201_1",
        question: "O que acontece quando uma molécula absorve um fóton de luz na região UV-Vis?",
        options: ["A molécula vibra mais intensamente", "Um elétron é promovido para um nível de energia mais alto", "A molécula se quebra imediatamente", "A molécula emite luz de outra cor"],
        answerIndex: 1,
        explanation: "A absorção de luz UV ou visível fornece energia suficiente para que um elétron de valência salte de um orbital de menor energia (estado fundamental) para um de maior energia (estado excitado)."
      },
      {
        id: "q201_2",
        question: "Uma solução transparente e incolor para o olho humano...",
        options: ["Absorve todas as cores de luz", "Não absorve luz na região visível do espectro", "Absorve apenas luz ultravioleta", "É muito concentrada"],
        answerIndex: 1,
        explanation: "Se uma solução é incolor, significa que ela não está absorvendo nenhuma luz na faixa do espectro visível (aproximadamente 400-700 nm). Ela pode, no entanto, absorver luz na região UV ou infravermelha."
      },
    ]
  },
  {
    id: "202",
    title: "Espectro e Cores",
    description: "Aprofunde seu conhecimento sobre o espectro eletromagnético e a percepção de cores.",
    moduleId: "2",
    difficulty: "Médio",
    questions: [
        {
            id: "q202_1",
            question: "Qual região do espectro eletromagnético possui maior energia por fóton?",
            options: ["Infravermelho", "Luz Visível", "Ultravioleta (UV)", "Micro-ondas"],
            answerIndex: 2,
            explanation: "A energia é inversamente proporcional ao comprimento de onda. A luz UV tem o menor comprimento de onda entre as opções, portanto, possui a maior energia por fóton."
        },
        {
            id: "q202_2",
            question: "Se uma amostra tem um pico de absorção em 600 nm (região laranja/vermelha), qual cor ela provavelmente aparenta ter?",
            options: ["Vermelha", "Laranja", "Verde/Azul", "Incolor"],
            answerIndex: 2,
            explanation: "A cor percebida é a complementar da cor absorvida. A cor complementar do laranja/vermelho no espectro visível é o verde/azul."
        },
        {
            id: "q202_3",
            question: "O que um espectro de absorção representa?",
            options: ["Um gráfico da cor da amostra vs. tempo", "Um gráfico da absorbância vs. comprimento de onda", "Um gráfico da concentração vs. absorbância", "Um mapa de todos os elétrons da molécula"],
            answerIndex: 1,
            explanation: "O espectro de absorção é uma 'impressão digital' molecular que mostra o quão fortemente uma substância absorve luz em diferentes comprimentos de onda."
        }
    ]
  },
  {
    id: "203",
    title: "Desafio: Transições Eletrônicas",
    description: "Teste seus conhecimentos avançados sobre os fenômenos quânticos por trás da absorção de luz.",
    moduleId: "2",
    difficulty: "Difícil",
    questions: [
        {
            id: "q203_1",
            question: "A absorção de luz por uma molécula é um processo quantizado. O que isso significa?",
            options: ["A molécula pode absorver qualquer quantidade de energia", "A molécula só pode absorver fótons com a energia exata para uma transição eletrônica permitida", "Toda a luz que atinge a molécula é absorvida", "A absorção depende da temperatura da molécula"],
            answerIndex: 1,
            explanation: "Ser 'quantizado' significa que apenas quantidades discretas (quanta) de energia podem ser absorvidas. Um fóton só será absorvido se sua energia corresponder exatamente à diferença de energia entre o estado fundamental e um estado excitado da molécula."
        },
        {
            id: "q203_2",
            question: "O que acontece com a maioria das moléculas após um elétron ser excitado pela luz UV-Vis?",
            options: ["Ele permanece no estado excitado para sempre", "Ele emite um fóton de maior energia e retorna ao estado fundamental", "A energia é dissipada como calor (vibrações) e a molécula retorna ao estado fundamental", "A molécula é permanentemente ionizada"],
            answerIndex: 2,
            explanation: "Embora a fluorescência (emissão de luz) possa ocorrer, o caminho mais comum para a molécula relaxar é através de processos não radiativos, onde a energia eletrônica é convertida em energia vibracional (calor), e a molécula retorna ao seu estado fundamental."
        },
        {
            id: "q203_3",
            question: "O termo 'efeito batocrômico' refere-se a:",
            options: ["Um deslocamento do pico de absorção para um comprimento de onda menor (mais energia)", "Um aumento na intensidade da absorção (hipercrômico)", "Um deslocamento do pico de absorção para um comprimento de onda maior (menos energia)", "Uma diminuição na intensidade da absorção (hipocrômico)"],
            answerIndex: 2,
            explanation: "Um deslocamento batocrômico, também conhecido como 'red shift' (desvio para o vermelho), é quando a absorção de uma molécula se desloca para comprimentos de onda mais longos, geralmente devido a mudanças estruturais ou de solvente."
        },
        {
            id: "q203_4",
            question: "Qual tipo de transição eletrônica geralmente requer mais energia?",
            options: ["n → π*", "π → π*", "σ → σ*", "n → σ*"],
            answerIndex: 2,
            explanation: "As transições envolvendo orbitais sigma (σ), que são as ligações simples, são muito estáveis e requerem uma grande quantidade de energia para serem excitadas, geralmente caindo na região do UV de vácuo (< 200 nm). As transições π e n são mais fáceis de ocorrer e são as responsáveis pela absorção na faixa UV-Vis."
        }
    ]
  },
]