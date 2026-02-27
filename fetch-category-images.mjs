const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9';

const CATEGORIES = [
  { slug: 'disposable', query: '使い捨て VAPE 電子タバコ 本体 ディスポーザブル' },
  { slug: 'pod', query: 'ポッド型 VAPE POD デバイス 本体' },
  { slug: 'boxmod', query: 'BOX MOD VAPE 電子タバコ デバイス' },
  { slug: 'liquid', query: 'VAPE リキッド 電子タバコ フレーバー ボトル' },
  { slug: 'starter', query: 'VAPE スターターキット 電子タバコ 初心者 セット' },
  { slug: 'parts', query: 'VAPE コイル パーツ アトマイザー 交換' },
];

async function searchImages(query, num = 6) {
  const res = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, gl: 'jp', num })
  });
  const data = await res.json();
  const images = data.images || [];
  return images.slice(0, num).map(img => img.imageUrl).filter(Boolean);
}

async function main() {
  const result = {};
  
  for (const cat of CATEGORIES) {
    console.log(`Fetching images for ${cat.slug}...`);
    const imgs = await searchImages(cat.query, 6);
    result[cat.slug] = imgs;
    console.log(`  Got ${imgs.length} images`);
    if (imgs.length > 0) {
      console.log(`  First: ${imgs[0].substring(0, 80)}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\nResult:', JSON.stringify(result, null, 2));
  
  const { writeFileSync, mkdirSync, existsSync } = await import('fs');
  const libDir = '/home/atukuri/vapelog/lib';
  if (!existsSync(libDir)) mkdirSync(libDir, { recursive: true });
  writeFileSync(`${libDir}/category-images.json`, JSON.stringify(result, null, 2));
  console.log(`\nSaved to ${libDir}/category-images.json`);
}

main().catch(console.error);
