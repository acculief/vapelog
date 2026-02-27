const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';
const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo';

async function searchImages(query) {
  const res = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query + ' 電子タバコ', gl: 'jp', num: 3 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.images || []).map(img => img.imageUrl).filter(url => url && url.startsWith('http'));
}

const products = await (async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/Product?select=id,name,brand&imageUrl=is.null&limit=100`, {
    headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY }
  });
  return await res.json();
})();

console.log(`${products.length} products to process`);

let updated = 0;
for (let i = 0; i < products.length; i++) {
  const p = products[i];
  const query = `${p.brand} ${p.name}`;
  process.stdout.write(`[${i+1}/${products.length}] ${query}... `);
  
  try {
    const imgs = await searchImages(query);
    if (imgs.length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/Product?id=eq.${p.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ imageUrl: imgs[0], imageUrls: imgs })
      });
      console.log(`OK`);
      updated++;
    } else {
      console.log(`SKIP`);
    }
  } catch(e) {
    console.log(`ERR: ${e.message}`);
  }
  
  await new Promise(r => setTimeout(r, 2000)); // 2 second delay
}

console.log(`\nDone: ${updated}/${products.length} updated`);
