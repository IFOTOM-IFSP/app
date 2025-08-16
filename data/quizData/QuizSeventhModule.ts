import { Quiz } from "@/models";

export const quizSeventhModule: Quiz[] = [{
    id: "701",
    title: "Interpretando Dados Brutos",
    description: "Entenda o significado dos valores e gráficos gerados pelo espectrofotômetro.",
    moduleId: "7",
    difficulty: "Fácil",
    questions: [
        {
            id: "q701_1",
            question: "Um valor de absorbância negativo geralmente indica:",
            options: ["Que a amostra emite luz", "Que a concentração é extremamente alta", "Um erro, provavelmente porque o 'branco' absorveu mais luz do que a amostra", "Que a análise foi um sucesso"],
            answerIndex: 2,
            explanation: "A absorbância negativa é fisicamente impossível sob condições ideais. Geralmente ocorre se a amostra de referência ('branco') tiver uma absorbância maior no comprimento de onda medido do que a própria amostra, indicando um erro no preparo do branco ou instabilidade do equipamento."
        },
        {
            id: "q701_2",
            question: "Em uma curva de calibração, onde a absorbância está no eixo Y e a concentração no eixo X, o que a inclinação da reta representa?",
            options: ["O erro da medida", "O produto da absortividade molar e do caminho óptico (εb)", "A concentração do padrão mais alto", "O limite de detecção"],
            answerIndex: 1,
            explanation: "A equação da reta é y = mx + c, onde m é a inclinação. Na Lei de Beer-Lambert (A = εbc), se plotarmos A vs. c, a inclinação (m) da reta é igual ao produto εb. Isso é útil para determinar a absortividade molar se o caminho óptico 'b' for conhecido."
        }
    ]
  },
  {
    id: "702",
    title: "Análise Estatística e Validação",
    description: "Avalie a qualidade e a confiabilidade dos seus resultados espectrofotométricos.",
    moduleId: "7",
    difficulty: "Médio",
    questions: [
        {
            id: "q702_1",
            question: "O que um coeficiente de correlação (R²) de 0.999 em uma curva de calibração indica?",
            options: ["Que a absorbância e a concentração têm uma forte relação linear", "Que a concentração das amostras é muito alta", "Que o equipamento precisa de manutenção", "Que o analito não absorve luz"],
            answerIndex: 0,
            explanation: "O R², ou coeficiente de correlação, mede o quão bem os pontos de dados se ajustam à linha de regressão. Um valor próximo de 1.0 (como 0.999) indica um excelente ajuste linear, o que é desejável para uma curva de calibração confiável."
        },
        {
            id: "q702_2",
            question: "Se você medir a mesma amostra três vezes e obtiver os valores de absorbância 0.501, 0.503, 0.499, isso demonstra uma boa:",
            options: ["Exatidão", "Resolução", "Precisão (ou Reprodutibilidade)", "Sensibilidade"],
            answerIndex: 2,
            explanation: "Precisão (ou reprodutibilidade) é a medida da proximidade dos resultados de medições repetidas entre si. Exatidão, por outro lado, é a proximidade do valor medido com o valor real, o que exigiria um padrão de referência para ser avaliado."
        },
        {
            id: "q702_3",
            question: "O Limite de Quantificação (LOQ) é definido como:",
            options: ["A maior concentração que o equipamento pode medir", "A menor concentração de um analito que pode ser detectada", "A menor concentração de um analito que pode ser medida com um nível aceitável de precisão e exatidão", "A concentração que resulta em uma absorbância de 1.0"],
            answerIndex: 2,
            explanation: "Abaixo do LOQ, o equipamento pode até detectar a presença do analito (Limite de Detecção - LOD), mas o erro associado à medição é muito grande para que o valor seja considerado quantitativamente confiável."
        },
    ]
  },
   {
    id: "703",
    title: "Desafio: Solução de Problemas (Troubleshooting)",
    description: "Diagnostique problemas comuns que podem ocorrer durante uma análise espectrofotométrica.",
    moduleId: "7",
    difficulty: "Difícil",
    questions: [
        {
            id: "q703_1",
            question: "Você está obtendo leituras de absorbância instáveis e que flutuam muito. Qual NÃO é uma causa provável?",
            options: ["Bolhas de ar na cuveta", "A fonte de luz do equipamento não está estabilizada", "A concentração da amostra está muito alta, na faixa linear da curva", "Condensação na parte externa da cuveta"],
            answerIndex: 2,
            explanation: "Uma concentração na faixa linear deveria, na verdade, produzir resultados estáveis. Bolhas de ar, condensação ou uma lâmpada instável podem desviar o feixe de luz ou alterar sua intensidade, causando flutuações e leituras erráticas."
        },
        {
            id: "q703_2",
            question: "Sua curva de calibração, que deveria ser uma reta, está se curvando para baixo (achatando) em altas concentrações. Qual é a causa mais comum?",
            options: ["O analito está se degradando com a luz", "Aconteceu um erro de pipetagem no primeiro ponto", "Desvio negativo da Lei de Beer-Lambert, possivelmente por luz espúria ou interações moleculares", "A temperatura do laboratório aumentou"],
            answerIndex: 2,
            explanation: "Esse achatamento da curva é um comportamento clássico de desvio negativo da Lei de Beer-Lambert. Em altas concentrações, a fração de luz espúria que atinge o detector se torna significativa em comparação com a pouca luz que atravessa a amostra, resultando em valores de absorbância menores do que o esperado."
        },
        {
            id: "q703_3",
            question: "Ao medir o espectro de um composto desconhecido, você observa vários picos de absorção. Isso indica que:",
            options: ["O equipamento está com defeito", "A amostra provavelmente contém uma mistura de diferentes substâncias ou impurezas", "A concentração é muito baixa", "O solvente utilizado foi inadequado"],
            answerIndex: 1,
            explanation: "Cada composto com um cromóforo tende a ter seu próprio espectro de absorção característico. A presença de múltiplos picos inesperados é um forte indicativo de que a amostra não é pura e contém outras substâncias que também absorvem luz na faixa de comprimentos de onda analisada."
        },
        {
            id: "q703_4",
            question: "Se a absorbância do seu 'branco' é significativamente maior que zero (ex: 0.1), o que isso pode significar?",
            options: ["Que o detector é muito sensível", "Que o solvente ou a cuveta estão sujos ou contaminados, ou o equipamento não foi zerado corretamente", "Que a concentração do seu analito é zero", "Isso é normal e não afeta as medições"],
            answerIndex: 1,
            explanation: "O branco deveria ter uma absorbância próxima de zero, pois ele é a referência. Uma absorbância alta no branco indica que algo nele está absorvendo luz (contaminação, solvente inadequado) ou que o equipamento não foi corretamente zerado antes da medição, o que levará a resultados incorretos para todas as amostras."
        }
    ]
  },]