import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: 'メンソール' }, update: {}, create: { name: 'メンソール', type: 'flavor' } }),
    prisma.tag.upsert({ where: { name: 'フルーツ' }, update: {}, create: { name: 'フルーツ', type: 'flavor' } }),
    prisma.tag.upsert({ where: { name: 'タバコ' }, update: {}, create: { name: 'タバコ', type: 'flavor' } }),
    prisma.tag.upsert({ where: { name: '初心者向け' }, update: {}, create: { name: '初心者向け', type: 'feature' } }),
    prisma.tag.upsert({ where: { name: 'コスパ良し' }, update: {}, create: { name: 'コスパ良し', type: 'feature' } }),
    prisma.tag.upsert({ where: { name: 'ハイエンド' }, update: {}, create: { name: 'ハイエンド', type: 'feature' } }),
  ])

  const products = [
    { name: 'VOOPOO DRAG S Pro', slug: 'voopoo-drag-s-pro', category: 'pod', brand: 'VOOPOO', price: 8800, description: 'ハイパワー60WポッドMOD。GENE TQ2チップ搭載で素早いヒットを実現。', specs: { バッテリー: '2600mAh', 出力: '5-60W', コイル: 'PnP対応', 充電: 'USB-C' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example1', rakuten: 'https://item.rakuten.co.jp/example1' } },
    { name: 'SMOK Nord 5', slug: 'smok-nord-5', category: 'pod', brand: 'SMOK', price: 6500, description: '定番のNordシリーズ最新作。80W出力でパワフルな吸い応え。', specs: { バッテリー: '2000mAh', 出力: '5-80W', コイル: 'RPMシリーズ対応', 充電: 'USB-C' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example2' } },
    { name: 'GeekVape Aegis Legend 2', slug: 'geekvape-aegis-legend-2', category: 'boxmod', brand: 'GeekVape', price: 15800, description: '最高の防水・防塵性能。IP68規格取得のフラグシップBOX MOD。', specs: { バッテリー: '21700×2', 出力: '5-200W', 防水: 'IP68', 充電: 'USB-C' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example3', official: 'https://geekvape.com' } },
    { name: 'Vaporesso XROS 3 Nano', slug: 'vaporesso-xros-3-nano', category: 'pod', brand: 'Vaporesso', price: 4500, description: 'コンパクトで軽量なポッド型VAPE。初心者にも扱いやすい。', specs: { バッテリー: '1000mAh', 出力: '11-16W(自動)', コイル: 'XROS用', 充電: 'USB-C' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example4' } },
    { name: 'Uwell Caliburn G3', slug: 'uwell-caliburn-g3', category: 'pod', brand: 'Uwell', price: 5200, description: 'Caliburnシリーズの最新作。クリアな味わいが特徴のMTLポッド。', specs: { バッテリー: '900mAh', 出力: '最大25W', コイル: 'G3専用', 充電: 'USB-C' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example5', yahoo: 'https://item.shopping.yahoo.co.jp/example5' } },
    { name: 'Naked 100 Hawaiian POG', slug: 'naked-100-hawaiian-pog', category: 'liquid', brand: 'Naked 100', price: 2200, description: 'パッションフルーツ・オレンジ・グアバのトロピカルフルーツブレンド。', specs: { ニコチン: '3mg/6mg', VGPG: '70/30', 容量: '60ml', フレーバー: 'フルーツ' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example6' } },
    { name: 'LOSTMARY BM5000', slug: 'lostmary-bm5000', category: 'disposable', brand: 'LOSTMARY', price: 1800, description: '5000パフ対応の大容量使い捨てVAPE。多彩なフレーバーラインナップ。', specs: { パフ数: '約5000回', バッテリー: '500mAh', 容量: '13ml', 充電: '不可' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example7' } },
    { name: 'Vaporesso GTX Coil 0.2ohm', slug: 'vaporesso-gtx-coil-02', category: 'parts', brand: 'Vaporesso', price: 1200, description: 'GTXシリーズ対応コイル。0.2ohmでクラウドを楽しめる。', specs: { 抵抗値: '0.2Ω', 推奨ワット: '40-60W', 対応: 'GTXシリーズ', 入数: '5個入り' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example8' } },
    { name: 'Innokin Endura T20-S', slug: 'innokin-endura-t20s', category: 'starter', brand: 'Innokin', price: 3800, description: '初心者向けスターターキット。シンプル操作でタバコに近い吸い心地。', specs: { バッテリー: '1500mAh', 出力: '13W固定', タイプ: 'MTL', 充電: 'Micro-USB' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example9' } },
    { name: 'OXVA Xlim V3', slug: 'oxva-xlim-v3', category: 'pod', brand: 'OXVA', price: 5800, description: 'サイドフィル方式採用の使いやすいポッドシステム。最大30W出力。', specs: { バッテリー: '900mAh', 出力: '5-30W', 充電: 'USB-C', フィル: 'サイドフィル' }, affiliateLinks: { amazon: 'https://amazon.co.jp/dp/example10' } },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        name: productData.name,
        slug: productData.slug,
        category: productData.category,
        brand: productData.brand,
        price: productData.price,
        description: productData.description,
        specs: productData.specs,
        affiliateLinks: productData.affiliateLinks,
      },
    })

    if (productData.category === 'starter' || productData.category === 'pod') {
      await prisma.productTag.upsert({
        where: { productId_tagId: { productId: product.id, tagId: tags[3].id } },
        update: {},
        create: { productId: product.id, tagId: tags[3].id },
      })
    }
    if (productData.category === 'liquid') {
      await prisma.productTag.upsert({
        where: { productId_tagId: { productId: product.id, tagId: tags[1].id } },
        update: {},
        create: { productId: product.id, tagId: tags[1].id },
      })
    }
  }

  console.log('Seed completed!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
