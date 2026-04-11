import { supabaseServer } from "@/lib/supabase-server";
import { sendOTP } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const body = await req.json();
  const { service_id, date, time, patient_name, patient_phone } = body;

  if (!service_id || !date || !time || !patient_name || !patient_phone) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  // Check slot is still available
  const { data: existing } = await supabaseServer
    .from("appointments")
    .select("id")
    .eq("appointment_date", date)
    .eq("appointment_time", time)
    .in("status", ["confirmed", "pending_otp"])
    .maybeSingle();

  if (existing) {
    return Response.json(
      { error: "This time slot is no longer available" },
      { status: 409 }
    );
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Insert appointment
  const { data: appointment, error } = await supabaseServer
    .from("appointments")
    .insert({
      service_id,
      patient_name,
      patient_phone,
      appointment_date: date,
      appointment_time: time,
      status: "pending_otp",
      otp_code: otp,
      otp_expires_at: otpExpiresAt,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Appointment insert error:", error);
    return Response.json({ error: "Failed to create appointment" }, { status: 500 });
  }

  // Send OTP via WhatsApp
  try {
    await sendOTP(patient_phone, otp);
  } catch (err) {
    console.error("WhatsApp OTP send error:", err);
    // Don't fail the booking - OTP is stored, they can request resend
  }

  return Response.json({
    success: true,
    appointmentId: appointment.id,
  });
}
