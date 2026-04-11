"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/lib/types";

const statusColor: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  no_show: "bg-warning/10 text-warning",
  pending_otp: "bg-muted text-muted-foreground",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  async function fetchAppointments() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);

    const res = await fetch(`/api/admin/appointments?${params}`);
    const data = await res.json();
    setAppointments(data.appointments || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchAppointments();
  }

  const filters = ["all", "confirmed", "completed", "cancelled", "no_show", "pending_otp"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Appointments</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground text-sm">
                        {apt.patient_name}
                      </p>
                      <a
                        href={`https://wa.me/${apt.patient_phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {apt.patient_phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {apt.service?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">
                        {apt.appointment_date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {apt.appointment_time.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          statusColor[apt.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {apt.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {apt.status === "confirmed" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(apt.id, "completed")}
                            className="text-xs px-2.5 py-1 rounded-lg bg-success/10 text-success hover:bg-success/20 font-medium"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, "no_show")}
                            className="text-xs px-2.5 py-1 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 font-medium"
                          >
                            No Show
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, "cancelled")}
                            className="text-xs px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
