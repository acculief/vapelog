// べプログ移行スクリプト v3 - より堅牢な実装

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import fs from 'fs';

process.on('uncaughtException', e => { console.error('UNCAUGHT:', e.message, e.stack); });
process.on('unhandledRejection', e => { console.error('UNHANDLED:', e); });

const sb = createClient(
  'https://cuinyjpiifcslzexrunc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
);

const ORIGINAL_BRANDS = ['べプログ','ベプログ','vapelog','VAPELOG','VAPEROG','ターレス','TARLESS','NEXT by TARLESS'];
const CP_FILE = '/mnt/c/Users/yajou/.openclaw/workspace/vl_ids_checkpoint.json';
const LOG_FILE = '/mnt/c/Users/yajou/.openclaw/workspace/vl_migrate.log';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const PAGE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
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
  if (t.includes('加熱式')||t.includes('iqos')||t.includes('glo')||t.includes('ploom')) return 'heated';
  if (t.includes('スターター')) return 'starter';
  if (t.includes('mod')||t.includes('モッド')) return 'mod';
  if (t.includes('シーシャ')||t.includes('shisha')) return 'shisha';
  if (t.includes('cbd')) return 'cbd';
  if (t.includes('コイル')||t.includes('coil')) return 'coil';
  if (t.includes('アトマイザー')||t.includes('atomizer')) return 'atomizer';
  if (t.includes('アクセサリ')) return 'accessories';
  return 'other';
}

async function wpFetch(page) {
  const url = `https://vapelog.jp/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/122', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(20000)
    });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) return { error: `HTTP ${res.status}`, ids: [], done: res.status === 400 };
    if (!ct.includes('json')) {
      const txt = await res.text();
      return { error: `non-JSON (${ct}): ${txt.substring(0,50)}`, ids: [], done: false };
    }
    const data = await res.json();
    if (!Array.isArray(data)) return { error: 'not array: ' + JSON.stringify(data).substring(0,100), ids: [], done: true };
    const total = parseInt(res.headers.get('X-WP-Total') || '0');
    const totalPgs = parseInt(res.headers.get('X-WP-TotalPages') || '0');
    return { ids: data.map(p => p.id), total, totalPgs, done: data.length === 0 };
  } catch(e) {
    return { error: e.message, ids: [], done: false };
  }
}

async function getAllPostIds() {
  if (fs.existsSync(CP_FILE)) {
    const d = JSON.parse(fs.readFileSync(CP_FILE, 'utf8'));
    if (d.ids?.length > 5000) { console.log(`Checkpoint: ${d.ids.length} IDs`); return d.ids; }
  }
  
  const ids = [];
  let totalPgs = 999;
  
  for (let page = 1; page <= totalPgs; page++) {
    const r = await wpFetch(page);
    if (r.error) {
      console.log(`  WP p${page}: ${r.error}`);
      if (r.done) break;
      await sleep(3000);
      continue;
    }
    if (r.done || !r.ids.length) break;
    if (page === 1 && r.totalPgs) {
      totalPgs = r.totalPgs;
      console.log(`  WP total=${r.total} pages=${totalPgs}`);
    }
    ids.push(...r.ids);
    
    // Save checkpoint every 10 pages
    if (page % 10 === 0) {
      fs.writeFileSync(CP_FILE, JSON.stringify({ ids, ts: Date.now() }));
      console.log(`  WP p${page}/${totalPgs}: ${ids.length} IDs (saved)`);
    }
    
    await sleep(100);
  }
  
  fs.writeFileSync(CP_FILE, JSON.stringify({ ids, ts: Date.now() }));
  console.log(`  Total IDs: ${ids.length}`);
  return ids;
}

async function fetchItem(postId) {
  const _postId = postId; // preserve for slug
  try {
    const res = await fetch(`https://vapelog.jp/archives/${postId}`, {
      headers: PAGE_HEADERS, signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    if (!html.includes('item-detail') && !html.includes('製品情報')) return null;

    const specs = parseSpecs(html);
    const maker = specs['メーカー'] || specs['ブランド'] || '';
    if (maker && ORIGINAL_BRANDS.some(b => maker.includes(b))) return { skip: true, maker };

    const ogImg = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1]
      || html.match(/content="([^"]+)"\s+property="og:image"/)?.[1];
    const imgs = [...new Set([...html.matchAll(/src="(https?:\/\/vapelog\.jp\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)].map(m=>m[1]))].filter(u=>!u.includes('noimage')).slice(0,8);

    const title = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/property="og:title"\s+content="([^"]+)"/)?.[1]?.replace(/\s*[\|｜]\s*べプログ.*/,'')?.trim()
      || specs['商品名'];

    if (!title || title.length < 2) return null;

    const amazonLink = html.match(/href="(https?:\/\/(?:www\.)?amazon\.co\.jp\/dp\/[A-Z0-9]{10}[^"]*)"/)?.[1];
    const rakutenLink = html.match(/href="(https?:\/\/item\.rakuten\.co\.jp\/vapecollection\/[^"]+)"/)?.[1];
    const yahooLink = html.match(/href="(https?:\/\/(?:store\.)?shopping\.yahoo\.co\.jp\/[^"]+)"/)?.[1];
    const shopLink = html.match(/href="(https?:\/\/shop\.vapelog\.jp\/[^"]+)"/)?.[1];

    const priceStr = specs['金額'] || specs['価格'] || '';
    const price = parseFloat(priceStr.replace(/[^0-9.]/g,'')) || null;
    const desc = [specs['フレーバー'],specs['その他特徴'],specs['特徴']].filter(Boolean).join('\n').substring(0,2000);

    return {
      _postId: postId, // for slug generation
      name: title,
      category: getCategory(specs),
      brand: maker || 'Unknown',
      price, specs: Object.keys(specs).length ? specs : null,
      description: desc || null,
      imageUrl: ogImg || imgs[0] || null,
      imageUrls: imgs.length ? imgs : null,
      affiliateLinks: {
        ...(amazonLink ? {amazon: amazonLink} : {}),
        ...(rakutenLink ? {rakuten: rakutenLink} : {}),
        ...(yahooLink ? {yahoo: yahooLink} : {}),
        ...(shopLink ? {beprog: shopLink} : {}),
        source: `https://vapelog.jp/archives/${postId}`,
      },
      rankScore: 0,
    };
  } catch(e) {
    return { error: e.message };
  }
}

