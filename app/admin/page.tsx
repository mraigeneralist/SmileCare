"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Appointment } from "@/lib/types";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    pending: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const today = format(new Date(), "yyyy-MM-dd");
    const weekStart = format(
      new Date(Date.now() - new Date().getDay() * 86400000),
      "yyyy-MM-dd"
    );
    const weekEnd = format(
      new Date(Date.now() + (6 - new Date().getDay()) * 86400000),
      "yyyy-MM-dd"
    );

    const [todayRes, weekRes, pendingRes, patientsRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("*, service:services(name)")
        .eq("appointment_date", today)
        .in("status", ["confirmed", "completed"])
        .order("appointment_time"),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .gte("appointment_date", weekStart)
        .lte("appointment_date", weekEnd)
        .in("status", ["confirmed", "completed"]),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_otp"),
      supabase
        .from("appointments")
        .select("patient_phone", { count: "exact", head: true })
        .in("status", ["confirmed", "completed"]),
    ]);

    if (todayRes.data) setTodayAppointments(todayRes.data as Appointment[]);
    setStats({
      today: todayRes.data?.length || 0,
      thisWeek: weekRes.count || 0,
      pending: pendingRes.count || 0,
      totalPatients: patientsRes.count || 0,
    });
  }

  const statusColor: Record<string, string> = {
    confirmed: "bg-success/10 text-success",
    completed: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
    no_show: "bg-warning/10 text-warning",
    pending_otp: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Appointments", value: stats.today, color: "text-primary" },
          { label: "This Week", value: stats.thisWeek, color: "text-foreground" },
          { label: "Pending OTP", value: stats.pending, color: "text-warning" },
          { label: "Total Patients", value: stats.totalPatients, color: "text-success" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-border p-5"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-xl border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Today&apos;s Schedule
          </h2>
          <Link
            href="/admin/appointments"
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            View All
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold text-foreground">
                      {apt.appointment_time.slice(0, 5)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {apt.patient_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {apt.service?.name || "Dental Appointment"} &middot;{" "}
                      {apt.patient_phone}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusColor[apt.status] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {apt.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
