"use client";

import { useState } from "react";
import type { CustomerProfileRow } from "@/lib/customer/auth-check";
import {
  updateCustomerProfile,
  type CustomerProfileUpdate,
} from "@/lib/customer/profile";

const inputClass =
  "min-h-12 w-full rounded-xl border border-silver-400/45 bg-white/[0.08] px-4 text-sm text-silver-200 outline-none placeholder:text-silver-600 focus:border-silver-300/65 focus:bg-white/[0.12]";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600";

type CustomerProfileFormProps = {
  userId: string;
  profile: CustomerProfileRow;
  email: string;
};

export function CustomerProfileForm({
  userId,
  profile,
  email,
}: CustomerProfileFormProps) {
  const [firstName, setFirstName] = useState(profile.first_name ?? "");
  const [lastName, setLastName] = useState(profile.last_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [address, setAddress] = useState(profile.default_address ?? "");
  const [city, setCity] = useState(profile.default_city ?? "");
  const [postcode, setPostcode] = useState(profile.default_postcode ?? "");
  const [country, setCountry] = useState(profile.default_country ?? "Svizzera");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const input: CustomerProfileUpdate = {
      firstName,
      lastName,
      phone,
      defaultAddress: address,
      defaultCity: city,
      defaultPostcode: postcode,
      defaultCountry: country,
    };

    const res = await updateCustomerProfile(userId, input);
    setSaving(false);
    setFeedback(res.ok ? "Profilo aggiornato." : res.error ?? "Errore salvataggio.");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {feedback && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.includes("Errore")
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {feedback}
        </p>
      )}

      <div>
        <label className={labelClass}>Email</label>
        <input type="email" value={email} disabled className={`${inputClass} opacity-60`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nome</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cognome</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Telefono</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Indirizzo predefinito</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>CAP</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Città</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Paese</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300 disabled:opacity-50"
      >
        {saving ? "Salvataggio…" : "Salva profilo"}
      </button>
    </form>
  );
}
