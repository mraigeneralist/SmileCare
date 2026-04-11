import { BookingDetails } from "./types";

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const DENTIST_NUMBER = process.env.DENTIST_WHATSAPP_NUMBER!;

async function sendWhatsAppMessage(to: string, body: string) {
  const phone = to.replace(/[^0-9]/g, "");
  const res = await fetch(
    `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("WhatsApp API error:", err);
    throw new Error(`WhatsApp send failed: ${res.status}`);
  }

  return res.json();
}

export async function sendOTP(phone: string, otp: string) {
  const message = `Your SmileCare Dental appointment verification code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`;
  return sendWhatsAppMessage(phone, message);
}

export async function sendBookingConfirmation(
  phone: string,
  details: BookingDetails
) {
  const message =
    `✅ *Appointment Confirmed!*\n\n` +
    `Hi ${details.patientName},\n\n` +
    `Your appointment at *SmileCare Dental* has been confirmed:\n\n` +
    `🦷 *Service:* ${details.serviceName}\n` +
    `📅 *Date:* ${details.appointmentDate}\n` +
    `🕐 *Time:* ${details.appointmentTime}\n\n` +
    `You'll receive reminders before your appointment.\n\n` +
    `To cancel or reschedule, please contact us.\n` +
    `Thank you for choosing SmileCare Dental! 😊`;
  return sendWhatsAppMessage(phone, message);
}

export async function sendDentistNotification(details: BookingDetails) {
  const message =
    `📋 *New Appointment Booked*\n\n` +
    `*Patient:* ${details.patientName}\n` +
    `*Phone:* ${details.patientPhone}\n` +
    `*Service:* ${details.serviceName}\n` +
    `*Date:* ${details.appointmentDate}\n` +
    `*Time:* ${details.appointmentTime}\n\n` +
    `Appointment ID: ${details.appointmentId}`;
  return sendWhatsAppMessage(DENTIST_NUMBER, message);
}

export async function sendReminder(
  phone: string,
  details: BookingDetails,
  minutesBefore: number
) {
  const timeLabel =
    minutesBefore >= 60
      ? `${Math.floor(minutesBefore / 60)} hour`
      : `${minutesBefore} minutes`;

  const message =
    `⏰ *Appointment Reminder*\n\n` +
    `Hi ${details.patientName},\n\n` +
    `Your appointment at *SmileCare Dental* is in *${timeLabel}*.\n\n` +
    `🦷 *Service:* ${details.serviceName}\n` +
    `🕐 *Time:* ${details.appointmentTime}\n\n` +
    `We look forward to seeing you!`;
  return sendWhatsAppMessage(phone, message);
}

export async function sendDentistReminder(
  details: BookingDetails,
  minutesBefore: number
) {
  const timeLabel =
    minutesBefore >= 60
      ? `${Math.floor(minutesBefore / 60)} hour`
      : `${minutesBefore} minutes`;

  const message =
    `⏰ *Upcoming Appointment in ${timeLabel}*\n\n` +
    `*Patient:* ${details.patientName}\n` +
    `*Phone:* ${details.patientPhone}\n` +
    `*Service:* ${details.serviceName}\n` +
    `*Time:* ${details.appointmentTime}`;
  return sendWhatsAppMessage(DENTIST_NUMBER, message);
}
