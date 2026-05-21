/**
 * Décode un Guid catalogue en id annonce (long), même logique que
 * TryAdvertIdFromCatalogGuid côté EcoScolarWebApi.
 * Retourne null si le Guid n'est pas un id catalogue encodé (ex. mock démo).
 */
export function tryParseCatalogAdvertId(catalogGuid: string): number | null {
  const bytes = guidStringToBytes(catalogGuid)
  if (!bytes)
    return null

  for (let i = 8; i < 16; i++) {
    if (bytes[i] !== 0)
      return null
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const advertId = view.getBigInt64(0, true)

  if (advertId <= 0n || advertId > BigInt(Number.MAX_SAFE_INTEGER))
    return null

  return Number(advertId)
}

function guidStringToBytes(guid: string): Uint8Array | null {
  const parts = guid.trim().split('-')
  if (parts.length !== 5)
    return null

  const part0 = parts[0]?.toLowerCase()
  const part1 = parts[1]?.toLowerCase()
  const part2 = parts[2]?.toLowerCase()
  const part3 = parts[3]?.toLowerCase()
  const part4 = parts[4]?.toLowerCase()

  if (!part0 || !part1 || !part2 || !part3 || !part4)
    return null

  if ([part0, part1, part2, part3, part4].some(p => !/^[0-9a-f]+$/.test(p)))
    return null
  if (part0.length !== 8 || part1.length !== 4 || part2.length !== 4)
    return null
  if (part3.length !== 4 || part4.length !== 12)
    return null

  const bytes = new Uint8Array(16)

  const chunk0 = Number.parseInt(part0, 16)
  bytes[0] = chunk0 & 0xff
  bytes[1] = (chunk0 >> 8) & 0xff
  bytes[2] = (chunk0 >> 16) & 0xff
  bytes[3] = (chunk0 >> 24) & 0xff

  const chunk1 = Number.parseInt(part1, 16)
  bytes[4] = chunk1 & 0xff
  bytes[5] = (chunk1 >> 8) & 0xff

  const chunk2 = Number.parseInt(part2, 16)
  bytes[6] = chunk2 & 0xff
  bytes[7] = (chunk2 >> 8) & 0xff

  bytes[8] = Number.parseInt(part3.slice(0, 2), 16)
  bytes[9] = Number.parseInt(part3.slice(2, 4), 16)

  for (let i = 0; i < 6; i++) {
    bytes[10 + i] = Number.parseInt(part4.slice(i * 2, i * 2 + 2), 16)
  }

  return bytes
}
