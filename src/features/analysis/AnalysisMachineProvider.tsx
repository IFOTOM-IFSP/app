import { quantMachine } from "@/src/machines/quantMachine";
import { useActorRef, useSelector } from "@xstate/react";
import { createContext, useContext, useEffect, useRef } from "react";
import type { ActorRefFrom, SnapshotFrom } from "xstate";

type AnalysisCtx = {
  actor: ActorRefFrom<typeof quantMachine>;
  state: SnapshotFrom<typeof quantMachine>;
  send: ActorRefFrom<typeof quantMachine>["send"];
};

const Ctx = createContext<AnalysisCtx | null>(null);

export function AnalysisMachineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = useActorRef(quantMachine);

  const state = useSelector(actor, (s) => s);

  const { send } = actor;

  const didResetRef = useRef(false);
  useEffect(() => {
    if (state.matches("PARAMS") && state.context.analysisType !== "quant") {
      if (!didResetRef.current) {
        didResetRef.current = true;
        actor.send({ type: "RESET" });
      }
    } else {
      didResetRef.current = false;
    }
  }, [actor, state]);

  return <Ctx.Provider value={{ actor, state, send }}>{children}</Ctx.Provider>;
}

export function useAnalysisMachine() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AnalysisMachineProvider ausente");
  return v;
}
