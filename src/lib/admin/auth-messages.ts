export type AdminAuthErrorCode =
  | "session_required"
  | "access_denied"
  | "invalid_credentials"
  | "supabase_not_configured";

export function getAdminAuthErrorMessage(
  code: string | null | undefined
): string {
  switch (code) {
    case "session_required":
      return "Devi effettuare il login per accedere al pannello admin.";
    case "access_denied":
      return "Accesso negato. Il tuo account non è autorizzato come admin.";
    case "invalid_credentials":
      return "Email o password non corretti.";
    case "supabase_not_configured":
      return "Supabase non è configurato. Aggiungi le variabili ambiente in .env.local.";
    default:
      return "";
  }
}
