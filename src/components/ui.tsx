import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHead({
  kicker,
  title,
  tabs,
  tab,
  onTab,
}: {
  kicker: string;
  title: string;
  tabs?: { id: string; label: string }[];
  tab?: string;
  onTab?: (id: string) => void;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {tabs && onTab && tab ? (
        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={cn("tab-btn", tab === t.id && "is-active")}
              onClick={() => onTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Panel({
  kicker,
  title,
  extra,
  className,
  children,
}: {
  kicker?: string;
  title?: string;
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={cn("panel", className)}>
      {(kicker || title || extra) && (
        <div className="panel-head">
          <div>
            {kicker ? <span className="panel-kicker">{kicker}</span> : null}
            {title ? <h3>{title}</h3> : null}
          </div>
          {extra}
        </div>
      )}
      {children}
    </article>
  );
}
