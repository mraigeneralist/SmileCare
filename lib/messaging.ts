// Re-exports messaging functions from the configured provider.
// Set MESSAGING_PROVIDER=telegram in .env to use Telegram for demos.
// Defaults to whatsapp if not set.

const provider = process.env.MESSAGING_PROVIDER || "whatsapp";

const mod =
  provider === "telegram"
    ? require("./telegram")
    : require("./whatsapp");

export const sendOTP: typeof import("./whatsapp").sendOTP = mod.sendOTP;
export const sendBookingConfirmation: typeof import("./whatsapp").sendBookingConfirmation = mod.sendBookingConfirmation;
export const sendDentistNotification: typeof import("./whatsapp").sendDentistNotification = mod.sendDentistNotification;
export const sendReminder: typeof import("./whatsapp").sendReminder = mod.sendReminder;
export const sendDentistReminder: typeof import("./whatsapp").sendDentistReminder = mod.sendDentistReminder;
