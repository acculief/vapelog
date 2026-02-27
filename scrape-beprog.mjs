import { chromium } from 'playwright';
import fs from 'fs';

// ベプログのカテゴリURL一覧
const CATEGORIES = [
  { slug: 'disposable', name: '使い捨て', url: 'https://www.beprog.com/collections/disposable-vape' },
  { slug: 'pod', name: 'ポッド型', url: 'https://www.beprog.com/collections/pod-vape' },
  { slug: 'boxmod', name: 'BOX MOD', url: 'https://www.beprog.com/collections/box-mod' },
  { slug: 'liquid', name: 'リキッド', url: 'https://www.beprog.com/collections/e-liquid' },
  { slug: 'starter', name: 'スターターキット', url: 'https://www.beprog.com/collections/starter-kit' },
];

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // User-Agent設定
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
  });

  const allProducts = [];

  for (const cat of CATEGORIES) {
    try {
      console.log(`Scraping ${cat.name}...`);
      await page.goto(cat.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // 年齢確認ダイアログがあれば通過
      const ageBtn = await page.$('button:has-text("18歳以上"), button:has-text("入場する"), [data-age-gate]');
      if (ageBtn) { await ageBtn.click(); await page.waitForTimeout(1000); }

      // 商品一覧を取得 - より広いセレクタ
      const products = await page.evaluate(() => {
        // まずページのHTML構造を確認
        const allCards = document.querySelectorAll('.product-item, .grid__item, [class*="product-card"], .card--product, .product-card, article');
        console.log('Found cards:', allCards.length);
        
        const items = allCards.length > 0 ? allCards : document.querySelectorAll('li, .item');
        return Array.from(items).slice(0, 30).map(item => {
          const titleEl = item.querySelector('.product-item__title, .card__heading, h3, h2, h4, [class*="title"], [class*="name"]');
          const priceEl = item.querySelector('.price, [class*="price"], .money');
          const imgEl = item.querySelector('img');
          
          if (!titleEl && !imgEl) return null;
          
          const name = titleEl?.textContent?.trim();
          if (!name || name.length < 2) return null;
          
          return {
            name,
            price: priceEl?.textContent?.trim(),
            imageUrl: imgEl?.src || imgEl?.getAttribute('data-src') || imgEl?.getAttribute('data-lazy-src'),
          };
        }).filter(Boolean);
      });
      
      allProducts.push(...products.map(p => ({ ...p, category: cat.slug, categoryName: cat.name })));
      console.log(`  Found ${products.length} products`);
    } catch (err) {
      console.error(`Error scraping ${cat.name}:`, err.message);
    }
  }

  await browser.close();
  fs.writeFileSync('/tmp/beprog-products.json', JSON.stringify(allProducts, null, 2));
  console.log(`Total: ${allProducts.length} products`);
  
  // 結果をプレビュー
  if (allProducts.length > 0) {
    console.log('\nSample products:');
    allProducts.slice(0, 3).forEach(p => console.log(` - ${p.categoryName}: ${p.name}`));
  }
}

scrape().catch(console.error);
