// src/features/analysis/AnalysisMachineProvider.tsx
import { quantMachine } from "@/src/machines/quantMachine";
import { useMachine } from "@xstate/react";
import { createContext, useContext } from "react";

type AnalysisCtx = {
  state: ReturnType<typeof useMachine<typeof quantMachine>>[0];
  send: ReturnType<typeof useMachine<typeof quantMachine>>[1];
  actor: ReturnType<typeof useMachine<typeof quantMachine>>[2];
};

const Ctx = createContext<AnalysisCtx | null>(null);

export function AnalysisMachineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ❗️Somente cria a máquina e fornece o contexto — NADA de effects aqui.
  const [state, send, actor] = useMachine(quantMachine);
  return <Ctx.Provider value={{ state, send, actor }}>{children}</Ctx.Provider>;
}

export function useAnalysisMachine() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AnalysisMachineProvider ausente");
  return v;
}
