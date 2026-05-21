"use client";

import type { CheckoutFormData, CheckoutFormErrors } from "@/lib/checkout/types";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-500";
const inputClass =
  "w-full rounded-xl border border-silver-500/35 bg-white/[0.06] px-4 py-2.5 text-sm text-silver-100 outline-none transition placeholder:text-silver-600 focus:border-silver-400/55 focus:bg-white/[0.08] focus:ring-2 focus:ring-white/10";
const errorClass = "mt-1 text-xs text-red-300";

type CheckoutFormProps = {
  form: CheckoutFormData;
  errors: CheckoutFormErrors;
  disabled?: boolean;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onSubmit: () => void;
};

export function CheckoutForm({
  form,
  errors,
  disabled,
  onChange,
  onSubmit,
}: CheckoutFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-silver-500/20 bg-white/[0.03] p-6 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-silver-100">
        Dati di spedizione
      </h2>
      <p className="mt-1 text-sm text-silver-500">
        Compila i campi per completare l&apos;ordine (checkout demo, senza
        pagamento).
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="firstName">
            Nome *
          </label>
          <input
            id="firstName"
            required
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className={inputClass}
            autoComplete="given-name"
          />
          {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">
            Cognome *
          </label>
          <input
            id="lastName"
            required
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className={inputClass}
            autoComplete="family-name"
          />
          {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="phone">
            Telefono
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass}
            autoComplete="tel"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="address">
            Indirizzo *
          </label>
          <input
            id="address"
            required
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
            className={inputClass}
            autoComplete="street-address"
          />
          {errors.address && <p className={errorClass}>{errors.address}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="city">
            Città *
          </label>
          <input
            id="city"
            required
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            className={inputClass}
            autoComplete="address-level2"
          />
          {errors.city && <p className={errorClass}>{errors.city}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="postcode">
            CAP *
          </label>
          <input
            id="postcode"
            required
            value={form.postcode}
            onChange={(e) => onChange("postcode", e.target.value)}
            className={inputClass}
            autoComplete="postal-code"
          />
          {errors.postcode && <p className={errorClass}>{errors.postcode}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="country">
            Paese *
          </label>
          <input
            id="country"
            required
            value={form.country}
            onChange={(e) => onChange("country", e.target.value)}
            className={inputClass}
            autoComplete="country-name"
          />
          {errors.country && <p className={errorClass}>{errors.country}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="notes">
            Note ordine (opzionale)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className={inputClass}
            placeholder="Istruzioni per la consegna, orari, ecc."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-8 flex w-full min-h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {disabled ? "Invio in corso…" : "Conferma ordine"}
      </button>
    </form>
  );
}
