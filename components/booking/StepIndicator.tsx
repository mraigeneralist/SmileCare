const steps = [
  "Service",
  "Date",
  "Time",
  "Details",
  "Verify",
  "Confirmed",
];

export default function StepIndicator({ current }: { current: number }) {
  const progressPercent = ((current - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-10 w-full max-w-lg mx-auto">
      <div className="relative grid grid-cols-6">
        {/* Background line */}
        <div className="absolute top-3.5 sm:top-[18px] left-[calc(100%/12)] right-[calc(100%/12)] h-0.5 bg-border" />
        {/* Progress line */}
        <div
          className="absolute top-3.5 sm:top-[18px] left-[calc(100%/12)] h-0.5 bg-primary transition-all duration-500"
          style={{
            width: `calc((100% - 100%/6) * ${progressPercent / 100})`,
          }}
        />

        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === current;
          const isDone = stepNum < current;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[11px] sm:text-sm font-semibold transition-all ${
                  isDone
                    ? "bg-primary text-white"
                    : isActive
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[8px] sm:text-[10px] mt-1 font-medium text-center tracking-wide uppercase ${
                  isActive
                    ? "text-primary"
                    : isDone
                    ? "text-primary/70"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
