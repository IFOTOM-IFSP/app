/**
 * @file Contém todos os dados dos quizzes disponíveis no aplicativo.
 * A estrutura foi projetada para ser facilmente integrada com um banco de dados SQLite.
 */

// --- Tipagem para a Estrutura do Quiz ---

/**
 * Representa uma única questão dentro de um quiz.
 * A `explanation` é fundamental para o processo de aprendizado.
 */
export type Question = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

/**
 * Representa um Quiz completo.
 * - `moduleId` vincula o quiz a um módulo de estudo específico.
 * - `difficulty` permite filtrar quizzes por nível.
 */
export type Quiz = {
  id: string;
  title: string;
  description: string;
  moduleId: string; // Ex: '1' para "Introdução à Espectrofotometria"
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  questions: Question[];
};

// --- Dados dos Quizzes ---

export const quizData: Quiz[] = [
  // =================================================================
  // Módulo 1: Introdução à Espectrofotometria
  // =================================================================
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
  },

  // =================================================================
  // Módulo 2: Luz e Matéria
  // =================================================================
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

  // =================================================================
  // Módulo 3: Princípios da Espectrofotometria de Absorção
  // =================================================================
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

  // =================================================================
  // Módulo 4: Partes de um Espectrofotômetro
  // =================================================================
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
  
  // =================================================================
  // Módulo 5: Tipos de Análises Possíveis
  // =================================================================
   {
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

  // =================================================================
  // Módulo 6: Preparo de Soluções para Análise
  // =================================================================
    {
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
  },

  // =================================================================
  // Módulo 7: Interpretação de Resultados
  // =================================================================
  {
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
  },
];
