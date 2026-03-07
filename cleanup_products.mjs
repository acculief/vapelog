// 古いProductエントリを削除（最新移行以前のもの）
import https from 'https';

const pat = 'sbp_8cd91c47a0453caefe302ec901a451ddb352e236';
const projectRef = 'cuinyjpiifcslzexrunc';
const cutoff = '2026-03-06T13:57:00Z'; // 最新移行開始時刻

function runSQL(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode < 300) resolve(JSON.parse(data));
        else reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0,300)}`));
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function main() {
  // 分布確認
  console.log('=== createdAt分布 ===');
  const dist = await runSQL(`SELECT date_trunc('hour', "createdAt") as hr, count(*) FROM "Product" GROUP BY hr ORDER BY hr`);
  console.log(JSON.stringify(dist, null, 2));

  // カットオフより前の件数
  const old = await runSQL(`SELECT count(*) as cnt FROM "Product" WHERE "createdAt" < '${cutoff}'`);
  console.log(`\n削除対象: ${old[0]?.cnt} 件 (createdAt < ${cutoff})`);

  if (parseInt(old[0]?.cnt) === 0) {
    console.log('削除不要！');
    return;
  }

  // 削除実行（FK順に）
  console.log('\n削除中...');
  // Report/Review/ProductTagは空のはずだが念のため
  const r4 = await runSQL(`DELETE FROM "Product" WHERE "createdAt" < '${cutoff}'`);
  console.log('Product deleted:', JSON.stringify(r4));

  // 最終確認
  const final = await runSQL(`SELECT count(*) as total FROM "Product"`);
  console.log(`\n残り: ${final[0]?.total} 件`);
}

main().catch(console.error);
