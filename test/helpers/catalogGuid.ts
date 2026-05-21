/** Encode un id annonce DB en Guid catalogue (même logique que CatalogIdFromAdvertId côté API). */
export function encodeCatalogAdvertGuid(advertId: number): string {
  const bytes = new Uint8Array(16)
  new DataView(bytes.buffer).setBigInt64(0, BigInt(advertId), true)

  const part0 = (
    (bytes[3]! << 24)
    | (bytes[2]! << 16)
    | (bytes[1]! << 8)
    | bytes[0]!
  ).toString(16).padStart(8, '0')

  const part1 = ((bytes[5]! << 8) | bytes[4]!).toString(16).padStart(4, '0')
  const part2 = ((bytes[7]! << 8) | bytes[6]!).toString(16).padStart(4, '0')
  const part3 = bytes[8]!.toString(16).padStart(2, '0') + bytes[9]!.toString(16).padStart(2, '0')
  const part4 = Array.from(bytes.slice(10, 16))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')

  return `${part0}-${part1}-${part2}-${part3}-${part4}`
}
