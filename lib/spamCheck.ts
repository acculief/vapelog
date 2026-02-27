export function calculateQualityScore(body: string): number {
  let score = 1.0
  if (body.length < 40) score -= 0.3
  if (/http|www|\.com/.test(body)) score -= 0.4
  if ((body.match(/!/g) || []).length > 5) score -= 0.2
  if (/無料|稼げる|投資/.test(body)) score -= 0.5
  if (body.length < 20) score -= 0.3
  if (/test|テスト|aaaa/.test(body.toLowerCase())) score -= 0.3
  return Math.max(score, 0)
}

export function isSpam(body: string): boolean {
  return calculateQualityScore(body) < 0.3
}
