import { supabaseServer } from "@/lib/supabase-server";
import {
  sendBookingConfirmation,
  sendDentistNotification,
} from "@/lib/messaging";
import { format, parse } from "date-fns";

export async function POST(req: Request) {
  const body = await req.json();
  const { appointmentId, otp } = body;

  if (!appointmentId || !otp) {
    return Response.json(
      { error: "Appointment ID and OTP are required" },
      { status: 400 }
    );
  }

  // Fetch appointment with service info
  const { data: appointment, error } = await supabaseServer
    .from("appointments")
    .select("*, service:services(name)")
    .eq("id", appointmentId)
    .single();

  if (error || !appointment) {
    return Response.json({ error: "Appointment not found" }, { status: 404 });
  }

  if (appointment.status !== "pending_otp") {
    return Response.json(
      { error: "Appointment is not pending verification" },
      { status: 400 }
    );
  }

  // Check OTP expiry
  if (new Date(appointment.otp_expires_at) < new Date()) {
    return Response.json({ error: "OTP has expired" }, { status: 400 });
  }

  // Verify OTP
  if (appointment.otp_code !== otp) {
    return Response.json({ error: "Invalid OTP" }, { status: 400 });
  }

  // Confirm appointment
  const { error: updateError } = await supabaseServer
    .from("appointments")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      otp_code: null,
      otp_expires_at: null,
    })
    .eq("id", appointmentId);

  if (updateError) {
    console.error("Confirm update error:", updateError);
    return Response.json(
      { error: "Failed to confirm appointment" },
      { status: 500 }
    );
  }

  const serviceName = appointment.service?.name || "Dental Appointment";
  const appointmentDate = format(
    parse(appointment.appointment_date, "yyyy-MM-dd", new Date()),
    "EEEE, dd MMM yyyy"
  );
  const appointmentTime = appointment.appointment_time.slice(0, 5);

  const details = {
    appointmentId,
    patientName: appointment.patient_name,
    patientPhone: appointment.patient_phone,
    serviceName,
    appointmentDate,
    appointmentTime,
  };

  // Send WhatsApp confirmations (don't block on failure)
  try {
    await Promise.all([
      sendBookingConfirmation(appointment.patient_phone, details),
      sendDentistNotification(details),
    ]);
  } catch (err) {
    console.error("WhatsApp confirmation error:", err);
  }

  return Response.json({
    success: true,
    appointment: {
      id: appointmentId,
      serviceName,
      date: appointmentDate,
      time: appointmentTime,
      patientName: appointment.patient_name,
    },
  });
}
