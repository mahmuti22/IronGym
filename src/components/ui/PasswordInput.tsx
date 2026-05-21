"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputClassName: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
};

export function PasswordInput({
  id,
  value,
  onChange,
  inputClassName,
  placeholder = "••••••••",
  disabled = false,
  required = true,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${inputClassName} pr-20`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        disabled={disabled}
        aria-label={showPassword ? "Nascondi password" : "Mostra password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-silver-500 transition hover:text-silver-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-400/60 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {showPassword ? "Nascondi" : "Mostra"}
      </button>
    </div>
  );
}
