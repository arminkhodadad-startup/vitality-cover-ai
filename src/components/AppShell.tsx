import { useEffect } from "react";
import { BrandMark } from "@/components/BrandMark";
import {
  CarePage,
  CoachPage,
  CoveragePage,
  DashboardPage,
  HealthPage,
  MemberPage,
  RiskPage,
  RewardsPage,
} from "@/components/pages/InnerPages";
import { Simulator } from "@/components/Simulator";
import { NAV_ITEMS, PAGE_META, type PageId } from "@/lib/nav";
import { useDerived, useInputs, useSim } from "@/lib/store";
import { cn } from "@/lib/utils";

const DEFAULT_TAB: Record<PageId, string> = {
  dashboard: "overview",
  member: "profile",
  health: "sleep",
  risk: "burnout",
  coverage: "plans",
  rewards: "premium",
  care: "providers",
  coach: "daily",
};

export function AppShell() {
  const page = useSim((s) => s.page);
  const setPage = useSim((s) => s.setPage);
  const tabs = useSim((s) => s.tabs);
  const setTab = useSim((s) => s.setTab);
  const setSimulatorOpen = useSim((s) => s.setSimulatorOpen);
  const s = useInputs();
  const d = useDerived();
  const tab = tabs[page] ?? DEFAULT_TAB[page];
  const meta = PAGE_META[page];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, tab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSimulatorOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSimulatorOpen]);

  const onTab = (id: string) => setTab(page, id);

  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="Primary navigation">
        <div className="brand-mark" title="Vitality Cover AI">
          <BrandMark size={28} />
        </div>
        <div className="nav-stack">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={cn("nav-btn", page === item.id && "is-active")}
                title={item.label}
                onClick={() => setPage(item.id)}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
        <div className="side-footer">
          <div className="status-dot" />
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI Wellness Risk + Rewards + Insurance Intelligence</p>
            <h1>{meta.title}</h1>
          </div>
          <div className="topbar-actions">
            <div className="live-badge">
              <i /> Live simulation
            </div>
            <button className="ghost-btn" type="button" onClick={() => setSimulatorOpen(true)}>
              Tune Inputs
            </button>
            <div className="avatar" title="Demo member">
              AK
            </div>
          </div>
        </header>

        <div className="prototype-strip">
          <strong>PROTOTYPE:</strong> Simulated wellness data and projected premium estimates. Not an
          insurance quote, medical diagnosis, or regulated underwriting decision.
        </div>

        <div className="page-enter" key={`${page}:${tab}`}>
          {page === "dashboard" && (
            <DashboardPage s={s} d={d} tab={tab} onTab={onTab} onOpen={setPage} />
          )}
          {page === "member" && <MemberPage s={s} d={d} tab={tab} onTab={onTab} />}
          {page === "health" && <HealthPage s={s} d={d} tab={tab} onTab={onTab} />}
          {page === "risk" && <RiskPage s={s} d={d} tab={tab} onTab={onTab} />}
          {page === "coverage" && <CoveragePage d={d} tab={tab} onTab={onTab} />}
          {page === "rewards" && <RewardsPage s={s} d={d} tab={tab} onTab={onTab} />}
          {page === "care" && <CarePage s={s} d={d} tab={tab} onTab={onTab} />}
          {page === "coach" && <CoachPage s={s} d={d} tab={tab} onTab={onTab} />}
        </div>

        <footer className="app-footer">
          <span>Vitality Cover AI MVP v1.2</span>
          <span>Better behavior. Lower risk. Smarter coverage.</span>
          <span>Simulated Data · Projected Premium · Wellness Risk Indicator</span>
        </footer>
      </main>

      <nav className="bottom-nav" aria-label="Bottom navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={cn("bottom-btn", page === item.id && "is-active")}
              onClick={() => setPage(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Simulator />
    </div>
  );
}
