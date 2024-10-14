import { generate } from "./rand";

describe("rand", () => {
  describe("generate", () => {
    it("should generate alphanumeric string of correct length", () => {
      const result = generate(32, "alphanumeric");
      expect(result).toHaveLength(32);
      expect(result).toMatch(/^[0-9a-zA-Z]+$/);
    });

    it("should generate numeric string of correct length", () => {
      const result = generate(40, "numeric");
      expect(result).toHaveLength(40);
      expect(result).toMatch(/^[0-9]+$/);
    });

    it("should generate different strings on subsequent calls", () => {
      const result1 = generate(20, "alphanumeric");
      const result2 = generate(20, "alphanumeric");
      expect(result1).not.toEqual(result2);
    });

    it("should throw an error for invalid charset", () => {
      // @ts-expect-error: Testing invalid input
      expect(() => generate(10, "invalid")).toThrow();
    });

    it("should generate empty string for length 0", () => {
      const result = generate(0, "alphanumeric");
      expect(result).toEqual("");
    });

    it("should handle large lengths", () => {
      const length = 1000;
      const result = generate(length, "alphanumeric");
      expect(result).toHaveLength(length);
    });
  });
});
