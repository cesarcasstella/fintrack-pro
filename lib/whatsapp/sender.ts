/**
 * WhatsApp Message Sender via Twilio
 */

export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    console.error("Twilio credentials not configured");
    return false;
  }

  // Ensure phone number has whatsapp: prefix
  const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          To: toNumber,
          From: fromNumber,
          Body: body,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Twilio error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return false;
  }
}

/**
 * Send a template message (for notifications)
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateSid: string,
  variables?: Record<string, string>
): Promise<boolean> {
  // Template messages require approval from Twilio/WhatsApp
  // This is a placeholder for future implementation
  console.log("Template messages not yet implemented", { to, templateSid, variables });
  return false;
}
