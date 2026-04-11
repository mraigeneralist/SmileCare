import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("services")
    .select("*")
    .order("sort_order");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ services: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, duration_minutes, price } = body;

  if (!name || !duration_minutes || !price) {
    return Response.json({ error: "name, duration, and price are required" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("services")
    .insert({
      name,
      description: description || "",
      duration_minutes,
      price,
      is_active: true,
      sort_order: 0,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ service: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("services")
    .update(updates)
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("services").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
