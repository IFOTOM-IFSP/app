import FilterTabs from "@/components/common/FilterTabs";
import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { ConverterCard } from "@/components/specific/converter/ConverterCard";
import { UnitInput } from "@/components/specific/converter/UnitInput";
import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import {
  calculateAbsorbance,
  calculateConcentration,
  calculateTransmittance,
} from "@/utils/formulas/absorbance";
import {
  convertMassToMolConc,
  convertMolToMassConc,
} from "@/utils/formulas/concentration";
import { convertNmToUm, convertUmToNm } from "@/utils/formulas/length";
import {
  convertWavelengthToWavenumber,
  convertWavenumberToWavelength,
} from "@/utils/formulas/wavelength";

import React, { useReducer, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const initialState = {
  absorbance: "",
  transmittance: "",
  beerAbsorbance: "",
  molarAbsorptivity: "",
  pathLength: "1",
  concentrationResult: "",
  molarMass: "",
  concMolL: "",
  concMgMl: "",
  wavelengthNm: "",
  wavenumber: "",
  nanometers: "",
  micrometers: "",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, [action.field]: action.payload };
    case "CALCULATE": {
      const { field, value } = action;
      let newState = { ...state, [field]: value };
      const numericValue = parseFloat(value.replace(",", "."));

      if (field === "absorbance") {
        const T = calculateAbsorbance(numericValue);
        newState.transmittance = T ? T.toPrecision(4) : "";
      } else if (field === "transmittance") {
        const A = calculateTransmittance(numericValue);
        newState.absorbance = A ? A.toPrecision(4) : "";
      } else if (field === "nanometers") {
        const um = convertNmToUm(numericValue);
        newState.micrometers = um !== null ? um.toString() : "";
      } else if (field === "micrometers") {
        const nm = convertUmToNm(numericValue);
        newState.nanometers = nm !== null ? nm.toString() : "";
      } else if (field === "wavelengthNm") {
        const wn = convertWavelengthToWavenumber(numericValue);
        newState.wavenumber = wn ? wn.toPrecision(5) : "";
      } else if (field === "wavenumber") {
        const wl = convertWavenumberToWavelength(numericValue);
        newState.wavelengthNm = wl ? wl.toPrecision(5) : "";
      } else if (field === "concMolL") {
        const massConc = convertMolToMassConc(
          numericValue,
          parseFloat(state.molarMass)
        );
        newState.concMgMl = massConc ? massConc.toPrecision(4) : "";
      } else if (field === "concMgMl") {
        const molConc = convertMassToMolConc(
          numericValue,
          parseFloat(state.molarMass)
        );
        newState.concMolL = molConc ? molConc.toPrecision(4) : "";
      } else if (field === "molarMass") {
        const molConc = parseFloat(state.concMolL);
        const massConc = convertMolToMassConc(molConc, numericValue);
        newState.concMgMl = massConc ? massConc.toPrecision(4) : "";
      }
      return newState;
    }
    default:
      return state;
  }
}

const converters = [
  { key: "all", label: "Todas" },
  { key: "abs", label: "Abs ↔ %T" },
  { key: "beer", label: "Lei de Beer" },
  { key: "conc", label: "mol/L ↔ mg/mL" },
  { key: "wave", label: "λ ↔ ν̃" },
  { key: "len", label: "nm ↔ µm" },
];

