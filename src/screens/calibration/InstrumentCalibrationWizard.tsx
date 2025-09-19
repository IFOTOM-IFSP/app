import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import BackButton from '@/src/components/ui/BackButton';
import { Button } from '@/src/components/ui/Button';
import { ThemedInput } from '@/src/components/ui/ThemedInput';
import { ThemedText } from '@/src/components/ui/ThemedText';
import { Tag } from '@/src/components/ui/Tag';
import { InfoModal } from '@/src/components/ui/InfoModal';
import { useThemeValue } from '@/hooks/useThemeValue';
import { BorderRadius, Margin, Padding, Spacing } from '@/constants/Styles';
import { useVectorsStore } from '@/store/analysisVectors';
import { useDeviceProfile, type DeviceProfile } from '@/store/deviceProfile';
import { ApiClient } from '@/services/http';
import { ENV } from '@/config/env';
import { useCalibrationStore, type LaserColor } from '@/store/calibrationStore';
import { createLaserBurst } from '@/utils/syntheticBurst';
import { pt } from '@/src/i18n/pt';

const strings = pt.calibration.wizard;
const modals = pt.modals;

type WizardStep = 'intro' | 'roi' | 'capture' | 'review' | 'saved';

const stepLabels: Record<WizardStep, string> = {
  intro: strings.steps.intro,
  roi: strings.steps.roi,
  capture: strings.steps.capture,
  review: strings.steps.review,
  saved: strings.steps.save,
};

type VectorKey = 'dark' | 'ref' | 'sample';

const DEFAULT_LASER_WAVELENGTHS: Record<LaserColor, number> = {
  green: 532,
  red: 650,
  blue: 450,
};

const LASER_ORDER: { color: LaserColor; label: string; storeKey: VectorKey; helperButton: string }[] = [
  { color: 'green', label: 'Laser verde (~532 nm)', storeKey: 'ref', helperButton: strings.captureSection.importFromRef },
  { color: 'red', label: 'Laser vermelho (~650 nm)', storeKey: 'sample', helperButton: strings.captureSection.importFromSample },
  { color: 'blue', label: 'Laser adicional (opcional)', storeKey: 'dark', helperButton: strings.captureSection.importFromDark },
];

