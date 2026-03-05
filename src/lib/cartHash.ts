/**
 * Generates a deterministic hash of cart contents for tamper detection.
 * Uses Web Crypto API (SHA-256) for browser-native hashing.
 */
export async function generateCartHash(items: Array<{
  id: string;
  price: number;
  quantity: number;
  variantKey?: string;
}>): Promise<string> {
  const payload = items
    .map(i => `${i.variantKey || i.id}:${i.price}:${i.quantity}`)
    .sort()
    .join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
