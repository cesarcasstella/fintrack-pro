import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { parseWhatsAppMessage } from "@/lib/whatsapp/parser";
import { sendWhatsAppMessage } from "@/lib/whatsapp/sender";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const from = formData.get("From") as string; // whatsapp:+1234567890
    const body = formData.get("Body") as string;
    const messageSid = formData.get("MessageSid") as string;

    if (!from || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract phone number (remove whatsapp: prefix)
    const phoneNumber = from.replace("whatsapp:", "");

    const supabase = createAdminClient();

    // Find user by phone number
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, preferred_currency, whatsapp_enabled")
      .eq("phone_number", phoneNumber)
      .single();

    // Log the incoming message
    await supabase.from("whatsapp_messages").insert({
      user_id: profile?.id || null,
      direction: "inbound",
      phone_number: phoneNumber,
      message_sid: messageSid,
      message_body: body,
      status: "received",
    });

    // If user not found or WhatsApp not enabled
    if (!profile) {
      await sendWhatsAppMessage(
        phoneNumber,
        "👋 ¡Hola! No encontré tu cuenta. Regístrate en FinTrack Pro y vincula tu WhatsApp en configuración."
      );
      return NextResponse.json({ success: true });
    }

    if (!profile.whatsapp_enabled) {
      await sendWhatsAppMessage(
        phoneNumber,
        "⚠️ WhatsApp no está habilitado en tu cuenta. Actívalo en Configuración > WhatsApp."
      );
      return NextResponse.json({ success: true });
    }

    // Parse the message
    const parsed = await parseWhatsAppMessage(body);

    // Update message with parsed data
    await supabase
      .from("whatsapp_messages")
      .update({
        parsed_intent: parsed.intent,
        parsed_data: parsed.data,
        confidence_score: parsed.confidence,
        status: "parsed",
      })
      .eq("message_sid", messageSid);

    // Handle different intents
    switch (parsed.intent) {
      case "add_expense":
        if (parsed.data.amount) {
          await handleAddExpense(supabase, profile.id, parsed.data as { amount: number; description?: string; category?: string }, phoneNumber);
        }
        break;
      case "add_income":
        if (parsed.data.amount) {
          await handleAddIncome(supabase, profile.id, parsed.data as { amount: number; description?: string }, phoneNumber);
        }
        break;
      case "get_balance":
        await handleGetBalance(supabase, profile.id, phoneNumber);
        break;
      case "get_summary":
        await handleGetSummary(supabase, profile.id, phoneNumber);
        break;
      default:
        await sendWhatsAppMessage(
          phoneNumber,
          "🤔 No entendí tu mensaje. Prueba con:\n" +
          "• \"Almuerzo 25000\"\n" +
          "• \"Ingreso 1500000 salario\"\n" +
          "• \"Balance\"\n" +
          "• \"Resumen\""
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleAddExpense(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  data: { amount: number; description?: string; category?: string },
  phoneNumber: string
) {
  // Get default account
  const { data: account } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at")
    .limit(1)
    .single();

  if (!account) {
    await sendWhatsAppMessage(
      phoneNumber,
      "❌ No tienes cuentas configuradas. Crea una en la app primero."
    );
    return;
  }

  // Find category if mentioned
  let categoryId = null;
  if (data.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "expense")
      .ilike("name", `%${data.category}%`)
      .limit(1)
      .single();
    categoryId = category?.id;
  }

  // Create transaction
  await supabase.from("transactions").insert({
    user_id: userId,
    account_id: account.id,
    category_id: categoryId,
    type: "expense",
    amount: data.amount,
    description: data.description || null,
    source: "whatsapp",
  });

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(data.amount);

  await sendWhatsAppMessage(
    phoneNumber,
    `✅ Gasto registrado: ${formatted}${data.description ? ` - ${data.description}` : ""}`
  );
}

async function handleAddIncome(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  data: { amount: number; description?: string },
  phoneNumber: string
) {
  const { data: account } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at")
    .limit(1)
    .single();

  if (!account) {
    await sendWhatsAppMessage(
      phoneNumber,
      "❌ No tienes cuentas configuradas. Crea una en la app primero."
    );
    return;
  }

  await supabase.from("transactions").insert({
    user_id: userId,
    account_id: account.id,
    type: "income",
    amount: data.amount,
    description: data.description || null,
    source: "whatsapp",
  });

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(data.amount);

  await sendWhatsAppMessage(
    phoneNumber,
    `✅ Ingreso registrado: ${formatted}${data.description ? ` - ${data.description}` : ""}`
  );
}

async function handleGetBalance(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  phoneNumber: string
) {
  const { data: accounts } = await supabase
    .from("accounts")
    .select("name, balance, currency")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (!accounts || accounts.length === 0) {
    await sendWhatsAppMessage(phoneNumber, "No tienes cuentas configuradas.");
    return;
  }

  const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(total);

  let message = `💰 *Balance Total:* ${formatted}\n\n`;
  accounts.forEach((acc) => {
    const bal = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: acc.currency,
      minimumFractionDigits: 0,
    }).format(Number(acc.balance));
    message += `• ${acc.name}: ${bal}\n`;
  });

  await sendWhatsAppMessage(phoneNumber, message);
}

async function handleGetSummary(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  phoneNumber: string
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId)
    .gte("date", startOfMonth);

  const income = transactions
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const expenses = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const format = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(n);

  const monthName = now.toLocaleDateString("es-CO", { month: "long" });

  await sendWhatsAppMessage(
    phoneNumber,
    `📊 *Resumen de ${monthName}*\n\n` +
    `💚 Ingresos: ${format(income)}\n` +
    `❤️ Gastos: ${format(expenses)}\n` +
    `📈 Balance: ${format(income - expenses)}`
  );
}

// Twilio webhook verification (GET request)
export async function GET() {
  return NextResponse.json({ status: "WhatsApp webhook active" });
}
