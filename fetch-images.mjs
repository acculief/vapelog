const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';
const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo';

async function searchImages(query, num = 5) {
  try {
    const res = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query + ' 電子タバコ VAPE', gl: 'jp', num })
    });
    const data = await res.json();
    const images = data.images || [];
    return images.map(img => img.imageUrl).filter(Boolean);
  } catch (err) {
    console.error(`  Search error: ${err.message}`);
    return [];
  }
}

async function getProducts() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/Product?select=id,name,brand,category&imageUrl=is.null&limit=80`, {
    headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY }
  });
  return await res.json();
}

async function updateProductImage(id, imageUrl, imageUrls) {
  await fetch(`${SUPABASE_URL}/rest/v1/Product?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ imageUrl, imageUrls })
  });
}

async function main() {
  const products = await getProducts();
  console.log(`Processing ${products.length} products without images...`);
  
  let updated = 0;
  
  for (const product of products) {
    const query = `${product.brand} ${product.name}`;
    process.stdout.write(`Searching: ${query}... `);
    
    const imgs = await searchImages(query, 5);
    
    if (imgs.length > 0) {
      await updateProductImage(product.id, imgs[0], imgs.slice(0, 3));
      console.log(`✓ ${imgs[0].substring(0, 60)}`);
      updated++;
    } else {
      console.log('✗ no images found');
    }
    
    await new Promise(r => setTimeout(r, 400));
  }
  
  console.log(`\nDone! Updated ${updated}/${products.length} products`);
}

main().catch(console.error);
