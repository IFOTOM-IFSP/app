import { pt } from '@/src/i18n/pt';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { Button } from '@/src/components/ui/Button';
import { ThemedText } from '@/src/components/ui/ThemedText';
import { useThemeValue } from '@/hooks/useThemeValue';
import { useDeviceProfile } from '@/store/deviceProfile';
import { useCurveStore } from '@/store/curveStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const guidedActions = [
  {
    label: 'Medir agora',
    description: 'Fluxo completo com ajuda passo a passo.',
    route: '/(tabs)/analysis/create/index',
  },
  {
    label: 'Calibrar equipamento',
    description: 'Ajuste pixel→λ antes de medir.',
    route: '/(tabs)/analysis/calibration',
  },
  {
    label: 'Criar curva',
    description: 'Construa a curva de calibração.',
    route: '/(tabs)/analysis/curve',
  },
];

const proShortcuts = [
  {
    label: 'Analisar (quantitativa)',
    description: 'Abrir formulário direto.',
    route: '/(tabs)/analysis/create/index',
  },
  {
    label: 'Calibração rápida',
    description: 'Ir direto para os lasers.',
    route: '/(tabs)/analysis/calibration',
  },
  {
    label: 'Minhas curvas',
    description: 'Gerenciar curvas salvas.',
    route: '/(tabs)/analysis/curve',
  },
];

export default function AnalysisDashboardScreen() {
  const router = useRouter();
  const cardBackground = useThemeValue('card');
  const secondaryText = useThemeValue('textSecondary');
  const { profile, load } = useDeviceProfile();
  const loadCurves = useCurveStore((state) => state.loadCurves);
  const curves = useCurveStore((state) => state.curves);

  useEffect(() => {
    load().catch(() => undefined);
    loadCurves().catch(() => undefined);
  }, [load, loadCurves]);

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Modo guiado (recomendado)</ThemedText>
          <Text style={[styles.sectionDescription, { color: secondaryText }]}>O que você quer fazer?</Text>
          <View style={styles.cardGrid}>
            {guidedActions.map((action) => (
              <View key={action.label} style={[styles.card, { backgroundColor: cardBackground }]}>
                <ThemedText style={styles.cardTitle}>{action.label}</ThemedText>
                <Text style={[styles.cardSubtitle, { color: secondaryText }]}>{action.description}</Text>
                <Button title="Começar" onPress={() => router.push(action.route)} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Atalhos profissionais</ThemedText>
          <View style={styles.cardGrid}>
            {proShortcuts.map((shortcut) => (
              <View key={shortcut.label} style={[styles.card, { backgroundColor: cardBackground }]}>
                <ThemedText style={styles.cardTitle}>{shortcut.label}</ThemedText>
                <Text style={[styles.cardSubtitle, { color: secondaryText }]}>{shortcut.description}</Text>
                <Button title="Abrir" variant="outline" onPress={() => router.push(shortcut.route)} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Centro de preparação</ThemedText>
          <View style={styles.infoCardContainer}>
            <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
              <ThemedText style={styles.cardTitle}>Calibre o equipamento</ThemedText>
              <Text style={[styles.cardSubtitle, { color: secondaryText }]}>
                {profile
                  ? pt.analysis.profileActiveLabel(
                      profile.device_hash,
                      (profile.pixel_to_wavelength.rmse_nm ?? 0).toFixed(2)
                    )
                  : pt.analysis.noProfileWarning}
              </Text>
              <Button
                title={pt.analysis.calibrateNow}
                onPress={() => router.push('/(tabs)/analysis/calibration')}
              />
            </View>
            <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
              <ThemedText style={styles.cardTitle}>Curvas salvas</ThemedText>
              <Text style={[styles.cardSubtitle, { color: secondaryText }]}>
                {curves.length} curvas disponíveis.
              </Text>
              <Button title={pt.curve.saveButton} variant="outline" onPress={() => router.push('/(tabs)/analysis/curve')} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 48,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: 14,
  },
  cardGrid: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoCardContainer: {
    gap: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
});
