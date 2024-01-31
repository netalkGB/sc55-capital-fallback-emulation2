export function calcChecksum (d: Uint8Array | number[]): number {
  const a = d[5]
  const b = d[6]
  const c = d[7]
  const data = d[8]
  return 0x80 - (a + b + c + data) % 0x80
}

export function checkSysExChecksum (d: Uint8Array | number[]): boolean {
  const checksum = d[9]
  return checksum === calcChecksum(d)
}
