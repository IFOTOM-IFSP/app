import { pt } from '@/src/i18n/pt';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { Button } from '@/src/components/ui/Button';
import BackButton from '@/src/components/ui/BackButton';
import { ThemedText } from '@/src/components/ui/ThemedText';
import { useThemeValue } from '@/hooks/useThemeValue';
import {
  useCalibrationCurveBuilderStore,
  type CurveStandard,
} from '@/store/calibrationCurveBuilderStore';
import { useCurveStore } from '@/store/curveStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CalibrationCurveScreen() {
  const textColor = useThemeValue('text');
  const secondaryText = useThemeValue('textSecondary');
  const cardBackground = useThemeValue('card');
  const tint = useThemeValue('primary');

  const {
    standards,
    addStandard,
    updateStandard,
    removeStandard,
    calculateFit,
    fit,
  } = useCalibrationCurveBuilderStore();
  const addCurve = useCurveStore((state) => state.addCurve);
  const [isSaving, setIsSaving] = useState(false);

  const handleCaptureToggle = (
    id: string,
    field: 'darkCaptured' | 'referenceCaptured' | 'sampleCaptured'
  ) => {
    const current = standards.find((item) => item.id === id) as CurveStandard | undefined;
    if (!current) return;
    updateStandard(id, { [field]: !current[field] } as Partial<CurveStandard>);
  };

  const handleChange = (id: string, field: 'concentration' | 'absorbance', value: string) => {
    const numeric = Number(value.replace(',', '.'));
    updateStandard(id, { [field]: Number.isFinite(numeric) ? numeric : 0 } as Partial<CurveStandard>);
  };

  const handleCalculateFit = () => {
    const result = calculateFit();
    if (!result) {
      Alert.alert('Dados insuficientes', 'Adicione ao menos dois pontos válidos.');
    }
  };

  const handleSaveCurve = async () => {
    if (!fit) {
      Alert.alert('Curva inexistente', 'Calcule a curva antes de salvar.');
      return;
    }
    const validPoints = standards.filter((point) => point.absorbance !== null && point.absorbance !== undefined);
    if (validPoints.length < 5) {
      Alert.alert('Pontos insuficientes', 'Inclua pelo menos 5 padrões antes de salvar.');
      return;
    }
    try {
      setIsSaving(true);
      await addCurve({
        id: `curve-${Date.now()}`,
        substanceName: `Curva ${new Date().toLocaleDateString('pt-BR')}`,
        wavelengthNm: 0,
        creationDate: new Date().toISOString(),
        coefficients: {
          slope_m: fit.slope,
          intercept_b: fit.intercept,
          r_squared: fit.rSquared,
        },
      });
      Alert.alert('Curva salva', pt.curve.savedFeedback, [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a curva.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.headerRow}>
        <BackButton color={textColor} style={styles.backButton} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <Text style={styles.stepBadgeText}>↗︎</Text>
          </View>
          <ThemedText style={styles.headerTitle}>{pt.curve.title}</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.sectionTitle}>{pt.curve.whatIsThisTitle}</ThemedText>
          <Text style={[styles.sectionText, { color: secondaryText }]}>{pt.curve.whatIsThisText}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.sectionTitle}>{pt.curve.standardsTitle}</ThemedText>
            <Text style={[styles.sectionText, { color: secondaryText }]}>{pt.curve.standardsSubtitle}</Text>
          </View>

          {standards.map((standard, index) => (
            <View key={standard.id} style={styles.standardCard}>
              <View style={styles.standardHeader}>
                <Text style={[styles.standardTitle, { color: textColor }]}>Padrão {index + 1}</Text>
                {standards.length > 1 && (
                  <TouchableOpacity onPress={() => removeStandard(standard.id)}>
                    <Text style={[styles.removeText, { color: '#B91C1C' }]}>Remover</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.standardRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.concentrationLabel}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
                  keyboardType="numeric"
                  value={String(standard.concentration ?? '')}
                  onChangeText={(text) => handleChange(standard.id, 'concentration', text)}
                />
              </View>
              <View style={styles.standardRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.absorbanceLabel}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
                  keyboardType="numeric"
                  value={standard.absorbance !== null && standard.absorbance !== undefined ? String(standard.absorbance) : ''}
                  onChangeText={(text) => handleChange(standard.id, 'absorbance', text)}
                />
              </View>
              <View style={styles.captureRow}>
                <TouchableOpacity
                  style={[styles.capturePill, standard.darkCaptured && styles.capturePillActive]}
                  onPress={() => handleCaptureToggle(standard.id, 'darkCaptured')}>
                  <Text style={styles.captureText}>{pt.curve.captureDark}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.capturePill, standard.referenceCaptured && styles.capturePillActive]}
                  onPress={() => handleCaptureToggle(standard.id, 'referenceCaptured')}>
                  <Text style={styles.captureText}>{pt.curve.captureRef}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.capturePill, standard.sampleCaptured && styles.capturePillActive]}
                  onPress={() => handleCaptureToggle(standard.id, 'sampleCaptured')}>
                  <Text style={styles.captureText}>{pt.curve.captureSample}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Button title={pt.curve.addStandard} variant="outline" onPress={addStandard} style={styles.addStandardButton} />
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.sectionTitle}>{pt.curve.adjustTitle}</ThemedText>
            <Button title="Calcular ajuste" variant="outline" onPress={handleCalculateFit} />
          </View>
          {fit ? (
            <View style={styles.fitGrid}>
              <View style={styles.fitRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.statsSlope}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{fit.slope.toFixed(6)}</Text>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.statsIntercept}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{fit.intercept.toFixed(6)}</Text>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.statsR2}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{fit.rSquared.toFixed(4)}</Text>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.statsSee}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{fit.see.toExponential(2)}</Text>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.statsLod}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{fit.lod ? fit.lod.toFixed(4) : '-'}</Text>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.label, { color: secondaryText }]}>{pt.curve.statsLoq}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{fit.loq ? fit.loq.toFixed(4) : '-'}</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.sectionText, { color: secondaryText }]}>Calcule o ajuste para ver os resultados.</Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.sectionTitle}>{pt.curve.qaTitle}</ThemedText>
          <Text style={[styles.sectionText, { color: secondaryText }]}>{pt.curve.qaText}</Text>
        </View>
      </ScrollView>

      <Button title={pt.curve.saveButton} onPress={handleSaveCurve} loading={isSaving} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 32,
    gap: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardHeader: {
    gap: 8,
  },
  standardCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 12,
  },
  standardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  standardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  standardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  captureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  capturePill: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    paddingVertical: 8,
    alignItems: 'center',
  },
  capturePillActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  captureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addStandardButton: {
    alignSelf: 'flex-start',
  },
  fitGrid: {
    gap: 12,
  },
  fitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
