interface Props {
  slots: string[];
  selected: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  loading: boolean;
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function TimeSlotStep({
  slots,
  selected,
  onSelect,
  onNext,
  loading,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Choose a Time
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Select an available time slot for your visit.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No available slots for this date. Please choose another date.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => onSelect(slot)}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                  selected === slot
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-muted hover:bg-primary/10 hover:text-primary text-foreground"
                }`}
              >
                {formatTime(slot)}
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
        </>
      )}
    </div>
  );
}
