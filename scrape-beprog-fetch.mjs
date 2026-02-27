import fs from 'fs';

// ベプログのShopify JSON API (公開エンドポイント)
const CATEGORIES = [
  { slug: 'disposable', name: '使い捨て', url: 'https://www.beprog.com/collections/disposable-vape/products.json?limit=30' },
  { slug: 'pod', name: 'ポッド型', url: 'https://www.beprog.com/collections/pod-vape/products.json?limit=30' },
  { slug: 'boxmod', name: 'BOX MOD', url: 'https://www.beprog.com/collections/box-mod/products.json?limit=30' },
  { slug: 'liquid', name: 'リキッド', url: 'https://www.beprog.com/collections/e-liquid/products.json?limit=30' },
  { slug: 'starter', name: 'スターターキット', url: 'https://www.beprog.com/collections/starter-kit/products.json?limit=30' },
];

async function scrape() {
  const allProducts = [];

  for (const cat of CATEGORIES) {
    try {
      console.log(`Scraping ${cat.name}... (${cat.url})`);
      const res = await fetch(cat.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(15000),
      });
      
      if (!res.ok) {
        console.log(`  HTTP ${res.status} - skipping`);
        continue;
      }
      
      const data = await res.json();
      const products = (data.products || []).slice(0, 20).map(p => ({
        name: p.title,
        price: p.variants?.[0]?.price,
        imageUrl: p.images?.[0]?.src,
        handle: p.handle,
        category: cat.slug,
        categoryName: cat.name,
        description: p.body_html?.replace(/<[^>]*>/g, '').substring(0, 200),
        brand: p.vendor,
      }));
      
      allProducts.push(...products);
      console.log(`  Found ${products.length} products`);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
    
    // 少し待機
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync('/tmp/beprog-products.json', JSON.stringify(allProducts, null, 2));
  console.log(`\nTotal: ${allProducts.length} products saved to /tmp/beprog-products.json`);
  
  if (allProducts.length > 0) {
    console.log('\nSample:');
    allProducts.slice(0, 5).forEach(p => console.log(`  [${p.category}] ${p.name} - ¥${p.price}`));
  }
  
  return allProducts;
}

scrape().catch(console.error);
