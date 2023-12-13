export const Alphabets = {
  BASE36: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

export function encode(str: string, alphabet = Alphabets.BASE36): bigint {
  if (str.length === 0) return 0n;
  const base = BigInt(alphabet.length);
  let value = 0n;
  for (let i = 0; i < str.length; i++) {
    const char = str[str.length - i - 1];
    const charIndex = alphabet.indexOf(char);
    if (charIndex === -1) {
      throw new Error(`Invalid character: ${char}`);
    }
    value += BigInt(charIndex) * base ** BigInt(i);
  }
  return value;
}

export function decode(value: bigint, alphabet = Alphabets.BASE36): string {
  const base = BigInt(alphabet.length);
  let remaining = value;
  if (remaining < 0n) {
    throw new Error("Value must be positive");
  }
  if (remaining === 0n) {
    return "0";
  }
  let str = "";
  while (remaining > 0n) {
    const charIndex = remaining % base;
    remaining = remaining / base;
    str = alphabet[Number(charIndex)] + str;
  }
  return str;
}
