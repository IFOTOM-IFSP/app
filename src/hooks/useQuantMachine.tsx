import { quantMachine } from "@/src/lib/quantMachine";
import { useMachine } from "@xstate/react";

export function useQuantFlow() {
  const [state, send] = useMachine(quantMachine);
  return { state, send };
}
