import fs from 'fs'

const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'

const catImages = JSON.parse(fs.readFileSync('./lib/category-images.json', 'utf-8'))

for (const [slug, urls] of Object.entries(catImages)) {
  for (let i = 0; i < Math.min(3, urls.length); i++) {
    const url = urls[i]
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' },
        signal: AbortSignal.timeout(10000)
      })
      if (!res.ok) { console.log('Skip ' + slug + '[' + i + ']: HTTP ' + res.status); continue }
      const buf = await res.arrayBuffer()
      const ext = url.includes('.png') ? 'png' : 'jpg'
      const storagePath = 'vapelog-categories/' + slug + '.' + ext
      const uploadRes = await fetch(
        SUPABASE_URL + '/storage/v1/object/item-images/' + storagePath,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + SERVICE_KEY,
            'Content-Type': ext === 'png' ? 'image/png' : 'image/jpeg',
            'x-upsert': 'true'
          },
          body: buf
        }
      )
      if (uploadRes.ok) {
        const cdnUrl = SUPABASE_URL + '/storage/v1/object/public/item-images/' + storagePath
        console.log('SUCCESS:' + slug + ':' + cdnUrl)
        break
      } else {
        const err = await uploadRes.text()
        console.log('Fail ' + slug + '[' + i + ']: ' + err.substring(0, 100))
      }
    } catch(e) {
      console.log('Error ' + slug + '[' + i + ']: ' + e.message)
    }
    await new Promise(r => setTimeout(r, 500))
  }
}
