// Debug script to test fetchItem for a few specific IDs
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import fs from 'fs';

const sb = createClient(
  'https://cuinyjpiifcslzexrunc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
);

const d = JSON.parse(fs.readFileSync('/mnt/c/Users/yajou/.openclaw/workspace/vl_ids_checkpoint.json'));
console.log('Total IDs:', d.ids.length);
console.log('IDs 0-39:', d.ids.slice(0, 40).join(', '));
console.log('IDs 16-25 (potential crash point):', d.ids.slice(16, 26).join(', '));

const ORIGINAL_BRANDS = ['べプログ','ベプログ','vapelog','VAPELOG','VAPEROG','ターレス','TARLESS','NEXT by TARLESS'];
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

async function fetchItem(postId) {
  try {
    console.log(`Fetching ${postId}...`);
    const res = await fetch(`https://vapelog.jp/archives/${postId}`, {
      headers: PAGE_HEADERS, signal: AbortSignal.timeout(12000)
    });
    console.log(`  ${postId}: HTTP ${res.status}`);
    if (!res.ok) return null;
    const html = await res.text();
    const specs = parseSpecs(html);
    const maker = specs['メーカー'] || specs['ブランド'] || '';
    if (maker && ORIGINAL_BRANDS.some(b => maker.includes(b))) return { skip: true, maker };
    const title = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim()
      || html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim();
    console.log(`  ${postId}: title="${title}" maker="${maker}"`);
    return { name: title, maker };
  } catch(e) {
    console.error(`  ${postId}: THROW ${e.message}`);
    return { error: e.message };
  }
}

// Test items 16-23 (the crash point)
const testIds = d.ids.slice(14, 26);
console.log('\nTesting IDs:', testIds);
for (const id of testIds) {
  const r = await fetchItem(id);
  console.log(`  Result:`, JSON.stringify(r));
}
console.log('\nDone');
