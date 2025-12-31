import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createTransactionSchema = z.object({
  account_id: z.string().uuid(),
  category_id: z.string().uuid().optional().nullable(),
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.number().positive(),
  description: z.string().optional().nullable(),
  date: z.string().datetime().optional(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  transfer_to_account_id: z.string().uuid().optional().nullable(),
  source: z.enum(["manual", "whatsapp", "import", "recurring", "api"]).optional(),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const type = searchParams.get("type");
  const categoryId = searchParams.get("category_id");
  const accountId = searchParams.get("account_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  let query = supabase
    .from("transactions")
    .select(`
      *,
      account:accounts(id, name, color),
      category:categories(id, name, icon, color)
    `, { count: "exact" })
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) {
    query = query.eq("type", type);
  }
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  if (accountId) {
    query = query.eq("account_id", accountId);
  }
  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      total: count,
      limit,
      offset,
      hasMore: (count || 0) > offset + limit,
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createTransactionSchema.parse(body);

    // 1. Insert the transaction
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        ...validated,
        date: validated.date || new Date().toISOString(),
        source: validated.source || "api",
      })
      .select(`
        *,
        account:accounts(id, name, color, balance),
        category:categories(id, name, icon, color)
      `)
      .single();

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    // 2. Update account balance
    const currentBalance = Number(transaction.account?.balance || 0);
    const amount = Number(validated.amount);

    let newBalance: number;
    if (validated.type === "income") {
      newBalance = currentBalance + amount;
    } else if (validated.type === "expense") {
      newBalance = currentBalance - amount;
    } else if (validated.type === "transfer" && validated.transfer_to_account_id) {
      // For transfers: deduct from source account
      newBalance = currentBalance - amount;

      // Add to destination account
      const { data: destAccount } = await supabase
        .from("accounts")
        .select("balance")
        .eq("id", validated.transfer_to_account_id)
        .single();

      if (destAccount) {
        await supabase
          .from("accounts")
          .update({
            balance: Number(destAccount.balance) + amount,
            updated_at: new Date().toISOString()
          })
          .eq("id", validated.transfer_to_account_id);
      }
    } else {
      newBalance = currentBalance;
    }

    // Update source account balance
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq("id", validated.account_id);

    if (updateError) {
      console.error("Failed to update account balance:", updateError);
    }

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
