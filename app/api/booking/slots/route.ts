import { supabaseServer } from "@/lib/supabase-server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const serviceId = searchParams.get("service_id");

  if (!date) {
    return Response.json({ error: "date is required" }, { status: 400 });
  }

  const requestedDate = new Date(date + "T00:00:00");
  const dayOfWeek = requestedDate.getDay();

  // Check if date is blocked
  const { data: blocked } = await supabaseServer
    .from("blocked_dates")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (blocked) {
    return Response.json({ slots: [], message: "This date is unavailable" });
  }

  // Get availability for this day of week
  const { data: availability } = await supabaseServer
    .from("availability")
    .select("*")
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  if (!availability || availability.length === 0) {
    return Response.json({ slots: [], message: "No availability on this day" });
  }

  // Get service duration if provided
  let serviceDuration = 30;
  if (serviceId) {
    const { data: service } = await supabaseServer
      .from("services")
      .select("duration_minutes")
      .eq("id", serviceId)
      .single();
    if (service) {
      serviceDuration = service.duration_minutes;
    }
  }

  // Generate all possible slots
  const allSlots: string[] = [];
  for (const avail of availability) {
    const [startH, startM] = avail.start_time.split(":").map(Number);
    const [endH, endM] = avail.end_time.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const slotDuration = avail.slot_duration_minutes || 30;

    for (let m = startMinutes; m + serviceDuration <= endMinutes; m += slotDuration) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      allSlots.push(
        `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
      );
    }
  }

  // Get already booked slots for this date
  const { data: booked } = await supabaseServer
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date)
    .in("status", ["confirmed", "pending_otp"]);

  const bookedTimes = new Set(
    (booked || []).map((b) => b.appointment_time.slice(0, 5))
  );

  // Filter to only today-future slots if date is today
  const now = new Date();
  const isToday =
    requestedDate.toDateString() === now.toDateString();

  const availableSlots = allSlots.filter((slot) => {
    if (bookedTimes.has(slot)) return false;
    if (isToday) {
      const [h, m] = slot.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(h, m, 0, 0);
      if (slotTime <= now) return false;
    }
    return true;
  });

  return Response.json({ slots: availableSlots });
}