export default function InstrumentCalibrationWizard() {
  const [step, setStep] = useState<WizardStep>('intro');
  const [isSaving, setIsSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<'profile' | 'rmse' | null>(null);
  const [autoRmseShown, setAutoRmseShown] = useState(false);

  const tint = useThemeValue('primary');
  const cardBackground = useThemeValue('card');
  const text = useThemeValue('text');
  const muted = useThemeValue('textSecondary');

  const vectors = useVectorsStore();
  const { setProfile } = useDeviceProfile();
  const calibration = useCalibrationStore();
  const api = useMemo(() => new ApiClient(ENV.API_BASE_URL), []);

  useEffect(() => {
    if (step === 'review' && calibration.fit && calibration.fit.rmseNm > 2 && !autoRmseShown) {
      setActiveModal('rmse');
      setAutoRmseShown(true);
    }
  }, [step, calibration.fit, autoRmseShown]);

  const handleImport = (color: LaserColor, source: VectorKey) => {
    let frames = vectors[source];
    let alertTitle = 'Burst importado';
    let alertMessage = 'Usamos o burst mais recente para este laser.';

    if (!frames || !frames.length) {
      const fallbackNm = calibration.lasers[color]?.wavelength ?? DEFAULT_LASER_WAVELENGTHS[color];
      const syntheticBurst = createLaserBurst(fallbackNm, 10);

      if (source === 'ref') {
        vectors.setRef(syntheticBurst);
      } else if (source === 'sample') {
        vectors.setSample(syntheticBurst);
      } else {
        vectors.setDark(syntheticBurst);
      }

      frames = syntheticBurst;
      alertTitle = 'Burst sintético gerado';
      alertMessage = 'Não encontramos capturas recentes, então geramos um burst de exemplo. Capture dados reais quando possível.';
    }

    calibration.setLaserFrames(color, frames);
    Alert.alert(alertTitle, alertMessage);
  };

  const handleSaveProfile = async () => {
    if (!calibration.fit) {
      Alert.alert('Capture os lasers', 'Importe pelo menos dois lasers antes de salvar.');
      return;
    }
    setIsSaving(true);
    try {
      const { coefficients, rmseNm } = calibration.fit;
      const device_profile: DeviceProfile = {
        device_hash: 'expo-managed-dev',
        pixel_to_wavelength: {
          a0: coefficients.a0,
          a1: coefficients.a1,
          a2: coefficients.a2,
          rmse_nm: rmseNm,
        },
        roi: calibration.roi,
        camera_meta: { wb: 'locked' },
      };
      await setProfile(device_profile);
      try {
        await api.characterizeInstrument({
          frames_green: calibration.lasers.green?.frames ?? [],
          frames_red: calibration.lasers.red?.frames ?? [],
          frames_blue: calibration.lasers.blue?.frames ?? [],
          roi: calibration.roi,
          hints: {
            nm_green: calibration.lasers.green?.wavelength,
            nm_red: calibration.lasers.red?.wavelength,
            nm_blue: calibration.lasers.blue?.wavelength,
          },
        });
      } catch (error) {
        console.warn('Falha no envio opcional da caracterização', error);
      }
      setStep('saved');
    } catch (error) {
      Alert.alert('Erro ao salvar perfil', (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const rmseBadgeVariant = () => {
    const rmse = calibration.fit?.rmseNm ?? 0;
    if (rmse <= 2) return { variant: 'success' as const, label: strings.adjustmentSection.rmseBadge.ok };
    if (rmse <= 3) return { variant: 'warning' as const, label: strings.adjustmentSection.rmseBadge.warn };
    return { variant: 'error' as const, label: strings.adjustmentSection.rmseBadge.bad };
  };

  const renderIntro = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}> 
      <ThemedText style={styles.cardTitle}>{strings.title}</ThemedText>
      <ThemedText style={[styles.cardBody, { color: muted }]}>{strings.intro}</ThemedText>
      <Button title="Começar calibração" onPress={() => setStep('roi')} />
    </View>
  );

  const renderRoi = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}> 
      <ThemedText style={styles.sectionTitle}>{strings.roiSection.title}</ThemedText>
      <ThemedText style={[styles.cardBody, { color: muted }]}>{strings.roiSection.description}</ThemedText>
      <View style={styles.roiBox}> 
        <ThemedText style={styles.roiText}>ROI atual</ThemedText>
        <ThemedText style={[styles.roiValue, { color: text }]}>
          x={calibration.roi.x} · y={calibration.roi.y} · w={calibration.roi.width} · h={calibration.roi.height}
        </ThemedText>
      </View>
      <View style={styles.lockRow}>
        <Tag
          text={calibration.exposuresLocked ? strings.roiSection.locked : strings.roiSection.unlocked}
          variant={calibration.exposuresLocked ? 'success' : 'warning'}
          size="sm"
        />
        <Button
          title={calibration.exposuresLocked ? 'Destravar' : 'Marcar como travado'}
          variant="outline"
          onPress={() => calibration.setExposureLocked(!calibration.exposuresLocked)}
        />
      </View>
      <Button title="Ir para captura" onPress={() => setStep('capture')} />
    </View>
  );

  const renderCapture = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}> 
      <ThemedText style={styles.sectionTitle}>{strings.captureSection.title}</ThemedText>
      <ThemedText style={[styles.cardBody, { color: muted }]}>{strings.captureSection.instruction}</ThemedText>
      {LASER_ORDER.map((laser) => {
        const measurement = calibration.lasers[laser.color];
        return (
          <View key={laser.color} style={styles.laserBlock}>
            <ThemedText style={styles.laserLabel}>{laser.label}</ThemedText>
            <ThemedInput
              keyboardType="numeric"
              value={String(measurement?.wavelength ?? DEFAULT_LASER_WAVELENGTHS[laser.color])}
              onChangeText={(textValue) => {
                const numeric = Number(textValue.replace(',', '.'));
                if (!Number.isNaN(numeric)) {
                  calibration.setLaserWavelength(laser.color, numeric);
                }
              }}
              placeholder="λ conhecido"
            />
            <View style={styles.laserActions}>
              <Button
                title={laser.helperButton}
                variant="outline"
                onPress={() => handleImport(laser.color, laser.storeKey)}
              />
              <Tag
                text={`${measurement?.frames.length ?? 0} frames`}
                variant={(measurement?.frames.length ?? 0) >= 2 ? 'success' : 'warning'}
                size="sm"
              />
            </View>
          </View>
        );
      })}
      <Button
        title="Calcular ajuste"
        onPress={() => {
          const ready = LASER_ORDER.filter((laser) => (calibration.lasers[laser.color]?.frames.length ?? 0) > 0).length;
          if (ready < 2) {
            Alert.alert('Capturas insuficientes', 'Importe pelo menos dois lasers para ajustar pixel → λ.');
            return;
          }
          setStep('review');
        }}
      />
    </View>
  );

  const renderReview = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}> 
      <View style={styles.reviewHeader}>
        <ThemedText style={styles.sectionTitle}>{strings.adjustmentSection.title}</ThemedText>
        {calibration.fit && (
          <Tag
            text={`${rmseBadgeVariant().label} · ${calibration.fit.rmseNm.toFixed(2)} nm`}
            variant={rmseBadgeVariant().variant}
            size="sm"
            style={{ marginLeft: Spacing.sm }}
          />
        )}
      </View>
      {calibration.fit ? (
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Coeficientes</ThemedText>
            <ThemedText style={styles.summaryValue}>
              a0 {calibration.fit.coefficients.a0.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.summaryValue}>
              a1 {calibration.fit.coefficients.a1.toFixed(4)}
            </ThemedText>
            {typeof calibration.fit.coefficients.a2 === 'number' && (
              <ThemedText style={styles.summaryValue}>
                a2 {calibration.fit.coefficients.a2.toExponential(2)}
              </ThemedText>
            )}
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Picos (px)</ThemedText>
            {LASER_ORDER.map((laser) => (
              <ThemedText key={laser.color} style={styles.summaryValue}>
                {laser.label.split('(')[0].trim()}: {calibration.fit?.peaks[laser.color] ?? '-'}
              </ThemedText>
            ))}
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Dispersão</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {calibration.fit.dispersionNmPerPx.toFixed(3)} nm/px
            </ThemedText>
            <Button
              title="Ver dica sobre RMSE"
              variant="outline"
              onPress={() => setActiveModal('rmse')}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </View>
      ) : (
        <ThemedText style={[styles.cardBody, { color: muted }]}> 
          Importe pelo menos dois lasers para gerar o ajuste.
        </ThemedText>
      )}
      <ThemedText style={[styles.cardBody, { color: muted }]}>
        {strings.saveSection.description}
      </ThemedText>
      <Button
        title={strings.saveSection.cta}
        onPress={handleSaveProfile}
        disabled={!calibration.fit}
        loading={isSaving}
        style={{ marginTop: Spacing.lg }}
      />
    </View>
  );

  const renderSaved = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}> 
      <ThemedText style={styles.sectionTitle}>{strings.saveSection.saved}</ThemedText>
      <Button
        title={strings.saveSection.redo}
        onPress={() => {
          calibration.reset();
          setStep('roi');
          setAutoRmseShown(false);
        }}
      />
    </View>
  );

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <BackButton color={text} />
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle}>{strings.title}</ThemedText>
          <Tag text={stepLabels[step]} variant="primary" size="sm" style={{ marginTop: 4 }} />
        </View>
        <TouchableOpacity onPress={() => setActiveModal('profile')} accessibilityRole="button">
          <ThemedText style={[styles.helpLink, { color: tint }]}>Saiba mais</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText style={[styles.hero, { color: muted }]}>{strings.intro}</ThemedText>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {step === 'intro' && renderIntro()}
        {step === 'roi' && renderRoi()}
        {step === 'capture' && renderCapture()}
        {step === 'review' && renderReview()}
        {step === 'saved' && renderSaved()}
      </ScrollView>
      <InfoModal
        visible={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        title={modals.profile.title}
        content={modals.profile.body}
        actions={
          <Button
            title={modals.profile.cta}
            onPress={() => {
              setActiveModal(null);
              if (step === 'intro') {
                setStep('roi');
              }
            }}
            style={{ marginHorizontal: Padding.lg }}
          />
        }
      />
      <InfoModal
        visible={activeModal === 'rmse'}
        onClose={() => setActiveModal(null)}
        title={modals.rmse.title}
        content={modals.rmse.body}
        actions={
          <View style={styles.modalActions}>
            {modals.rmse.actions?.map((action) => (
              <Button key={action} title={action} variant="outline" style={{ marginBottom: Spacing.sm }} onPress={() => setActiveModal(null)} />
            ))}
          </View>
        }
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Margin.md,
  },
  headerCenter: {
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  hero: {
    marginBottom: Margin.lg,
    fontSize: 14,
    lineHeight: 20,
  },
  helpLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingBottom: Padding.xl,
    gap: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Padding.lg,
    gap: Spacing.md,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  roiBox: {
    padding: Padding.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 4,
  },
  roiText: {
    fontWeight: '600',
  },
  roiValue: {
    fontSize: 14,
  },
  lockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  laserBlock: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    gap: Spacing.sm,
  },
  laserLabel: {
    fontWeight: '600',
  },
  laserActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  summaryItem: {
    flexBasis: '48%',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: Padding.md,
    gap: 4,
  },
  summaryLabel: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: 14,
  },
  modalActions: {
    paddingHorizontal: Padding.lg,
    paddingBottom: Padding.lg,
  },
});
