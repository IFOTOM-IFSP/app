export const pt = {
  analysis: {
    quantitative: {
      headerTitle: 'Análise Quantitativa',
      heroCopy:
        'Configure os parâmetros, confira se pré-requisitos estão ok e avance para capturar dark/ref/amostra.',
      missingProfileChip:
        '⚠️ Sem calibração do equipamento — calibre antes de medir para alinhar o λ corretamente.',
      profileChipPrefix: 'Perfil ativo:',
      profileChipRmse: (rmse: string) => `RMSE ${rmse} nm`,
      profileActions: {
        calibrateNow: 'Calibrar agora',
        recalibrate: 'Refazer calibração',
      },
      form: {
        substanceLabel: 'Substância / identificação',
        wavelengthLabel: 'Comprimento de onda (nm)',
        wavelengthHelp:
          'Use o λmax do analito. Em dúvida? Faça uma varredura rápida para encontrar o pico.',
        windowLabel: 'Janela espectral (± nm)',
        slopeLabel: 'Coeficiente angular (m)',
        interceptLabel: 'Coeficiente linear (b)',
        framesLabel: 'Frames por burst',
        pseudoDoubleBeam: 'Pseudo double-beam (branco após amostra)',
      },
      cta: 'Continuar para captura',
      validators: {
        missingProfile: 'Você ainda não calibrou o equipamento. Salve um perfil antes de continuar.',
        poorProfile: (rmse: number) =>
          `A calibração atual está imprecisa (RMSE ${rmse.toFixed(2)} nm). Refaça a captura dos lasers.`,
        missingVectors: 'Capture dark, branco e amostra antes de prosseguir.',
        inconsistentFrames: (expected: number, dark: number, ref: number, sample: number) =>
          `Esperava ${expected} frames/burst. Recebido: dark ${dark}, branco ${ref}, amostra ${sample}.`,
        missingRefAfter: 'Capture o branco após a amostra ou desligue o pseudo double-beam.',
        invalidSlope: 'Coeficiente angular (m) inválido. Crie ou importe uma curva válida.',
      },
    },
  },
  calibration: {
    wizard: {
      title: 'Calibração do equipamento',
      intro:
        'Calibra o mapeamento pixel → λ para garantir leituras corretas. Use lasers conhecidos (532 nm, 650 nm, opcional 3º ponto).',
      steps: {
        intro: 'Entender',
        roi: 'Configurar ROI',
        capture: 'Capturar lasers',
        fit: 'Ajuste',
        review: 'Revisar',
        save: 'Salvar',
      },
      roiSection: {
        title: 'ROI e travas',
        description:
          'Ajuste a janela que cobre a fenda/ordem do espectro. Garanta que exposição/WB estejam travadas antes de capturar.',
        locked: 'Exposição / WB travadas',
        unlocked: 'Configurar travas antes de prosseguir',
      },
      captureSection: {
        title: 'Capturar lasers',
        instruction:
          'Use a tela de captura para gravar ~10 frames para cada laser e, em seguida, importe o burst para esta tela.',
        importFromRef: 'Usar burst atual (referência)',
        importFromSample: 'Usar burst atual (amostra)',
        importFromDark: 'Usar burst atual (escuro)',
      },
      adjustmentSection: {
        title: 'Ajuste pixel → λ',
        summaryLabel: 'Resumo do ajuste',
        rmseBadge: {
          ok: 'OK',
          warn: 'Atenção',
          bad: 'Refazer',
        },
      },
      saveSection: {
        title: 'Salvar como perfil ativo',
        description:
          'Salva localmente o hash, ROI, coeficientes e RMSE. Necessário para habilitar análises quantitativas.',
        cta: 'Salvar perfil',
        saved: 'Perfil salvo! Pronto para usar nas análises.',
        redo: 'Refazer calibração',
      },
    },
  },
  modals: {
    profile: {
      title: 'O que é o “perfil do equipamento”?',
      body:
        'O perfil define como converter pixel → comprimento de onda (λ) e qual ROI usamos no sensor. Sem ele, o λ pode ficar deslocado. Inclui: coeficientes do ajuste λ(px)=a0 + a1·px (+ a2·px²), erro RMSE (nm) e a ROI. Recalibre se trocar de telefone, lente, geometria ou se o RMSE > 2,0 nm.',
      cta: 'Calibrar agora',
    },
    rmse: {
      title: 'RMSE (nm) — o que significa?',
      body:
        'É o erro médio do ajuste pixel→λ em nanômetros. Meta: ≤ 2,0 nm (bom). 2,0–3,0 nm: aceitável, mas considere melhorar. > 3,0 nm: refaça a calibração. Como melhorar: usar 3 lasers (ex.: 405/450, 532, 650 nm) para ajuste quadrático; ajustar a ROI; evitar saturação e melhorar o alinhamento.',
      actions: ['Ajustar ROI', 'Capturar 3º laser'],
    },
    pseudoDoubleBeam: {
      title: 'Pseudo double-beam — por que usar?',
      body:
        'Se a lâmpada ou o ambiente variar durante a medição, a deriva afeta o resultado. Marque esta opção para medir o branco novamente após a amostra (ref_after) e a análise corrigirá o drift. Use em sequências longas, fontes instáveis ou quando a temperatura varia. Custo: +1 etapa de captura (branco final).',
      toggle: 'Usar branco após amostra',
    },
    window: {
      title: 'Janela (± nm) — como escolher?',
      body:
        'Em vez de usar 1 único pixel em λ, integramos uma faixa de ±2 a ±5 nm ao redor de λ. Isso reduz ruído e pequenas imprecisões de λ, estabilizando o cálculo da absorbância. Use ±2 nm para picos estreitos; ±5 nm quando houver mais ruído.',
    },
    curve: {
      title: 'Curva de calibração — para que serve?',
      body:
        'Relaciona Absorbância (A) e Concentração (C). Na forma linear, A = m·C + b e C = (A − b)/m. Como criar: prepare ≥5 padrões com concentrações conhecidas; para cada um capture dark → branco → padrão; a API ajusta m e b (mostra R², LOD/LOQ); salve a curva. Refaça quando mudar substância, matriz, caminho óptico ou se R²/resíduos estiverem ruins.',
      cta: 'Criar/Atualizar curva',
    },
  },
};

export type AppStrings = typeof pt;
