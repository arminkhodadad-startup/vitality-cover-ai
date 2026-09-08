export type MemberType =
  | "Founder"
  | "Executive"
  | "Freelancer"
  | "Remote Team Lead";

export type SimInputs = {
  sleep: number;
  steps: number;
  recovery: number;
  nutrition: number;
  stress: number;
  memberType: MemberType;
  baselineVitality: number;
  basePremium: number;
};

export const DEFAULT_INPUTS: SimInputs = {
  sleep: 7.2,
  steps: 6800,
  recovery: 72,
  nutrition: 74,
  stress: 42,
  memberType: "Founder",
  baselineVitality: 78,
  basePremium: 340,
};

export const MEMBER_TYPES: MemberType[] = [
  "Founder",
  "Executive",
  "Freelancer",
  "Remote Team Lead",
];

export function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

export function riskLabel(v: number) {
  if (v < 25) return "Low";
  if (v < 50) return "Moderate";
  if (v < 70) return "Elevated";
  return "High";
}

export type Derived = ReturnType<typeof derive>;

export function derive(s: SimInputs) {
  const sleepScore = clamp(100 - Math.abs(8 - s.sleep) * 20);
  const activityScore = clamp((s.steps / 10000) * 100);
  const resilience = 100 - s.stress;
  const vitality = clamp(
    sleepScore * 0.24 +
      activityScore * 0.24 +
      s.recovery * 0.22 +
      s.nutrition * 0.18 +
      resilience * 0.12,
  );
  const sleepDef = 100 - sleepScore;
  const recoveryDef = 100 - s.recovery;
  const burnout = clamp(s.stress * 0.45 + sleepDef * 0.25 + recoveryDef * 0.3);
  const claims = clamp(
    (100 - vitality) * 0.35 +
      s.stress * 0.25 +
      recoveryDef * 0.2 +
      (100 - s.nutrition) * 0.2,
  );
  const recoveryRisk = recoveryDef;
  const stressRisk = s.stress;
  const sleepDebt = sleepDef;
  const lifestyle = clamp((100 - activityScore) * 0.55 + (100 - s.nutrition) * 0.45);

  const pricingScore = vitality * 0.72 + s.baselineVitality * 0.28;
  let discount = 0;
  if (pricingScore < 60) discount = clamp((pricingScore / 60) * 5, 0, 5);
  else if (pricingScore < 70) discount = 5 + ((pricingScore - 60) / 10) * 4;
  else if (pricingScore < 85) discount = 9 + ((pricingScore - 70) / 15) * 5;
  else discount = 14 + ((pricingScore - 85) / 15) * 6;
  discount = clamp(discount, 0, 20);

  const premium = s.basePremium * (1 - discount / 100);
  const savings = s.basePremium - premium;
  const tier = vitality >= 85 ? "Gold" : vitality >= 70 ? "Silver" : "Standard";
  const points = Math.round(
    820 +
      sleepScore * 2.1 +
      activityScore * 2.5 +
      s.recovery * 1.8 +
      s.nutrition * 1.5 +
      resilience * 1.3,
  );
  const pointsWeek = Math.round(
    150 +
      sleepScore * 1.8 +
      activityScore * 1.6 +
      s.recovery * 1.2 +
      s.nutrition * 0.8,
  );
  const preventiveRisk = clamp(claims * 0.54);
  const preventiveYield = clamp(78 - claims * 0.18 + vitality * 0.08);
  const forecast = clamp(vitality + (100 - vitality) * 0.23);
  const vitalityTomorrow = clamp(vitality + 3);
  const stressTomorrow = Math.max(3, Math.round(s.stress * 0.14));
  const recoveryTomorrow = Math.max(3, Math.round((100 - s.recovery) * 0.18));
  const sleepTomorrow = Math.max(0.2, Math.min(0.7, (8 - s.sleep) * 0.35));
  const riskTomorrow = Math.max(3, Math.round(burnout * 0.12));
  const vitalityDelta =
    ((vitality - s.baselineVitality) / s.baselineVitality) * 100;
  const workload = clamp(s.stress * 0.8 + (s.memberType === "Founder" ? 15 : 8));

  return {
    sleepScore,
    activityScore,
    resilience,
    vitality,
    burnout,
    claims,
    recoveryRisk,
    stressRisk,
    sleepDebt,
    lifestyle,
    pricingScore,
    discount,
    premium,
    savings,
    tier,
    points,
    pointsWeek,
    preventiveRisk,
    preventiveYield,
    forecast,
    vitalityTomorrow,
    stressTomorrow,
    recoveryTomorrow,
    sleepTomorrow,
    riskTomorrow,
    vitalityDelta,
    workload,
  };
}

