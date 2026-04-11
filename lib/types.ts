export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export interface Appointment {
  id: string;
  service_id: string;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending_otp' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  otp_code: string | null;
  otp_expires_at: string | null;
  confirmed_at: string | null;
  reminder_1h_sent: boolean;
  reminder_30m_sent: boolean;
  reminder_10m_sent: boolean;
  notes: string | null;
  created_at: string;
  service?: Service;
}

export interface Settings {
  id: number;
  clinic_name: string;
  clinic_phone: string;
  clinic_address: string;
  dentist_whatsapp: string;
}

export interface BookingDetails {
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}
