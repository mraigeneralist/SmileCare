import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const [availRes, blockedRes] = await Promise.all([
    supabaseServer.from("availability").select("*").order("day_of_week"),
    supabaseServer.from("blocked_dates").select("*").order("date"),
  ]);

  return Response.json({
    availability: availRes.data || [],
    blockedDates: blockedRes.data || [],
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type === "blocked_date") {
    const { date, reason } = body;
    const { error } = await supabaseServer
      .from("blocked_dates")
      .insert({ date, reason: reason || null });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ success: true });
  }

  const { day_of_week, start_time, end_time, slot_duration_minutes } = body;

  if (day_of_week === undefined || !start_time || !end_time) {
    return Response.json({ error: "day_of_week, start_time, and end_time are required" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("availability").insert({
    day_of_week,
    start_time,
    end_time,
    slot_duration_minutes: slot_duration_minutes || 30,
    is_active: true,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("availability")
    .update(updates)
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id, type } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const table = type === "blocked_date" ? "blocked_dates" : "availability";
  const { error } = await supabaseServer.from(table).delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
