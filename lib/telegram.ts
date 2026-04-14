import { BookingDetails } from "./types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const DENTIST_CHAT_ID = process.env.TELEGRAM_DENTIST_CHAT_ID!;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendTelegramMessage(chatId: string, text: string) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Telegram API error:", err);
    throw new Error(`Telegram send failed: ${res.status}`);
  }

  return res.json();
}

export async function sendOTP(phone: string, otp: string) {
  const message =
    `Your SmileCare Dental appointment verification code is: *${otp}*\n\n` +
    `This code expires in 5 minutes. Do not share it with anyone.`;
  return sendTelegramMessage(phone, message);
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
  return sendTelegramMessage(phone, message);
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
  return sendTelegramMessage(DENTIST_CHAT_ID, message);
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
  return sendTelegramMessage(phone, message);
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
  return sendTelegramMessage(DENTIST_CHAT_ID, message);
}
