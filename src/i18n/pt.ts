export const pt = {
  common: {
    back: "Voltar",
    loading: "Carregando...",
    save: "Salvar",
    cancel: "Cancelar",
    continue: "Continuar",
    understand: "Entendi",
  },
  analysis: {
    header: "Análise Quantitativa",
    intro: "Configure a análise e avance para a captura.",
    noProfileWarning:
      "⚠️ Sem calibração do equipamento — Calibre para escolher o comprimento de onda corretamente.",
    calibrateNow: "Calibrar agora",
    profileActiveLabel: (hash: string, rmse: string) =>
      `Perfil ativo: ${hash} · RMSE ${rmse} nm`,
    recalibrate: "Refazer calibração",
    recalibrateHint:
      "Se mudou o alinhamento/telefone, recalcule.",
    substanceLabel: "Substância",
    wavelengthLabel: "Comprimento de onda (λ nm)",
    wavelengthHelp: "Use o λmax. Se não souber, faça um mini-scan.",
    windowLabel: "Janela ± nm",
    windowHelp:
      "Faixa ao redor de λ usada para integrar o sinal; 2–5 nm costuma ser suficiente.",
    slopeLabel: "Coeficiente angular (m)",
    interceptLabel: "Coeficiente linear (b)",
    curvePickerButton: "Usar curva salva",
    pseudoDoubleBeamLabel: "Pseudo double-beam",
    pseudoDoubleBeamHelp:
      "Medir branco novamente após a amostra para compensar deriva.",
    pseudoDoubleBeamDescription:
      "Medir branco depois da amostra para compensar deriva.",
    continueCta: "Continuar para captura",
    slopeZeroError:
      "Coeficiente angular inválido (m≈0). Verifique a curva.",
    missingProfileTooltip:
      "Você ainda não calibrou o equipamento. Faça a calibração para escolher corretamente o λ.",
    highRmseWarning: (rmse: string) =>
      `A calibração está imprecisa (RMSE ${rmse} nm). Refaça a captura dos lasers.`,
    curveInfoCta: "Saiba mais",
    pseudoDoubleBeamInfo: "ℹ︎",
    chipInfo: "ℹ︎",
    rmseBadgeOk: "OK",
    rmseBadgeWarn: "Atenção",
    rmseBadgeError: "Refazer",
  },
  calibration: {
    title: "Calibrar equipamento",
    whatIsThisTitle: "O que é isso?",
    whatIsThisText:
      "Calibra o mapeamento pixel→λ. Sem isso, o λ e a janela podem ficar errados.",
    configurationTitle: "Configuração",
    roiLabel: "Janela (ROI)",
    locksLabel: "Travas",
    locksSummary: "Exposição/WB travadas",
    captureTitle: "Captura dos lasers",
    greenButton: "Capturar VERDE (10 frames)",
    redButton: "Capturar VERMELHO (10 frames)",
    blueButton: "Capturar AZUL (opcional)",
    previewPlaceholder:
      "Capture os lasers para visualizar o espectro e o pico detectado.",
    fitTitle: "Ajuste",
    coefficientsLabel: "Coeficientes",
    rmseLabel: "RMSE",
    dispersionLabel: "Dispersão",
    rmseLegend: "RMSE: erro médio do ajuste em nm (quanto menor, melhor).",
    dispersionLegend:
      "Dispersão: quantos nm por pixel — usado para a janela ±nm.",
    saveTitle: "Salvar",
    saveButton: "Salvar como perfil ativo",
    rmseBadgeOk: "≤ 2,0 nm",
    rmseBadgeWarn: "2,0–3,0 nm",
    rmseBadgeError: "> 3,0 nm",
    missingLaserWarning:
      "Capture pelo menos dois lasers antes de calcular o ajuste.",
    savedFeedback: "Perfil salvo com sucesso.",
    rmseInfoCta: "ℹ︎",
    rmseInfoTitle: "RMSE (nm) — o que significa?",
  },
  curve: {
    title: "Curva de calibração",
    whatIsThisTitle: "O que é isso?",
    whatIsThisText:
      "Relaciona absorbância à concentração. Necessária para calcular C a partir de A.",
    standardsTitle: "Padrões",
    standardsSubtitle:
      "Preencha as concentrações e capture dark/ref/padrão para cada ponto.",
    addStandard: "Adicionar padrão",
    concentrationLabel: "Concentração",
    absorbanceLabel: "Absorbância",
    captureDark: "Capturar dark",
    captureRef: "Capturar ref",
    captureSample: "Capturar padrão",
    adjustTitle: "Ajuste",
    qaTitle: "Critérios",
    qaText: "≥ 5 pontos · R² ≥ 0,995 · resíduos sem tendência",
    saveButton: "Salvar curva",
    savedFeedback: "Curva salva.",
    statsSlope: "m",
    statsIntercept: "b",
    statsR2: "R²",
    statsSee: "SEE",
    statsLod: "LOD",
    statsLoq: "LOQ",
  },
  modals: {
    deviceProfile: {
      title: "O que é o “perfil do equipamento”?",
      body:
        "O perfil define como converter pixel → comprimento de onda (λ) e qual ROI usamos no sensor. Sem ele, o λ de medição pode ficar deslocado.\nInclui: coeficientes do ajuste λ(px)=a0 + a1·px (+ a2·px²), erro RMSE (nm) e a ROI.\nQuando recalibrar? trocou de telefone/lente, mudou a geometria/ROI, ou RMSE > 2,0 nm.",
      cta: "Calibrar agora",
    },
    rmse: {
      title: "RMSE (nm) — o que significa?",
      body:
        "É o erro médio do ajuste pixel→λ em nanômetros.\n\nMeta: ≤ 2,0 nm (bom)\n\n2,0–3,0 nm: aceitável, mas considere melhorar\n\n> 3,0 nm: refaça a calibração\n\nComo melhorar:\n• usar 3 lasers (ex.: 405/450, 532, 650 nm) para ajuste quadrático;\n• ajustar a ROI para pegar só a faixa da fenda/ordem;\n• evitar saturação (reduzir exposição) e aumentar SNR (melhor alinhamento).",
      actions: ["Ajustar ROI", "Capturar 3º laser"],
    },
    pseudoDoubleBeam: {
      title: "Pseudo double-beam — por que usar?",
      body:
        "Se a lâmpada/ambiente variar durante a medição, a deriva afeta o resultado.\nMarque esta opção para medir o branco novamente após a amostra (ref_after) e a análise corrigirá o drift no tempo.\n\nQuando usar: sequências longas, fonte instável, temperatura variando.\nCusto: +1 etapa de captura (branco final).",
    },
    window: {
      title: "Janela (± nm) — como escolher?",
      body:
        "Em vez de usar 1 único pixel em λ, integramos uma faixa de ±2 a 5 nm ao redor de λ.\n\nBenefícios:\n• reduz ruído e pequenas imprecisões de λ;\n• estabiliza o cálculo da absorbância.\n\nSugestão: ±2 a ±5 nm. Use ±2 quando picos forem estreitos; ±5 se houver mais ruído.",
    },
    curve: {
      title: "Curva de calibração — para que serve?",
      body:
        "Ela relaciona Absorbância (A) e Concentração (C).\nNo modo linear, usamos A = m·C + b.\nNa amostra desconhecida, medimos A e calculamos C = (A − b)/m.\n\nComo criar (resumo):\n• Prepare ≥ 5 padrões com concentrações conhecidas;\n• Para cada padrão: dark → branco → padrão;\n• A API ajusta m e b (e mostra R², LOD/LOQ);\n• Salve a curva.\nQuando refazer: nova substância/matriz, caminho óptico mudou, R² baixo, resíduos ruins.",
      cta: "Criar/Atualizar curva",
    },
  },
} as const;

export type PtDictionary = typeof pt;
