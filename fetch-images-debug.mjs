import { writeFileSync, appendFileSync } from 'fs';

const LOG = '/tmp/debug-images.log';
const log = (msg) => {
  const line = `${new Date().toISOString()} ${msg}\n`;
  appendFileSync(LOG, line);
  process.stdout.write(line);
};

process.on('SIGTERM', () => { log('SIGTERM received'); process.exit(0); });
process.on('SIGPIPE', () => { log('SIGPIPE received'); });
process.on('exit', (code) => { appendFileSync(LOG, `EXIT ${code}\n`); });
process.on('uncaughtException', (err) => { log(`uncaughtException: ${err.message}\n${err.stack}`); process.exit(1); });
process.on('unhandledRejection', (reason) => { log(`unhandledRejection: ${reason}`); process.exit(1); });

const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';
const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo';

writeFileSync(LOG, `Started at ${new Date().toISOString()}\n`);
log('Fetching products...');

const prodsRes = await fetch(`${SUPABASE_URL}/rest/v1/Product?select=id,name,brand&imageUrl=is.null&limit=100`, {
  headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY }
});
const prods = await prodsRes.json();
log(`Got ${prods.length} products`);

for (let i = 0; i < prods.length; i++) {
  const p = prods[i];
  log(`[${i+1}/${prods.length}] Processing: ${p.brand} ${p.name}`);
  
  try {
    log(`  Calling Serper...`);
    const r = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${p.brand} ${p.name} vape`, gl: 'jp', num: 2 }),
    });
    log(`  Serper status: ${r.status}`);
    if (r.ok) {
      const d = await r.json();
      const url = (d.images||[])[0]?.imageUrl;
      if (url) {
        log(`  Image: ${url.substring(0, 60)}`);
        log(`  Updating DB...`);
        const ur = await fetch(`${SUPABASE_URL}/rest/v1/Product?id=eq.${p.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY,
            'Content-Type': 'application/json', 'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ imageUrl: url, imageUrls: [url] })
        });
        log(`  DB status: ${ur.status}`);
      }
    } else {
      const txt = await r.text();
      log(`  Serper error body: ${txt.substring(0, 100)}`);
    }
  } catch(e) {
    log(`  Exception: ${e.name}: ${e.message}`);
    log(`  Stack: ${e.stack}`);
  }
  
  log(`  Sleeping 2s...`);
  await new Promise(r => setTimeout(r, 2000));
  log(`  Done sleeping`);
}

log(`All done!`);
