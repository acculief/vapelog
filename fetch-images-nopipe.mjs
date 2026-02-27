import { appendFileSync, writeFileSync } from 'fs';

// Ignore EPIPE/SIGPIPE - happens when stdout pipe closes
process.stdout.on('error', () => {});
process.stderr.on('error', () => {});
process.on('SIGPIPE', () => {});

const LOG = '/tmp/nopipe-images.log';
const log = (msg) => {
  const line = `${new Date().toISOString()} ${msg}\n`;
  try { appendFileSync(LOG, line); } catch(e) {}
  try { process.stdout.write(line); } catch(e) {}
};

writeFileSync(LOG, '');
log('Script started');

const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';
const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo';

const prodsRes = await fetch(`${SUPABASE_URL}/rest/v1/Product?select=id,name,brand&imageUrl=is.null&limit=100`, {
  headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY }
});
const prods = await prodsRes.json();
log(`Got ${prods.length} products`);

let ok = 0;
for (let i = 0; i < prods.length; i++) {
  const p = prods[i];
  log(`[${i+1}/${prods.length}] ${p.brand} ${p.name}`);
  
  try {
    const r = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${p.brand} ${p.name} vape`, gl: 'jp', num: 2 }),
    });
    if (r.ok) {
      const d = await r.json();
      const url = (d.images||[])[0]?.imageUrl;
      if (url && url.startsWith('http')) {
        await fetch(`${SUPABASE_URL}/rest/v1/Product?id=eq.${p.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY,
            'Content-Type': 'application/json', 'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ imageUrl: url, imageUrls: [url] })
        });
        log(`  -> OK: ${url.substring(0, 60)}`);
        ok++;
      } else { log(`  -> No image`); }
    } else { log(`  -> Serper ${r.status}`); }
  } catch(e) { log(`  -> Error: ${e.message}`); }
  
  await new Promise(r => setTimeout(r, 1500));
}

log(`COMPLETE: ${ok}/${prods.length} updated`);
