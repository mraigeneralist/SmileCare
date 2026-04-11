"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading: boolean;
  error: string | null;
}

export default function OTPStep({
  phone,
  onVerify,
  onResend,
  loading,
  error,
}: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newDigits.every((d) => d) && value) {
      onVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    if (pasted.length === 6) {
      onVerify(newDigits.join(""));
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleResend = () => {
    onResend();
    setCountdown(300);
    setResendCooldown(30);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const maskedPhone = phone.length >= 4
    ? "****" + phone.slice(-4)
    : phone;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Verify OTP
      </h2>
      <p className="text-muted-foreground mb-8">
        Enter the 6-digit code sent to your WhatsApp number{" "}
        <span className="font-medium text-foreground">{maskedPhone}</span>.
      </p>

      <div className="max-w-md mx-auto">
        {/* OTP inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              maxLength={1}
              className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all focus:outline-none ${
                digit
                  ? "border-primary bg-primary-50"
                  : "border-border"
              } focus:border-primary focus:ring-2 focus:ring-primary/20`}
            />
          ))}
        </div>

        {/* Timer */}
        {countdown > 0 ? (
          <p className="text-center text-sm text-muted-foreground mb-4">
            Code expires in{" "}
            <span className="font-medium text-foreground">
              {formatTime(countdown)}
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-destructive mb-4 font-medium">
            OTP has expired. Please request a new one.
          </p>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Resend */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
