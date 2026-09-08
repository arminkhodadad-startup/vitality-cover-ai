import { useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  Brain,
  HeartPulse,
  Shield,
  Sparkles,
  Stethoscope,
  Utensils,
} from "lucide-react";
import {
  BarChart,
  Donut,
  ForecastBars,
  HBarChart,
  LineChart,
  RadarChart,
  RiskBars,
} from "@/components/charts";
import { CascadeDashboard, weekSeries } from "@/components/dashboard/CascadeDashboard";
import { Panel, SectionHead } from "@/components/ui";
import {
  buildActions,
  buildScenarios,
  buildSummary,
  clamp,
  riskLabel,
  WEEK_LABELS,
  type Derived,
  type SimInputs,
} from "@/lib/engine";
import type { PageId } from "@/lib/nav";
import { fmt, round } from "@/lib/utils";

const COMMITS = [
  "7 hour sleep",
  "8K steps",
  "2 recovery sessions",
  "Hydration target",
  "Healthy meals",
  "Therapy / coaching",
];

export function DashboardPage({
  s,
  d,
  tab,
  onTab,
  onOpen,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
  onOpen: (page: PageId) => void;
}) {
  const base = d.vitality;
  const forecast = Array.from({ length: 8 }, (_, i) =>
    clamp(d.vitality + (100 - d.vitality) * (0.03 * i)),
  );
  return (
    <>
      <SectionHead
        kicker="01 / Command Center"
        title="Dashboard"
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "portfolio", label: "Portfolio" },
          { id: "alerts", label: "Alerts" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "overview" && (
        <>
          <CascadeDashboard s={s} d={d} onOpen={onOpen} />
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
            <Panel
              className="lg:col-span-8"
              kicker="Signal Trajectory"
              title="7-Day Health Signal Trend"
              extra={
                <div className="legend">
                  <span>
                    <i className="cyan" /> Vitality
                  </span>
                  <span>
                    <i className="purple" /> Recovery
                  </span>
                  <span>
                    <i className="pink" /> Stress resilience
                  </span>
                </div>
              }
            >
              <div className="chart-shell">
                <LineChart
                  series={[
                    weekSeries(base, [-5, -2, -4, 1, -1, 2, 0]),
                    weekSeries(s.recovery, [-8, -4, -6, 0, 3, 1, 0]),
                    weekSeries(d.resilience, [-3, 0, -6, -2, 4, 1, 0]),
                  ]}
                  labels={WEEK_LABELS}
                />
              </div>
            </Panel>
            <Panel className="lg:col-span-4" kicker="Score Path" title="8-Week Forecast">
              <ForecastBars values={forecast} />
              <p className="panel-note">
                Pattern-weighted projection. One imperfect week does not rewrite the curve.
              </p>
            </Panel>
          </div>
        </>
      )}
      {tab === "portfolio" && (
        <Panel kicker="B2B2C View" title="Population Portfolio" extra={<span className="mini-label">Demo cohort</span>}>
          <div className="portfolio-table">
            <div className="data-row header">
              <div>Member segment</div>
              <div>Avg vitality</div>
              <div>Avg premium</div>
              <div>Risk trend</div>
              <div>Plan tier</div>
            </div>
            {[
              ["Founders", round(d.vitality), `$${round(d.premium)}`, d.burnout < 45 ? "↓ improving" : "↑ watch", d.tier],
              ["Executives", 82, "$286", "↓ improving", "Silver"],
              ["Freelancers", 74, "$306", "→ stable", "Silver"],
              ["Remote Team Leads", 69, "$318", "↑ watch", "Standard"],
            ].map((r) => (
              <div className="data-row" key={r[0]}>
                <div>
                  <strong>{r[0]}</strong>
                </div>
                <div>{r[1]}</div>
                <div>{r[2]}</div>
                <div className={String(r[3]).startsWith("↓") ? "trend-up" : String(r[3]).startsWith("↑") ? "trend-down" : ""}>
                  {r[3]}
                </div>
                <div>{r[4]}</div>
              </div>
            ))}
          </div>
          <div className="chart-shell short">
            <LineChart
              series={[
                [74, 76, 78, 79, 81, 82],
                [70, 71, 73, 74, 75, 74],
                [64, 66, 67, 70, 69, 69],
              ]}
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
              height={210}
            />
          </div>
        </Panel>
      )}
      {tab === "alerts" && (
        <div className="alert-grid">
          {[
            ["Sleep", "Late sleep pattern detected", "Two nights below target. Support recommended, no pricing penalty.", "WATCH"],
            ["Stress", "Workload pressure rising", `${s.stress}/100 stress load is ${riskLabel(s.stress).toLowerCase()}.`, "LIVE"],
            ["Recovery", "Recovery opportunity", "Protect one low-intensity block in the next 24 hours.", "ACTION"],
            ["Care", "Preventive pathway available", "A coaching pathway can reduce modeled risk before claims pressure increases.", "READY"],
            ["Underwriting", "Stability buffer active", "Pricing uses a 30-day weighted score to avoid short-term punishment.", "SAFEGUARD"],
            ["Nutrition", "Meal rhythm drift", "Calendar-aware timing can reduce late-day crash risk.", "COACH"],
          ].map((a) => (
            <div className="alert-card" key={a[0]}>
              <div className="alert-icon">
                <Bell size={16} />
              </div>
              <div>
                <strong>
                  {a[0]} · {a[1]}
                </strong>
                <small>{a[2]}</small>
              </div>
              <span className="alert-level">{a[3]}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function MemberPage({
  s,
  d,
  tab,
  onTab,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  const [saved, setSaved] = useState(false);
  const [checks, setChecks] = useState([true, true, true, true, false, false]);
  const routines: [string, number][] = [
    ["Sleep routine", d.sleepScore],
    ["Movement routine", d.activityScore],
    ["Recovery routine", s.recovery],
    ["Nutrition routine", s.nutrition],
  ];
  return (
    <>
      <SectionHead
        kicker="02 / Member Intelligence"
        title="Member 360"
        tabs={[
          { id: "profile", label: "Profile" },
          { id: "behavior", label: "Behavior" },
          { id: "engagement", label: "Engagement" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "profile" && (
        <div className="grid-12">
          <article className="panel span-5">
            <div className="member-top">
              <div className="avatar large">AK</div>
              <div>
                <span className="panel-kicker">Demo member</span>
                <h3>Alex Karim</h3>
                <p>{s.memberType}</p>
              </div>
            </div>
            <div className="identity-grid">
              <div>
                <span>Current Tier</span>
                <strong>{d.tier}</strong>
              </div>
              <div>
                <span>Vitality Score</span>
                <strong>{round(d.vitality)}</strong>
              </div>
              <div>
                <span>Burnout Risk</span>
                <strong>{round(d.burnout)}</strong>
              </div>
              <div>
                <span>Projected Premium</span>
                <strong>${round(d.premium)}</strong>
              </div>
            </div>
            <div className="consent-card">
              <Shield size={16} className="text-green" />
              <div>
                <strong>Consent-led profile</strong>
                <small>
                  Demo data. Sensitive health data should use minimization, encryption and explicit permissions.
                </small>
              </div>
            </div>
          </article>
          <Panel className="span-7" kicker="Composite Signal" title="Health Signal Wheel" extra={<span className="mini-label">Live inputs</span>}>
            <RadarChart
              axes={["Sleep", "Activity", "Recovery", "Nutrition", "Stress Res."]}
              values={[d.sleepScore, d.activityScore, s.recovery, s.nutrition, d.resilience]}
            />
          </Panel>
        </div>
      )}
      {tab === "behavior" && (
        <div className="grid-12">
          <Panel className="span-7" kicker="Adherence" title="Healthy Routine Adherence" extra={<span className="mini-label">7-day</span>}>
            <div className="routine-grid">
              {routines.map(([l, v]) => (
                <div className="routine-card" key={l}>
                  <div className="routine-top">
                    <strong>{l}</strong>
                    <span>{round(v)}%</span>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="span-5" kicker="Commitments" title="Weekly Commitment Builder" extra={<span className="ai-chip">Live</span>}>
            <div className="check-list">
              {COMMITS.map((c, i) => (
                <label className="check-item" key={c}>
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() =>
                      setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                  />
                  {c}
                </label>
              ))}
            </div>
            <button
              className="primary-btn full"
              type="button"
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
              }}
            >
              Update weekly plan
            </button>
            <div className={`save-note${saved ? " show" : ""}`}>Plan synced to demo profile.</div>
          </Panel>
        </div>
      )}
      {tab === "engagement" && (
        <div className="grid-12">
          <Panel className="span-6" kicker="Program Funnel" title="Engagement Funnel">
            <div className="funnel">
              {[
                ["Eligible", 100],
                ["Enrolled", 82],
                ["Activated", 71],
                ["Weekly engaged", 64],
                ["Challenge complete", 48],
              ].map(([l, v]) => (
                <div className="funnel-step" key={String(l)} style={{ width: `${50 + Number(v) / 2}%` }}>
                  <span>{l}</span>
                  <strong>{v}%</strong>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="span-6" kicker="Recent Signals" title="Activity Timeline">
            <div className="timeline">
              {[
                ["Today · 14:20", "Recovery score synced from demo input"],
                ["Today · 12:40", "Protein-focused meal plan opened"],
                ["Yesterday · 22:58", "Bedtime routine completed"],
                ["Mon · 17:10", "Walking break challenge +85 points"],
                ["Mon · 09:05", "Stress reset completed"],
              ].map((x) => (
                <div className="timeline-item" key={x[0]}>
                  <strong>{x[0]}</strong>
                  <small>{x[1]}</small>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}

export function HealthPage({
  s,
  d,
  tab,
  onTab,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  return (
    <>
      <SectionHead
        kicker="03 / Behavior Data"
        title="Health Signals"
        tabs={[
          { id: "sleep", label: "Sleep" },
          { id: "activity", label: "Activity" },
          { id: "nutrition", label: "Nutrition" },
          { id: "stress", label: "Stress" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "sleep" && (
        <div className="grid-12">
          <Panel className="span-8" kicker="7-Day Stability" title="Sleep Stability" extra={<strong className="metric-inline">{s.sleep.toFixed(1)}h avg</strong>}>
            <div className="chart-shell">
              <LineChart
                series={[weekSeries(s.sleep, [-0.6, -0.2, -0.4, 0.3, -0.1, 0.4, 0])]}
                labels={WEEK_LABELS}
                max={9}
                min={4}
              />
            </div>
          </Panel>
          <Panel className="span-4" kicker="Sleep Debt" title="Risk Indicator">
            <div className="risk-gauge">
              <div className="gauge-track">
                <i style={{ width: `${d.sleepDebt}%` }} />
              </div>
              <strong>{round(d.sleepDebt)}</strong>
              <span>/100</span>
            </div>
            <div className="tool-stack">
              <button type="button">AI bedtime routine</button>
              <button type="button">Sleep debt alerts</button>
              <button type="button">Late caffeine warning</button>
              <button type="button">Recovery day recommendation</button>
            </div>
          </Panel>
        </div>
      )}
      {tab === "activity" && (
        <div className="grid-12">
          <Panel className="span-8" kicker="Movement Load" title="Activity Load" extra={<strong className="metric-inline">{fmt(s.steps)} steps</strong>}>
            <BarChart
              rows={WEEK_LABELS.map((l, i) => [
                l,
                clamp(s.steps * (0.72 + [0.05, 0.12, 0.18, 0.22, 0.09, 0.31, 0.28][i]!)),
              ])}
              max={16000}
            />
          </Panel>
          <Panel className="span-4" kicker="Activity Risk" title="Movement Profile">
            <div className="score-orb">
              <strong>{round(d.activityScore)}</strong>
              <span>Activity</span>
            </div>
            <div className="tool-stack">
              <button type="button">Step optimizer</button>
              <button type="button">Sedentary alerts</button>
              <button type="button">Walking blocks</button>
              <button type="button">Travel day planner</button>
            </div>
          </Panel>
        </div>
      )}
      {tab === "nutrition" && (
        <div className="grid-12">
          <Panel className="span-7" kicker="Calendar-aware AI" title="Meal Timing Intelligence" extra={<span className="ai-chip">AI Nutritionist</span>}>
            <div className="meal-timeline">
              {[
                ["08:30", "Greek yogurt + oats + fruit", "Before deep work", "STEADY"],
                ["12:40", "Protein bowl + grains + greens", "Between meetings", "FOCUS"],
                ["16:20", "Nuts + fruit + water", "Prevents late crash", "RECOVERY"],
                ["20:00", "Light dinner + vegetables", "Post-work window", "SLEEP"],
              ].map((m) => (
                <div className="meal-row" key={m[0]}>
                  <div className="meal-time">{m[0]}</div>
                  <div>
                    <strong>{m[1]}</strong>
                    <small>{m[2]}</small>
                  </div>
                  <span className="meal-tag">{m[3]}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="span-5" kicker="Nutrition" title="Daily Stability" extra={<strong className="metric-inline">{round(s.nutrition)}/100</strong>}>
            <div className="chart-shell short">
              <LineChart
                series={[weekSeries(s.nutrition, [-10, -6, -2, 3, -1, 2, 0])]}
                labels={WEEK_LABELS}
                width={500}
                height={190}
              />
            </div>
            <div className="tool-stack">
              <button type="button">Meal Timing AI</button>
              <button type="button">Hydration tracker</button>
              <button type="button">Protein tracker</button>
              <button type="button">Healthy menu suggestion</button>
              <button type="button">Late-night crash prevention</button>
            </div>
          </Panel>
        </div>
      )}
      {tab === "stress" && (
        <div className="grid-12">
          <Panel className="span-8" kicker="Workload Signal" title="Stress Load Curve" extra={<strong className="metric-inline">{round(s.stress)}/100</strong>}>
            <div className="chart-shell">
              <LineChart
                series={[
                  [
                    clamp(s.stress - 8),
                    clamp(s.stress - 2),
                    clamp(s.stress + 12),
                    clamp(s.stress + 4),
                    clamp(s.stress + 18),
                    clamp(s.stress + 2),
                    s.stress,
                  ],
                ]}
                labels={WEEK_LABELS}
              />
            </div>
          </Panel>
          <Panel className="span-4" kicker="Intervention" title="Recovery Toolkit">
            <div className="tool-stack">
              <button type="button">Burnout detector</button>
              <button type="button">90-second decompression</button>
              <button type="button">Breathing reset</button>
              <button type="button">Therapy routing</button>
              <button type="button">Workload warning</button>
            </div>
            <div className="principle-note">
              A difficult week triggers support, not punishment. Persistent 30–60 day deterioration triggers review.
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}

export function RiskPage({
  s,
  d,
  tab,
  onTab,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  const scenarios = buildScenarios(s, d);
  const note = (
    <>
      <strong>{riskLabel(d.burnout)} burnout pressure.</strong>
      <br />
      <br />
      {s.stress > 55
        ? "Stress is the dominant signal."
        : d.sleepDebt > 35
          ? "Sleep inconsistency is the primary pressure point."
          : "No single signal is currently dominant."}{" "}
      The engine is designed to intervene before modeled risk becomes expensive. A short-term spike does{" "}
      <strong>not</strong> automatically reduce the pricing tier; persistent 30–60 day deterioration would trigger a
      structured review.
    </>
  );
  return (
    <>
      <SectionHead
        kicker="04 / Predictive Layer"
        title="Risk Engine"
        tabs={[
          { id: "burnout", label: "Burnout" },
          { id: "claims", label: "Claims" },
          { id: "underwriting", label: "Underwriting" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "burnout" && (
        <div className="grid-12">
          <Panel className="span-7" kicker="Risk Components" title="Burnout Pressure" extra={<strong className="risk-number">{round(d.burnout)}/100</strong>}>
            <HBarChart
              rows={[
                ["Stress Pressure", s.stress],
                ["Sleep Erosion", d.sleepDebt],
                ["Recovery Deficit", 100 - s.recovery],
                ["Workload Spillover", d.workload],
              ]}
            />
          </Panel>
          <Panel className="span-5" kicker="AI Note" title="Pattern Interpretation" extra={<span className="ai-chip">AI</span>}>
            <div className="ai-note">{note}</div>
          </Panel>
        </div>
      )}
      {tab === "claims" && (
        <div className="grid-12">
          <Panel className="span-8" kicker="Projected Categories" title="Claims Pressure Mix" extra={<strong className="metric-inline">{round(d.claims)}/100</strong>}>
            <BarChart
              rows={[
                ["Preventive", d.preventiveRisk],
                ["Stress", s.stress * 0.62],
                ["Sleep", d.sleepDebt * 0.72],
                ["Lifestyle", d.lifestyle],
                ["Recovery", d.recoveryRisk * 0.68],
              ]}
            />
          </Panel>
          <Panel className="span-4" kicker="Prevention" title="Intervention Yield">
            <Donut value={d.preventiveYield} className="large" from="var(--color-green)" to="var(--color-cyan)">
              <strong>{round(d.preventiveYield)}</strong>
              <span>%</span>
            </Donut>
            <p className="panel-note">
              Share of modeled risk factors with an available preventive pathway in this prototype.
            </p>
          </Panel>
        </div>
      )}
      {tab === "underwriting" && (
        <Panel kicker="Scenario Lab" title="Projected Coverage Scenarios" extra={<span className="warning-chip">Simulated pricing</span>}>
          <div className="scenario-grid">
            {scenarios.map((sc, i) => (
              <div className={`scenario-card${i === 1 ? " featured" : ""}`} key={sc.name}>
                <div className="scenario-title">
                  <h4>{sc.name}</h4>
                  <span className={i === 1 ? "pill healthy" : "pill"}>{sc.risk}</span>
                </div>
                <div className="scenario-metrics">
                  <div>
                    <span>Vitality</span>
                    <strong>{round(sc.vitality)}</strong>
                  </div>
                  <div>
                    <span>Projected premium</span>
                    <strong>${round(sc.premium)}</strong>
                  </div>
                  <div>
                    <span>Burnout risk</span>
                    <strong>{round(sc.burnout)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="panel-note">
            This is a wellness-risk simulation layer, not licensed underwriting. Short-term stress spikes are smoothed
            before pricing impact.
          </p>
        </Panel>
      )}
    </>
  );
}

export function CoveragePage({
  d,
  tab,
  onTab,
}: {
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  const planOffsets = { Standard: 22, Silver: 8, Gold: -8 } as const;
  const plans = ["Standard", "Silver", "Gold"] as const;
  return (
    <>
      <SectionHead
        kicker="05 / Coverage Intelligence"
        title="Coverage"
        tabs={[
          { id: "plans", label: "Plans" },
          { id: "benefits", label: "Benefits" },
          { id: "compare", label: "Compare" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "plans" && (
        <>
          <div className="plan-grid">
            {plans.map((p) => {
              const price = round(clamp(d.premium + planOffsets[p], 250, 380));
              const feats =
                p === "Standard"
                  ? ["Core wellness dashboard", "Preventive checkups", "Telehealth access", "Basic rewards"]
                  : p === "Silver"
                    ? [
                        "Everything in Standard",
                        "Stress coaching",
                        "Wearable integration",
                        "Nutrition + sleep programs",
                        "Enhanced rewards",
                      ]
                    : [
                        "Everything in Silver",
                        "Priority care routing",
                        "Executive recovery programs",
                        "Advanced AI risk intelligence",
                        "Highest reward ceiling",
                      ];
              return (
                <div className={`plan-card${d.tier === p ? " recommended" : ""}`} key={p}>
                  <span className="panel-kicker">Projected plan</span>
                  <h3>{p.toUpperCase()}</h3>
                  <div className="plan-price">
                    ${price}
                    <small>/ month</small>
                  </div>
                  <ul className="plan-features">
                    {feats.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <Panel className="plan-chart-panel" kicker="Price Model" title="Projected Monthly Premium by Tier" extra={<span className="warning-chip">Demo only</span>}>
            <BarChart
              rows={plans.map((p) => [p, round(clamp(d.premium + planOffsets[p], 250, 380))])}
              max={400}
            />
          </Panel>
        </>
      )}
      {tab === "benefits" && (
        <>
          <div className="benefit-grid">
            {[
              [Stethoscope, "Telehealth", "Remote clinician access and triage."],
              [HeartPulse, "Preventive Checkups", "Scheduled preventive engagement."],
              [Sparkles, "Stress Coaching", "Non-diagnostic stress and workload support."],
              [Shield, "Wearable Integration", "Future consent-based device signals."],
              [Utensils, "Nutrition", "Calendar-aware meal timing guidance."],
              [Calendar, "Sleep Program", "Sleep consistency and debt recovery."],
              [Brain, "Mental Health", "Future routing to licensed support."],
              [Check, "Claims Assistant", "Future support layer with insurer APIs."],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof HeartPulse;
              return (
                <div className="benefit-card" key={String(title)}>
                  <div className="benefit-icon">
                    <I size={16} />
                  </div>
                  <strong>{String(title)}</strong>
                  <small>{String(copy)}</small>
                </div>
              );
            })}
          </div>
          <Panel kicker="Future Integrations" title="Partner Infrastructure">
            <div className="integration-grid">
              {[
                ["Apple Health", "Connect · Future"],
                ["Garmin", "Connect · Future"],
                ["Fitbit", "Connect · Future"],
                ["Oura", "Connect · Future"],
                ["Calendar", "Connect · Future"],
                ["Insurance APIs", "Partner · Future"],
              ].map(([n, s]) => (
                <div key={n}>
                  <strong>{n}</strong>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
      {tab === "compare" && (
        <Panel kicker="Benefit Matrix" title="Standard vs Silver vs Gold">
          <div className="compare-table">
            <div className="compare-row header">
              <div>Benefit</div>
              <div>Standard</div>
              <div>Silver</div>
              <div>Gold</div>
            </div>
            {[
              ["Projected price", "$321", "$307", "$291"],
              ["Telehealth", "✓", "✓", "✓"],
              ["Preventive checkups", "✓", "✓", "✓"],
              ["Stress coaching", "—", "✓", "✓"],
              ["Nutrition + sleep", "Basic", "Full", "Full + Priority"],
              ["AI risk intelligence", "Core", "Advanced", "Executive"],
              ["Rewards ceiling", "5%", "14%", "20%"],
            ].map((r) => (
              <div className="compare-row" key={r[0]}>
                <div>
                  <strong>{r[0]}</strong>
                </div>
                <div>{r[1]}</div>
                <div>{r[2]}</div>
                <div>{r[3]}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}

export function RewardsPage({
  s,
  d,
  tab,
  onTab,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  const bands: [string, string, string, boolean][] = [
    ["Below 60", "0–5%", "Support-first", d.pricingScore < 60],
    ["60–69", "up to 9%", "Standard", d.pricingScore >= 60 && d.pricingScore < 70],
    ["70–84", "up to 14%", "Silver", d.pricingScore >= 70 && d.pricingScore < 85],
    ["85+", "up to 20%", "Gold", d.pricingScore >= 85],
  ];
  const challenges: [string, number, number][] = [
    ["7-Day Sleep Recovery", 250, clamp(d.sleepScore * 0.82)],
    ["10K Steps Sprint", 320, clamp((s.steps / 10000) * 100)],
    ["Low Stress Week", 180, clamp((100 - s.stress) * 1.05)],
    ["Meal Rhythm Challenge", 150, s.nutrition],
  ];
  return (
    <>
      <SectionHead
        kicker="06 / Behavior Rewards"
        title="Rewards"
        tabs={[
          { id: "premium", label: "Premium Simulator" },
          { id: "points", label: "Points" },
          { id: "challenges", label: "Challenges" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "premium" && (
        <>
          <div className="premium-hero">
            <div>
              <span className="panel-kicker">30-day weighted pricing score</span>
              <h3>Projected Premium</h3>
              <div className="premium-big">
                ${round(d.premium)}
                <small>/ month</small>
              </div>
              <span className="warning-chip">Simulated premium</span>
            </div>
            <div className="premium-flow">
              <div>
                <span>Base</span>
                <strong>$340</strong>
              </div>
              <b>→</b>
              <div>
                <span>Behavior Discount</span>
                <strong>{round(d.discount)}%</strong>
              </div>
              <b>→</b>
              <div>
                <span>Monthly Savings</span>
                <strong>${round(d.savings)}</strong>
              </div>
              <b>→</b>
              <div>
                <span>Annual Savings</span>
                <strong>${fmt(round(d.savings * 12))}</strong>
              </div>
            </div>
          </div>
          <Panel kicker="Discount Path" title="Vitality Score → Potential Savings">
            <div className="discount-scale">
              {bands.map((b) => (
                <div className={`discount-band${b[3] ? " is-current" : ""}`} key={b[0]}>
                  <span>{b[0]}</span>
                  <strong>{b[1]}</strong>
                  <small>
                    {b[2]}
                    {b[3] ? " · current" : ""}
                  </small>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
      {tab === "points" && (
        <div className="grid-12">
          <article className="panel span-4">
            <div className="wallet">
              <span className="wallet-icon">
                <Sparkles size={20} />
              </span>
              <span>Vitality Points</span>
              <strong>{fmt(d.points)}</strong>
              <small>+{fmt(d.pointsWeek)} this week</small>
            </div>
          </article>
          <Panel className="span-8" kicker="Points History" title="Rewards by Category">
            <BarChart
              rows={[
                ["Sleep", d.sleepScore * 2.1],
                ["Movement", d.activityScore * 2.5],
                ["Recovery", s.recovery * 1.8],
                ["Nutrition", s.nutrition * 1.5],
                ["Stress", d.resilience * 1.3],
              ]}
              max={260}
            />
          </Panel>
        </div>
      )}
      {tab === "challenges" && (
        <div className="challenge-grid">
          {challenges.map((c) => (
            <div className="challenge-card" key={c[0]}>
              <div className="challenge-head">
                <div>
                  <h3>{c[0]}</h3>
                  <small>Behavior reward challenge</small>
                </div>
                <span className="reward-badge">+{c[1]} pts</span>
              </div>
              <div className="progress">
                <i style={{ width: `${c[2]}%` }} />
              </div>
              <div className="challenge-foot">
                <span>{round(c[2])}% complete</span>
                <span>{round((c[1] * c[2]) / 100)} pts unlocked</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function CarePage({
  s,
  d,
  tab,
  onTab,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  return (
    <>
      <SectionHead
        kicker="07 / Care Orchestration"
        title="Care"
        tabs={[
          { id: "providers", label: "Providers" },
          { id: "pathways", label: "Pathways" },
          { id: "telehealth", label: "Telehealth" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "providers" && (
        <>
          <div className="provider-grid">
            {[
              [HeartPulse, "Sleep Specialist", "Sleep consistency + recovery review"],
              [Sparkles, "Stress Coach", "Workload decompression + resilience"],
              [Utensils, "Nutritionist", "Meal rhythm + performance nutrition"],
              [Stethoscope, "Primary Care", "Preventive health coordination"],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof HeartPulse;
              return (
                <div className="provider-card" key={String(title)}>
                  <div className="provider-icon">
                    <I size={16} />
                  </div>
                  <strong>{String(title)}</strong>
                  <small>{String(copy)}</small>
                  <button type="button">View demo pathway</button>
                </div>
              );
            })}
          </div>
          <Panel kicker="Care Access" title="Recommended Mix">
            <BarChart
              rows={[
                ["Sleep", clamp(d.sleepDebt + 25)],
                ["Stress", clamp(s.stress + 20)],
                ["Nutrition", clamp(100 - s.nutrition + 34)],
                ["Primary", 45],
              ]}
            />
          </Panel>
        </>
      )}
      {tab === "pathways" && (
        <div className="pathway-grid">
          {[
            ["Sleep Debt", ["Bedtime Audit", "AI Coaching", "7-Day Recovery", "Specialist Referral"]],
            ["Stress", ["Stress Signal", "90s Reset", "Coach Session", "Clinical Routing"]],
            ["Nutrition", ["Meal Audit", "Timing AI", "Meal Rhythm", "Nutritionist"]],
            ["Recovery", ["Recovery Deficit", "Low Load Day", "Sleep Block", "Care Escalation"]],
          ].map((p) => (
            <div className="pathway-card" key={p[0] as string}>
              <h3>{p[0] as string} Pathway</h3>
              <div className="pathway-flow">
                {(p[1] as string[]).map((step, i) => (
                  <span key={step} className="contents">
                    {i ? <span className="pathway-arrow">→</span> : null}
                    <div className="pathway-step">{step}</div>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "telehealth" && (
        <div className="grid-12">
          <Panel className="span-6" kicker="Upcoming" title="Appointments">
            <div className="appointment-grid">
              {[
                ["Tue 11:30", "Stress Coach", "20-min remote session"],
                ["Thu 08:45", "Nutritionist", "Meal rhythm review"],
                ["Fri 17:00", "Primary Care", "Preventive check-in"],
              ].map((a) => (
                <div className="appointment-card" key={a[0]}>
                  <div className="appointment-time">{a[0]}</div>
                  <div>
                    <strong>{a[1]}</strong>
                    <small>{a[2]}</small>
                  </div>
                  <button type="button">Book demo</button>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="span-6" kicker="Utilization" title="Telehealth Utilization">
            <BarChart
              rows={[
                ["Jan", 28],
                ["Feb", 34],
                ["Mar", 43],
                ["Apr", 51],
                ["May", 48],
                ["Jun", 64],
              ]}
              max={75}
            />
          </Panel>
        </div>
      )}
    </>
  );
}

export function CoachPage({
  s,
  d,
  tab,
  onTab,
}: {
  s: SimInputs;
  d: Derived;
  tab: string;
  onTab: (id: string) => void;
}) {
  const note = buildSummary(s, d);
  const [regenLabel, setRegenLabel] = useState("Regenerate");
  const actions = buildActions(s, d);
  return (
    <>
      <SectionHead
        kicker="08 / Preventive AI"
        title="AI Coach"
        tabs={[
          { id: "daily", label: "Daily Coach" },
          { id: "meal", label: "Meal Planner" },
          { id: "recovery", label: "Recovery" },
          { id: "notes", label: "AI Notes" },
        ]}
        tab={tab}
        onTab={onTab}
      />
      {tab === "daily" && (
        <div className="grid-12">
          <Panel className="span-7" kicker="Today's Plan" title="Executive Performance Coach" extra={<span className="ai-chip">AI</span>}>
            <div className="coach-actions">
              {actions.map((a, i) => (
                <div className="coach-action" key={a.title}>
                  <div className="num">0{i + 1}</div>
                  <div>
                    <strong>{a.title}</strong>
                    <small>{a.detail}</small>
                  </div>
                  <em>{a.impact}</em>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="span-5" kicker="Expected Effect" title="Tomorrow's Signal">
            <div className="coach-score">
              <div className="score-orb">
                <strong>{round(d.vitalityTomorrow)}</strong>
                <span>Projected</span>
              </div>
              <div className="mini-grid">
                <div>
                  <span>Stress</span>
                  <strong>-{d.stressTomorrow}</strong>
                </div>
                <div>
                  <span>Recovery</span>
                  <strong>+{d.recoveryTomorrow}</strong>
                </div>
                <div>
                  <span>Sleep</span>
                  <strong>+{d.sleepTomorrow.toFixed(1)}h</strong>
                </div>
                <div>
                  <span>Risk</span>
                  <strong>-{d.riskTomorrow}</strong>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
      {tab === "meal" && (
        <Panel kicker="Calendar-aware" title="Meal Planner" extra={<span className="ai-chip">Demo schedule</span>}>
          <div className="calendar-meal-grid">
            {[
              ["08:30", "09:00 investor prep", "Greek yogurt + oats + berries", "Fast, stable energy before focus block."],
              ["12:40", "13:15 product review", "Protein bowl + grains", "High-protein lunch before meeting block."],
              ["16:20", "17:00 board call", "Nuts + fruit + water", "Small fuel block to reduce late-day crash."],
              ["20:00", "No late meetings", "Light dinner + vegetables", "Protect sleep quality and recovery."],
            ].map((c) => (
              <div className="calendar-card" key={c[0]}>
                <time>{c[0]}</time>
                <div className="calendar-event">{c[1]}</div>
                <strong>{c[2]}</strong>
                <small>{c[3]}</small>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {tab === "recovery" && (
        <div className="grid-12">
          <Panel className="span-7" kicker="72-Hour Plan" title="Recovery Trajectory">
            <div className="chart-shell">
              <LineChart
                series={[
                  [s.recovery, clamp(s.recovery + 4), clamp(s.recovery + 8), clamp(s.recovery + 12)],
                  [d.burnout, clamp(d.burnout - 4), clamp(d.burnout - 8), clamp(d.burnout - 12)],
                ]}
                labels={["Now", "24h", "48h", "72h"]}
              />
            </div>
          </Panel>
          <Panel className="span-5" kicker="Recovery Blocks" title="Next 72 Hours">
            <div className="recovery-blocks">
              {[
                ["Tonight", "23:00–07:15 sleep window", "No punitive impact from one imperfect night."],
                ["Tomorrow", "40-minute recovery block", "Low-intensity walk + screen break."],
                ["+48 hours", "Two movement breaks", "10–15 minutes between meeting clusters."],
                ["+72 hours", "Reassess trend", "Review pattern, not a single data point."],
              ].map((r) => (
                <div className="recovery-block" key={r[0]}>
                  <span>{r[0]}</span>
                  <strong>{r[1]}</strong>
                  <small>{r[2]}</small>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
      {tab === "notes" && (
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">Executive Summary</span>
              <h3>AI Health Note</h3>
            </div>
            <button
              className="ghost-btn"
              type="button"
              onClick={() => {
                setRegenLabel("Updated");
                setTimeout(() => setRegenLabel("Regenerate"), 1000);
              }}
            >
              {regenLabel}
            </button>
          </div>
          <div className="ai-summary">
            {note.split(". ").map((sentence, i, arr) => (
              <span key={i}>
                {sentence}
                {i < arr.length - 1 ? ". " : ""}
                {i === 1 || i === 3 ? <br /> : null}
                {i === 1 || i === 3 ? <br /> : null}
              </span>
            ))}
          </div>
          <div className="ethics-strip">
            <span>
              <Shield size={14} />
            </span>
            <p>
              Wellness intelligence only. No medical diagnosis. No psychiatric inference. Future regulated use requires
              consent, governance, auditability and licensed partners.
            </p>
          </div>
        </article>
      )}
    </>
  );
}
