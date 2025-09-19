import { pt } from '@/src/i18n/pt';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { Button } from '@/src/components/ui/Button';
import BackButton from '@/src/components/ui/BackButton';
import { InfoModal } from '@/src/components/ui/InfoModal';
import { ThemedText } from '@/src/components/ui/ThemedText';
import { useThemeValue } from '@/hooks/useThemeValue';
import {
  useCalibrationStore,
  type LaserKey,
  selectCalibrationFitQuality,
} from '@/store/calibrationStore';
import { useDeviceProfile, type DeviceProfile } from '@/store/deviceProfile';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const LASER_PRESETS: Record<LaserKey, { label: string; wavelength: number }> = {
  green: { label: 'VERDE', wavelength: 532 },
  red: { label: 'VERMELHO', wavelength: 650 },
  blue: { label: 'AZUL', wavelength: 450 },
};

export default function InstrumentCalibrationWizard() {
  const textColor = useThemeValue('text');
  const secondaryText = useThemeValue('textSecondary');
  const cardBackground = useThemeValue('card');
  const tint = useThemeValue('primary');

  const { roi, lasers, fit, setLaserCapture, calculateFit, setStep, isSaving, setSaving } =
    useCalibrationStore();
  const { setProfile } = useDeviceProfile();
  const [isRmseModalVisible, setRmseModalVisible] = useState(false);

  const fitQuality = selectCalibrationFitQuality(fit?.rmse ?? null);

  const handleCapture = (key: LaserKey) => {
    setStep('CAPTURE_LASERS');
    const preset = LASER_PRESETS[key];
    // TODO: integrar captura real. Placeholder para registrar o laser.
    const simulatedPeak = key === 'green' ? 520 : key === 'red' ? 760 : 420;
    setLaserCapture(key, { wavelength: preset.wavelength, peakPx: simulatedPeak });
    Alert.alert('Captura registrada', `Dados do laser ${preset.label} armazenados.`);
  };

  const handleFit = () => {
    const result = calculateFit();
    if (!result) {
      Alert.alert('Captura insuficiente', pt.calibration.missingLaserWarning);
      return;
    }
    setStep('FIT');
  };

  const handleSave = async () => {
    if (!fit) {
      Alert.alert('Ajuste necessário', 'Calcule o ajuste antes de salvar.');
      return;
    }
    try {
      setSaving(true);
      const profile: DeviceProfile = {
        device_hash: 'ifotom-local-device',
        pixel_to_wavelength: {
          a0: fit.a0,
          a1: fit.a1,
          a2: fit.a2,
          rmse_nm: fit.rmse,
        },
        roi,
      };
      await setProfile(profile);
      Alert.alert('Perfil salvo', pt.calibration.savedFeedback);
      setStep('SAVE');
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const renderLaserStatus = (key: LaserKey) => {
    const capture = lasers[key];
    const preset = LASER_PRESETS[key];
    return (
      <View key={key} style={styles.laserRow}>
        <View style={styles.laserInfo}>
          <Text style={[styles.laserLabel, { color: textColor }]}>Laser {preset.label}</Text>
          <Text style={[styles.laserSubtitle, { color: secondaryText }]}>
            {preset.wavelength} nm
          </Text>
        </View>
        <Button
          title={`Capturar ${preset.label} (10 frames)`}
          onPress={() => handleCapture(key)}
          variant={capture ? 'outline' : 'filled'}
          style={styles.captureButton}
        />
      </View>
    );
  };

  const coefficientRows = fit
    ? [
        { label: 'a0', value: fit.a0 },
        { label: 'a1', value: fit.a1 },
        ...(fit.a2 !== undefined ? [{ label: 'a2', value: fit.a2 }] : []),
      ]
    : [];

  return (
    <ScreenLayout>
      <View style={styles.headerRow}>
        <BackButton color={textColor} style={styles.backButton} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <Text style={styles.stepBadgeText}>λ</Text>
          </View>
          <ThemedText style={styles.headerTitle}>{pt.calibration.title}</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: cardBackground }]}
          accessibilityLabel="O que é a calibração">
          <ThemedText style={styles.sectionTitle}>{pt.calibration.whatIsThisTitle}</ThemedText>
          <Text style={[styles.sectionText, { color: secondaryText }]}>
            {pt.calibration.whatIsThisText}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}
          accessibilityLabel="Configuração da calibração">
          <ThemedText style={styles.sectionTitle}>{pt.calibration.configurationTitle}</ThemedText>
          <View style={styles.configRow}>
            <View>
              <Text style={[styles.configLabel, { color: secondaryText }]}>{pt.calibration.roiLabel}</Text>
              <Text style={[styles.configValue, { color: textColor }]}>
                x:{roi.x} · y:{roi.y} · w:{roi.width} · h:{roi.height}
              </Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Ajuste de ROI', 'Integração futura.')}>
              <Text style={[styles.configLink, { color: tint }]}>Ajustar ROI</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.configRow}>
            <View>
              <Text style={[styles.configLabel, { color: secondaryText }]}>{pt.calibration.locksLabel}</Text>
              <Text style={[styles.configValue, { color: textColor }]}>{pt.calibration.locksSummary}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}
          accessibilityLabel="Captura dos lasers">
          <ThemedText style={styles.sectionTitle}>{pt.calibration.captureTitle}</ThemedText>
          <View style={styles.laserList}>
            {(['green', 'red'] as LaserKey[]).map((key) => renderLaserStatus(key))}
            {lasers.blue ? renderLaserStatus('blue') : null}
          </View>
          {!lasers.blue && (
            <TouchableOpacity style={styles.addLaserButton} onPress={() => handleCapture('blue')}>
              <Text style={[styles.addLaserText, { color: tint }]}>{pt.calibration.blueButton}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}
          accessibilityLabel="Ajuste da calibração">
          <View style={styles.adjustHeader}>
            <ThemedText style={styles.sectionTitle}>{pt.calibration.fitTitle}</ThemedText>
            <TouchableOpacity onPress={() => setRmseModalVisible(true)}>
              <Text style={[styles.infoIcon, { color: secondaryText }]}>{pt.calibration.rmseInfoCta}</Text>
            </TouchableOpacity>
          </View>
          {fit ? (
            <View style={styles.fitGrid}>
              <View style={styles.fitRow}>
                <Text style={[styles.configLabel, { color: secondaryText }]}>{pt.calibration.coefficientsLabel}</Text>
                <View style={styles.coefficients}>
                  {coefficientRows.map((row) => (
                    <View key={row.label} style={styles.coefficientItem}>
                      <Text style={[styles.coefficientLabel, { color: secondaryText }]}>{row.label}</Text>
                      <Text style={[styles.coefficientValue, { color: textColor }]}>
                        {row.value.toFixed(4)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.configLabel, { color: secondaryText }]}>{pt.calibration.rmseLabel}</Text>
                <View style={[styles.badge, getFitBadgeStyle(fitQuality)]}>
                  <Text style={styles.badgeText}>{fit.rmse.toFixed(2)} nm</Text>
                </View>
              </View>
              <View style={styles.fitRow}>
                <Text style={[styles.configLabel, { color: secondaryText }]}>{pt.calibration.dispersionLabel}</Text>
                <Text style={[styles.configValue, { color: textColor }]}>
                  {fit.dispersion.toFixed(4)} nm/px
                </Text>
              </View>
              <Text style={[styles.helperText, { color: secondaryText }]}>{pt.calibration.rmseLegend}</Text>
              <Text style={[styles.helperText, { color: secondaryText }]}>{pt.calibration.dispersionLegend}</Text>
            </View>
          ) : (
            <Text style={[styles.sectionText, { color: secondaryText }]}>{pt.calibration.previewPlaceholder}</Text>
          )}
          <Button title="Calcular ajuste" onPress={handleFit} variant="outline" />
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}
          accessibilityLabel="Salvar perfil">
          <ThemedText style={styles.sectionTitle}>{pt.calibration.saveTitle}</ThemedText>
          <Text style={[styles.sectionText, { color: secondaryText }]}>
            {pt.calibration.saveButton}
          </Text>
          <Button title={pt.calibration.saveButton} onPress={handleSave} loading={isSaving} />
        </View>
      </ScrollView>

      <InfoModal
        visible={isRmseModalVisible}
        onClose={() => setRmseModalVisible(false)}
        title={pt.modals.rmse.title}
        content={<Text style={{ color: secondaryText }}>{pt.modals.rmse.body}</Text>}
        actions={
          <View style={styles.modalActions}>
            <Button
              title={pt.modals.rmse.actions[0]}
              variant="outline"
              onPress={() => {
                setRmseModalVisible(false);
                Alert.alert('Ajuste de ROI', 'Integração futura.');
              }}
            />
            <Button
              title={pt.modals.rmse.actions[1]}
              onPress={() => {
                setRmseModalVisible(false);
                Alert.alert('Captura', 'Capture o terceiro laser para ajuste quadrático.');
              }}
            />
          </View>
        }
      />
    </ScreenLayout>
  );
}

