import { encode, decode } from "./bigint";

test("encode", () => {
  expect(encode("0")).toBe(0n);
  expect(encode("1")).toBe(1n);
  expect(encode("A")).toBe(10n);
  expect(encode("Z")).toBe(35n);
  expect(encode("10")).toBe(36n);
  expect(encode("11")).toBe(37n);
  expect(encode("2S")).toBe(100n);
  expect(encode("RS")).toBe(1000n);
  expect(encode("7PS")).toBe(10000n);
  expect(encode("AZ12325")).toBe(23885916413n);
  expect(encode("ZZZZZZZZZ")).toBe(101559956668415n);
  expect(encode("AZAZAZAZAZAZA")).toBe(52030720178326943830n);
  expect(() => encode("a")).toThrow("Invalid character: a");
  expect(() => encode("1a")).toThrow("Invalid character: a");
  expect(() => encode("a1")).toThrow("Invalid character: a");
});

test("decode", () => {
  expect(decode(0n)).toBe("0");
  expect(decode(1n)).toBe("1");
  expect(decode(10n)).toBe("A");
  expect(decode(35n)).toBe("Z");
  expect(decode(36n)).toBe("10");
  expect(decode(37n)).toBe("11");
  expect(decode(100n)).toBe("2S");
  expect(decode(1000n)).toBe("RS");
  expect(decode(10000n)).toBe("7PS");
  expect(decode(23885916413n)).toBe("AZ12325");
  expect(decode(101559956668415n)).toBe("ZZZZZZZZZ");
  expect(decode(52030720178326943830n)).toBe("AZAZAZAZAZAZA");
  expect(() => decode(-1n)).toThrow("Value must be positive");
  expect(() => decode(-100n)).toThrow("Value must be positive");
});
