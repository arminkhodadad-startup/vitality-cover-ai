import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  DEFAULT_INPUTS,
  derive,
  type MemberType,
  type SimInputs,
} from "@/lib/engine";
import type { PageId } from "@/lib/nav";

type SimStore = SimInputs & {
  page: PageId;
  tabs: Partial<Record<PageId, string>>;
  simulatorOpen: boolean;
  setPage: (page: PageId) => void;
  setTab: (page: PageId, tab: string) => void;
  setNumber: (
    key: "sleep" | "steps" | "recovery" | "nutrition" | "stress",
    value: number,
  ) => void;
  setMemberType: (memberType: MemberType) => void;
  setSimulatorOpen: (open: boolean) => void;
  reset: () => void;
};

export const useSim = create<SimStore>()((set) => ({
  ...DEFAULT_INPUTS,
  page: "dashboard",
  tabs: {},
  simulatorOpen: false,
  setPage: (page) => set({ page }),
  setTab: (page, tab) => set((s) => ({ tabs: { ...s.tabs, [page]: tab } })),
  setNumber: (key, value) => set({ [key]: value }),
  setMemberType: (memberType) => set({ memberType }),
  setSimulatorOpen: (simulatorOpen) => set({ simulatorOpen }),
  reset: () => set({ ...DEFAULT_INPUTS }),
}));

export function useInputs(): SimInputs {
  return useSim(
    useShallow((s) => ({
      sleep: s.sleep,
      steps: s.steps,
      recovery: s.recovery,
      nutrition: s.nutrition,
      stress: s.stress,
      memberType: s.memberType,
      baselineVitality: s.baselineVitality,
      basePremium: s.basePremium,
    })),
  );
}

export function useDerived() {
  const inputs = useInputs();
  return derive(inputs);
}
