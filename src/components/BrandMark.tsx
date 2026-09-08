import { cn } from "@/lib/utils";

export function BrandMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vcPeak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7af6ff" />
          <stop offset="55%" stopColor="#29e7ff" />
          <stop offset="100%" stopColor="#4d7dff" />
        </linearGradient>
        <linearGradient id="vcFall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8ffff" />
          <stop offset="100%" stopColor="#29e7ff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M10 62 L28 22 L40 40 L52 16 L70 62"
        fill="none"
        stroke="url(#vcPeak)"
        strokeWidth="4.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M40 40 L40 66"
        fill="none"
        stroke="url(#vcFall)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="68" r="3.2" fill="#29e7ff" opacity="0.9" />
      <path
        d="M22 68 H32 L35 64 L38 70 L41 61 L44 68 H58"
        fill="none"
        stroke="#29e7ff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function CoreEmblem({ score }: { score: number }) {
  return (
    <div className="core-rings">
      <div className="core-logo">
        <div className="flex flex-col items-center">
          <BrandMark size={64} />
          <strong className="mt-1 font-display text-[28px] leading-none tracking-tight">
            {Math.round(score)}
          </strong>
        </div>
      </div>
    </div>
  );
}