export type ActionItem = { title: string; detail: string; impact: string };

export function buildActions(s: SimInputs, d: Derived): ActionItem[] {
  const actions: ActionItem[] = [];
  if (s.sleep < 7.5) {
    actions.push({
      title: "Protect tonight’s sleep window",
      detail: `Target 7.8–8.2h. Current average is ${s.sleep.toFixed(1)}h.`,
      impact: "+3 vitality",
    });
  }
  if (s.steps < 8000) {
    actions.push({
      title: "Add two walking blocks",
      detail: `Close a ${Math.max(0, 8000 - s.steps).toLocaleString("en-US")}-step movement gap without a hard workout.`,
      impact: "+2 vitality",
    });
  }
  if (s.recovery < 78) {
    actions.push({
      title: "Create a 40-minute recovery block",
      detail: "Schedule low-load time before the next high-pressure work cluster.",
      impact: "−5 risk",
    });
  }
  if (s.stress > 35) {
    actions.push({
      title: "Use a 90-second decompression",
      detail: "Trigger immediately after the next demanding meeting.",
      impact: "−4 stress",
    });
  }
  if (s.nutrition < 80) {
    actions.push({
      title: "Anchor one protein-focused meal",
      detail: "Place it before the afternoon work peak to reduce energy volatility.",
      impact: "+2 stability",
    });
  }
  while (actions.length < 4) {
    actions.push({
      title: "Maintain current routine",
      detail: "Consistency is currently more valuable than adding more interventions.",
      impact: "hold tier",
    });
  }
  return actions.slice(0, 5);
}

function projectPremium(vitality: number, s: SimInputs) {
  const pricing = vitality * 0.72 + s.baselineVitality * 0.28;
  let disc: number;
  if (pricing < 60) disc = (pricing / 60) * 5;
  else if (pricing < 70) disc = 5 + ((pricing - 60) / 10) * 4;
  else if (pricing < 85) disc = 9 + ((pricing - 70) / 15) * 5;
  else disc = 14 + ((pricing - 85) / 15) * 6;
  return s.basePremium * (1 - clamp(disc, 0, 20) / 100);
}

export function buildScenarios(s: SimInputs, d: Derived) {
  const improvedV = clamp(d.vitality + 10);
  const stressV = clamp(d.vitality - s.stress * 0.08);
  return [
    {
      name: "CURRENT",
      vitality: d.vitality,
      premium: d.premium,
      burnout: d.burnout,
      risk: riskLabel(d.burnout),
    },
    {
      name: "IMPROVED +10",
      vitality: improvedV,
      premium: projectPremium(improvedV, s),
      burnout: clamp(d.burnout - 12),
      risk: riskLabel(clamp(d.burnout - 12)),
    },
    {
      name: "STRESS SPIKE",
      vitality: stressV,
      premium: projectPremium(stressV, s),
      burnout: clamp(d.burnout + 18),
      risk: riskLabel(clamp(d.burnout + 18)),
    },
  ];
}

export function buildSummary(s: SimInputs, d: Derived) {
  const primary =
    s.sleep < 7
      ? "inconsistent sleep"
      : s.stress > 55
        ? "elevated stress pressure"
        : s.recovery < 60
          ? "recovery deficit"
          : "moderate workload and routine variability";
  return `Vitality Cover AI identifies this demo member as a ${s.memberType} with a ${d.tier} wellness profile. Current Vitality Score: ${Math.round(d.vitality)}/100. The primary modeled risk factor is ${primary}. Burnout Risk Indicator is ${Math.round(d.burnout)}/100 and projected claims pressure is ${Math.round(d.claims)}/100. The pricing simulator applies a 30-day stability buffer, producing a projected premium of $${Math.round(d.premium)}/month from a $${s.basePremium} base premium. This is simulated pricing only, not an insurance quote. Maintaining improved recovery, sleep consistency and movement for several weeks could strengthen reward eligibility while reducing long-term wellness risk. Short-term stress events should trigger support and care options rather than immediate penalties.`;
}

export const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