export default function ConverterScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeConverter, setActiveConverter] = useState("all");

  const tintColor = useThemeValue("tint");
  const borderColor = useThemeValue("border");
  const buttonText = useThemeValue("buttonText");

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: "CALCULATE", field, value });
  };

  const calculateFromBeer = () => {
    Keyboard.dismiss();
    const A = parseFloat(state.beerAbsorbance);
    const epsilon = parseFloat(state.molarAbsorptivity);
    const l = parseFloat(state.pathLength);

    if (isNaN(A) || isNaN(epsilon) || isNaN(l)) {
      Alert.alert(
        "Campos incompletos",
        "Preencha todos os campos para calcular."
      );
      return;
    }

    const result = calculateConcentration({ A, epsilon, l });

    dispatch({
      type: "SET_VALUE",
      field: "concentrationResult",
      payload: result !== null ? result.toExponential(4) : "Erro",
    });
  };

  const renderContent = () => (
    <>
      {(activeConverter === "all" || activeConverter === "abs") && (
        <ConverterCard title="Absorbância ↔ Transmitância">
          <UnitInput
            label="Absorbância"
            unit="A"
            value={state.absorbance}
            onChangeText={(v) => handleInputChange("absorbance", v)}
            placeholder="Ex: 0.301"
          />
          <UnitInput
            label="Transmitância"
            unit="%T"
            value={state.transmittance}
            onChangeText={(v) => handleInputChange("transmittance", v)}
            placeholder="Ex: 50.0"
          />
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "beer") && (
        <ConverterCard title="Absorbância → Concentração (Beer-Lambert)">
          <ThemedText style={styles.formulaText}>c = A / (ε · l)</ThemedText>
          <UnitInput
            label="Absorbância (A)"
            unit="A"
            value={state.beerAbsorbance}
            onChangeText={(v) =>
              dispatch({
                type: "SET_VALUE",
                field: "beerAbsorbance",
                payload: v,
              })
            }
            placeholder="Valor medido"
          />
          <UnitInput
            label="Absortividade Molar (ε)"
            unit="L·mol⁻¹·cm⁻¹"
            value={state.molarAbsorptivity}
            onChangeText={(v) =>
              dispatch({
                type: "SET_VALUE",
                field: "molarAbsorptivity",
                payload: v,
              })
            }
            placeholder="Constante da substância"
          />
          <UnitInput
            label="Caminho Óptico (l)"
            unit="cm"
            value={state.pathLength}
            onChangeText={(v) =>
              dispatch({ type: "SET_VALUE", field: "pathLength", payload: v })
            }
            placeholder="Normalmente 1"
          />
          <Button
            title="Calcular Concentração"
            onPress={calculateFromBeer}
            style={{ marginTop: Margin.sm }}
          />
          {state.concentrationResult ? (
            <View
              style={[styles.resultContainer, { backgroundColor: tintColor }]}>
              <ThemedText style={[styles.resultLabel, { color: buttonText }]}>
                Concentração (c):
              </ThemedText>
              <ThemedText style={[styles.resultValue, { color: buttonText }]}>
                {state.concentrationResult} mol/L
              </ThemedText>
            </View>
          ) : null}
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "conc") && (
        <ConverterCard title="Concentração (massa ↔ molar)">
          <UnitInput
            label="Massa Molar (MM)"
            unit="g/mol"
            value={state.molarMass}
            onChangeText={(v) => handleInputChange("molarMass", v)}
            placeholder="Ex: 58.44 para NaCl"
          />
          <View style={[styles.separator, { backgroundColor: borderColor }]} />
          <UnitInput
            label="Concentração Molar"
            unit="mol/L"
            value={state.concMolL}
            onChangeText={(v) => handleInputChange("concMolL", v)}
            placeholder="Digite para converter"
          />
          <UnitInput
            label="Concentração de Massa"
            unit="mg/mL"
            value={state.concMgMl}
            onChangeText={(v) => handleInputChange("concMgMl", v)}
            placeholder="ou digite aqui"
          />
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "wave") && (
        <ConverterCard title="Onda (λ ↔ ν̃)">
          <UnitInput
            label="Comprimento de Onda (λ)"
            unit="nm"
            value={state.wavelengthNm}
            onChangeText={(v) => handleInputChange("wavelengthNm", v)}
          />
          <UnitInput
            label="Número de Onda (ν̃)"
            unit="cm⁻¹"
            value={state.wavenumber}
            onChangeText={(v) => handleInputChange("wavenumber", v)}
          />
        </ConverterCard>
      )}

      {(activeConverter === "all" || activeConverter === "len") && (
        <ConverterCard title="Unidades de Comprimento">
          <UnitInput
            label="Nanômetros"
            unit="nm"
            value={state.nanometers}
            onChangeText={(v) => handleInputChange("nanometers", v)}
          />
          <UnitInput
            label="Micrômetros"
            unit="µm"
            value={state.micrometers}
            onChangeText={(v) => handleInputChange("micrometers", v)}
          />
        </ConverterCard>
      )}
    </>
  );

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TitleSection
          title="Conversor de Unidades"
          subtitle="Converta unidades de química e física facilmente"
        />
        <FilterTabs<(typeof converters)[0]>
          data={converters}
          selectedValue={activeConverter}
          onSelect={setActiveConverter}
          getValue={(converter) => converter.key}
          getLabel={(converter) => converter.label}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.content}>{renderContent()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: { paddingBottom: Padding.xxl },

  filterScrollView: {
    paddingVertical: Padding.sm,
    marginBottom: Margin.sm,
  },
  filterButton: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Margin.sm,
  },
  filterButtonText: {
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.sm,
  },
  content: {},
  formulaText: {
    fontFamily: "monospace",
    padding: Padding.md,
    borderRadius: BorderRadius.md,
    marginBottom: Margin.lg,
    textAlign: "center",
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
  },
  resultContainer: {
    marginTop: Margin.lg,
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },
  resultValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginTop: Margin.xs,
  },
  separator: {
    height: 1,
    marginVertical: Margin.md,
  },
});
