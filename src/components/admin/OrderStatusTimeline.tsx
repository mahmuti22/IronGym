import type { AdminOrder, OrderStatus } from "@/lib/orders/types";
import { ORDER_STATUSES, orderStatusLabels } from "@/lib/orders/types";
import { adminCaptionClass, adminMutedTextClass } from "./admin-ui";

const FLOW_STATUSES: OrderStatus[] = ORDER_STATUSES.filter(
  (s) => s !== "cancelled"
);

function stepReached(current: OrderStatus, step: OrderStatus): boolean {
  if (current === "cancelled") return false;
  return FLOW_STATUSES.indexOf(current) >= FLOW_STATUSES.indexOf(step);
}

function formatTs(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("it-CH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function timestampForStep(order: AdminOrder, step: OrderStatus): string | null {
  switch (step) {
    case "new":
      return order.createdAt;
    case "shipped":
      return order.shippedAt;
    case "completed":
      return order.completedAt;
    default:
      return null;
  }
}

type StepVisual = "pending" | "done" | "active";

function stepVisual(active: boolean, done: boolean): StepVisual {
  if (active) return "active";
  if (done) return "done";
  return "pending";
}

/** Box border/background per step — active uses step-specific accent, not global amber. */
function stepBoxClass(step: OrderStatus, visual: StepVisual): string {
  if (visual === "pending") {
    return "border-white/10 bg-white/[0.03]";
  }
  if (visual === "done") {
    return "border-emerald-400/20 bg-emerald-500/5";
  }
  switch (step) {
    case "new":
      return "border-amber-400/40 bg-amber-500/10";
    case "processing":
      return "border-sky-400/40 bg-sky-500/10";
    case "shipped":
      return "border-teal-400/40 bg-teal-500/10";
    case "completed":
      return "border-emerald-400/50 bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.12)]";
    default:
      return "border-emerald-400/20 bg-emerald-500/5";
  }
}

function stepDotClass(step: OrderStatus, visual: StepVisual): string {
  if (visual === "pending") {
    return "bg-white/5 text-zinc-500";
  }
  if (visual === "done") {
    return "bg-emerald-500/20 text-emerald-200";
  }
  switch (step) {
    case "new":
      return "bg-amber-500/25 text-amber-100";
    case "processing":
      return "bg-sky-500/25 text-sky-100";
    case "shipped":
      return "bg-teal-500/25 text-teal-100";
    case "completed":
      return "bg-emerald-500/35 text-emerald-50 ring-2 ring-emerald-400/30";
    default:
      return "bg-emerald-500/20 text-emerald-200";
  }
}

function stepLabelClass(step: OrderStatus, visual: StepVisual): string {
  if (visual === "pending") return adminMutedTextClass;
  if (visual === "done") return "text-zinc-200";
  switch (step) {
    case "new":
      return "text-amber-100";
    case "processing":
      return "text-sky-100";
    case "shipped":
      return "text-teal-100";
    case "completed":
      return "text-emerald-100";
    default:
      return "text-zinc-200";
  }
}

type OrderStatusTimelineProps = {
  order: AdminOrder;
};

export function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
        <p className="text-sm font-semibold text-red-200">Ordine annullato</p>
        {order.cancelledAt && (
          <p className={`mt-1 ${adminCaptionClass}`}>
            {formatTs(order.cancelledAt)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {FLOW_STATUSES.map((step) => {
        const done = stepReached(order.status, step);
        const active = order.status === step;
        const visual = stepVisual(active, done);
        const ts = timestampForStep(order, step);
        const showCheck = visual === "done" || (visual === "active" && step === "completed");

        return (
          <div
            key={step}
            className={`rounded-xl border p-4 ${stepBoxClass(step, visual)}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stepDotClass(step, visual)}`}
              >
                {showCheck ? "✓" : "·"}
              </span>
              <p className={`text-sm font-semibold ${stepLabelClass(step, visual)}`}>
                {orderStatusLabels[step]}
              </p>
            </div>
            {ts && done && (
              <p className={`mt-2 pl-9 ${adminCaptionClass}`}>{formatTs(ts)}</p>
            )}
            {active && step === "processing" && !ts && (
              <p className={`mt-2 pl-9 ${adminCaptionClass}`}>In corso</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
