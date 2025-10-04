// src/features/analysis/AnalysisMachineProvider.tsx
import { quantMachine } from "@/src/machines/quantMachine";
import { useActor, useInterpret } from "@xstate/react";
import { createContext, useContext, useMemo } from "react";
import type { ActorRefFrom, StateFrom } from "xstate";

type AnalysisActor = ActorRefFrom<typeof quantMachine>;

type AnalysisCtx = {
  state: StateFrom<typeof quantMachine>;
  send: AnalysisActor["send"];
  actor: AnalysisActor;
};

const Ctx = createContext<AnalysisCtx | null>(null);

export function AnalysisMachineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = useInterpret(quantMachine);
  const [state, send] = useActor(actor);

  const value = useMemo(() => ({ state, send, actor }), [state, send, actor]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAnalysisMachine() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AnalysisMachineProvider ausente");
  return v;
}
