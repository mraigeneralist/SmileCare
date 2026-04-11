"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, isBefore, startOfDay } from "date-fns";

interface Props {
  selected: Date | null;
  onSelect: (date: Date) => void;
  blockedDates: string[];
  availableDays: number[];
}

export default function DateStep({
  selected,
  onSelect,
  blockedDates,
  availableDays,
}: Props) {
  const today = startOfDay(new Date());
  const blocked = blockedDates.map((d) => new Date(d + "T00:00:00"));

  const isDisabled = (date: Date) => {
    if (isBefore(date, today)) return true;
    if (blocked.some((b) => b.toDateString() === date.toDateString()))
      return true;
    if (!availableDays.includes(date.getDay())) return true;
    return false;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Pick a Date</h2>
      <p className="text-muted-foreground mb-8">
        Select your preferred appointment date.
      </p>

      <div className="flex justify-center">
        <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
          <DayPicker
            mode="single"
            selected={selected || undefined}
            onSelect={(date) => date && onSelect(date)}
            disabled={isDisabled}
            fromDate={today}
            toDate={addDays(today, 60)}
            classNames={{
              today: "font-bold text-primary",
              selected:
                "bg-primary text-white rounded-full",
              disabled: "text-muted-foreground/40 line-through",
              chevron: "fill-primary",
            }}
          />
        </div>
      </div>
    </div>
  );
}
