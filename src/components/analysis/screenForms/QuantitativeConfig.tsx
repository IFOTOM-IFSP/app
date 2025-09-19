import { pt } from '@/src/i18n/pt';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { Button } from '@/src/components/ui/Button';
import BackButton from '@/src/components/ui/BackButton';
import { InfoModal } from '@/src/components/ui/InfoModal';
import { ThemedText } from '@/src/components/ui/ThemedText';
import { useThemeValue } from '@/hooks/useThemeValue';
import { useDeviceProfile } from '@/store/deviceProfile';
import { useCurveStore } from '@/store/curveStore';
import { useQuantitativeAnalysisStore, isSlopeNearZero } from '@/store/quantitativeAnalysisStore';
import { selectCalibrationFitQuality } from '@/store/calibrationStore';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { CalibrationCurve } from '@/models/CalibrationCurve';

type CurveModalProps = {
  visible: boolean;
  curves: CalibrationCurve[];
  onClose: () => void;
  onSelect: (curve: CalibrationCurve) => void;
};

const CurvePickerModal = ({ visible, curves, onClose, onSelect }: CurveModalProps) => {
  const cardBackground = useThemeValue('card');
  const textColor = useThemeValue('text');
  const secondaryText = useThemeValue('textSecondary');

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.modalTitle}>{pt.analysis.curvePickerButton}</ThemedText>
          <ScrollView style={{ maxHeight: 320 }}>
            {curves.length === 0 ? (
              <Text style={[styles.emptyStateText, { color: secondaryText }]}>Nenhuma curva salva.</Text>
            ) : (
              curves.map((curve) => (
                <TouchableOpacity
                  key={curve.id}
                  style={styles.curveRow}
                  onPress={() => {
                    onSelect(curve);
                    onClose();
                  }}>
                  <View style={styles.curveRowText}>
                    <Text style={[styles.curveName, { color: textColor }]}>{curve.substanceName}</Text>
                    <Text style={[styles.curveMetadata, { color: secondaryText }]}>
                      λ {curve.wavelengthNm} nm · m {curve.coefficients.slope_m.toFixed(4)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <Button title={pt.common.cancel} onPress={onClose} variant="outline" style={styles.modalCloseButton} />
        </View>
      </View>
    </Modal>
  );
};

function formatNumber(value: number | null | undefined, digits = 2) {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return value.toFixed(digits);
}

export default function QuantitativeAnalysisScreen() {
  const [isProfileInfoOpen, setProfileInfoOpen] = useState(false);
  const [isRmseInfoOpen, setRmseInfoOpen] = useState(false);
  const [isWindowInfoOpen, setWindowInfoOpen] = useState(false);
  const [isPseudoInfoOpen, setPseudoInfoOpen] = useState(false);
  const [isCurveInfoOpen, setCurveInfoOpen] = useState(false);
  const [hasShownPseudoModal, setHasShownPseudoModal] = useState(false);
  const [isCurveModalOpen, setCurveModalOpen] = useState(false);

  const textColor = useThemeValue('text');
  const secondaryText = useThemeValue('textSecondary');
  const cardBackground = useThemeValue('card');
  const tint = useThemeValue('primary');

  const { profile, load } = useDeviceProfile();
  const setParam = useQuantitativeAnalysisStore((state) => state.setParam);
  const params = useQuantitativeAnalysisStore((state) => state.params);
  const setError = useQuantitativeAnalysisStore((state) => state.setError);

  const curves = useCurveStore((state) => state.curves);
  const loadCurves = useCurveStore((state) => state.loadCurves);

  const [substance, setSubstance] = useState(params.substance);
  const [wavelengthInput, setWavelengthInput] = useState(
    params.wavelengthNm !== null && params.wavelengthNm !== undefined
      ? String(params.wavelengthNm)
      : ''
  );
  const [windowInput, setWindowInput] = useState(String(params.windowNm ?? ''));
  const [slopeInput, setSlopeInput] = useState(
    params.slope !== null && params.slope !== undefined ? String(params.slope) : ''
  );
  const [interceptInput, setInterceptInput] = useState(
    params.intercept !== null && params.intercept !== undefined ? String(params.intercept) : ''
  );
  const [pseudoDoubleBeam, setPseudoDoubleBeam] = useState(params.pseudoDoubleBeam);

  useEffect(() => {
    load().catch(() => undefined);
    loadCurves().catch(() => undefined);
  }, [load, loadCurves]);

  useEffect(() => {
    setParam('substance', substance);
  }, [setParam, substance]);

  useEffect(() => {
    setParam('pseudoDoubleBeam', pseudoDoubleBeam);
  }, [setParam, pseudoDoubleBeam]);

  const rmse = profile?.pixel_to_wavelength?.rmse_nm ?? null;
  const rmseQuality = selectCalibrationFitQuality(rmse);

  const parsedWavelength = useMemo(() => {
    const numeric = Number(wavelengthInput.replace(',', '.'));
    if (!Number.isFinite(numeric)) return null;
    return numeric;
  }, [wavelengthInput]);

  const parsedWindow = useMemo(() => {
    const numeric = Number(windowInput.replace(',', '.'));
    if (!Number.isFinite(numeric)) return null;
    return numeric;
  }, [windowInput]);

  const parsedSlope = useMemo(() => {
    const numeric = Number(slopeInput.replace(',', '.'));
    if (!Number.isFinite(numeric)) return null;
    return numeric;
  }, [slopeInput]);

  const parsedIntercept = useMemo(() => {
    const numeric = Number(interceptInput.replace(',', '.'));
    if (!Number.isFinite(numeric)) return null;
    return numeric;
  }, [interceptInput]);

  useEffect(() => {
    setParam('wavelengthNm', parsedWavelength);
  }, [parsedWavelength, setParam]);

  useEffect(() => {
    if (parsedWindow !== null) {
      setParam('windowNm', parsedWindow);
    }
  }, [parsedWindow, setParam]);

  useEffect(() => {
    setParam('slope', parsedSlope);
  }, [parsedSlope, setParam]);

  useEffect(() => {
    setParam('intercept', parsedIntercept);
  }, [parsedIntercept, setParam]);

  const handleSelectCurve = (curve: CalibrationCurve) => {
    setSlopeInput(curve.coefficients.slope_m.toString());
    setInterceptInput(curve.coefficients.intercept_b.toString());
    setParam('selectedCurveId', curve.id);
  };

  const hasProfile = Boolean(profile);
  const slopeNearZero = isSlopeNearZero(parsedSlope);
  const rmseTooHigh = rmse !== null && rmse > 3;
  const missingWavelength = parsedWavelength === null;
  const missingWindow = parsedWindow === null;
  const missingSubstance = substance.trim().length === 0;

  const disableReason = !hasProfile
    ? pt.analysis.missingProfileTooltip
    : rmseTooHigh
    ? pt.analysis.highRmseWarning(formatNumber(rmse, 1))
    : slopeNearZero
    ? pt.analysis.slopeZeroError
    : missingWavelength
    ? 'Informe o λ.'
    : missingWindow
    ? 'Informe a janela ±nm.'
    : missingSubstance
    ? 'Informe a substância.'
    : undefined;

  const canContinue = !disableReason;

  const handleContinue = () => {
    if (!canContinue) return;
    setError(null);
    Alert.alert('Captura', 'Pronto para capturar dark/ref/amostra.');
  };

  const rmseBadgeStyle = useMemo(() => {
    switch (rmseQuality) {
      case 'ok':
        return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'warn':
        return { backgroundColor: '#FEF9C3', color: '#854D0E' };
      case 'error':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default:
        return { backgroundColor: cardBackground, color: secondaryText };
    }
  }, [rmseQuality, cardBackground, secondaryText]);

  return (
    <ScreenLayout>
      <View style={styles.headerRow}>
        <BackButton color={textColor} style={styles.backButton} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <Text style={styles.stepBadgeText}>λ</Text>
          </View>
          <ThemedText style={styles.headerTitle}>{pt.analysis.header}</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ThemedText style={[styles.instructions, { color: secondaryText }]}>
        {pt.analysis.intro}
      </ThemedText>

      <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
        <View style={styles.profileHeader}>
          <ThemedText style={styles.profileTitle}>Perfil do equipamento</ThemedText>
          <TouchableOpacity onPress={() => setProfileInfoOpen(true)}>
            <Text style={[styles.infoIcon, { color: secondaryText }]}>{pt.analysis.chipInfo}</Text>
          </TouchableOpacity>
        </View>
        {!hasProfile ? (
          <View style={styles.profileBody}>
            <Text style={[styles.warningText, { color: secondaryText }]}>
              {pt.analysis.noProfileWarning}
            </Text>
            <Button title={pt.analysis.calibrateNow} onPress={() => router.push('/(tabs)/analysis/calibration')} />
          </View>
        ) : (
          <View style={styles.profileBody}>
            <Text style={[styles.profileText, { color: textColor }]}>
              {pt.analysis.profileActiveLabel(profile.device_hash, formatNumber(rmse, 1))}
            </Text>
            <View style={styles.profileActions}>
              <Button
                title={pt.analysis.recalibrate}
                onPress={() => router.push('/(tabs)/analysis/calibration')}
                variant="outline"
                style={styles.recalibrateButton}
              />
              <TouchableOpacity onPress={() => setRmseInfoOpen(true)} style={styles.rmseBadge}>
                <View style={[styles.badge, { backgroundColor: rmseBadgeStyle.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: rmseBadgeStyle.color }]}>RMSE {formatNumber(rmse, 2)} nm</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={[styles.recalibrateHint, { color: secondaryText }]}>{pt.analysis.recalibrateHint}</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: secondaryText }]}>{pt.analysis.substanceLabel}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
            value={substance}
            placeholder="Ex.: Azul de metileno"
            placeholderTextColor={secondaryText}
            onChangeText={setSubstance}
          />
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: secondaryText }]}>{pt.analysis.wavelengthLabel}</Text>
            <TouchableOpacity onPress={() => setWindowInfoOpen(true)}>
              <Text style={[styles.infoIcon, { color: secondaryText }]}>{pt.analysis.pseudoDoubleBeamInfo}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
            keyboardType="numeric"
            value={wavelengthInput}
            onChangeText={setWavelengthInput}
            placeholder="λ"
            placeholderTextColor={secondaryText}
          />
          <Text style={[styles.helperText, { color: secondaryText }]}>{pt.analysis.wavelengthHelp}</Text>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: secondaryText }]}>{pt.analysis.windowLabel}</Text>
            <TouchableOpacity onPress={() => setWindowInfoOpen(true)}>
              <Text style={[styles.infoIcon, { color: secondaryText }]}>{pt.analysis.pseudoDoubleBeamInfo}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
            keyboardType="numeric"
            value={windowInput}
            onChangeText={setWindowInput}
            placeholder="±nm"
            placeholderTextColor={secondaryText}
          />
          <Text style={[styles.helperText, { color: secondaryText }]}>{pt.analysis.windowHelp}</Text>
        </View>

        <View style={[styles.formGroup, styles.curveGroup]}>
          <View style={styles.curveHeader}>
            <Text style={[styles.label, { color: secondaryText }]}>Curva de calibração</Text>
            <TouchableOpacity onPress={() => setCurveInfoOpen(true)}>
              <Text style={[styles.infoIcon, { color: secondaryText }]}>{pt.analysis.curveInfoCta}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.curveInputsRow}>
            <View style={styles.curveField}>
              <Text style={[styles.label, { color: secondaryText }]}>{pt.analysis.slopeLabel}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
                value={slopeInput}
                keyboardType="numeric"
                onChangeText={setSlopeInput}
                placeholder="m"
                placeholderTextColor={secondaryText}
              />
            </View>
            <View style={styles.curveField}>
              <Text style={[styles.label, { color: secondaryText }]}>{pt.analysis.interceptLabel}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: cardBackground, color: textColor }]}
                value={interceptInput}
                keyboardType="numeric"
                onChangeText={setInterceptInput}
                placeholder="b"
                placeholderTextColor={secondaryText}
              />
            </View>
          </View>

          <Button
            title={pt.analysis.curvePickerButton}
            variant="outline"
            onPress={() => setCurveModalOpen(true)}
            style={styles.curvePickerButton}
          />

          {slopeNearZero && (
            <Text style={[styles.errorText, { color: '#B91C1C' }]}>{pt.analysis.slopeZeroError}</Text>
          )}
        </View>

        <View style={[styles.formGroup, styles.switchRow]}>
          <View>
            <Text style={[styles.label, { color: secondaryText }]}>{pt.analysis.pseudoDoubleBeamLabel}</Text>
            <Text style={[styles.helperText, { color: secondaryText }]}>
              {pt.analysis.pseudoDoubleBeamDescription}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setPseudoInfoOpen(true)} style={styles.switchInfoIcon}>
            <Text style={[styles.infoIcon, { color: secondaryText }]}>{pt.analysis.pseudoDoubleBeamInfo}</Text>
          </TouchableOpacity>
          <Switch
            value={pseudoDoubleBeam}
            onValueChange={(value) => {
              setPseudoDoubleBeam(value);
              if (value && !hasShownPseudoModal) {
                setPseudoInfoOpen(true);
                setHasShownPseudoModal(true);
              }
            }}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={pt.analysis.continueCta}
          onPress={handleContinue}
          disabled={!canContinue}
        />
        {disableReason && (
          <Text style={[styles.disableReason, { color: secondaryText }]}>{disableReason}</Text>
        )}
      </View>

      <InfoModal
        visible={isProfileInfoOpen}
        onClose={() => setProfileInfoOpen(false)}
        title={pt.modals.deviceProfile.title}
        content={<Text style={{ color: secondaryText }}>{pt.modals.deviceProfile.body}</Text>}
        actions={
          <Button
            title={pt.modals.deviceProfile.cta}
            onPress={() => {
              setProfileInfoOpen(false);
              router.push('/(tabs)/analysis/calibration');
            }}
          />
        }
      />

      <InfoModal
        visible={isRmseInfoOpen}
        onClose={() => setRmseInfoOpen(false)}
        title={pt.modals.rmse.title}
        content={<Text style={{ color: secondaryText }}>{pt.modals.rmse.body}</Text>}
        actions={
          <View style={styles.modalActions}>
            <Button
              title={pt.modals.rmse.actions[0]}
              variant="outline"
              onPress={() => {
                setRmseInfoOpen(false);
                router.push('/(tabs)/analysis/calibration');
              }}
            />
            <Button
              title={pt.modals.rmse.actions[1]}
              onPress={() => {
                setRmseInfoOpen(false);
                router.push('/(tabs)/analysis/calibration');
              }}
            />
          </View>
        }
      />

      <InfoModal
        visible={isWindowInfoOpen}
        onClose={() => setWindowInfoOpen(false)}
        title={pt.modals.window.title}
        content={<Text style={{ color: secondaryText }}>{pt.modals.window.body}</Text>}
      />

      <InfoModal
        visible={isPseudoInfoOpen}
        onClose={() => setPseudoInfoOpen(false)}
        title={pt.modals.pseudoDoubleBeam.title}
        content={<Text style={{ color: secondaryText }}>{pt.modals.pseudoDoubleBeam.body}</Text>}
      />

      <InfoModal
        visible={isCurveInfoOpen}
        onClose={() => setCurveInfoOpen(false)}
        title={pt.modals.curve.title}
        content={<Text style={{ color: secondaryText }}>{pt.modals.curve.body}</Text>}
        actions={
          <Button
            title={pt.modals.curve.cta}
            onPress={() => {
              setCurveInfoOpen(false);
              router.push('/(tabs)/analysis/curve');
            }}
          />
        }
      />

      <CurvePickerModal
        visible={isCurveModalOpen}
        curves={curves}
        onClose={() => setCurveModalOpen(false)}
        onSelect={handleSelectCurve}
      />
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
  instructions: {
    fontSize: 16,
    marginBottom: 16,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoIcon: {
    fontSize: 16,
  },
  profileBody: {
    marginTop: 12,
    gap: 12,
  },
  profileText: {
    fontSize: 14,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recalibrateButton: {
    flex: 1,
  },
  rmseBadge: {
    paddingVertical: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  recalibrateHint: {
    fontSize: 12,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 24,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  curveGroup: {
    gap: 12,
  },
  curveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  curveInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  curveField: {
    flex: 1,
    gap: 8,
  },
  curvePickerButton: {
    alignSelf: 'flex-start',
  },
  errorText: {
    fontSize: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfoIcon: {
    marginRight: 12,
  },
  footer: {
    marginTop: 16,
    gap: 8,
  },
  disableReason: {
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyStateText: {
    textAlign: 'center',
    paddingVertical: 16,
  },
  curveRow: {
    paddingVertical: 12,
  },
  curveRowText: {
    gap: 4,
  },
  curveName: {
    fontSize: 16,
    fontWeight: '600',
  },
  curveMetadata: {
    fontSize: 13,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    width: '45%',
  },
  modalActions: {
    gap: 12,
  },
});
