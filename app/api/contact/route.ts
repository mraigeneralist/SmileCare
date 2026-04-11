import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, phone } = body;

  const { error } = await supabase
    .from("contact")
    .insert([{ name, phone }]);

  if (error) {
    console.error("Supabase error:", error);

    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}