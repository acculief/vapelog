// べプログ全商品データ移行スクリプト v2
// vape-go.com Supabase DB（Product空）へべプログ商品を全件インポート

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import fs from 'fs';

const sb = createClient(
  'https://cuinyjpiifcslzexrunc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
);

const ORIGINAL_BRANDS = [
  'べプログ','ベプログ','vapelog','VAPELOG','VAPEROG','Vaperog',
  'ターレス','TARLESS','NEXT by TARLESS','次世代電子タバコ NEXT'
];

const PAGE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'ja,en-US;q=0.9',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function slugify(str) {
  const base = str
    .replace(/[^\w\s\-\u3000-\u9fff\uff00-\uffef]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .substring(0, 80);
  return base || 'product-' + randomUUID().split('-')[0];
}

function parseSpecs(html) {
  const specs = {};
  const re = /<tr[^>]*>[\s\S]*?<th[^>]*>([\s\S]*?)<\/th>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const k = m[1].replace(/<[^>]+>/g, '').trim();
    const v = m[2].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (k && v && k.length < 20) specs[k] = v;
  }
  return specs;
}

function getCategory(specs) {
  const t = (specs['タイプ'] || specs['商品タイプ'] || specs['種類'] || '').toLowerCase();
  if (t.includes('使い捨て') && t.includes('pod')) return 'pod_disposable';
  if (t.includes('使い捨て')) return 'disposable';
  if (t.includes('pod')) return 'pod';
  if (t.includes('リキッド') || t.includes('フレーバー') || t.includes('e-liquid')) return 'liquid';
  if (t.includes('加熱式') || t.includes('iqos') || t.includes('アイコス') || t.includes('glo') || t.includes('ploom')) return 'heated';
  if (t.includes('スターター')) return 'starter';
  if (t.includes('mod') || t.includes('モッド') || t.includes('box')) return 'mod';
  if (t.includes('シーシャ') || t.includes('shisha') || t.includes('hookah')) return 'shisha';
  if (t.includes('cbd')) return 'cbd';
  if (t.includes('コイル') || t.includes('coil') || t.includes('ポッド交換')) return 'coil';
  if (t.includes('アトマイザー') || t.includes('atomizer') || t.includes('タンク')) return 'atomizer';
  if (t.includes('アクセサリ') || t.includes('accessories') || t.includes('バッテリー')) return 'accessories';
  return 'other';
}

