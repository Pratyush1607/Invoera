import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req: Request) => {
  const expectedSecret = Deno.env.get("NOTIFICATION_WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-webhook-secret");

  if (!expectedSecret || !providedSecret || !timingSafeEqual(providedSecret, expectedSecret)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const frankfurterResponse = await fetch("https://api.frankfurter.dev/v1/latest?base=USD");

  if (!frankfurterResponse.ok) {
    const errorText = await frankfurterResponse.text();
    return new Response(JSON.stringify({ error: `Frankfurter error: ${errorText}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await frankfurterResponse.json();

  if (!data || typeof data !== "object" || !data.rates || !data.rates.EUR || !data.date) {
    return new Response(
      JSON.stringify({ error: "Frankfurter response missing expected fields; not caching it." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const rates = { ...data.rates, USD: 1 };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase.from("exchange_rates").upsert({
    id: 1,
    rates,
    rates_as_of: data.date,
    fetched_at: new Date().toISOString(),
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, ratesAsOf: data.date }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