async function main() {
  const logS = fs.createWriteStream(LOG_FILE, {flags:'w'});
  const log = s => { process.stdout.write(s+'\n'); logS.write(s+'\n'); };
  
  log(`=== べプログ移行 v3 開始 ${new Date().toISOString()} ===`);
  
  const ids = await getAllPostIds();
  log(`\n${ids.length}件 スクレイプ開始\n`);
  
  const CONCURRENCY = 8, BATCH_INSERT = 50, DELAY = 100;
  const slugSet = new Set();
  let processed=0, inserted=0, skipped=0, errors=0;
  let buffer = [];
  
  async function flush() {
    if (!buffer.length) return;
    try {
      // upsert with ignoreDuplicates to skip any remaining conflicts
      const {error} = await sb.from('Product').upsert(buffer, { onConflict: 'slug', ignoreDuplicates: true });
      if (error) { log(`INSERT ERR: ${error.message}`); errors += buffer.length; }
      else inserted += buffer.length;
    } catch(e) { log(`INSERT THROW: ${e.message}`); errors += buffer.length; }
    buffer = [];
  }
  
  for (let i=0; i<ids.length; i+=CONCURRENCY) {
    const batch = ids.slice(i, i+CONCURRENCY);
    const results = await Promise.allSettled(batch.map(id => fetchItem(id)));
    
    for (const res of results) {
      processed++;
      if (res.status === 'rejected') { errors++; continue; }
      const r = res.value;
      if (!r || r.error) { errors++; continue; }
      if (r.skip) { skipped++; logS.write(`SKIP: ${r.maker}\n`); continue; }
      
      // Use postId to guarantee uniqueness: slug = "name-postid"
      const { _postId, ...product } = r;
      const base = slugify(r.name);
      // postId suffix ensures global uniqueness; slugSet prevents within-batch dups
      const slug = base ? `${base}-${_postId}` : `vl-${_postId}`;
      if (slugSet.has(slug)) { errors++; continue; } // shouldn't happen but just in case
      slugSet.add(slug);
      buffer.push({id: randomUUID(), slug, ...product});
      if (buffer.length >= BATCH_INSERT) await flush();
    }
    
    if (processed % 500 === 0 || i+CONCURRENCY >= ids.length) {
      await flush();
      const pct = Math.round(processed/ids.length*100);
      log(`[${pct}%] ${processed}/${ids.length} | OK=${inserted} SKIP=${skipped} ERR=${errors}`);
    }
    await sleep(DELAY);
  }
  
  await flush();
  log(`\n=== 完了 ${new Date().toISOString()} ===`);
  log(`Total=${processed} Inserted=${inserted} Skipped=${skipped} Errors=${errors}`);
}

main().then(() => process.exit(0)).catch(e => { console.error('FATAL:', e); process.exit(1); });