async function fetchItem(postId) {
  try {
    const res = await fetch(`https://vapelog.jp/archives/${postId}`, {
      headers: PAGE_HEADERS,
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) return null;
    const html = await res.text();

    // 商品ページチェック
    if (!html.includes('item-detail') && !html.includes('製品情報') && !html.includes('item_detail')) {
      return null;
    }

    const specs = parseSpecs(html);
    const maker = specs['メーカー'] || specs['ブランド'] || specs['メーカー名'] || '';

    // べプログオリジナル除外
    if (maker && ORIGINAL_BRANDS.some(b => maker.toLowerCase().includes(b.toLowerCase()))) {
      return { skip: 'original', maker };
    }

    // アフィリエイトリンク抽出
    const amazonLink = html.match(/href="(https?:\/\/(?:www\.)?amazon\.co\.jp\/dp\/[A-Z0-9]{10}[^"]*)"/)?.[1]
      || html.match(/href="(https?:\/\/amzn\.asia\/[^"]+)"/)?.[1];
    const rakutenLink = html.match(/href="(https?:\/\/item\.rakuten\.co\.jp\/vapecollection\/[^"]+)"/)?.[1];
    const yahooLink = html.match(/href="(https?:\/\/(?:store\.)?shopping\.yahoo\.co\.jp\/[^"]+)"/)?.[1];
    const shopLink = html.match(/href="(https?:\/\/shop\.vapelog\.jp\/[^"]+)"/)?.[1];

    // 画像
    const ogImg = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1]
      || html.match(/content="([^"]+)"\s+property="og:image"/)?.[1];
    const allImgs = [...html.matchAll(/src="(https?:\/\/vapelog\.jp\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)]
      .map(m => m[1])
      .filter(u => !u.includes('noimage') && !u.includes('icon') && !u.includes('logo'));
    const productImgs = [...new Set(allImgs)].slice(0, 8);

    // タイトル
    const title = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/property="og:title"\s+content="([^"]+)"/)?.[1]?.replace(/\s*[\|｜]\s*べプログ.*$/, '')?.trim()
      || html.match(/content="([^"]+)"\s+property="og:title"/)?.[1]?.replace(/\s*[\|｜]\s*べプログ.*$/, '')?.trim()
      || specs['商品名'];

    if (!title || title.length < 2) return null;

    const priceStr = specs['金額'] || specs['価格'] || '';
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || null;
    const category = getCategory(specs);
    const description = [specs['フレーバー'], specs['その他特徴'], specs['特徴'], specs['説明'], specs['コメント']]
      .filter(Boolean).join('\n').substring(0, 2000);

    return {
      name: title,
      category,
      brand: maker || 'Unknown',
      price,
      specs: Object.keys(specs).length > 0 ? specs : null,
      description: description || null,
      imageUrl: ogImg || productImgs[0] || null,
      imageUrls: productImgs.length > 0 ? productImgs : null,
      affiliateLinks: {
        ...(amazonLink ? { amazon: amazonLink } : {}),
        ...(rakutenLink ? { rakuten: rakutenLink } : {}),
        ...(yahooLink ? { yahoo: yahooLink } : {}),
        ...(shopLink ? { beprog: shopLink } : {}),
        source: `https://vapelog.jp/archives/${postId}`,
      },
      rankScore: 0,
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function getAllPostIds() {
  const CP = '/tmp/vl_ids_v2.json';
  if (fs.existsSync(CP)) {
    const d = JSON.parse(fs.readFileSync(CP, 'utf8'));
    if (d.ids?.length > 100) { console.log(`Checkpoint: ${d.ids.length} IDs`); return d.ids; }
  }

  const ids = [];
  let page = 1, totalPages = 999;
  while (page <= totalPages) {
    try {
      const res = await fetch(
        `https://vapelog.jp/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id`,
        { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/122', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) }
      );
      if (!res.ok) break;
      if (page === 1) {
        totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '0');
        console.log(`Total: ${res.headers.get('X-WP-Total')} posts, ${totalPages} pages`);
      }
      const data = await res.json();
      if (!data.length) break;
      ids.push(...data.map(p => p.id));
      if (page % 20 === 0) console.log(`  WP page ${page}/${totalPages} → ${ids.length} IDs`);
      page++;
      await sleep(150);
    } catch (e) { console.error(`WP page ${page}: ${e.message}`); await sleep(2000); page++; }
  }

  fs.writeFileSync(CP, JSON.stringify({ ids, ts: Date.now() }));
  return ids;
}

async function main() {
  const LOG = '/tmp/vl_migrate_v2.log';
  const logS = fs.createWriteStream(LOG, { flags: 'w' });
  const log = s => { process.stdout.write(s + '\n'); logS.write(s + '\n'); };

  log(`=== べプログ移行開始 ${new Date().toISOString()} ===`);

  // ID全取得
  const ids = await getAllPostIds();
  log(`\n${ids.length}件 スクレイプ開始\n`);

  const CONCURRENCY = 8;
  const BATCH_INSERT = 50;
  const slugSet = new Set();
  let processed = 0, inserted = 0, skipped = 0, errors = 0;
  let buffer = [];

  async function flushBuffer() {
    if (!buffer.length) return;
    const { error } = await sb.from('Product').insert(buffer);
    if (error) {
      log(`INSERT ERROR: ${error.message}`);
      errors += buffer.length;
    } else {
      inserted += buffer.length;
    }
    buffer = [];
  }

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(id => fetchItem(id)));

    for (const r of results) {
      processed++;
      if (!r || r.error) { errors++; continue; }
      if (r.skip) { skipped++; logS.write(`SKIP ${r.skip}: ${r.maker || ''}\n`); continue; }

      let base = slugify(r.name);
      let slug = base;
      let n = 2;
      while (slugSet.has(slug)) slug = `${base}-${n++}`;
      slugSet.add(slug);

      buffer.push({ id: randomUUID(), slug, ...r });
      if (buffer.length >= BATCH_INSERT) await flushBuffer();
    }

    if (processed % 500 === 0 || i + CONCURRENCY >= ids.length) {
      await flushBuffer();
      const pct = Math.round(processed / ids.length * 100);
      log(`[${pct}%] ${processed}/${ids.length} | OK=${inserted} SKIP=${skipped} ERR=${errors}`);
    }

    await sleep(120);
  }

  await flushBuffer();
  log(`\n=== 完了 ===`);
  log(`Total=${processed} Inserted=${inserted} Skipped=${skipped} Errors=${errors}`);
  log(`Log: ${LOG}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
