"use client";

import { useEffect, useState } from "react";
import { Availability, BlockedDate } from "@/lib/types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [slotForm, setSlotForm] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "18:00",
    slot_duration_minutes: 30,
  });
  const [blockForm, setBlockForm] = useState({ date: "", reason: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/admin/availability");
    const data = await res.json();
    setAvailability(data.availability || []);
    setBlockedDates(data.blockedDates || []);
    setLoading(false);
  }

  async function addSlot() {
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slotForm),
    });
    setShowSlotForm(false);
    fetchData();
  }

  async function addBlockedDate() {
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blocked_date", ...blockForm }),
    });
    setShowBlockForm(false);
    setBlockForm({ date: "", reason: "" });
    fetchData();
  }

  async function toggleSlot(slot: Availability) {
    await fetch("/api/admin/availability", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slot.id, is_active: !slot.is_active }),
    });
    fetchData();
  }

  async function deleteItem(id: string, type?: string) {
    await fetch("/api/admin/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    fetchData();
  }

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Availability</h1>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl border border-border mb-6">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Weekly Schedule</h2>
          <button
            onClick={() => setShowSlotForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            + Add Time Slot
          </button>
        </div>

        {showSlotForm && (
          <div className="p-5 border-b border-border bg-muted/20">
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Day
                </label>
                <select
                  value={slotForm.day_of_week}
                  onChange={(e) =>
                    setSlotForm({
                      ...slotForm,
                      day_of_week: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {DAY_NAMES.map((day, i) => (
                    <option key={i} value={i}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={slotForm.start_time}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, start_time: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={slotForm.end_time}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, end_time: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Slot Duration
                </label>
                <select
                  value={slotForm.slot_duration_minutes}
                  onChange={(e) =>
                    setSlotForm({
                      ...slotForm,
                      slot_duration_minutes: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value={15}>15 min</option>
                  <option value={20}>20 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addSlot}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Add
              </button>
              <button
                onClick={() => setShowSlotForm(false)}
                className="border border-border text-muted-foreground px-5 py-2 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {availability.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No schedule set. Add your working hours.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {availability.map((slot) => (
              <div
                key={slot.id}
                className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {DAY_NAMES[slot.day_of_week]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}{" "}
                    &middot; {slot.slot_duration_minutes} min slots
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSlot(slot)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                      slot.is_active
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {slot.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => deleteItem(slot.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked Dates */}
      <div className="bg-white rounded-xl border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Blocked Dates (Holidays / Days Off)
          </h2>
          <button
            onClick={() => setShowBlockForm(true)}
            className="bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            + Block Date
          </button>
        </div>

        {showBlockForm && (
          <div className="p-5 border-b border-border bg-muted/20">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, date: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, reason: e.target.value })
                  }
                  placeholder="e.g. Public holiday"
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addBlockedDate}
                className="bg-destructive hover:bg-destructive/90 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Block
              </button>
              <button
                onClick={() => setShowBlockForm(false)}
                className="border border-border text-muted-foreground px-5 py-2 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {blockedDates.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No blocked dates.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{bd.date}</p>
                  {bd.reason && (
                    <p className="text-sm text-muted-foreground">{bd.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteItem(bd.id, "blocked_date")}
                  className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
