import { db } from './db'

export type Product = {
  id: string
  name: string
  slug: string
  category: string
  brand: string
  price: number | null
  description: string | null
  specs: Record<string, string> | null
  affiliateLinks: Record<string, string> | null
  rankScore: number
  imageUrl: string | null
  imageUrls: string[] | null
  createdAt: string
  reviews?: Review[]
  tags?: { tag: Tag }[]
}

export type Review = {
  id: string
  rating: number
  title: string | null
  body: string
  status: string
  qualityScore: number | null
  productId: string
  userId: string
  createdAt: string
  user?: { name: string | null; email: string | null }
}

export type Tag = {
  id: string
  name: string
  type: string
}

// 商品一覧取得
export async function getProducts(opts: {
  category?: string
  brand?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  orderBy?: 'rankScore' | 'price' | 'createdAt'
  order?: 'asc' | 'desc'
} = {}) {
  let query = db.from('Product').select('*, reviews:Review(rating, status)')

  if (opts.category) query = query.eq('category', opts.category)
  if (opts.brand) query = query.ilike('brand', `%${opts.brand}%`)
  if (opts.q) query = query.or(`name.ilike.%${opts.q}%,brand.ilike.%${opts.q}%`)
  if (opts.minPrice != null) query = query.gte('price', opts.minPrice)
  if (opts.maxPrice != null) query = query.lte('price', opts.maxPrice)

  const col = opts.orderBy || 'rankScore'
  const asc = (opts.order || 'desc') === 'asc'
  query = query.order(col, { ascending: asc })
  query = query.limit(opts.limit || 48)

  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return (data || []) as Product[]
}

// 商品単体取得（レビュー・タグ含む）
export async function getProduct(id: string) {
  const { data, error } = await db
    .from('Product')
    .select(`
      *,
      reviews:Review(*, user:User(name, email)),
      tags:ProductTag(tag:Tag(*))
    `)
    .eq('id', id)
    .single()
  if (error) { console.error(error); return null }
  return data as any as Product & { tags: { tag: Tag }[], reviews: Review[] }
}

// レビュー一覧取得
export async function getReviews(productId: string) {
  const { data, error } = await db
    .from('Review')
    .select('*')
    .eq('productId', productId)
    .eq('status', 'visible')
    .order('createdAt', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data || []) as Review[]
}

// API検索用（タグ絞り込みなし版）
export async function searchProducts(opts: {
  q?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  id?: string
  limit?: number
} = {}) {
  if (opts.id) {
    const { data, error } = await db
      .from('Product')
      .select('*, reviews:Review(rating, qualityScore, status), tags:ProductTag(tag:Tag(name))')
      .eq('id', opts.id)
    if (error) { console.error(error); return [] }
    return (data || []) as any[]
  }

  let query = db
    .from('Product')
    .select('*, reviews:Review(rating, qualityScore, status), tags:ProductTag(tag:Tag(name))')

  if (opts.q) query = query.or(`name.ilike.%${opts.q}%,brand.ilike.%${opts.q}%,description.ilike.%${opts.q}%`)
  if (opts.category) query = query.eq('category', opts.category)
  if (opts.brand) query = query.ilike('brand', `%${opts.brand}%`)
  if (opts.minPrice != null) query = query.gte('price', opts.minPrice)
  if (opts.maxPrice != null) query = query.lte('price', opts.maxPrice)

  query = query.order('rankScore', { ascending: false }).limit(opts.limit || 20)

  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return (data || []) as any[]
}
