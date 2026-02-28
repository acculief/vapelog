import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
const sb = createClient(SUPABASE_URL, SERVICE_KEY)

const COLLECTIONS = ['disposable-vape','pod-vape','box-mod','e-liquid','starter-kit','vape-coil']

const beprogProducts = []
for (const col of COLLECTIONS) {
  for (let page = 1; page <= 3; page++) {
    const url = 'https://www.beprog.com/collections/' + col + '/products.json?limit=250&page=' + page
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' }, signal: AbortSignal.timeout(10000) })
      if (!res.ok) break
      const data = await res.json()
      if (!data.products?.length) break
      for (const p of data.products) {
        if (!beprogProducts.find(x => x.handle === p.handle)) {
          beprogProducts.push({ handle: p.handle, title: p.title, vendor: p.vendor })
        }
      }
      if (data.products.length < 250) break
    } catch(e) { console.log(col + ' p' + page + ': ' + e.message); break }
    await new Promise(r => setTimeout(r, 800))
  }
}
console.log('beprog: ' + beprogProducts.length + '件取得')

const { data: dbProducts, error: dbError } = await sb.from('Product').select('id, name, brand, affiliateLinks')
if (dbError) { console.error('DB error:', dbError); process.exit(1) }
console.log('DB: ' + dbProducts.length + '件')

const normalize = s => s.toLowerCase().replace(/[\s\-\/\.\(\)]/g,'')

let matched = 0, skipped = 0
const unmatched = []

for (const db of dbProducts) {
  const dbNorm = normalize(db.name)
  let found = beprogProducts.find(b => normalize(b.title) === dbNorm)
  if (!found) found = beprogProducts.find(b => normalize(b.title).includes(dbNorm) || dbNorm.includes(normalize(b.title)))
  
  if (found) {
    const beprogUrl = 'https://www.beprog.com/products/' + found.handle
    const existing = db.affiliateLinks || {}
    const { error } = await sb.from('Product').update({
      affiliateLinks: { ...existing, beprog: beprogUrl }
    }).eq('id', db.id)
    if (!error) {
      console.log('OK ' + db.name + ' -> ' + found.handle)
      matched++
    } else {
      console.log('ERR ' + db.name + ': ' + error.message)
    }
  } else {
    console.log('NO_MATCH: ' + db.name)
    unmatched.push(db)
    skipped++
  }
  await new Promise(r => setTimeout(r, 100))
}

console.log('--- フォールバック: 未マッチ' + unmatched.length + '件に検索URLを設定 ---')
let fallbackCount = 0
for (const db of unmatched) {
  const searchUrl = 'https://www.beprog.com/search?q=' + encodeURIComponent(db.name)
  const existing = db.affiliateLinks || {}
  const { error } = await sb.from('Product').update({
    affiliateLinks: { ...existing, beprog: searchUrl }
  }).eq('id', db.id)
  if (!error) {
    console.log('FALLBACK ' + db.name)
    fallbackCount++
  }
  await new Promise(r => setTimeout(r, 100))
}

console.log('完了: ' + matched + '件マッチ, ' + skipped + '件未マッチ(' + fallbackCount + '件フォールバックURL設定)')
