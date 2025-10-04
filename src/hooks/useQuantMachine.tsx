import { useMachine } from "@xstate/react";
import { quantMachine } from "../machines/quantMachine";

export function useQuantFlow() {
  const [state, send] = useMachine(quantMachine);
  return { state, send };
}
