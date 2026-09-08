import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Brain,
  Building2,
  Cpu,
  Eye,
  Fingerprint,
  Gamepad2,
  GraduationCap,
  Hand,
  HeartPulse,
  Layers,
  Mic,
  MoveHorizontal,
  Network,
  Package,
  Shield,
  Sparkles,
  Stethoscope,
  UserRound,
  Wrench,
} from "lucide-react";
import { BrandMark, CoreEmblem } from "@/components/BrandMark";
import { Axes3D } from "@/components/charts";
import { clamp, riskLabel, type Derived, type SimInputs } from "@/lib/engine";
import type { PageId } from "@/lib/nav";
import { fmt, round } from "@/lib/utils";

export function CascadeDashboard({
  s,
  d,
  onOpen,
}: {
  s: SimInputs;
  d: Derived;
  onOpen: (page: PageId) => void;
}) {
  return (
    <div>
      <div className="eco-title">
        <div className="mx-auto mb-1 flex justify-center">
          <BrandMark size={42} />
        </div>
        <h2>Vitality Cover AI</h2>
        <p>Wellness Risk · Rewards · Coverage Ecosystem</p>
      </div>

      <div className="eco-grid">
        <Connectors />

        <EcoCard
          area="eco-m1"
          num="1"
          title="Member 360"
          onClick={() => onOpen("member")}
          art={<UserRound size={36} strokeWidth={1.5} />}
        >
          <ul className="eco-list">
            <Li icon={Fingerprint} label="Identity graph" value="Alex Karim" />
            <Li icon={Shield} label="Consent vault" value="Active" />
            <Li icon={UserRound} label="Segment" value={s.memberType} />
            <Li icon={Layers} label="Plan tier" value={d.tier} />
            <Li icon={HeartPulse} label="Vitality" value={`${round(d.vitality)}/100`} />
            <Li icon={Sparkles} label="Projected premium" value={`$${round(d.premium)}`} />
          </ul>
        </EcoCard>

        <EcoCard
          area="eco-m2"
          num="2"
          title="Vitality Engine"
          onClick={() => onOpen("dashboard")}
          art={<Cpu size={36} strokeWidth={1.5} />}
        >
          <div className="engine-pills">
            <span><Eye size={12} /> VC Sight</span>
            <span><Hand size={12} /> VC Touch</span>
            <span><Mic size={12} /> VC Echo</span>
            <span><Layers size={12} /> VC Map</span>
            <span><Network size={12} /> VC Link</span>
            <span><Shield size={12} /> VC Vault</span>
            <span><HeartPulse size={12} /> VC Guard</span>
            <span><Brain size={12} /> VC Guide</span>
          </div>
        </EcoCard>

        <EcoCard
          area="eco-m3"
          num="3"
          title="Risk Arithmetics"
          onClick={() => onOpen("risk")}
          art={<Axes3D />}
        >
          <ul className="eco-list">
            <Li icon={HeartPulse} label="Burnout map" value={`${round(d.burnout)}`} />
            <Li icon={Shield} label="Claims pressure" value={`${round(d.claims)}`} />
            <Li icon={Layers} label="Sleep debt" value={`${round(d.sleepDebt)}`} />
            <Li icon={MoveHorizontal} label="Lifestyle drift" value={`${round(d.lifestyle)}`} />
            <Li icon={Network} label="Safe boundaries" value={riskLabel(d.burnout)} />
          </ul>
        </EcoCard>

        <EcoCard
          area="eco-m4"
          num="4"
          title="Guide AI"
          onClick={() => onOpen("coach")}
          art={<Brain size={36} strokeWidth={1.5} />}
        >
          <ul className="eco-list">
            <Li icon={Layers} label="Daily plan" value="Live" />
            <Li icon={HeartPulse} label="Meal timing" value="Calendar" />
            <Li icon={MoveHorizontal} label="Recovery block" value="40 min" />
            <Li icon={Mic} label="Procedure guide" value="On" />
            <Li icon={Eye} label="Adaptive interface" value="Demo" />
            <Li icon={Sparkles} label="Tomorrow score" value={String(round(d.vitalityTomorrow))} />
          </ul>
        </EcoCard>

        <article className="cascade-core eco-core">
          <CoreEmblem score={d.vitality} />
          <span className="core-kicker">AI Wellness Engine</span>
          <h3>VC System</h3>
          <p>
            Adaptive wellness risk, rewards and insurance intelligence for
            high-performance professionals.
          </p>
          <div className="core-score">
            <strong>{round(d.vitality)}</strong>
            <span>Vitality Score</span>
          </div>
        </article>

        <EcoCard
          area="eco-m5"
          num="5"
          title="Infrastructure"
          onClick={() => onOpen("coverage")}
          art={<Network size={36} strokeWidth={1.5} />}
        >
          <ul className="eco-list">
            <Li icon={Network} label="Care node anchors" value="4 live" />
            <Li icon={Cpu} label="VC Core hub" value="Online" />
            <Li icon={Layers} label="Local processing" value="On-device" />
            <Li icon={MoveHorizontal} label="Shared spatial sync" value="Demo" />
            <Li icon={Shield} label="Coverage services" value={d.tier} />
            <Li icon={Building2} label="Facility mapping" value="Future" />
          </ul>
        </EcoCard>

        <EcoCard
          area="eco-m6"
          num="6"
          title="Interaction Layer"
          onClick={() => onOpen("health")}
        >
          <div className="interact-row">
            <div className="interact-chip">
              <Eye size={18} />
              Gaze select
              <strong>{s.sleep.toFixed(1)}h</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Sleep</span>
            </div>
            <div className="interact-chip">
              <Hand size={18} />
              Pinch
              <strong>{fmt(s.steps)}</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Steps</span>
            </div>
            <div className="interact-chip">
              <MoveHorizontal size={18} />
              Pull
              <strong>{round(s.recovery)}</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Recovery</span>
            </div>
            <div className="interact-chip">
              <Layers size={18} />
              Spread
              <strong>{round(s.nutrition)}</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Nutrition</span>
            </div>
            <div className="interact-chip">
              <Fingerprint size={18} />
              Twist
              <strong>{round(s.stress)}</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Stress</span>
            </div>
            <div className="interact-chip">
              <Hand size={18} />
              Palm menu
              <strong>{d.tier}</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Tier</span>
            </div>
            <div className="interact-chip">
              <Mic size={18} />
              Voice
              <strong>Coach</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Command</span>
            </div>
            <div className="interact-chip">
              <Sparkles size={18} />
              Signal
              <strong>{round(d.vitality)}</strong>
              <span className="text-[8px] tracking-widest text-muted uppercase">Score</span>
            </div>
          </div>
        </EcoCard>

        <EcoCard
          area="eco-m7"
          num="7"
          title="Applications"
          onClick={() => onOpen("care")}
        >
          <div className="app-icons">
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("risk"); }}>
              <Wrench size={16} /> Engineering
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("care"); }}>
              <Stethoscope size={16} /> Medicine
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("coach"); }}>
              <GraduationCap size={16} /> Education
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("coverage"); }}>
              <Package size={16} /> Logistics
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("member"); }}>
              <Building2 size={16} /> Architecture
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("rewards"); }}>
              <Gamepad2 size={16} /> Entertainment
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("health"); }}>
              <Network size={16} /> Remote collab
            </button>
            <button type="button" className="app-icon" onClick={(e) => { e.stopPropagation(); onOpen("dashboard"); }}>
              <Cpu size={16} /> Command
            </button>
          </div>
        </EcoCard>

        <article className="panel eco-flow">
          <div className="flow-strip">
            <h3>System Flow</h3>
            <Flow n="01" title="User Perception" sub="Sleep · Steps · Stress" />
            <span className="flow-arrow" aria-hidden>
              <ArrowRight size={16} />
            </span>
            <Flow n="02" title="Member 360" sub="Consent-led profile" />
            <span className="flow-arrow" aria-hidden>
              <ArrowRight size={16} />
            </span>
            <Flow n="03" title="VC Processing" sub="Vitality engine" />
            <span className="flow-arrow" aria-hidden>
              <ArrowRight size={16} />
            </span>
            <Flow n="04" title="Risk Overlay" sub={`${round(d.burnout)} burnout`} />
            <span className="flow-arrow" aria-hidden>
              <ArrowRight size={16} />
            </span>
            <Flow n="05" title="Interaction" sub="Coach + rewards" />
            <span className="flow-arrow" aria-hidden>
              <ArrowRight size={16} />
            </span>
            <Flow n="06" title="Shared Intelligence" sub={`$${round(d.premium)} / mo`} />
          </div>
        </article>
      </div>
    </div>
  );
}

