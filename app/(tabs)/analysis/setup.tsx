// import { useLocalSearchParams, useRouter } from "expo-router";
// import React from "react";

import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import React from "react";

// import { AnalysisSetup, AnalysisType } from "@/schemas/analysisSchemas";
// import { useAnalysisActions } from "@/store/analysisStore";

// import TitleSection from "@/components/common/TitleSection";
// import { ScreenLayout } from "@/components/layouts/ScreenLayout";
// import { ThemedText } from "@/components/ui/ThemedText";

// import { KineticSetupForm } from "@/components/analysis/forms/KineticSetupForm";
// import { QuantitativeSetupForm } from "@/components/analysis/forms/QuantitativeSetupForm";
// import { ScanSetupForm } from "@/components/analysis/forms/ScanSetupForm";
// import { SimpleReadSetupForm } from "@/components/analysis/forms/SimpleReadSetupForm";

// export default function AnalysisSetupScreen() {
//   // 1. Hooks para navegação, estado global e parâmetros da URL
//   const router = useRouter();
//   const { startAnalysis } = useAnalysisActions();
//   const { type } = useLocalSearchParams<{ type: AnalysisType }>();

//   // Mapeamento para exibir o título correto na tela
//   const screenTitle = {
//     quantitative: "Configurar Análise Quantitativa",
//     scan: "Configurar Varredura Espectral",
//     kinetic: "Configurar Análise Cinética",
//     simple_read: "Configurar Leitura Simples",
//   }[type || "quantitative"];

//   const handleStart = (setupData: AnalysisSetup) => {
//     console.log("Iniciando análise com a configuração final:", setupData);
//     startAnalysis(setupData);
//     router.push("/analysis/capture-references");
//   };

//   const renderForm = () => {
//     switch (type) {
//       case "quantitative":
//         return <QuantitativeSetupForm onSubmit={handleStart} />;
//       case "scan":
//         return <ScanSetupForm onSubmit={handleStart} />;
//       case "kinetic":
//         return <KineticSetupForm onSubmit={handleStart} />;
//       case "simple_read":
//         return <SimpleReadSetupForm onSubmit={handleStart} />;
//       default:
//         return (
//           <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
//             Tipo de análise inválido ou não selecionado.
//           </ThemedText>
//         );
//     }
//   };

//   return (
//     <ScreenLayout>
//       <TitleSection
//         title={screenTitle}
//         subtitle="Preencha os parâmetros para iniciar."
//       />
//       {renderForm()}
//     </ScreenLayout>
//   );
// }

export default function AnalysisSetupScreen() {
  return (
    <ScreenLayout>
      <TitleSection
        title="Configurar Análise"
        subtitle="Selecione o tipo de análise para começar."
      />
      <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
        Selecione o tipo de análise na barra de navegação.
      </ThemedText>
    </ScreenLayout>
  );
}
