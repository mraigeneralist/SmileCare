import { supabaseServer } from "@/lib/supabase-server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");

  let query = supabaseServer
    .from("appointments")
    .select("*, service:services(name)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (dateFrom) {
    query = query.gte("appointment_date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("appointment_date", dateTo);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ appointments: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return Response.json({ error: "id and status required" }, { status: 400 });
  }

  const validStatuses = ["confirmed", "cancelled", "completed", "no_show"];
  if (!validStatuses.includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
