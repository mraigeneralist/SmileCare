"use client";

import { useState } from "react";

interface Props {
  name: string;
  phone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export default function PatientDetailsStep({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  loading,
  error,
}: Props) {
  const [touched, setTouched] = useState({ name: false, phone: false });

  const nameError = touched.name && !name.trim() ? "Name is required" : null;
  const phoneError =
    touched.phone && !/^(\+91|91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))
      ? "Enter a valid Indian mobile number"
      : null;

  const isValid =
    name.trim() && /^(\+91|91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Your Details
      </h2>
      <p className="text-muted-foreground mb-8">
        Enter your name and WhatsApp number to receive the verification OTP.
      </p>

      <div className="max-w-md mx-auto space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 rounded-xl border ${
              nameError ? "border-destructive" : "border-border"
            } bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
          />
          {nameError && (
            <p className="text-destructive text-xs mt-1">{nameError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            WhatsApp Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-muted text-muted-foreground text-sm">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
              placeholder="9876543210"
              maxLength={10}
              className={`w-full px-4 py-3 rounded-r-xl border ${
                phoneError ? "border-destructive" : "border-border"
              } bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
            />
          </div>
          {phoneError && (
            <p className="text-destructive text-xs mt-1">{phoneError}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5">
            You&apos;ll receive a verification OTP on this WhatsApp number.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!isValid || loading}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Send OTP via WhatsApp
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
