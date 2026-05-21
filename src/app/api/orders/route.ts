import { NextResponse } from "next/server";
import { createOrderFromCheckout } from "@/lib/orders/create-order";
import { validateCreateOrderRequest } from "@/lib/orders/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateCreateOrderRequest(body);

    if (!parsed.ok) {
      return NextResponse.json(
        { ok: false, error: parsed.error },
        { status: 400 }
      );
    }

    const result = await createOrderFromCheckout(parsed.data);

    if (!result.ok) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Non autorizzato." },
    { status: 403 }
  );
}
