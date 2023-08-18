import { cacheGetter } from "./cache-getter";

test("cacheGetter should ensure getter is called only first time", () => {
  let callCount = 0;
  class Sample {
    private readonly data: number[] = [1, 2, 3, 4, 5];

    @cacheGetter
    get sum(): number {
      callCount++;
      return this.data.reduce((acc, curr) => acc + curr, 0);
    }
  }

  let s = new Sample();
  expect(callCount).toBe(0);
  expect(s.sum).toBe(15);
  expect(callCount).toBe(1);
  expect(s.sum).toBe(15);
  expect(callCount).toBe(1);
});
