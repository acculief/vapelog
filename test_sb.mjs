import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://cuinyjpiifcslzexrunc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo");
console.log("Testing Supabase...");
try {
  const { count, error } = await sb.from("Product").select("*", { count: "exact", head: true });
  if (error) console.error("SB Error:", error.message);
  else console.log("SB OK count=", count);
} catch(e) { console.error("SB THROW:", e.message); }

console.log("Testing fetch...");
try {
  const res = await fetch("https://vapelog.jp/archives/1000", { signal: AbortSignal.timeout(10000) });
  console.log("Fetch status:", res.status);
  const html = await res.text();
  console.log("HTML length:", html.length, "has item-detail:", html.includes("item-detail"));
} catch(e) { console.error("FETCH THROW:", e.message); }
console.log("Done");
