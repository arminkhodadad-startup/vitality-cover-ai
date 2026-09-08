import { X } from "lucide-react";
import { MEMBER_TYPES } from "@/lib/engine";
import { useDerived, useSim } from "@/lib/store";
import { fmt, round } from "@/lib/utils";

export function Simulator() {
  const open = useSim((s) => s.simulatorOpen);
  const setOpen = useSim((s) => s.setSimulatorOpen);
  const sleep = useSim((s) => s.sleep);
  const steps = useSim((s) => s.steps);
  const recovery = useSim((s) => s.recovery);
  const nutrition = useSim((s) => s.nutrition);
  const stress = useSim((s) => s.stress);
  const memberType = useSim((s) => s.memberType);
  const setNumber = useSim((s) => s.setNumber);
  const setMemberType = useSim((s) => s.setMemberType);
  const reset = useSim((s) => s.reset);
  const d = useDerived();

  return (
    <>
      <div
        className={`simulator-backdrop${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`simulator${open ? " open" : ""}`} aria-label="Simulation inputs">
        <div className="sim-head">
          <div>
            <span className="panel-kicker">Live demo inputs</span>
            <h3>Simulation Lab</h3>
          </div>
          <button
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close simulator"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
        <p className="sim-copy">
          Change the member’s wellness inputs. The entire application recalculates in
          real time. Humans do enjoy moving sliders until reality becomes negotiable.
        </p>
        <Range
          label="Average Sleep"
          value={`${sleep.toFixed(1)}h`}
          min={4}
          max={9}
          step={0.1}
          current={sleep}
          onChange={(v) => setNumber("sleep", v)}
        />
        <Range
          label="Daily Steps"
          value={fmt(steps)}
          min={1000}
          max={16000}
          step={100}
          current={steps}
          onChange={(v) => setNumber("steps", v)}
        />
        <Range
          label="Recovery Score"
          value={String(round(recovery))}
          min={0}
          max={100}
          step={1}
          current={recovery}
          onChange={(v) => setNumber("recovery", v)}
        />
        <Range
          label="Nutrition Score"
          value={String(round(nutrition))}
          min={0}
          max={100}
          step={1}
          current={nutrition}
          onChange={(v) => setNumber("nutrition", v)}
        />
        <Range
          label="Stress Load"
          value={String(round(stress))}
          min={0}
          max={100}
          step={1}
          current={stress}
          onChange={(v) => setNumber("stress", v)}
        />
        <div className="input-group">
          <label>Member Type</label>
          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value as (typeof MEMBER_TYPES)[number])}
          >
            {MEMBER_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sim-result">
          <span>Vitality Score</span>
          <strong>{round(d.vitality)}</strong>
          <small>Long-term behavior weighted</small>
        </div>
        <button className="primary-btn full" type="button" onClick={reset}>
          Reset demo profile
        </button>
      </aside>
    </>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="input-group">
      <label>
        {label}
        <strong>{value}</strong>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
