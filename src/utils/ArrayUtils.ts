export function compareArray (arrA: Uint8Array | number[], arrB: Uint8Array | number[]): boolean {
  if (arrA.length !== arrB.length) {
    return false
  }
  let result = true
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      result = false
      break
    }
  }
  return result
}
