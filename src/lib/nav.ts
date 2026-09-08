import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Brain,
  Cpu,
  HeartPulse,
  LayoutDashboard,
  Shield,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";

export type PageId =
  | "dashboard"
  | "member"
  | "health"
  | "risk"
  | "coverage"
  | "rewards"
  | "care"
  | "coach";

export type NavItem = {
  id: PageId;
  label: string;
  kicker: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", kicker: "01 / Command Center", icon: LayoutDashboard },
  { id: "member", label: "Member 360", kicker: "02 / Member Intelligence", icon: UserRound },
  { id: "health", label: "Health", kicker: "03 / Behavior Data", icon: HeartPulse },
  { id: "risk", label: "Risk", kicker: "04 / Predictive Layer", icon: Activity },
  { id: "coverage", label: "Coverage", kicker: "05 / Coverage Intelligence", icon: Shield },
  { id: "rewards", label: "Rewards", kicker: "06 / Behavior Rewards", icon: Sparkles },
  { id: "care", label: "Care", kicker: "07 / Care Orchestration", icon: Stethoscope },
  { id: "coach", label: "AI Coach", kicker: "08 / Preventive AI", icon: Brain },
];

export const PAGE_META: Record<PageId, { title: string; kicker: string }> = {
  dashboard: { title: "Dashboard", kicker: "01 / Command Center" },
  member: { title: "Member 360", kicker: "02 / Member Intelligence" },
  health: { title: "Health Signals", kicker: "03 / Behavior Data" },
  risk: { title: "Risk Engine", kicker: "04 / Predictive Layer" },
  coverage: { title: "Coverage", kicker: "05 / Coverage Intelligence" },
  rewards: { title: "Rewards", kicker: "06 / Behavior Rewards" },
  care: { title: "Care", kicker: "07 / Care Orchestration" },
  coach: { title: "AI Coach", kicker: "08 / Preventive AI" },
};

export const ENGINE_ICON = Cpu;
