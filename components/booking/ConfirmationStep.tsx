import Link from "next/link";
import { format, parse } from "date-fns";

interface Props {
  appointment: {
    id: string;
    serviceName: string;
    date: string;
    time: string;
    patientName: string;
  };
}

export default function ConfirmationStep({ appointment }: Props) {
  // Build Google Calendar URL
  const formatGCalTime = () => {
    try {
      // appointment.date is like "Friday, 18 Apr 2026"
      // appointment.time is like "10:00"
      const dateStr = appointment.date;
      const timeStr = appointment.time;
      const parsed = parse(
        `${dateStr} ${timeStr}`,
        "EEEE, dd MMM yyyy HH:mm",
        new Date()
      );
      const start = format(parsed, "yyyyMMdd'T'HHmmss");
      // Add 1 hour for end time
      const end = format(
        new Date(parsed.getTime() + 60 * 60 * 1000),
        "yyyyMMdd'T'HHmmss"
      );
      return `${start}/${end}`;
    } catch {
      return null;
    }
  };

  const gCalDates = formatGCalTime();
  const gCalUrl = gCalDates
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `Dental Appointment - ${appointment.serviceName}`
      )}&dates=${gCalDates}&details=${encodeURIComponent(
        `SmileCare Dental appointment for ${appointment.serviceName}`
      )}`
    : null;

  return (
    <div className="text-center">
      {/* Success animation */}
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Appointment Confirmed!
      </h2>
      <p className="text-muted-foreground mb-8">
        Your appointment has been booked successfully. You&apos;ll receive a
        confirmation on WhatsApp shortly.
      </p>

      {/* Appointment summary */}
      <div className="bg-primary-50 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left">
        <h3 className="font-semibold text-foreground mb-4 text-center">
          Appointment Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Patient</span>
            <span className="font-medium text-foreground text-sm">
              {appointment.patientName}
            </span>
          </div>
          <div className="border-t border-primary/10" />
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Service</span>
            <span className="font-medium text-foreground text-sm">
              {appointment.serviceName}
            </span>
          </div>
          <div className="border-t border-primary/10" />
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Date</span>
            <span className="font-medium text-foreground text-sm">
              {appointment.date}
            </span>
          </div>
          <div className="border-t border-primary/10" />
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Time</span>
            <span className="font-medium text-foreground text-sm">
              {appointment.time}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        {gCalUrl && (
          <a
            href={gCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-border hover:border-primary text-foreground px-6 py-3 rounded-xl font-medium transition-all hover:text-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Add to Calendar
          </a>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-all"
        >
          Back to Home
        </Link>
      </div>

      {/* Reminder note */}
      <p className="text-xs text-muted-foreground mt-8 max-w-sm mx-auto">
        You&apos;ll receive WhatsApp reminders 1 hour, 30 minutes, and 10
        minutes before your appointment.
      </p>
    </div>
  );
}
