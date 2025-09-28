// app/analysis/curve.tsx
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";

import { useThemeValue } from "@/src/hooks/useThemeValue";
import {
  MIN_R2,
  MIN_STANDARDS,
  validateCalibrationAcceptance,
} from "@/src/lib/quality";
import { computeAStatsFromBursts } from "@/src/lib/quantCore";
import { useCurveLibraryStore } from "@/src/store/curveLibraryStore.ts";
import { useSettingsStore } from "@/src/store/settingsStore";
import type { PixelToWavelength } from "@/types/api";
import { useAnalysisMachine } from "../../features/analysis/AnalysisMachineProvider";

// Mesmo alvo usado no pipeline
const TARGET_POINTS = 2048;

// Escala coeficientes pixel→λ quando reamostramos para TARGET_POINTS
function scalePixelToWavelength(
  px2nm: { a0: number; a1: number; a2?: number },
  origW: number,
  newW: number
): PixelToWavelength {
  const alpha = origW > 1 && newW > 1 ? (origW - 1) / (newW - 1) : 1;
  return {
    a0: px2nm.a0,
    a1: (px2nm.a1 ?? 0) * alpha,
    a2: px2nm.a2 != null ? px2nm.a2 * alpha * alpha : undefined,
  };
}

export default function CurveBuilderScreen() {
  const router = useRouter();
  const { state, send } = useAnalysisMachine();

  const text = useThemeValue("text");
  const tint = useThemeValue("tint");
  const border = useThemeValue("border");
  const secondary = useThemeValue("textSecondary");
  const learningMode = useSettingsStore((s) => s.learningMode);

  const addCurveToLib = useCurveLibraryStore((s) => s.add);

  const ctx = state.context;
  const isAcquiring = state.matches("CALIB_CURVE");
  const isBuild = state.matches("BUILD_CURVE");

  // Deriva pontos (C, A_mean, A_sd) a partir dos bursts reamostrados (2048)
  const derived = useMemo(() => {
    const dp = ctx.deviceProfile;
    const params = ctx.params;
    const sts = ctx.acquisition?.standards ?? [];

    if (!isBuild || !dp || !params || !sts.length) {
      return {
        points: [],
        curvePreview: null as null | ReturnType<
          typeof validateCalibrationAcceptance
        >,
      };
    }

    const p2wScaled = scalePixelToWavelength(
      dp.pixel_to_nm, // atenção: seu DeviceProfile pode ser pixel_to_nm ou pixel_to_wavelength; ajuste se necessário
      dp.roi.w,
      TARGET_POINTS
    );

    const points = sts.map((s) => {
      const { A_mean, A_sd } = computeAStatsFromBursts(
        s.darkNoise!,
        s.ref!,
        s.sample!,
        p2wScaled,
        params.lambda_nm,
        params.window_nm
      );
      return { C: s.C, A_mean, A_sd };
    });

    // Validação/preview da curva (R², WLS, issues)
    const curvePreview = validateCalibrationAcceptance(points, {
      minPoints: MIN_STANDARDS,
      minR2: MIN_R2,
      useWLS: true,
    });

    return { points, curvePreview };
  }, [isBuild, ctx.deviceProfile, ctx.params, ctx.acquisition?.standards]);

  // UI Helpers
  const canSaveAndUse =
    isBuild &&
    derived.curvePreview?.ok &&
    !!derived.curvePreview?.curve?.m &&
    !!derived.curvePreview?.curve?.b;

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={styles.header}>
        <BackButton color={text} style={styles.baseContainer} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <ThemedText style={styles.stepBadgeText}>4</ThemedText>
          </View>
          <ThemedText style={styles.headerTitle}>
            Curva de Calibração
          </ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Ajuda didática */}
      {learningMode && (
        <View style={[styles.helpBox, { borderColor: border }]}>
          <ThemedText style={styles.helpItem}>
            • Medimos {MIN_STANDARDS}+ padrões com concentrações conhecidas e
            calculamos a absorbância média (A).
          </ThemedText>
          <ThemedText style={styles.helpItem}>
            • Ajustamos A = m·C + b e checamos a qualidade: R² ≥ {MIN_R2}, faixa
            linear, resíduos.
          </ThemedText>
          <ThemedText style={styles.helpItem}>
            • Se aprovado, você pode **salvar** a curva na biblioteca e usá-la
            nesta análise.
          </ThemedText>
        </View>
      )}

      {/* CALIB_CURVE → captura de padrões */}
      {isAcquiring && (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" />
          <ThemedText style={[styles.progressText, { color: secondary }]}>
            Medindo padrões e agregando replicatas…
          </ThemedText>
        </View>
      )}

      {/* BUILD_CURVE → revisão dos pontos e do ajuste */}
      {isBuild && (
        <>
          <View style={[styles.card, { borderColor: border }]}>
            <ThemedText style={styles.sectionTitle}>Pontos (A × C)</ThemedText>
            {derived.points.length === 0 ? (
              <ThemedText style={{ color: secondary }}>
                Nenhum ponto encontrado. Volte e refaça a aquisição.
              </ThemedText>
            ) : (
              <View style={{ gap: 6 }}>
                {derived.points.map((p, i) => (
                  <ThemedText key={i}>
                    • C={p.C} → Ā={p.A_mean.toFixed(3)} (sd={p.A_sd?.toFixed(3)}
                    )
                  </ThemedText>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.card, { borderColor: border }]}>
            <ThemedText style={styles.sectionTitle}>Ajuste</ThemedText>
            {derived.curvePreview && (
              <>
                <ThemedText>
                  m={derived.curvePreview.curve.m.toFixed(6)} | b=
                  {derived.curvePreview.curve.b.toFixed(6)}
                </ThemedText>
                <ThemedText>
                  R²={derived.curvePreview.curve.R2?.toFixed(4) ?? "—"} | SEE=
                  {derived.curvePreview.curve.SEE?.toFixed(4) ?? "—"}
                </ThemedText>

                {derived.curvePreview.issues.length > 0 && (
                  <View style={styles.issuesBox}>
                    {derived.curvePreview.issues.map((msg, i) => (
                      <ThemedText key={i} style={styles.issueText}>
                        • {msg}
                      </ThemedText>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>

          <View style={{ gap: 8 }}>
            <Button
              title="Salvar curva na biblioteca e usar"
              disabled={!canSaveAndUse}
              onPress={() => {
                const c = derived.curvePreview!.curve;
                const params = state.context.params!;
                const name = `${params.substance ?? "Substância"} @ ${
                  params.lambda_nm
                } nm`;

                // 1) Salva na biblioteca (persistência)
                addCurveToLib({
                  id: Crypto.randomUUID(),
                  name,
                  substance: params.substance,
                  lambda_nm: params.lambda_nm,
                  createdAt: Date.now(),
                  coeffs: {
                    m: c.m,
                    b: c.b,
                    R2: c.R2,
                    SEE: c.SEE,
                    s_m: c.s_m,
                    s_b: c.s_b,
                  },
                  range: c.range,
                });

                // 2) Informa a máquina para usar essa curva no processamento
                send({
                  type: "QA_SAVE_CURVE",
                  curve: {
                    m: c.m,
                    b: c.b,
                    s_m: c.s_m,
                    s_b: c.s_b,
                    range: c.range,
                  },
                });

                Alert.alert(
                  "Curva salva",
                  "A curva foi salva e será usada nesta análise."
                );
              }}
            />

            <Button
              title="Prosseguir para a amostra"
              variant="outline"
              onPress={() => send({ type: "NEXT" })}
            />
          </View>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  baseContainer: { padding: 0, backgroundColor: "transparent" },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepBadgeText: { color: "white", fontWeight: "bold", fontSize: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },

  helpBox: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  helpItem: { fontSize: 15, lineHeight: 22, marginBottom: 6 },

  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
  },
  progressText: { fontSize: 16 },

  card: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },

  issuesBox: { marginTop: 8, gap: 4 },
  issueText: { color: "#B00020" },
});
