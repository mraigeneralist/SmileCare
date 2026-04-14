import { supabaseServer } from "@/lib/supabase-server";
import {
  sendReminder,
  sendDentistReminder,
} from "@/lib/messaging";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron sends this header)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { sent: 0, errors: 0 };

  // Find confirmed appointments that need reminders
  // We check for appointments within the next 65 minutes (to cover 1h reminder with 5-min cron window)
  const futureLimit = new Date(now.getTime() + 65 * 60 * 1000);

  const todayStr = now.toISOString().split("T")[0];
  const tomorrowStr = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: appointments } = await supabaseServer
    .from("appointments")
    .select("*, service:services(name)")
    .eq("status", "confirmed")
    .in("appointment_date", [todayStr, tomorrowStr])
    .or("reminder_1h_sent.eq.false,reminder_30m_sent.eq.false,reminder_10m_sent.eq.false");

  if (!appointments || appointments.length === 0) {
    return Response.json({ message: "No reminders to send", ...results });
  }

  for (const apt of appointments) {
    const [h, m] = apt.appointment_time.split(":").map(Number);
    const appointmentDateTime = new Date(apt.appointment_date + "T00:00:00");
    appointmentDateTime.setHours(h, m, 0, 0);

    const minutesUntil = (appointmentDateTime.getTime() - now.getTime()) / 60000;

    // Skip past appointments
    if (minutesUntil < 0) continue;

    const details = {
      appointmentId: apt.id,
      patientName: apt.patient_name,
      patientPhone: apt.patient_phone,
      serviceName: apt.service?.name || "Dental Appointment",
      appointmentDate: apt.appointment_date,
      appointmentTime: apt.appointment_time.slice(0, 5),
    };

    try {
      // 1 hour reminder (send when 55-65 min away)
      if (!apt.reminder_1h_sent && minutesUntil <= 65 && minutesUntil > 25) {
        await Promise.all([
          sendReminder(apt.patient_phone, details, 60),
          sendDentistReminder(details, 60),
        ]);
        await supabaseServer
          .from("appointments")
          .update({ reminder_1h_sent: true })
          .eq("id", apt.id);
        results.sent++;
      }

      // 30 minute reminder (send when 25-35 min away)
      if (!apt.reminder_30m_sent && minutesUntil <= 35 && minutesUntil > 5) {
        await Promise.all([
          sendReminder(apt.patient_phone, details, 30),
          sendDentistReminder(details, 30),
        ]);
        await supabaseServer
          .from("appointments")
          .update({ reminder_30m_sent: true })
          .eq("id", apt.id);
        results.sent++;
      }

      // 10 minute reminder (send when 5-15 min away)
      if (!apt.reminder_10m_sent && minutesUntil <= 15 && minutesUntil > 0) {
        await Promise.all([
          sendReminder(apt.patient_phone, details, 10),
          sendDentistReminder(details, 10),
        ]);
        await supabaseServer
          .from("appointments")
          .update({ reminder_10m_sent: true })
          .eq("id", apt.id);
        results.sent++;
      }
    } catch (err) {
      console.error(`Reminder error for appointment ${apt.id}:`, err);
      results.errors++;
    }
  }

  return Response.json({ message: "Reminders processed", ...results });
}
