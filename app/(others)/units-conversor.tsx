import { Colors } from "@/constants/Colors";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const converters = [
  { key: "all", label: "Todas" },
  { key: "abs", label: "Abs ↔ %T" },
  { key: "beer", label: "Lei de Beer" },
  { key: "conc", label: "mol/L ↔ mg/mL" },
  { key: "wave", label: "λ ↔ ν̃" },
  { key: "len", label: "nm ↔ µm" },
];

const ConverterCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const UnitInput = ({
  label,
  unit,
  value,
  onChangeText,
  placeholder,
  keyboardType = "numeric",
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.light.textSecondary}
      />
      <Text style={styles.inputUnit}>{unit}</Text>
    </View>
  </View>
);

export default function App() {
  const [activeConverter, setActiveConverter] = useState<string>("all");

  const [absorbance, setAbsorbance] = useState("");
  const [transmittance, setTransmittance] = useState("");
  const [nanometers, setNanometers] = useState("");
  const [micrometers, setMicrometers] = useState("");
  const [wavelengthNm, setWavelengthNm] = useState("");
  const [wavenumber, setWavenumber] = useState("");
  const [molarMass, setMolarMass] = useState("");
  const [concMolL, setConcMolL] = useState("");
  const [concMgMl, setConcMgMl] = useState("");
  const [beerAbsorbance, setBeerAbsorbance] = useState("");
  const [molarAbsorptivity, setMolarAbsorptivity] = useState("");
  const [pathLength, setPathLength] = useState("1");
  const [concentrationResult, setConcentrationResult] = useState("");

  const handleAbsorbanceChange = useCallback((value: string) => {
    setAbsorbance(value);
    const A = parseFloat(value);
    if (!isNaN(A)) {
      const T = 100 * Math.pow(10, -A);
      setTransmittance(T.toPrecision(4));
    } else {
      setTransmittance("");
    }
  }, []);

  const handleTransmittanceChange = useCallback((value: string) => {
    setTransmittance(value);
    const T = parseFloat(value);
    if (!isNaN(T) && T > 0) {
      const A = 2 - Math.log10(T);
      setAbsorbance(A.toPrecision(4));
    } else {
      setAbsorbance("");
    }
  }, []);

  const handleNmToUmChange = useCallback((value: string) => {
    setNanometers(value);
    const nm = parseFloat(value);
    if (!isNaN(nm)) {
      setMicrometers((nm / 1000).toString());
    } else {
      setMicrometers("");
    }
  }, []);

  const handleUmToNmChange = useCallback((value: string) => {
    setMicrometers(value);
    const um = parseFloat(value);
    if (!isNaN(um)) {
      setNanometers((um * 1000).toString());
    } else {
      setNanometers("");
    }
  }, []);

  const handleWavelengthToWavenumber = useCallback((value: string) => {
    setWavelengthNm(value);
    const lambda_nm = parseFloat(value);
    if (!isNaN(lambda_nm) && lambda_nm !== 0) {
      const wavenumberVal = 1 / (lambda_nm * 1e-7); // cm-1
      setWavenumber(wavenumberVal.toPrecision(5));
    } else {
      setWavenumber("");
    }
  }, []);

  const handleWavenumberToWavelength = useCallback((value: string) => {
    setWavenumber(value);
    const wavenumberVal = parseFloat(value);
    if (!isNaN(wavenumberVal) && wavenumberVal !== 0) {
      const lambda_nm = 1e7 / wavenumberVal; // nm
      setWavelengthNm(lambda_nm.toPrecision(5));
    } else {
      setWavelengthNm("");
    }
  }, []);

  const updateConcentration = (molValue: string, mmValue: string) => {
    const C_mol = parseFloat(molValue);
    const MM = parseFloat(mmValue);
    if (!isNaN(C_mol) && !isNaN(MM) && MM > 0) {
      const C_mg = C_mol * MM;
      setConcMgMl(C_mg.toPrecision(4));
    } else {
      setConcMgMl("");
    }
  };

  const handleConcMolToMg = useCallback(
    (value: string) => {
      setConcMolL(value);
      updateConcentration(value, molarMass);
    },
    [molarMass]
  );

  const handleConcMgToMol = useCallback(
    (value: string) => {
      setConcMgMl(value);
      const C_mg = parseFloat(value);
      const MM = parseFloat(molarMass);
      if (!isNaN(C_mg) && !isNaN(MM) && MM > 0) {
        const C_mol = C_mg / MM;
        setConcMolL(C_mol.toPrecision(4));
      } else {
        setConcMolL("");
      }
    },
    [molarMass]
  );

  const handleMolarMassChange = useCallback(
    (value: string) => {
      setMolarMass(value);
      updateConcentration(concMolL, value);
    },
    [concMolL]
  );

  const calculateConcentrationFromBeer = () => {
    Keyboard.dismiss();
    const A = parseFloat(beerAbsorbance);
    const epsilon = parseFloat(molarAbsorptivity);
    const l = parseFloat(pathLength);

    if (isNaN(A) || isNaN(epsilon) || isNaN(l)) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, preencha todos os campos: Absorbância (A), Absortividade Molar (ε) e Caminho Óptico (l)."
      );
      return;
    }
    if (epsilon <= 0 || l <= 0) {
      Alert.alert(
        "Valores Inválidos",
        "Absortividade Molar (ε) e Caminho Óptico (l) devem ser maiores que zero."
      );
      return;
    }

    const c = A / (epsilon * l);
    setConcentrationResult(c.toExponential(4));
  };

  const renderContent = () => (
    <>
      {(activeConverter === "all" || activeConverter === "abs") && (
        <ConverterCard title="Absorbância ↔ Transmitância">
          <UnitInput
            label="Absorbância"
            unit="A"
            value={absorbance}
            onChangeText={handleAbsorbanceChange}
            placeholder="Ex: 0.301"
          />
          <UnitInput
            label="Transmitância"
            unit="%T"
            value={transmittance}
            onChangeText={handleTransmittanceChange}
            placeholder="Ex: 50.0"
          />
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "beer") && (
        <ConverterCard title="Absorbância → Concentração (Beer-Lambert)">
          <Text style={styles.formulaText}>c = A / (ε · l)</Text>

          <UnitInput
            label="Absorbância"
            unit="A"
            value={beerAbsorbance}
            onChangeText={setBeerAbsorbance}
            placeholder="Valor medido"
          />

          <UnitInput
            label="Absortividade Molar"
            unit="L·mol⁻¹·cm⁻¹"
            value={molarAbsorptivity}
            onChangeText={setMolarAbsorptivity}
            placeholder="Constante da substância"
          />

          <UnitInput
            label="Caminho Óptico"
            unit="cm"
            value={pathLength}
            onChangeText={setPathLength}
            placeholder="Normalmente 1 cm"
          />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={calculateConcentrationFromBeer}>
            <Text style={styles.activeFilterButtonText}>
              Calcular Concentração
            </Text>
          </TouchableOpacity>

          {concentrationResult ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>
                Concentração (c) Calculada:
              </Text>

              <Text style={styles.resultValue}>
                {concentrationResult} mol/L
              </Text>
            </View>
          ) : null}
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "conc") && (
        <ConverterCard title="Concentração (massa ↔ molar)">
          <UnitInput
            label="Massa Molar (MM)"
            unit="g/mol"
            value={molarMass}
            onChangeText={handleMolarMassChange}
            placeholder="Ex: 58.44 para NaCl"
          />
          <View style={styles.separator} />
          <UnitInput
            label="Concentração Molar"
            unit="mol/L"
            value={concMolL}
            onChangeText={handleConcMolToMg}
            placeholder="Digite um valor para converter"
          />
          <UnitInput
            label="Concentração de Massa"
            unit="mg/mL"
            value={concMgMl}
            onChangeText={handleConcMgToMol}
            placeholder="ou digite um valor aqui"
          />
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "wave") && (
        <ConverterCard title="Onda (λ ↔ ν̃)">
          <UnitInput
            label="Comprimento de Onda (λ)"
            unit="nm"
            value={wavelengthNm}
            onChangeText={handleWavelengthToWavenumber}
            placeholder="Ex: 500"
          />
          <UnitInput
            label="Número de Onda (ν̃)"
            unit="cm⁻¹"
            value={wavenumber}
            onChangeText={handleWavenumberToWavelength}
            placeholder="Ex: 20000"
          />
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "len") && (
        <ConverterCard title="Unidades de Comprimento">
          <UnitInput
            label="Nanômetros"
            unit="nm"
            value={nanometers}
            onChangeText={handleNmToUmChange}
            placeholder="Ex: 1500"
          />
          <UnitInput
            label="Micrômetros"
            unit="µm"
            value={micrometers}
            onChangeText={handleUmToNmChange}
            placeholder="Ex: 1.5"
          />
        </ConverterCard>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Conversor Espectro</Text>
            <Text style={styles.slogan}>
              Ferramentas de conversão para espectrofotometria.
            </Text>
          </View>

          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollView}>
              {converters.map((converter) => (
                <TouchableOpacity
                  key={converter.key}
                  style={[
                    styles.filterButton,
                    activeConverter === converter.key &&
                      styles.activeFilterButton,
                  ]}
                  onPress={() => setActiveConverter(converter.key)}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      activeConverter === converter.key &&
                        styles.activeFilterButtonText,
                    ]}>
                    {converter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Container principal para os cards */}
          <View style={styles.content}>{renderContent()}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// --- ESTILOS REFINADOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.tint,
    textAlign: "left",
    marginTop: 12,
  },
  slogan: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "left",
    marginTop: 8,
  },
  filterScrollView: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    // borderColor: Colors.light.border,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: Colors.light.accentPurple,
    borderColor: Colors.light.borderColor,
  },
  filterButtonText: {
    color: Colors.light.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: Colors.light.textWhite,
  },
  content: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.accentPurple,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.textPrimary,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
    paddingBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    borderRadius: 12,
  },
  inputField: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  inputUnit: {
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500",
  },
  formulaText: {
    fontFamily: "monospace",
    backgroundColor: Colors.light.cardBackground,
    color: Colors.light.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  actionButtonText: {
    color: Colors.light.accentPurple,
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: Colors.light.accentPurple,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resultLabel: {
    color: Colors.light.textWhite,
    fontSize: 14,
    fontWeight: "600",
  },
  resultValue: {
    color: Colors.light.textWhite,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.textWhite,
    marginVertical: 15,
  },
});
