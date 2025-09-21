// app/analysis/AnalysisMachineProvider.tsx
import { quantMachine } from "@/src/lib/quantMachine";
import { useMachine } from "@xstate/react";
import React, { createContext, useContext } from "react";

type Ctx = ReturnType<typeof useMachine<typeof quantMachine>>;
const AnalysisCtx = createContext<Ctx | null>(null);

export const AnalysisMachineProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const service = useMachine(quantMachine);
  return (
    <AnalysisCtx.Provider value={service}>{children}</AnalysisCtx.Provider>
  );
};

export function useAnalysisMachine() {
  const ctx = useContext(AnalysisCtx);
  if (!ctx)
    throw new Error(
      "useAnalysisMachine must be used inside AnalysisMachineProvider"
    );
  const [state, send, service] = ctx;
  return { state, send, service };
}