function EcoCard({
  area,
  num,
  title,
  art,
  children,
  onClick,
}: {
  area: string;
  num: string;
  title: string;
  art?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <article className={`eco-card ${area}`} onClick={onClick}>
      <div className="eco-head">
        <span className="eco-num">{num}</span>
        <h3>{title}</h3>
      </div>
      {art ? (
        <div className="eco-art">
          <div className="eco-art-frame">{art}</div>
        </div>
      ) : null}
      {children}
    </article>
  );
}

function Li({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <li>
      <Icon size={12} />
      {label}
      <strong>{value}</strong>
    </li>
  );
}

function Flow({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="flow-box">
      <span>{n}</span>
      <strong>{title}</strong>
      <small>{sub}</small>
    </div>
  );
}

function Connectors() {
  return (
    <svg className="eco-connectors" viewBox="0 0 1200 980" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ecoLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#29e7ff" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#29e7ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#9b5cff" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d="M200 160 C200 240, 600 220, 600 390" fill="none" stroke="url(#ecoLine)" strokeWidth="1.4" />
      <path d="M600 160 C600 240, 600 300, 600 390" fill="none" stroke="url(#ecoLine)" strokeWidth="1.4" />
      <path d="M1000 160 C1000 240, 600 220, 600 390" fill="none" stroke="url(#ecoLine)" strokeWidth="1.4" />
      <path d="M200 620 C200 520, 600 540, 600 430" fill="none" stroke="url(#ecoLine)" strokeWidth="1.4" />
      <path d="M1000 620 C1000 520, 600 540, 600 430" fill="none" stroke="url(#ecoLine)" strokeWidth="1.4" />
      <circle cx="600" cy="400" r="4" fill="#29e7ff" opacity="0.7" />
    </svg>
  );
}

export function weekSeries(base: number, offsets: number[]) {
  return offsets.map((o) => clamp(base + o));
}
