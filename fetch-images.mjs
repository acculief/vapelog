const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';
const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

async function searchImages(query, num = 3) {
  try {
    const res = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query + ' 電子タバコ', gl: 'jp', num }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.log(`  Serper error: ${res.status} ${txt.substring(0, 100)}`);
      return [];
    }
    const data = await res.json();
    return (data.images || []).map(img => img.imageUrl).filter(url => url && (url.startsWith('http')));
  } catch (err) {
    console.log(`  Search error: ${err.message}`);
    return [];
  }
}

async function getProductsWithoutImages() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/Product?select=id,name,brand,category&imageUrl=is.null&limit=100`, {
    headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY }
  });
  return await res.json();
}

async function updateProductImage(id, imageUrl, imageUrls) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Product?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ imageUrl, imageUrls })
    });
    if (!res.ok) {
      const txt = await res.text();
      console.log(`  DB error: ${res.status} ${txt.substring(0, 80)}`);
    }
  } catch (err) {
    console.log(`  DB update error: ${err.message}`);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const products = await getProductsWithoutImages();
  console.log(`Processing ${products.length} products without images...`);
  
  let updated = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const query = `${product.brand} ${product.name}`;
    process.stdout.write(`[${i+1}/${products.length}] ${query}... `);
    
    let imgs = [];
    // Try up to 2 times
    for (let attempt = 0; attempt < 2; attempt++) {
      imgs = await searchImages(query, 3);
      if (imgs.length > 0) break;
      if (attempt < 1) await sleep(1000);
    }
    
    if (imgs.length > 0) {
      await updateProductImage(product.id, imgs[0], imgs);
      console.log(`OK`);
      updated++;
    } else {
      console.log(`SKIP`);
    }
    
    // Rate limit: 1s between requests
    await sleep(1000);
  }
  
  console.log(`\nDone! Updated ${updated}/${products.length} products`);
  return updated;
}

main().then(n => {
  console.log(`Finished. ${n} products updated.`);
  process.exit(0);
}).catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
