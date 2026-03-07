// Debug script - test first 3 batches of 8
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import fs from 'fs';

process.on('uncaughtException', e => { console.error('UNCAUGHT:', e.message, e.stack); });
process.on('unhandledRejection', (e, p) => { console.error('UNHANDLED:', e); });

const sb = createClient(
  'https://cuinyjpiifcslzexrunc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
);

const ORIGINAL_BRANDS = ['べプログ','ベプログ','vapelog','VAPELOG','VAPEROG','ターレス','TARLESS','NEXT by TARLESS'];
const PAGE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html',
  'Accept-Language': 'ja',
};

function slugify(str) {
  const base = str.replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase().substring(0, 80);
  return base || 'p-' + randomUUID().split('-')[0];
}

function parseSpecs(html) {
  const specs = {};
  const re = /<tr[^>]*>[\s\S]*?<th[^>]*>([\s\S]*?)<\/th>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;
  for (const m of html.matchAll(re)) {
    const k = m[1].replace(/<[^>]+>/g,'').trim();
    const v = m[2].replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    if (k && v && k.length < 20) specs[k] = v;
  }
  return specs;
}

function getCategory(specs) {
  const t = (specs['タイプ']||specs['商品タイプ']||specs['種類']||'').toLowerCase();
  if (t.includes('使い捨て') && t.includes('pod')) return 'pod_disposable';
  if (t.includes('使い捨て')) return 'disposable';
  if (t.includes('pod')) return 'pod';
  if (t.includes('リキッド')||t.includes('フレーバー')) return 'liquid';
  return 'other';
}

async function fetchItem(postId) {
  try {
    const res = await fetch(`https://vapelog.jp/archives/${postId}`, {
      headers: PAGE_HEADERS, signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) { console.log(`  ${postId}: HTTP ${res.status} → null`); return null; }
    const html = await res.text();
    if (!html.includes('item-detail') && !html.includes('製品情報')) { console.log(`  ${postId}: no product page → null`); return null; }

    const specs = parseSpecs(html);
    const maker = specs['メーカー'] || specs['ブランド'] || '';
    if (maker && ORIGINAL_BRANDS.some(b => maker.includes(b))) { console.log(`  ${postId}: SKIP maker="${maker}"`); return { skip: true, maker }; }

    const title = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/property="og:title"\s+content="([^"]+)"/)?.[1]?.replace(/\s*[\|｜]\s*べプログ.*/,'')?.trim()
      || specs['商品名'];

    if (!title || title.length < 2) { console.log(`  ${postId}: no title → null`); return null; }
    
    console.log(`  ${postId}: "${title}" maker="${maker}"`);
    const priceStr = specs['金額'] || specs['価格'] || '';
    const price = parseFloat(priceStr.replace(/[^0-9.]/g,'')) || null;
    const desc = [specs['フレーバー'],specs['その他特徴'],specs['特徴']].filter(Boolean).join('\n').substring(0,2000);

    return {
      _postId: postId,
      name: title,
      category: getCategory(specs),
      brand: maker || 'Unknown',
      price, specs: Object.keys(specs).length ? specs : null,
      description: desc || null,
      imageUrl: null,
      imageUrls: null,
      affiliateLinks: { source: `https://vapelog.jp/archives/${postId}` },
      rankScore: 0,
    };
  } catch(e) {
    console.error(`  ${postId}: THROW ${e.message}`);
    return { error: e.message };
  }
}

const d = JSON.parse(fs.readFileSync('/mnt/c/Users/yajou/.openclaw/workspace/vl_ids_checkpoint.json'));
console.log('Total IDs:', d.ids.length);

const slugSet = new Set();
let buffer = [];
let processed=0, inserted=0, skipped=0, errors=0;

async function flush() {
  if (!buffer.length) return;
  console.log(`\nFlushing ${buffer.length} items to Supabase...`);
  try {
    const {data, error} = await sb.from('Product').upsert(buffer, { onConflict: 'slug', ignoreDuplicates: true });
    if (error) { console.error('INSERT ERR:', error.message, JSON.stringify(error)); errors += buffer.length; }
    else { console.log('INSERT OK, rows:', data?.length); inserted += buffer.length; }
  } catch(e) { console.error('INSERT THROW:', e.message); errors += buffer.length; }
  buffer = [];
}

const CONCURRENCY = 8, BATCH_INSERT = 50, DELAY = 100;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Test first 5 batches (40 items)
for (let i=0; i<40; i+=CONCURRENCY) {
  const ids = d.ids.slice(i, i+CONCURRENCY);
  console.log(`\n=== Batch i=${i}, IDs: ${ids.join(', ')} ===`);
  const results = await Promise.allSettled(ids.map(id => fetchItem(id)));
  
  for (const res of results) {
    processed++;
    if (res.status === 'rejected') { errors++; console.error('REJECTED:', res.reason); continue; }
    const r = res.value;
    if (!r || r.error) { errors++; continue; }
    if (r.skip) { skipped++; continue; }
    
    const { _postId, ...product } = r;
    const base = slugify(r.name);
    const slug = base ? `${base}-${_postId}` : `vl-${_postId}`;
    if (slugSet.has(slug)) { errors++; continue; }
    slugSet.add(slug);
    buffer.push({id: randomUUID(), slug, ...product});
    if (buffer.length >= BATCH_INSERT) await flush();
  }
  
  console.log(`After batch: processed=${processed} skip=${skipped} err=${errors} buf=${buffer.length}`);
  if (buffer.length > 0) await flush();
  await sleep(DELAY);
}

console.log(`\nFinal: processed=${processed} inserted=${inserted} skip=${skipped} err=${errors}`);
