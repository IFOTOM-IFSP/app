import { Quiz } from "@/src/models";

export const quizFourthModule: Quiz[] = [
   {
    id: "401",
    title: "Componentes Essenciais",
    description: "Identifique as quatro partes principais de um espectrofotômetro.",
    moduleId: "4",
    difficulty: "Fácil",
    questions: [
        {
            id: "q401_1",
            question: "Qual componente gera a radiação que será usada na análise?",
            options: ["Detector", "Monocromador", "Fonte de Luz", "Cuveta"],
            answerIndex: 2,
            explanation: "A fonte de luz (como uma lâmpada de tungstênio ou deutério) é o ponto de partida, fornecendo a energia radiante que passará por todo o sistema óptico."
        },
        {
            id: "q401_2",
            question: "Onde a amostra a ser analisada é colocada?",
            options: ["No detector", "No monocromador", "No compartimento de amostra, dentro de uma cuveta", "Na fonte de luz"],
            answerIndex: 2,
            explanation: "O compartimento de amostra é projetado para abrigar a cuveta de forma que a luz do monocromador passe através dela em um caminho fixo."
        },
        {
            id: "q401_3",
            question: "Qual componente converte a intensidade da luz em um sinal elétrico?",
            options: ["A fonte de luz", "O monocromador", "A cuveta", "O detector"],
            answerIndex: 3,
            explanation: "O detector (como um fotodiodo ou um tubo fotomultiplicador) está no final do caminho óptico e é responsável por medir a quantidade de luz que atravessou a amostra e convertê-la em um sinal elétrico que pode ser processado."
        }
    ]
  },
  {
    id: "402",
    title: "Tipos de Instrumentos e Fontes",
    description: "Diferencie os tipos de espectrofotômetros e suas fontes de luz.",
    moduleId: "4",
    difficulty: "Médio",
    questions: [
        {
            id: "q402_1",
            question: "Um espectrofotômetro que precisa da leitura do 'branco' e da amostra em etapas separadas é do tipo:",
            options: ["Feixe duplo (double-beam)", "Feixe dividido (split-beam)", "Feixe simples (single-beam)", "Arranjo de diodos (diode-array)"],
            answerIndex: 2,
            explanation: "Em um espectrofotômetro de feixe simples, todo o feixe de luz passa ou pelo 'branco' ou pela amostra de cada vez. É um design mais simples, mas mais suscetível a flutuações na fonte de luz."
        },
        {
            id: "q402_2",
            question: "Para realizar uma análise na região UV (abaixo de 340 nm), qual fonte de luz é necessária?",
            options: ["Lâmpada de tungstênio", "LED branco", "Lâmpada de deutério", "Lâmpada de infravermelho"],
            answerIndex: 2,
            explanation: "A lâmpada de deutério fornece uma emissão contínua e intensa na região do ultravioleta, sendo a escolha padrão para análises nessa faixa do espectro."
        },
        {
            id: "q402_3",
            question: "A principal vantagem de um espectrofotômetro com arranjo de diodos (diode-array) é:",
            options: ["Seu baixo custo", "Sua capacidade de medir todos os comprimentos de onda simultaneamente", "Sua portabilidade", "Não precisar de uma fonte de luz"],
            answerIndex: 1,
            explanation: "Em um instrumento de arranjo de diodos, a luz branca passa pela amostra primeiro e depois é dispersa para um arranjo de detectores. Isso permite a aquisição de um espectro completo em uma fração de segundo, ideal para análises rápidas ou estudos cinéticos."
        }
    ]
  },
  {
    id: "403",
    title: "Desafio: O Monocromador",
    description: "Explore os detalhes e a importância do coração óptico do espectrofotômetro.",
    moduleId: "4",
    difficulty: "Difícil",
    questions: [
        {
            id: "q403_1",
            question: "O que define a 'resolução' de um monocromador?",
            options: ["A intensidade da luz que ele transmite", "O material de que é feito", "Sua capacidade de distinguir entre dois comprimentos de onda próximos", "O tamanho total do componente"],
            answerIndex: 2,
            explanation: "A resolução espectral é a medida da capacidade do monocromador de separar comprimentos de onda adjacentes. Uma alta resolução é crucial para distinguir picos de absorção muito próximos em um espectro."
        },
        {
            id: "q403_2",
            question: "Qual componente óptico é mais comum em monocromadores modernos devido à sua melhor dispersão e linearidade?",
            options: ["Prisma de quartzo", "Filtro de interferência", "Grade de difração holográfica", "Fibra óptica"],
            answerIndex: 2,
            explanation: "As grades de difração holográficas oferecem uma dispersão mais linear e uniforme ao longo do espectro em comparação com os prismas, além de serem menos sensíveis à temperatura e produzirem menos luz espúria."
        },
        {
            id: "q403_3",
            question: "A 'largura da fenda' (slit width) do monocromador afeta diretamente:",
            options: ["A concentração da amostra", "A cor da fonte de luz", "A pureza espectral da luz e a intensidade que chega ao detector", "O material da cuveta"],
            answerIndex: 2,
            explanation: "A largura da fenda controla a 'banda passante' (a faixa de comprimentos de onda que passa). Fendas mais estreitas melhoram a resolução (pureza espectral), mas diminuem a quantidade de luz (energia) que chega ao detector, exigindo um detector mais sensível."
        },
        {
            id: "q403_4",
            question: "Em um espectrofotômetro, a calibração do comprimento de onda é feita para:",
            options: ["Garantir que a absorbância lida seja correta", "Ajustar a intensidade da lâmpada", "Verificar se o comprimento de onda exibido no painel corresponde ao comprimento de onda que realmente atinge a amostra", "Aumentar a vida útil do detector"],
            answerIndex: 2,
            explanation: "A calibração do comprimento de onda usa padrões com picos de absorção bem conhecidos (como soluções de óxido de hólmio) para garantir que o mecanismo do monocromador está alinhado e que a seleção de λ está precisa."
        }
    ]
  },
]