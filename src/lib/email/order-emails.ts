import {
  getResendClient,
  getResendFromAddress,
  getSiteBaseUrl,
  hasAdminOrderEmails,
  isResendConfigured,
  parseAdminOrderEmails,
} from "./resend";

export type OrderEmailItem = {
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderEmailOrder = {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingCountry: string;
  customerNotes: string | null;
  subtotal: number;
  total: number;
  currency: string;
};

function formatChf(amount: number, currency = "CHF"): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatVariant(size: string, color: string): string {
  const parts: string[] = [];
  if (size && size !== "—") parts.push(`Taglia ${size}`);
  if (color && color !== "—") parts.push(color);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function buildItemsHtml(items: OrderEmailItem[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#e8e8e8;font-size:14px;">
          <strong style="color:#ffffff;">${escapeHtml(item.name)}</strong><br/>
          <span style="color:#9ca3af;font-size:12px;">${escapeHtml(formatVariant(item.size, item.color))}</span>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #2a2a2a;color:#9ca3af;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#e8e8e8;font-size:14px;text-align:right;white-space:nowrap;">${formatChf(item.lineTotal)}</td>
      </tr>`
    )
    .join("");
}

function buildItemsText(items: OrderEmailItem[]): string {
  return items
    .map(
      (item) =>
        `- ${item.name} (${formatVariant(item.size, item.color)}) x${item.quantity} — ${formatChf(item.unitPrice)} cad. — ${formatChf(item.lineTotal)}`
    )
    .join("\n");
}

function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#141414;border:1px solid #2a2a2a;border-radius:12px;">
          <tr>
            <td style="padding:28px 28px 8px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.12em;color:#c9a227;">IRONGYM</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;border-top:1px solid #2a2a2a;text-align:center;">
              <p style="margin:0;font-size:11px;color:#6b7280;">© IronGym — Premium fitness wear</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(
  order: OrderEmailOrder,
  items: OrderEmailItem[]
): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const customerName = `${order.customerFirstName} ${order.customerLastName}`;
  const subject = `Conferma ordine IronGym ${order.orderNumber}`;

  const shippingBlock = `
    <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">Indirizzo di spedizione</p>
    <p style="margin:0;font-size:14px;color:#e8e8e8;line-height:1.5;">
      ${escapeHtml(order.shippingAddress)}<br/>
      ${escapeHtml(order.shippingPostcode)} ${escapeHtml(order.shippingCity)}<br/>
      ${escapeHtml(order.shippingCountry)}
    </p>`;

  const html = emailShell(
    subject,
    `
    <h1 style="margin:0 0 8px;font-size:20px;color:#ffffff;">Grazie per il tuo ordine</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#9ca3af;line-height:1.5;">
      Ciao ${escapeHtml(order.customerFirstName)}, abbiamo ricevuto il tuo ordine.
    </p>
    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">Numero ordine</p>
    <p style="margin:0 0 24px;font-size:18px;font-weight:600;font-family:monospace;color:#c9a227;">${escapeHtml(order.orderNumber)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <thead>
        <tr>
          <th style="padding:0 0 8px;font-size:11px;color:#6b7280;text-align:left;font-weight:600;text-transform:uppercase;">Prodotto</th>
          <th style="padding:0 8px 8px;font-size:11px;color:#6b7280;text-align:center;font-weight:600;">Qtà</th>
          <th style="padding:0 0 8px;font-size:11px;color:#6b7280;text-align:right;font-weight:600;">Totale</th>
        </tr>
      </thead>
      <tbody>${buildItemsHtml(items)}</tbody>
    </table>
    <p style="margin:16px 0 24px;font-size:16px;font-weight:600;color:#ffffff;text-align:right;">
      Totale: <span style="color:#c9a227;">${formatChf(order.total, order.currency)}</span>
    </p>
    ${shippingBlock}
    <p style="margin:24px 0 0;padding:16px;background-color:#1a1a1a;border-radius:8px;font-size:13px;color:#d1d5db;line-height:1.5;border-left:3px solid #c9a227;">
      Il pagamento online non è ancora attivo. Ti contatteremo per completare l'ordine.
    </p>`
  );

  const text = `IronGym — Conferma ordine

Grazie per il tuo ordine, ${customerName}!

Numero ordine: ${order.orderNumber}

Articoli:
${buildItemsText(items)}

Totale: ${formatChf(order.total, order.currency)}

Spedizione:
${order.shippingAddress}
${order.shippingPostcode} ${order.shippingCity}
${order.shippingCountry}

Il pagamento online non è ancora attivo. Ti contatteremo per completare l'ordine.`;

  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: order.customerEmail,
    subject,
    html,
    text,
  });

  if (error) throw new Error(error.message);
}

export async function sendAdminOrderNotificationEmail(
  order: OrderEmailOrder,
  items: OrderEmailItem[]
): Promise<void> {
  const resend = getResendClient();
  const adminEmails = parseAdminOrderEmails();
  if (!resend || adminEmails.length === 0) return;

  const adminUrl = `${getSiteBaseUrl()}/admin/orders/${order.id}`;
  const customerName = `${order.customerFirstName} ${order.customerLastName}`;
  const subject = `Nuovo ordine IronGym ${order.orderNumber}`;

  const notesBlock = order.customerNotes
    ? `<p style="margin:12px 0 0;font-size:14px;color:#e8e8e8;"><strong style="color:#9ca3af;">Note:</strong> ${escapeHtml(order.customerNotes)}</p>`
    : "";

  const html = emailShell(
    subject,
    `
    <h1 style="margin:0 0 8px;font-size:20px;color:#ffffff;">Nuovo ordine ricevuto</h1>
    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;">Numero ordine</p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:600;font-family:monospace;color:#c9a227;">${escapeHtml(order.orderNumber)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;font-size:14px;">
      <tr><td style="padding:4px 0;color:#6b7280;width:100px;">Cliente</td><td style="color:#e8e8e8;">${escapeHtml(customerName)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="color:#e8e8e8;"><a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#c9a227;">${escapeHtml(order.customerEmail)}</a></td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Telefono</td><td style="color:#e8e8e8;">${escapeHtml(order.customerPhone || "—")}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;vertical-align:top;">Indirizzo</td><td style="color:#e8e8e8;line-height:1.5;">
        ${escapeHtml(order.shippingAddress)}<br/>
        ${escapeHtml(order.shippingPostcode)} ${escapeHtml(order.shippingCity)}<br/>
        ${escapeHtml(order.shippingCountry)}
      </td></tr>
    </table>
    ${notesBlock}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 16px;">
      <thead>
        <tr>
          <th style="padding:0 0 8px;font-size:11px;color:#6b7280;text-align:left;">Prodotto</th>
          <th style="padding:0 8px 8px;font-size:11px;color:#6b7280;text-align:center;">Qtà</th>
          <th style="padding:0 0 8px;font-size:11px;color:#6b7280;text-align:right;">Totale</th>
        </tr>
      </thead>
      <tbody>${buildItemsHtml(items)}</tbody>
    </table>
    <p style="margin:0 0 24px;font-size:16px;font-weight:600;color:#ffffff;text-align:right;">
      Totale: <span style="color:#c9a227;">${formatChf(order.total, order.currency)}</span>
    </p>
    <p style="margin:0;text-align:center;">
      <a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:12px 24px;background-color:#c9a227;color:#0a0a0a;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
        Apri ordine in admin
      </a>
    </p>`
  );

  const text = `IronGym — Nuovo ordine

Numero ordine: ${order.orderNumber}

Cliente: ${customerName}
Email: ${order.customerEmail}
Telefono: ${order.customerPhone || "—"}

Indirizzo:
${order.shippingAddress}
${order.shippingPostcode} ${order.shippingCity}
${order.shippingCountry}
${order.customerNotes ? `\nNote: ${order.customerNotes}` : ""}

Articoli:
${buildItemsText(items)}

Totale: ${formatChf(order.total, order.currency)}

Admin: ${adminUrl}`;

  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: adminEmails,
    subject,
    html,
    text,
  });

  if (error) throw new Error(error.message);
}

/** Send customer + admin emails after order creation. Never throws to caller. */
export async function sendOrderCreatedEmails(
  order: OrderEmailOrder,
  items: OrderEmailItem[]
): Promise<void> {
  if (!isResendConfigured()) {
    console.warn(
      "[IronGym] Order emails skipped: RESEND_API_KEY not configured."
    );
    return;
  }

  const emailTasks: Promise<void>[] = [
    sendOrderConfirmationEmail(order, items),
  ];

  if (hasAdminOrderEmails()) {
    emailTasks.push(sendAdminOrderNotificationEmail(order, items));
  } else {
    console.warn(
      "[IronGym] Admin order notification skipped: no valid ADMIN_ORDER_EMAIL."
    );
  }

  const results = await Promise.allSettled(emailTasks);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[IronGym] Order email failed:", result.reason);
    }
  }
}
