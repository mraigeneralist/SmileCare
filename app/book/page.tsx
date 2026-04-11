"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Service } from "@/lib/types";
import StepIndicator from "@/components/booking/StepIndicator";
import ServiceStep from "@/components/booking/ServiceStep";
import DateStep from "@/components/booking/DateStep";
import TimeSlotStep from "@/components/booking/TimeSlotStep";
import PatientDetailsStep from "@/components/booking/PatientDetailsStep";
import OTPStep from "@/components/booking/OTPStep";
import ConfirmationStep from "@/components/booking/ConfirmationStep";

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<number[]>([]);

  // Booking state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    id: string;
    serviceName: string;
    date: string;
    time: string;
    patientName: string;
  } | null>(null);

  // Load services and availability on mount
  useEffect(() => {
    async function loadData() {
      const [servicesRes, blockedRes, availRes] = await Promise.all([
        supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase.from("blocked_dates").select("date"),
        supabase.from("availability").select("day_of_week").eq("is_active", true),
      ]);

      if (servicesRes.data) setServices(servicesRes.data as Service[]);
      if (blockedRes.data)
        setBlockedDates(blockedRes.data.map((b) => b.date));
      if (availRes.data)
        setAvailableDays([
          ...new Set(availRes.data.map((a) => a.day_of_week)),
        ]);
    }
    loadData();
  }, []);

  // Fetch slots when date changes
  const fetchSlots = useCallback(async (date: Date, serviceId: string) => {
    setSlotsLoading(true);
    setSlots([]);
    setSelectedTime(null);
    const dateStr = format(date, "yyyy-MM-dd");
    const res = await fetch(
      `/api/booking/slots?date=${dateStr}&service_id=${serviceId}`
    );
    const data = await res.json();
    setSlots(data.slots || []);
    setSlotsLoading(false);
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (selectedService) fetchSlots(date, selectedService.id);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBookingSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setBookingLoading(true);
    setBookingError(null);

    const phone = patientPhone.startsWith("+91") || patientPhone.startsWith("91")
      ? patientPhone
      : "91" + patientPhone;

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: selectedService.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        patient_name: patientName,
        patient_phone: phone,
      }),
    });

    const data = await res.json();
    setBookingLoading(false);

    if (data.success) {
      setAppointmentId(data.appointmentId);
      setStep(5);
    } else {
      setBookingError(data.error || "Something went wrong");
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setOtpLoading(true);
    setOtpError(null);

    const res = await fetch("/api/booking/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, otp }),
    });

    const data = await res.json();
    setOtpLoading(false);

    if (data.success) {
      setConfirmedAppointment(data.appointment);
      setStep(6);
    } else {
      setOtpError(data.error || "Invalid OTP");
    }
  };

  const handleResendOTP = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const phone = patientPhone.startsWith("+91") || patientPhone.startsWith("91")
      ? patientPhone
      : "91" + patientPhone;

    // Cancel old appointment and create new one
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: selectedService.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        patient_name: patientName,
        patient_phone: phone,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setAppointmentId(data.appointmentId);
    }
  };

  const canGoBack = step > 1 && step < 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-primary-100/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground">
              Smile<span className="text-primary">Care</span>
            </span>
          </Link>

          {canGoBack && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          {step === 1 && (
            <ServiceStep
              services={services}
              selected={selectedService}
              onSelect={handleServiceSelect}
            />
          )}

          {step === 2 && (
            <DateStep
              selected={selectedDate}
              onSelect={handleDateSelect}
              blockedDates={blockedDates}
              availableDays={availableDays}
            />
          )}

          {step === 3 && (
            <TimeSlotStep
              slots={slots}
              selected={selectedTime}
              onSelect={handleTimeSelect}
              loading={slotsLoading}
            />
          )}

          {step === 4 && (
            <PatientDetailsStep
              name={patientName}
              phone={patientPhone}
              onNameChange={setPatientName}
              onPhoneChange={setPatientPhone}
              onSubmit={handleBookingSubmit}
              loading={bookingLoading}
              error={bookingError}
            />
          )}

          {step === 5 && (
            <OTPStep
              phone={patientPhone}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              loading={otpLoading}
              error={otpError}
            />
          )}

          {step === 6 && confirmedAppointment && (
            <ConfirmationStep appointment={confirmedAppointment} />
          )}
        </div>
      </div>
    </div>
  );
}
