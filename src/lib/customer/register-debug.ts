/** Dev-only logging for customer registration troubleshooting. */
export function logCustomerRegisterDebug(
  label: string,
  payload?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV !== "development") return;
  console.log(`[IronGym Customer Register] ${label}`, payload ?? "");
}
