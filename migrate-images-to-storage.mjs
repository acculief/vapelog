/**
 * VapeLog Product Images → Supabase Storage Migration
 * 木下 紬 作成
 * 
 * 処理:
 * 1. Product 全件取得
 * 2. 各商品の画像をfetch or Serper検索で取得
 * 3. Supabase Storage にアップロード (vapelog/<product_id>.jpg)
 * 4. Product.imageUrl を CDN URL に更新
 */

const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo';
const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';
const STORAGE_BUCKET = 'item-images';
const CDN_BASE = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'ja,en;q=0.9',
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getAllProducts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/Product?select=id,name,brand,imageUrl,category&order=id&limit=200`,
    { headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY } }
  );
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

async function checkStorageExists(path) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/info/${STORAGE_BUCKET}/${path}`,
    { headers: { 'Authorization': `Bearer ${SERVICE_KEY}` } }
  );
  return res.ok;
}

async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('image') && !ct.includes('jpeg') && !ct.includes('png') && !ct.includes('webp')) {
      // check if small body (likely HTML)
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 5000) return null; // probably HTML error page
      return buf;
    }
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

async function searchImageUrl(query) {
  try {
    const res = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query + ' 電子タバコ vape', gl: 'jp', num: 5 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const images = data.images || [];
    // Return first image that looks like a product image
    for (const img of images) {
      const url = img.imageUrl;
      if (url && url.startsWith('http') && !url.includes('logo') && !url.includes('icon')) {
        return url;
      }
    }
    return images[0]?.imageUrl || null;
  } catch {
    return null;
  }
}

async function uploadToStorage(path, buffer, mimeType = 'image/jpeg') {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true', // overwrite if exists (idempotent)
      },
      body: buffer,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text.substring(0, 100)}`);
  }
  return res.json();
}

async function updateProductImageUrl(id, imageUrl) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/Product?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ imageUrl }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DB update failed: ${res.status} ${text.substring(0, 100)}`);
  }
}

async function main() {
  console.log('=== VapeLog Product Images Migration ===\n');
  
  const products = await getAllProducts();
  console.log(`Total products: ${products.length}`);
  console.log(`NULL imageUrl: ${products.filter(p => !p.imageUrl).length}`);
  console.log(`Has imageUrl: ${products.filter(p => p.imageUrl).length}\n`);

  const stats = { skipped: 0, uploaded: 0, failed: 0, total: products.length };
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const storagePath = `vapelog/${product.id}.jpg`;
    const cdnUrl = `${CDN_BASE}/${storagePath}`;
    
    process.stdout.write(`[${i+1}/${products.length}] ${product.brand} ${product.name}... `);
    
    // すでにCDN URLに更新済みならスキップ
    if (product.imageUrl && product.imageUrl.startsWith(CDN_BASE)) {
      // さらにストレージに実際に存在するか確認
      const exists = await checkStorageExists(storagePath);
      if (exists) {
        console.log('SKIP (already CDN URL)');
        stats.skipped++;
        continue;
      }
    }
    
    // ストレージに既にアップロード済みか確認（冪等）
    const alreadyUploaded = await checkStorageExists(storagePath);
    if (alreadyUploaded) {
      // DBのURLだけ更新
      try {
        await updateProductImageUrl(product.id, cdnUrl);
        console.log('SKIP upload (exists) → DB updated');
        stats.skipped++;
      } catch (err) {
        console.log(`SKIP upload (exists) → DB update FAILED: ${err.message}`);
        stats.failed++;
      }
      continue;
    }
    
    // 画像バイナリを取得
    let buffer = null;
    let source = '';
    
    // 1. 既存URLからfetch試行
    if (product.imageUrl) {
      buffer = await fetchImageBuffer(product.imageUrl);
      if (buffer) source = 'original-url';
    }
    
    // 2. 失敗したらSerper検索
    if (!buffer) {
      const query = `${product.brand} ${product.name}`;
      process.stdout.write(`[searching "${query.substring(0, 30)}"]... `);
      const imgUrl = await searchImageUrl(query);
      if (imgUrl) {
        buffer = await fetchImageBuffer(imgUrl);
        if (buffer) source = `serper:${imgUrl.substring(0, 50)}`;
      }
      await sleep(1000); // Serper rate limit
    }
    
    if (!buffer || buffer.byteLength < 1000) {
      console.log('FAILED (no image found)');
      stats.failed++;
      continue;
    }
    
    // 3. Supabase Storage にアップロード
    try {
      // Content-Type を推測（WebP/PNGもjpgとして保存）
      await uploadToStorage(storagePath, buffer, 'image/jpeg');
      
      // 4. Product.imageUrl を CDN URL に更新
      await updateProductImageUrl(product.id, cdnUrl);
      
      console.log(`OK (${source}, ${Math.round(buffer.byteLength/1024)}KB)`);
      stats.uploaded++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      stats.failed++;
    }
    
    // レート制限回避: 1秒待機
    await sleep(1200);
  }
  
  console.log('\n=== Migration Complete ===');
  console.log(`Total:    ${stats.total}`);
  console.log(`Uploaded: ${stats.uploaded}`);
  console.log(`Skipped:  ${stats.skipped}`);
  console.log(`Failed:   ${stats.failed}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
