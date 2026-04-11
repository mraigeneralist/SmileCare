import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ settings: data });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { clinic_name, clinic_phone, clinic_address, dentist_whatsapp } = body;

  const { error } = await supabaseServer
    .from("settings")
    .upsert({
      id: 1,
      clinic_name,
      clinic_phone,
      clinic_address,
      dentist_whatsapp,
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
