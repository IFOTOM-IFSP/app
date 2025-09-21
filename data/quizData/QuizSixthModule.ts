import { Quiz } from "@/src/models";

export const quizSixthModule: Quiz[] = [{
    id: "601",
    title: "Técnicas de Preparo",
    description: "Teste seus conhecimentos básicos sobre o preparo de amostras para análise.",
    moduleId: "6",
    difficulty: "Fácil",
    questions: [
        {
            id: "q601_1",
            question: "O que é uma 'solução estoque' (stock solution)?",
            options: ["A amostra final a ser lida", "Uma solução concentrada usada para preparar outras soluções mais diluídas", "O solvente puro", "Uma amostra que já foi analisada"],
            answerIndex: 1,
            explanation: "Uma solução estoque é uma solução inicial, preparada com alta concentração e precisão, a partir da qual diluições em série são feitas para obter as soluções de trabalho e os padrões de calibração."
        },
        {
            id: "q601_2",
            question: "Qual vidraria de laboratório oferece a maior precisão para medir volumes na preparação de soluções?",
            options: ["Béquer", "Proveta", "Erlenmeyer", "Pipeta volumétrica e balão volumétrico"],
            answerIndex: 3,
            explanation: "Béqueres e provetas são para medições aproximadas. Para a precisão exigida na preparação de padrões, deve-se usar pipetas volumétricas (para transferir volumes exatos) e balões volumétricos (para conter um volume final exato)."
        }
    ]
  },
    {
    id: "602",
    title: "Cálculos de Diluição",
    description: "Pratique os cálculos essenciais para realizar diluições seriadas e preparar padrões.",
    moduleId: "6",
    difficulty: "Médio",
    questions: [
        {
            id: "q602_1",
            question: "Qual é a fórmula de diluição universalmente utilizada?",
            options: ["C1 / V1 = C2 / V2", "C1 * C2 = V1 * V2", "C1 * V1 = C2 * V2", "V1 / C1 = C2 * V2"],
            answerIndex: 2,
            explanation: "A fórmula C1V1 = C2V2 (Concentração inicial x Volume inicial = Concentração final x Volume final) é a base para todos os cálculos de diluição, pois a quantidade de soluto (C x V) permanece constante antes e depois da diluição."
        },
        {
            id: "q602_2",
            question: "Se você realiza uma diluição de 1:10, significa que você pegou:",
            options: ["1 parte da amostra e adicionou 10 partes de solvente", "1 parte da amostra para um volume final de 10 partes", "10 partes da amostra e adicionou 1 parte de solvente", "10 partes de amostra para um volume final de 11 partes"],
            answerIndex: 1,
            explanation: "Uma diluição de 1:10 significa que o volume final da solução é 10 vezes maior que o volume inicial da amostra. Isso é obtido pegando 1 parte da amostra e adicionando 9 partes de solvente, resultando em um volume final de 10 partes."
        },
        {
            id: "q602_3",
            question: "Você mediu a concentração de uma amostra diluída e encontrou 5 µg/mL. Se a amostra foi diluída 100 vezes, qual era a concentração original?",
            options: ["0.05 µg/mL", "50 µg/mL", "500 µg/mL", "0.5 µg/mL"],
            answerIndex: 2,
            explanation: "Para encontrar a concentração original, você deve multiplicar o resultado da amostra diluída pelo fator de diluição. Concentração original = 5 µg/mL * 100 = 500 µg/mL."
        }
    ]
  },
    {
    id: "603",
    title: "Desafio: Boas Práticas de Laboratório",
    description: "Avalie seu conhecimento sobre as boas práticas que garantem resultados confiáveis.",
    moduleId: "6",
    difficulty: "Difícil",
    questions: [
        {
            id: "q603_1",
            question: "Por que é importante manusear as cuvetas apenas pelas faces foscas?",
            options: ["Para aquecer a amostra com os dedos", "Para evitar que a luz passe pelas faces foscas", "Para evitar deixar impressões digitais ou gordura nas faces ópticas transparentes", "Porque as faces transparentes são muito frágeis"],
            answerIndex: 2,
            explanation: "Impressões digitais, gordura ou arranhões nas faces transparentes (por onde a luz passa) podem absorver ou espalhar a luz, introduzindo um erro significativo na medição da absorbância. Deve-se sempre segurar a cuveta pelas faces foscas."
        },
        {
            id: "q603_2",
            question: "O que significa 'preparar uma diluição seriada'?",
            options: ["Preparar várias diluições diferentes a partir da mesma solução estoque", "Diluir a mesma amostra várias vezes seguidas no mesmo tubo", "Criar uma série de diluições onde cada nova diluição é feita a partir da anterior", "Misturar várias soluções estoque diferentes"],
            answerIndex: 2,
            explanation: "Na diluição seriada, uma sequência de diluições é criada passo a passo. Por exemplo, para criar uma diluição 1:1000, pode-se primeiro fazer uma diluição 1:10 e, em seguida, diluir esta nova solução mais 1:100. Isso é útil para criar concentrações muito baixas com maior precisão."
        },
        {
            id: "q603_3",
            question: "Qual é o objetivo de deixar o espectrofotômetro aquecer por um tempo (geralmente 15-30 min) antes de usar?",
            options: ["Para esterilizar o compartimento da amostra", "Para garantir que a fonte de luz e os componentes eletrônicos atinjam uma estabilidade térmica e de emissão", "Para carregar a bateria interna do equipamento", "Para permitir que o software seja totalmente carregado"],
            answerIndex: 1,
            explanation: "A intensidade da fonte de luz e a resposta do detector podem variar ligeiramente até que o instrumento atinja uma temperatura de operação estável. Deixar o equipamento aquecer garante uma linha de base estável e medições mais reprodutíveis."
        },
        {
            id: "q603_4",
            question: "Ao preparar os padrões para uma curva de calibração, é crucial que:",
            options: ["Eles sejam preparados em uma ordem aleatória", "Todos os padrões e o 'branco' sejam preparados com o mesmo lote de solvente", "Cada padrão seja preparado com um solvente diferente", "Os padrões mais concentrados sejam lidos primeiro"],
            answerIndex: 1,
            explanation: "Usar o mesmo lote de solvente (e reagentes) para o branco e todos os padrões minimiza a variabilidade e garante que qualquer absorbância de fundo do próprio solvente seja consistentemente subtraída em todas as medições, aumentando a precisão da curva."
        }
    ]
  },]