const getFitBadgeStyle = (quality: ReturnType<typeof selectCalibrationFitQuality>) => {
  switch (quality) {
    case 'ok':
      return { backgroundColor: '#DCFCE7', borderColor: '#22C55E' };
    case 'warn':
      return { backgroundColor: '#FEF9C3', borderColor: '#FACC15' };
    case 'error':
      return { backgroundColor: '#FEE2E2', borderColor: '#F87171' };
    default:
      return { backgroundColor: '#E5E7EB', borderColor: '#CBD5F5' };
  }
};

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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  configValue: {
    fontSize: 14,
  },
  configLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  laserList: {
    gap: 12,
  },
  laserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  laserInfo: {
    gap: 4,
    flex: 1,
  },
  laserLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  laserSubtitle: {
    fontSize: 14,
  },
  captureButton: {
    flex: 1,
    marginLeft: 12,
  },
  addLaserButton: {
    paddingVertical: 8,
  },
  addLaserText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  adjustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoIcon: {
    fontSize: 16,
  },
  fitGrid: {
    gap: 16,
  },
  fitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coefficients: {
    flexDirection: 'row',
    gap: 16,
  },
  coefficientItem: {
    alignItems: 'flex-start',
  },
  coefficientLabel: {
    fontSize: 12,
  },
  coefficientValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalActions: {
    gap: 12,
  },
});
