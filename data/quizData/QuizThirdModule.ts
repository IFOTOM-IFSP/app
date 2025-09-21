import { Quiz } from "@/src/models";

export const quizThirdModule: Quiz[] = [
{
    id: "301",
    title: "A Lei de Beer-Lambert",
    description: "Verifique sua compreensão da equação mais importante da espectrofotometria.",
    moduleId: "3",
    difficulty: "Fácil",
    questions: [
        {
            id: "q301_1",
            question: "Na equação A = εbc, o que a letra 'b' representa?",
            options: ["A concentração do branco", "O brilho da fonte de luz", "O caminho óptico da cuveta", "A absorbância"],
            answerIndex: 2,
            explanation: "A letra 'b' (ou 'l' em algumas literaturas) representa o caminho óptico, que é a distância interna da cuveta que a luz percorre através da amostra, geralmente padronizada em 1 cm."
        },
        {
            id: "q301_2",
            question: "A relação entre absorbância e concentração, segundo a Lei de Beer-Lambert, é:",
            options: ["Linear", "Exponencial", "Logarítmica", "Inversamente proporcional"],
            answerIndex: 0,
            explanation: "A principal vantagem da Lei de Beer-Lambert é que ela estabelece uma relação linear direta entre a absorbância de uma solução e a concentração do analito, o que torna a quantificação muito mais simples."
        }
    ]
  },
    {
    id: "302",
    title: "Aplicações e Limitações da Lei de Beer",
    description: "Entenda quando a Lei de Beer-Lambert funciona e quando ela pode falhar.",
    moduleId: "3",
    difficulty: "Médio",
    questions: [
        {
            id: "q302_1",
            question: "Qual das seguintes condições pode causar um desvio da linearidade da Lei de Beer-Lambert?",
            options: ["Usar uma cuveta de 1 cm", "Manter a temperatura constante", "Analisar uma solução muito concentrada", "Diluir a amostra antes da leitura"],
            answerIndex: 2,
            explanation: "Em concentrações muito altas, as interações entre as moléculas do analito podem alterar sua absortividade molar. Além disso, a luz espúria se torna mais significativa, causando desvios negativos na linearidade da lei."
        },
        {
            id: "q302_2",
            question: "A absortividade molar (ε) é uma constante que depende:",
            options: ["Da concentração da solução", "Do caminho óptico da cuveta", "Da natureza química da substância e do comprimento de onda", "Da intensidade da fonte de luz"],
            answerIndex: 2,
            explanation: "A absortividade molar é uma propriedade intrínseca da molécula do analito em um determinado solvente e comprimento de onda. Ela reflete a eficiência com que a molécula absorve luz."
        },
        {
            id: "q302_3",
            question: "Se a absorbância (A) de uma solução é 1.0, qual é sua transmitância percentual?",
            options: ["10%", "1%", "50%", "0%"],
            answerIndex: 0,
            explanation: "A relação é A = -log(T). Portanto, T = 10^(-A). Se A = 1.0, então T = 10^(-1) = 0.1. Em porcentagem, a transmitância é 10%."
        },
        {
            id: "q302_4",
            question: "A Lei de Beer-Lambert assume que a luz que passa pela amostra é:",
            options: ["Policromática (várias cores)", "Monocromática (uma única cor/comprimento de onda)", "Luz polarizada", "Luz infravermelha"],
            answerIndex: 1,
            explanation: "Um dos pressupostos fundamentais da lei é que a radiação incidente seja monocromática, pois a absortividade molar (ε) é específica para cada comprimento de onda. O uso de luz policromática pode levar a desvios."
        }
    ]
  },
   {
    id: "303",
    title: "Desafio: Desvios da Lei de Beer",
    description: "Analise cenários complexos e as razões para os desvios da Lei de Beer-Lambert.",
    moduleId: "3",
    difficulty: "Difícil",
    questions: [
        {
            id: "q303_1",
            question: "O que é um 'desvio químico' da Lei de Beer-Lambert?",
            options: ["Quando o equipamento está descalibrado", "Quando a amostra sofre uma reação química (associação, dissociação, etc.) que muda com a concentração", "Quando a luz espúria afeta a medição", "Quando a cuveta está suja"],
            answerIndex: 1,
            explanation: "Desvios químicos ocorrem quando o analito participa de um equilíbrio químico (ex: um ácido fraco que se dissocia). Como a concentração das diferentes espécies muda com a diluição, a absortividade molar média da solução também muda, causando um desvio na linearidade."
        },
        {
            id: "q303_2",
            question: "A presença de partículas em suspensão em uma amostra (turbidez) causa um erro na medição porque:",
            options: ["As partículas reagem com o analito", "As partículas bloqueiam a passagem do solvente", "As partículas espalham a luz, o que é interpretado como absorbância", "As partículas emitem sua própria luz"],
            answerIndex: 2,
            explanation: "A turbidez faz com que a luz seja espalhada em todas as direções, em vez de ser absorvida. No entanto, o detector não consegue diferenciar entre luz absorvida e luz espalhada, resultando em um valor de absorbância falsamente alto."
        },
        {
            id: "q303_3",
            question: "Qual das seguintes opções é uma limitação instrumental real da Lei de Beer-Lambert?",
            options: ["O uso de cuvetas de quartzo", "A presença de luz espúria no monocromador", "A necessidade de usar um 'branco'", "A relação linear entre A e c"],
            answerIndex: 1,
            explanation: "A luz espúria é uma limitação inerente ao design instrumental. É uma radiação de comprimentos de onda indesejados que chega ao detector e causa desvios significativos, especialmente em altas absorbâncias."
        }
    ]
  },
]