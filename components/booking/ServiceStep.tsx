import { Service } from "@/lib/types";

interface Props {
  services: Service[];
  selected: Service | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
}

export default function ServiceStep({ services, selected, onSelect, onNext }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Select a Service
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Choose the dental service you need.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
              selected?.id === service.id
                ? "border-primary bg-primary-50 shadow-md"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              {selected?.id === service.id && (
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {service.description}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-primary bg-primary-50 px-2.5 py-1 rounded-full">
                {service.duration_minutes} min
              </span>
              <span className="text-sm font-semibold text-foreground">
                ₹{service.price}
              </span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${
          selected
            ? "bg-primary text-white hover:bg-primary-dark active:scale-[0.98] shadow-md shadow-primary/20"
            : "bg-muted text-muted-foreground border border-border cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
