import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["checking", "savings", "credit", "cash", "investment"]),
  balance: z.number().default(0),
  currency: z.string().default("COP"),
  color: z.string().default("#3B82F6"),
  icon: z.string().default("🏦"),
  include_in_total: z.boolean().default(true),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createAccountSchema.parse(body);

    const { data, error } = await (supabase
      .from("accounts") as any)
      .insert({
        user_id: user.id,
        name: validated.name,
        type: validated.type,
        balance: validated.balance,
        currency: validated.currency,
        color: validated.color,
        icon: validated.icon,
        include_in_total: validated.include_in_total,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
