import { Module } from "@/models";

export const firstModule: Module = {
  id: '1',
  title: 'Introdução à Espectrofotometria',
  description: 'Conceitos básicos, importância e o espectro eletromagnético.',
  estimatedTime: '25min',
  nextModuleId: '2',
  iconName: 'library-outline',
  iconColorName: 'primary',
  iconBackgroundColorName: 'primaryBackground',
  pages: [
    { 
      id: '1.1',
      title: 'O que é Espectrofotometria?',
      content: [
          {
            id: "intro-o-que-e-paragraph",
            type: "text",
            value: "A **espectrofotometria** é uma técnica analítica essencial que mede como uma substância interage com a luz. Ao analisar a quantidade de luz **absorvida** ou **transmitida** em diferentes comprimentos de onda, cientistas obtêm informações cruciais sobre a **composição** e a **concentração** de uma amostra. É uma ferramenta fundamental em diversas áreas da ciência e da indústria.",
            format: "paragraph"
          },
          {
            id: "comofunciona-heading",
            type: "text",
            value: "Como Funciona?",
            format: "heading2"
          },
          {
            id: "comofunciona-paragraph",
            type: "text",
            value: "O princípio é simples: um feixe de luz com intensidade inicial conhecida (I_0) atravessa uma amostra. Um detector mede a intensidade da luz que chega ao outro lado (I). A redução na intensidade da luz revela o quanto foi absorvido pela substância.",
            format: "paragraph"
          },
          {
            id: "composicao-luz-bloco",
            type: "text",
            value: "Assim como a luz branca se decompõe em um arco-íris, ela é formada por múltiplos comprimentos de onda (cores). Cada substância possui uma afinidade única por certos comprimentos de onda, absorvendo-os de maneira seletiva. Esse padrão de absorção cria uma **'assinatura espectral'** única, que funciona como uma impressão digital para **identificar** e **quantificar** o material.",
            format: "blockquote"
          },
          {
            id: "espectros-heading",
            type: "text",
            value: "O que são Espectros?",
            format: "heading2"
          },
          {
            id: "espectros-paragraph",
            type: "text",
            value: "O resultado de uma análise espectrofotométrica é um **espectro**: um gráfico que mapeia a intensidade da absorção (ou transmissão) de luz em função do comprimento de onda. Os **picos e vales** neste gráfico revelam os comprimentos de onda que a substância mais absorve, permitindo que cientistas **identifiquem compostos**, **determinem sua pureza** e **acompanhem o andamento de reações químicas**.",
            format: "paragraph"
          },
          {
            id: "exemplo-imagem-espectro",
            type: "image",
            src: { "uri": "https://cdn.kastatic.org/ka-perseus-images/7368b813cebab3abdd88286e456d16819743a6d1.png"},
            alt: "Exemplo de espectro eletromagnético",
            caption: "Exemplo de espectro eletromagnético.",
            width: 300,
            height: 200
          },
          {
            id: "contexto-historico-heading",
            type: "text",
            value: "Breve Contexto Histórico",
            format: "heading2"
          },
          {
            id: "contexto-historico-paragraph",
            type: "text",
            value: "As raízes da espectrofotometria remontam ao **século XIX**, com os primeiros estudos sobre a decomposição da luz. Contudo, foi no **século XX** que a técnica floresceu, impulsionada pelos **avanços na eletrônica e na óptica**. O desenvolvimento de **espectrofotômetros modernos** transformou a análise química, oferecendo resultados rápidos, precisos e reprodutíveis.",
            format: "paragraph"
          },
          {
            id: "tecnologias-relacionadas-heading",
            type: "text",
            value: "Tecnologias Relacionadas",
            format: "heading2"
          },
          {
            id: "tecnologias-relacionadas-paragraph",
            type: "text",
            value: "A técnica que estamos explorando, baseada na absorção de luz por moléculas em solução, é mais conhecida como espectrofotometria de absorção molecular UV-Vis. Ela pertence a uma grande família de técnicas espectroscópicas que inclui a espectroscopia no infravermelho (IV), que analisa as vibrações das ligações químicas, e a espectrometria de absorção atômica (EAA), usada para quantificar metais. ",
            format: "paragraph"
          },
          {
            id: "preview-proxima-pagina",
            type: "list",
            items: ["Para aprofundar seu conhecimento, o próximo passo é diferenciar os fenômenos de **absorção e emissão** de luz. Vamos descobrir como eles se complementam na próxima página!"],
            format: "bullet",
          }
      ] 
    },
    {
      id: '1.2',
      title: 'Diferença entre Absorção e Emissão',
      content: [
          {
            id: 'abs-emissao-heading',
            type: 'text',
            value: 'Diferença entre Absorção e Emissão',
            format: 'heading1',
          },
          {
            id: 'abs-emissao-paragraph-intro',
            type: 'text',
            value: 'A diferença fundamental entre **absorção** e **emissão** reside na forma como a matéria interage com a luz. Na absorção, a substância retira energia da luz; na emissão, ela libera energia na forma de luz.',
            format: 'paragraph',
          },
          {
            id: 'conceitos-basicos-heading',
            type: 'text',
            value: 'Conceitos Básicos',
            format: 'heading2',
          },
          {
            id: 'absorcao-explicacao',
            type: 'text',
            value:'**Absorção:** Ocorre quando um átomo ou molécula absorve um fóton (partícula de luz), o que faz com que seus elétrons passem para um nível de energia mais alto. Esse processo consome energia.',
            format: 'paragraph',
          },
          {
            id: 'emissao-explicacao',
            type: 'text',
            value:'**Emissão:** Acontece quando esses elétrons excitados retornam a níveis de energia mais baixos, liberando a energia excedente na forma de luz. Esse processo emite radiação.',
            format: 'paragraph',
          },
          {
            id: 'exemplo-cotidiano-bloco',
            type: 'text',
            value:'Um exemplo clássico é o teste de chama: quando aquecemos sais metálicos, vemos chamas coloridas. O sódio (do sal de cozinha) produz uma chama laranja intensa, o cobre gera uma chama verde/azulada e o potássio, uma chama lilás. Essa luz é o resultado da emissão de energia pelos átomos excitados pelo calor da chama.',
            format: 'blockquote',
          },
          {
            id: 'abs-emissao-diagrama',
            type: 'image',
            src: {uri: "https://astronoo.com/images/articles/principe-absorption-emission-atomique.webp"}, 
            alt: 'Diagrama explicando absorção e emissão de luz por elétrons em um átomo',
            caption: 'Ilustração da absorção e emissão: elétrons saltam para níveis energéticos mais altos e depois retornam, emitindo luz.',
            width: 320,
            height: 220,
          },
          {
            id: 'comparacao-tabela-heading',
            type: 'text',
            value: 'Comparação Lado a Lado',
            format: 'heading2',
          },
          {
            id: 'comparacao-tabela-interativa',
            type: 'interactive',
            componentName: 'AbsorcaoEmissaoTable',
            props: {
              data: [
                { aspecto: 'Interação com luz', absorcao: 'Absorve luz', emissao: 'Emite luz' },
                { aspecto: 'Energia do sistema', absorcao: 'Aumenta', emissao: 'Diminui' },
                { aspecto: 'Nível eletrônico', absorcao: 'Eletrons sobem', emissao: 'Eletrons descem' },
                { aspecto: 'Exemplo', absorcao: 'Pigmentos absorvendo luz', emissao: 'Neon emitindo luz' },
              ],
            },
          },
          {
            id: 'transicao-proxima',
            type: 'text',
            value: "Agora que você entende a diferença entre absorção e emissão, vamos focar no fenômeno da absorção, que é a base da espectrofotometria. O próximo passo é aprender a lei matemática que nos permite transformar uma medida de luz absorvida em um dado de concentração: a Lei de Beer-Lambert.",
            format: 'paragraph',
          }
      ],
    },
    {
      id: '1.3',
      title: 'Importância da Técnica',
      content: [
          {
            id: 'importancia-intro-paragraph',
            type: 'text',
            value: 'A espectrofotometria é considerada uma das ferramentas mais versáteis e essenciais da análise científica moderna. Sua importância se estende por diversas áreas do conhecimento e setores produtivos.',
            format: 'paragraph',
          },
          {
            id: 'importancia-list-heading',
            type: 'text',
            value: 'Principais Áreas de Aplicação',
            format: 'heading2',
          },
          {
            id: 'importancia-list-1',
            type: 'list',
            items: [
              "**Química**: Determinação de concentração de analitos, cinética de reações químicas, identificação de compostos.",
              "**Biologia**: Quantificação de proteínas, DNA, RNA e outros biomarcadores em pesquisas laboratoriais e clínicas.",
              "**Medicina**: Diagnóstico de doenças, exames laboratoriais (como bilirrubina, glicose e creatinina), monitoramento de níveis hormonais e metabólicos.",
              "**Indústria**: Controle de qualidade em produtos como alimentos, bebidas, fármacos, tintas, plásticos e combustíveis.",
              "**Meio ambiente**: Monitoramento de poluentes em água, solo e ar."
                  ],
            format: 'bullet',
          },
          {
            id: 'importancia-precisao',
            type: 'text',
            value: 'A técnica é altamente valorizada por sua precisão, rapidez e baixo custo operacional. Além disso, permite análises não destrutivas, o que é ideal para amostras valiosas ou limitadas.',
            format: 'paragraph',
          },
          {
            id: 'precisao-confiabilidade',
            type: 'text',
            value:'A técnica é altamente valorizada por sua precisão, rapidez e baixo custo operacional. Além disso, permite análises não destrutivas, o que é ideal para amostras valiosas ou limitadas.',
            format: 'paragraph',
          },
          {
            id: 'beneficios-bloco',
            type: 'text',
            value: 'Ao permitir a detecção de substâncias mesmo em concentrações muito baixas, a espectrofotometria tem um papel crucial na segurança de medicamentos, na pureza de reagentes químicos e no controle ambiental.',
            format: 'blockquote',
          },
          {
            id: 'grafico-interativo-impacto',
            type: 'interactive',
            componentName: 'ImpactoSetorialChart',
            props: {
              data: [
                { area: 'Química', impacto: 90 },
                { area: 'Biologia', impacto: 85 },
                { area: 'Medicina', impacto: 95 },
                { area: 'Indústria', impacto: 80 },
                { area: 'Meio ambiente', impacto: 88 },
              ],
              unit: '%',
              description: 'Nível de impacto da espectrofotometria por setor',
            },
          },
          {
            id: 'imagem-importancia',
            type: 'image',
            src: {uri: 'data:image/jpeg;base64,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'}, // Substituir com caminho real
            alt: 'Laboratório com espectrofotômetro em uso',
            caption: 'Exemplo de uso da espectrofotometria em laboratório clínico.',
            width: 320,
            height: 220,
          },
          {
            id: 'conclusao-importancia',
            type: 'text',
            value:
              'Com tantas aplicações e benefícios, a espectrofotometria é uma técnica indispensável para o avanço da ciência, saúde e indústria moderna.',
            format: 'paragraph',
          },
          {
            id: 'preview-proxima-pagina',
            type: 'text',
            value:
              'Vamos agora conhecer alguns exemplos práticos e reais de como essa técnica é utilizada no dia a dia.',
            format: 'paragraph',
          }
      ],
    },
    {
      id: '1.4',
      title: 'Exemplos de Aplicações Reais',
      content: [
          {
            id: 'aplicacoes-heading',
            type: 'text',
            value: 'Exemplos de Aplicações Reais',
            format: 'heading1',
          },
          {
            id: 'aplicacoes-intro',
            type: 'text',
            value:
              'A espectrofotometria é amplamente empregada em cenários do cotidiano científico e industrial. Aqui estão alguns exemplos práticos que demonstram sua utilidade na prática:',
            format: 'paragraph',
          },
          {
            id: 'aplicacoes-lista-principal',
            type: 'list',
            items: [
              "**Análise da qualidade da água**: Monitoramento de nutrientes e contaminantes, como **nitrato** e **fosfato**, em rios e estações de tratamento para prevenir a eutrofização.",
              "**Controle de alimentos**: Medição de teores de vitamina C em sucos ou presença de corantes artificiais em doces e refrigerantes.",
              "**Farmácia e medicamentos**: Avaliação da concentração de substâncias ativas em comprimidos para garantir eficácia e segurança.",
              "**Laboratórios clínicos**: Testes bioquímicos como ureia, creatinina e glicose utilizam espectrofotometria como método padrão.",
              "**Indústria de cosméticos**: Determinação da estabilidade e coloração de cremes e protetores solares."
            ],
            format: 'numbered',
          },
          {
            id: 'aplicacoes-imagem',
            type: 'image',
            src: require('@/assets/images/spectrum_applications.jpg'),
            alt: 'Diversas aplicações da espectrofotometria em diferentes campos.',
            caption: 'A versatilidade da espectrofotometria a torna indispensável em muitos setores.',
            width: 320,
            height: 220,
          },
          {
            id: 'caso-real-heading',
            type: 'text',
            value: 'Exemplo Real: Análise de Água Potável',
            format: 'heading2',
          },
          {
            id: 'caso-real-descricao',
            type: 'text',
            value:
              'Em estações de tratamento, a espectrofotometria é utilizada para monitorar a presença de nitratos e fosfatos em águas superficiais. Isso garante que os níveis estejam dentro dos padrões permitidos pela legislação ambiental.',
            format: 'paragraph',
          },
          {
            id: 'caso-real-quote',
            type: 'text',
            value:
              '“Sem espectrofotometria, seria quase impossível garantir a qualidade da água que chega às nossas casas.” — Técnico ambiental, SABESP',
            format: 'blockquote',
          },
          {
            id: 'interativo-cards-aplicacoes',
            type: 'interactive',
            componentName: "InfoCards",
            props: {
              cards: [
                {
                  title: 'Análises Clínicas',
                  description: 'Dosagem de glicose, colesterol, ureia e outros exames laboratoriais.',
                  icon: 'stethoscope',
                },
                {
                  title: 'Alimentos e Bebidas',
                  description: 'Controle de cor, pureza e presença de aditivos em produtos industrializados.',
                  icon: 'utensils',
                },
                {
                  title: 'Ambiental',
                  description: 'Monitoramento de águas, solos e efluentes industriais.',
                  icon: 'leaf',
                },
                {
                  title: 'Farmacêutica',
                  description: 'Verificação da pureza e concentração de ingredientes ativos.',
                  icon: 'capsule',
                },
            ],
          },
        },
        {
          id: 'conclusao-aplicacoes',
          type: 'text',
          value:
            'Esses exemplos demonstram o quão presente a espectrofotometria está em nosso cotidiano, mesmo que de forma invisível. Sua aplicação garante qualidade, segurança e precisão em diversas áreas.',
          format: 'paragraph',
        },
        {
          id: 'fim-capitulo-preview',
          type: 'text',
          value:
            'Com isso, concluímos a introdução à espectrofotometria. A seguir, você poderá revisar os principais conceitos ou avançar para atividades práticas.',
          format: 'paragraph',
        }
      ],
    },
  ] 
}
