const messages: Record<string, string> = {
  session_required: "Accedi per continuare.",
  access_denied: "Accesso non consentito.",
  invalid_credentials: "Email o password non validi.",
  supabase_not_configured: "Servizio account non disponibile.",
  email_taken: "Questa email è già registrata.",
  weak_password: "La password deve avere almeno 6 caratteri.",
  confirm_mismatch: "Le password non coincidono.",
  profile_missing: "Profilo cliente non trovato. Registrati di nuovo.",
  email_confirm:
    "Controlla la tua email per confermare l'account. Controlla anche Spam.",
  email_rate_limit:
    "Hai richiesto troppe email di conferma in poco tempo. Attendi qualche minuto e riprova.",
};

export function getCustomerAuthErrorMessage(code: string): string {
  return messages[code] ?? "Si è verificato un errore. Riprova.";
}

/** Maps Supabase signUp errors to user-facing Italian messages. */
export function getSignUpErrorMessage(error: {
  message?: string;
  code?: string;
}): string {
  const msg = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (
    code.includes("rate_limit") ||
    code === "over_email_send_rate_limit" ||
    msg.includes("rate limit") ||
    msg.includes("email rate limit")
  ) {
    return getCustomerAuthErrorMessage("email_rate_limit");
  }

  if (
    msg.includes("already") ||
    msg.includes("registered") ||
    code === "user_already_exists"
  ) {
    return getCustomerAuthErrorMessage("email_taken");
  }

  return error.message ?? getCustomerAuthErrorMessage("invalid_credentials");
}
